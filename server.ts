import express from 'express';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';
// 'vite' is only needed for local dev middleware; imported dynamically below
// so it never gets bundled into the Vercel serverless function.

const app = express();
const PORT = 3000;

app.use(express.json());

// Enable CORS for external website embedding and API requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.static(path.join(process.cwd(), 'public')));

// In-memory store for appointments
const appointmentsStore: any[] = [];

// Helper to extract response text, imageUrl, and buttons from n8n response node
function extractResponseFromNode(dataNode: any): { replyText: string; imageUrl?: string; buttons: Array<{ id: string; title: string }> } {
  let replyText = '';
  let imageUrl: string | undefined = undefined;
  const buttons: Array<{ id: string; title: string }> = [];

  if (!dataNode) return { replyText, imageUrl, buttons };

  if (typeof dataNode === 'string') {
    return { replyText: dataNode, imageUrl, buttons };
  }

  // 1. WhatsApp Payload structure
  if (dataNode.whatsapp_payload?.message) {
    const msg = dataNode.whatsapp_payload.message;
    if (msg.interactive) {
      const textParts = [];
      if (msg.interactive.header?.text) textParts.push(msg.interactive.header.text);
      if (msg.interactive.body?.text) textParts.push(msg.interactive.body.text);
      if (msg.interactive.footer?.text) textParts.push(msg.interactive.footer.text);
      if (textParts.length > 0) {
        replyText = textParts.join('\n\n');
      }

      const rawBtns = msg.interactive.action?.buttons || [];
      for (const b of rawBtns) {
        buttons.push({
          id: b.reply?.id || b.id || `btn_${buttons.length + 1}`,
          title: b.reply?.title || b.title || 'כפתור',
        });
      }

      const sections = msg.interactive.action?.sections || msg.interactive.sections || [];
      for (const sec of sections) {
        const rows = sec.rows || sec.items || [];
        for (const row of rows) {
          buttons.push({
            id: row.id || row.row_id || `row_${buttons.length + 1}`,
            title: row.title || row.text || row.name || 'בחירה',
          });
        }
      }
    } else if (msg.text?.body) {
      replyText = msg.text.body;
    }
    if (msg.image?.link || msg.image?.url) {
      imageUrl = msg.image.link || msg.image.url;
    }
    if (msg.image?.caption && !replyText) {
      replyText = msg.image.caption;
    }
    if (replyText || buttons.length > 0 || imageUrl) {
      return { replyText, imageUrl, buttons };
    }
  }

  // 2. Direct or nested message object
  const msgObj = dataNode.message || dataNode.reply || dataNode.output || dataNode.response || dataNode.data || dataNode.text;

  if (msgObj && typeof msgObj === 'object') {
    if (msgObj.type === 'image' || msgObj.image) {
      const imgInfo = msgObj.image || msgObj;
      if (typeof imgInfo === 'object') {
        imageUrl = imgInfo.link || imgInfo.url || imgInfo.src || imgInfo.href;
        if (imgInfo.caption) replyText = imgInfo.caption;
        else if (msgObj.caption) replyText = msgObj.caption;
        else if (msgObj.text) replyText = typeof msgObj.text === 'string' ? msgObj.text : JSON.stringify(msgObj.text);
      } else if (typeof imgInfo === 'string') {
        imageUrl = imgInfo;
        if (msgObj.caption) replyText = msgObj.caption;
        else if (msgObj.text) replyText = typeof msgObj.text === 'string' ? msgObj.text : JSON.stringify(msgObj.text);
      }
    } else {
      if (msgObj.caption) replyText = msgObj.caption;
      else if (msgObj.text) replyText = typeof msgObj.text === 'string' ? msgObj.text : JSON.stringify(msgObj.text);
      else if (msgObj.body) replyText = typeof msgObj.body === 'string' ? msgObj.body : JSON.stringify(msgObj.body);
      else if (msgObj.content) replyText = typeof msgObj.content === 'string' ? msgObj.content : JSON.stringify(msgObj.content);

      if (msgObj.imageUrl || msgObj.image) {
        const img = msgObj.imageUrl || msgObj.image;
        if (typeof img === 'string') imageUrl = img;
        else if (typeof img === 'object') {
          imageUrl = img.link || img.url || img.src;
          if (img.caption && !replyText) replyText = img.caption;
        }
      }
    }
  } else if (typeof msgObj === 'string') {
    replyText = msgObj;
  }

  // Fallback text candidates
  if (!replyText) {
    const stringCandidate = dataNode.reply || dataNode.output || dataNode.text || dataNode.content || dataNode.caption || dataNode.message || dataNode.response;
    if (typeof stringCandidate === 'string') {
      replyText = stringCandidate;
    }
  }

  // Check top-level image/imageUrl if not set yet
  if (!imageUrl) {
    const topImg = dataNode.image || dataNode.imageUrl || dataNode.img;
    if (typeof topImg === 'string') {
      imageUrl = topImg;
    } else if (topImg && typeof topImg === 'object') {
      imageUrl = topImg.link || topImg.url || topImg.src;
      if (topImg.caption && !replyText) {
        replyText = topImg.caption;
      }
    }
  }

  // Extract buttons
  const rawButtons = dataNode.buttons || msgObj?.buttons;
  if (Array.isArray(rawButtons)) {
    for (const b of rawButtons) {
      if (typeof b === 'string') {
        buttons.push({ id: `btn_${buttons.length + 1}`, title: b });
      } else if (b && typeof b === 'object') {
        buttons.push({ id: b.id || `btn_${buttons.length + 1}`, title: b.title || b.text || b.label || 'כפתור' });
      }
    }
  }

  // Extract sections & rows
  const directSections = dataNode.sections || dataNode.action?.sections || dataNode.interactive?.action?.sections || msgObj?.sections || [];
  for (const sec of directSections) {
    const rows = sec.rows || sec.items || [];
    for (const row of rows) {
      buttons.push({
        id: row.id || row.row_id || `row_${buttons.length + 1}`,
        title: row.title || row.text || row.name || 'בחירה',
      });
    }
  }

  return { replyText, imageUrl, buttons };
}
function normalizePhoneToInternational(phoneInput: string): string {
  if (!phoneInput) return '';
  const digits = phoneInput.replace(/\D/g, '');
  if (!digits) return '';

  // Israeli local format starting with 0:
  // Mobile: 05X-XXXXXXX (10 digits, e.g. 0545404183 -> 972545404183)
  // Landline: 02/03/04/08/09-XXXXXXX (9 digits, e.g. 046901234 -> 97246901234)
  if (digits.startsWith('0')) {
    if (digits.length === 10 || digits.length === 9) {
      return '972' + digits.substring(1);
    }
  }

  // Already 972...
  if (digits.startsWith('972')) {
    if (digits.length === 11 || digits.length === 12) {
      return digits;
    }
  }

  // 9 digits starting with 5 (e.g. 547866119)
  if (digits.length === 9 && digits.startsWith('5')) {
    return '972' + digits;
  }

  return '';
}

function extractAndNormalizePhone(text: string): string | null {
  if (!text) return null;

  // Match Israeli mobile: 050-058 or +972-50...
  const mobileMatch = text.match(/(?:\+?972-?|0)(5[0-8])[\s-]?(\d{3})[\s-]?(\d{4})\b/);
  if (mobileMatch) {
    const norm = normalizePhoneToInternational(mobileMatch[0]);
    if (norm) return norm;
  }

  // Match Israeli landline: 02, 03, 04, 08, 09
  const landlineMatch = text.match(/(?:\+?972-?|0)([23489])[\s-]?(\d{3})[\s-]?(\d{4})\b/);
  if (landlineMatch) {
    const norm = normalizePhoneToInternational(landlineMatch[0]);
    if (norm) return norm;
  }

  return null;
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', store: 'האופטיקה הטובה - אמירים' });
});

// Proxy to n8n Web Bot webhook
app.post('/api/bot/web', async (req, res) => {
  const { message, buttonId, sessionId, sessionID, userPhone, userName } = req.body;
  const webhookUrl = 'https://n8n.srv1239769.hstgr.cloud/webhook/65325d34-0c9e-4cc3-8b7c-c03c47105b3a';

  // Extract / normalize phone number if provided or present in message
  let normalizedPhone = userPhone ? normalizePhoneToInternational(userPhone) : '';
  if (!normalizedPhone && message) {
    const extracted = extractAndNormalizePhone(message);
    if (extracted) {
      normalizedPhone = extracted;
    }
  }

  // Determine effective session ID:
  // If user provided a phone number, use the international phone format (e.g. 972545404183) as session ID.
  // Otherwise, use the client UUID cookie/session string passed from browser, or fallback to 'web_client_anon'.
  const rawSession = sessionId || sessionID || '';
  let effectiveSessionId = 'web_client_anon';
  if (normalizedPhone) {
    effectiveSessionId = normalizedPhone;
  } else if (rawSession) {
    effectiveSessionId = rawSession;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s max wait for n8n AI workflow

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      body: JSON.stringify({
        bot_id: req.body?.bot_id || req.body?.botId || 'bot_generic_252',
        botId: req.body?.bot_id || req.body?.botId || 'bot_generic_252',
        message,
        buttonId,
        sessionId: effectiveSessionId,
        sessionID: effectiveSessionId,
        userPhone: normalizedPhone,
        userName: userName || '',
        timestamp: new Date().toISOString(),
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const rawData = await response.json().catch(() => null);
      if (rawData) {
        let replyText = '';
        let buttons: Array<{ id: string; title: string }> = [];
        let imageUrl: string | undefined = undefined;

        const items = Array.isArray(rawData) ? rawData : [rawData];
        for (const item of items) {
          const dataNode = item?.json || item || {};
          const extracted = extractResponseFromNode(dataNode);

          if (extracted.replyText) {
            replyText = replyText ? `${replyText}\n\n${extracted.replyText}` : extracted.replyText;
          }
          if (extracted.imageUrl) {
            imageUrl = extracted.imageUrl;
          }
          if (extracted.buttons.length > 0) {
            buttons = [...buttons, ...extracted.buttons];
          }
        }

        if (replyText || buttons.length > 0 || imageUrl) {
          return res.json({
            reply: replyText || 'תשובה מבוט האופטיקה',
            buttons,
            imageUrl,
            source: 'n8n_web_webhook',
          });
        }
      }
    }
  } catch (err: any) {
    console.warn('n8n Web webhook unreachable or timed out:', err?.message || err);
  }

  // Try Gemini AI if available
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = `אתה נציג השירות והבוט הדיגיטלי של "האופטיקה הטובה" באמירים (מיזם אופטיקה חברתית).
ענה בתשובה קצרה, אדיבה, תכליתית ובעברית.
פרטי העסק:
- שם: האופטיקה הטובה באמירים
- כתובת: מצפה מנחם 86, אמירים
- טלפון אביגיל (לתורים לבדיקת ראייה): 054-913-1704
- וואטסאפ לפניות ישירות / בירורים: 054-540-4183 (972545404183)
- מחירי מסגרות ראייה איכותיות כולל עדשות וציפויים: 150 ₪ / 250 ₪ בלבד למרשם רגיל.
- בדיקות ראייה מבוצעות ע"י אופטומטריסט מוסמך באמירים.`;

      const aiResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: `${systemInstruction}\n\nשאלת המשתמש: ${message || buttonId}` }] }
        ],
      });

      if (aiResponse.text) {
        return res.json({
          reply: aiResponse.text,
          buttons: [
            { id: 'btn_cal', title: '📅 יומן תורים דיגיטלי' },
            { id: 'btn_avigail', title: '📞 התקשר לאביגיל (054-913-1704)' },
            { id: 'btn_wa', title: '💬 לחץ למעבר לוואטסאפ (054-540-4183)' },
            { id: 'btn_waze', title: '🚗 ניווט ב-Waze' }
          ],
          source: 'gemini_ai_bot',
        });
      }
    } catch (e) {
      console.warn('Gemini AI fallback error:', e);
    }
  }

  // Smart fallback response if n8n is offline or returned non-json
  const textLower = (message || buttonId || '').toLowerCase();
  let fallbackReply = 'שלום! שמי האסיסטנט של "האופטיקה הטובה" באמירים. במה אוכל לעזור לך? (בדיקת ראייה, מחירי מסגרות, הגעה בוויז או תיאום תור)';
  let fallbackButtons: Array<{ id: string; title: string }> = [
    { id: 'btn_1', title: '👁️ לקבוע בדיקת ראייה' },
    { id: 'btn_2', title: '👓 משקפיים ומסגרות' },
    { id: 'btn_3', title: '🔍 עדשות מולטיפוקל' },
    { id: 'btn_4', title: '💰 אחריות ועלויות' },
    { id: 'btn_5', title: '📍 דרכי הגעה וחניה' },
  ];

  if (textLower.includes('תור') || textLower.includes('בדיק') || textLower.includes('אביגיל') || textLower.includes('cal')) {
    fallbackReply = 'לתיאום תור לבדיקת ראייה יסודית ביומן הדיגיטלי או מול אביגיל, בחר באחת האפשרויות מטה:';
    fallbackButtons = [
      { id: 'btn_cal', title: '📅 מעבר ליומן הדיגיטלי' },
      { id: 'btn_avigail', title: '📞 התקשר לאביגיל (054-913-1704)' },
      { id: 'btn_wa', title: '💬 לחץ למעבר לוואטסאפ (054-540-4183)' },
    ];
  } else if (textLower.includes('מחיר') || textLower.includes('עולה') || textLower.includes('כמה') || textLower.includes('150') || textLower.includes('250')) {
    fallbackReply = 'אצלנו במיזם האופטיקה החברתית באמירים, מסגרות ראייה איכותיות כולל עדשות וציפויים עולות 150 ₪ או 250 ₪ בלבד! ללא פערי תיווך וללא דמי שכירות יקרים בקניונים.';
  } else if (textLower.includes('וויז') || textLower.includes('איפה') || textLower.includes('הגעה') || textLower.includes('כתובת') || textLower.includes('אמירים') || textLower.includes('waze')) {
    fallbackReply = 'אנחנו ממוקמים במצפה מנחם 86, אמירים. ניתן ללחוץ על הכפתור מטה לניווט ישיר בוויז!';
    fallbackButtons = [
      { id: 'btn_waze', title: '🚗 ניווט ישיר ב-Waze' },
    ];
  } else if (textLower.includes('מולטיפוקל')) {
    fallbackReply = 'אנו מתמחים בהתאמת משקפי מולטיפוקל ועדשות מגע מולטיפוקל מתקדמות. כולל אחריות מלאה וכיוונון במקום.';
  } else if (textLower.includes('צביקה') || textLower.includes('ביטול') || textLower.includes('וואטסאפ')) {
    fallbackReply = 'ליצירת קשר או וואטסאפ ישיר, ניתן לפנות למספר 054-540-4183 (https://wa.me/972545404183).';
  }

  return res.json({ reply: fallbackReply, buttons: fallbackButtons, source: 'optics_smart_fallback' });
});

// Proxy to n8n WhatsApp Bot webhook
app.post('/api/bot/whatsapp', async (req, res) => {
  const { message, userPhone, userName, sessionId, sessionID } = req.body;
  const webhookUrl = 'https://n8n.srv1239769.hstgr.cloud/webhook/c89a7e0e-10af-4d85-89fd-8652b2d1b1ab';

  const normalizedPhone = userPhone ? normalizePhoneToInternational(userPhone) : '972545404183';
  const effectiveSessionId = normalizedPhone || sessionId || sessionID || 'whatsapp-session';

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        sessionId: effectiveSessionId,
        sessionID: effectiveSessionId,
        userPhone: normalizedPhone,
        userName: userName || '',
        timestamp: new Date().toISOString(),
      }),
    });

    if (response.ok) {
      const data = await response.json().catch(() => null);
      return res.json({
        success: true,
        data,
        source: 'n8n_whatsapp_webhook',
      });
    }
  } catch (err) {
    console.warn('n8n WhatsApp webhook call:', err);
  }

  return res.json({
    success: true,
    whatsappUrl: `https://wa.me/972545404183?text=${encodeURIComponent(message || 'שלום, אשמח לקבל פרטים על האופטיקה הטובה באמירים')}`,
    source: 'whatsapp_direct_link',
  });
});

// Helper to export Lead to SmartEsek CRM
async function exportLeadToSmartEsek(lead: {
  name: string;
  phone: string;
  source?: string;
  campaign?: string;
  message?: string;
}) {
  const leadKey = process.env.SMARTESEK_LEAD_KEY || '1234512345';
  const tenantKey = process.env.SMARTESEK_TENANT_KEY || '';
  const crmUrl = 'https://crm.smartesek.com/api/leads';

  const payload = {
    name: lead.name || 'פנייה מאתר האינטרנט',
    phone: lead.phone || '',
    source: lead.source || 'אתר',
    campaign: lead.campaign || '',
    message: lead.message || '',
  };

  console.log('\n================== [CRM LEAD EXPORT START] ==================');
  console.log('⏰ זמן שליחה:', new Date().toLocaleString('he-IL'));
  console.log('🌐 כתובת יעד (URL):', crmUrl);
  console.log('🔑 Headers:', { 'Content-Type': 'application/json', 'X-Lead-Key': leadKey });
  console.log('📦 פרטים שנשלחו (Payload):', JSON.stringify(payload, null, 2));

  try {
    const crmResponse = await fetch(crmUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Lead-Key': leadKey,
        'X-Tenant-Key': tenantKey,
      },
      body: JSON.stringify(payload),
    });

    const status = crmResponse.status;
    const rawText = await crmResponse.text();
    let responseData: any = rawText;
    try {
      responseData = JSON.parse(rawText);
    } catch {
      responseData = rawText;
    }

    if (crmResponse.ok) {
      console.log(`✅ [CRM LEAD EXPORT SUCCESS] הליד נקלט בהצלחה ב-SmartEsek CRM! (סטטוס: ${status})`);
      console.log('📥 תשובה שהתקבלה מה-CRM:', responseData);
      console.log('================== [CRM LEAD EXPORT END] ==================\n');

      return {
        success: true,
        status,
        sent: payload,
        response: responseData,
      };
    } else {
      const errorReason =
        typeof responseData === 'object' && responseData?.error
          ? responseData.error
          : typeof responseData === 'string' && responseData
          ? responseData
          : `HTTP ${status}`;

      console.error(`❌ [CRM LEAD EXPORT FAILED] שליחת הליד ל-SmartEsek CRM נכשלה! (סטטוס: ${status})`);
      console.error(`⚠️ סיבת הכישלון (למה נכשל): ${errorReason}`);
      console.error('📥 תשובה מלאה שהתקבלה מהשרת:', responseData);
      console.log('================== [CRM LEAD EXPORT END] ==================\n');

      return {
        success: false,
        status,
        sent: payload,
        response: responseData,
        error: errorReason,
      };
    }
  } catch (err: any) {
    console.error('💥 [CRM LEAD EXPORT ERROR] אירעה שגיאה/חריגה במהלך שליחת הליד:', err.message || err);
    console.log('================== [CRM LEAD EXPORT END] ==================\n');

    return {
      success: false,
      status: 500,
      sent: payload,
      error: err.message || 'שגיאת תקשורת עם שרת ה-CRM',
    };
  }
}

// Validate Israeli phone number
function isValidIsraeliPhone(phoneInput: string): boolean {
  if (!phoneInput) return false;
  const digits = phoneInput.replace(/\D/g, '');
  if (!digits) return false;
  if (digits.startsWith('0')) {
    return /^05\d{8}$/.test(digits) || /^07[2-9]\d{7}$/.test(digits) || /^0[23489]\d{7}$/.test(digits);
  }
  if (digits.startsWith('972')) {
    const after = digits.substring(3);
    return /^5\d{8}$/.test(after) || /^7[2-9]\d{7}$/.test(after) || /^[23489]\d{7}$/.test(after);
  }
  return false;
}

// Endpoint to export lead from frontend form
app.post('/api/crm/lead', async (req, res) => {
  const { name, phone, source, campaign, message } = req.body;
  if (!phone) {
    return res.status(400).json({ success: false, error: 'מספר טלפון הוא שדה חובה' });
  }

  if (!isValidIsraeliPhone(phone)) {
    return res.status(400).json({ success: false, error: 'מספר טלפון אינו תקין בישראל (לדוגמה: 050-1234567 או 04-1234567)' });
  }

  const result = await exportLeadToSmartEsek({ name, phone, source, campaign, message });
  return res.json(result);
});

// Appointment booking submission endpoint
app.post('/api/appointments', async (req, res) => {
  const { fullName, phone, email, appointmentType, preferredDate, preferredTime, notes, sessionId, sessionID } = req.body;

  if (!fullName || !phone) {
    return res.status(400).json({ error: 'נא למלא שם מלא ומספר טלפון' });
  }

  const normalizedPhone = normalizePhoneToInternational(phone);
  const effectiveSessionId = normalizedPhone || sessionId || sessionID || 'appointment-session';
  const recipientEmail = 'haim.bar@gmail.com';

  const newAppointment = {
    id: 'apt-' + Date.now(),
    fullName,
    phone: normalizedPhone,
    rawPhone: phone,
    email: email || '',
    recipientEmail,
    appointmentType: appointmentType || 'בדיקת ראייה מקיפה',
    preferredDate,
    preferredTime,
    notes,
    status: 'ממתין לאישור',
    createdAt: new Date().toISOString(),
  };

  appointmentsStore.push(newAppointment);

  console.log(`[APPOINTMENT NOTIFICATION] Sending new booking details for ${fullName} (${normalizedPhone}) to ${recipientEmail}...`);

  // Send payload to webhook configured to forward email to haim.bar@gmail.com
  try {
    fetch('https://n8n.srv1239769.hstgr.cloud/webhook/65325d34-0c9e-4cc3-8b7c-c03c47105b3a', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'NEW_APPOINTMENT',
        sessionId: effectiveSessionId,
        sessionID: effectiveSessionId,
        userPhone: normalizedPhone,
        recipient_email: recipientEmail,
        appointment: newAppointment,
        email_subject: `בקשת תור חדשה לבדיקת ראייה - ${fullName}`,
        email_body: `תור חדש נרשם באתר האופטיקה הטובה:\n- שם: ${fullName}\n- טלפון (בינלאומי): ${normalizedPhone}\n- מייל: ${email || 'לא צויין'}\n- סוג שירות: ${appointmentType}\n- תאריך מבוקש: ${preferredDate}\n- שעה מבוקשת: ${preferredTime}\n- הערות: ${notes || 'ללא'}`
      }),
    }).catch((err) => console.error('Webhook error:', err));
  } catch (e) {}

  // Also export lead to SmartEsek CRM
  exportLeadToSmartEsek({
    name: fullName,
    phone: phone,
    source: 'מערכת תורים',
    campaign: 'טופס תיאום תור באתר',
    message: `סוג תור: ${appointmentType} | תאריך מבוקש: ${preferredDate || 'גמיש'} | שעה מבוקשת: ${preferredTime || 'גמיש'}${notes ? ` | הערות: ${notes}` : ''}`,
  }).catch(() => null);

  res.json({
    success: true,
    recipientEmail,
    message: `בקשת התור נשלחה בהצלחה למייל ${recipientEmail}! אביגיל או צביקה יצרו עמך קשר בהקדם.`,
    appointment: newAppointment,
  });
});

app.get('/api/appointments', (req, res) => {
  res.json({ appointments: appointmentsStore });
});

// AI Chatbot with Gemini API or Knowledge Context
app.post('/api/ai-chat', async (req, res) => {
  const { message, history } = req.body;

  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = `אתה נציג שירות הלקוחות הדיגיטלי של "האופטיקה הטובה" באמירים (מיזם אופטיקה חברתית).
ענה תמיד בעברית אדיבה, מקצועית, שירותית וברורה.
פרטי העסק החשובים:
- שם העסק: האופטיקה הטובה
- כתובת: מצפה מנחם 86, אמירים
- Waze: https://waze.com/ul?ll=32.936389,35.454517&navigate=yes
- צביקה: 055-250-2584 (מענה כללי / ביטולים)
- אביגיל: 054-913-1704 (תיאום תורים לבדיקת ראייה)
- וואטסאפ לפניות ישירות / בירורים: 054-540-4183 (972545404183)
- מחירי מסגרות כולל עדשות וציפויים: 150 ₪ או 250 ₪ בלבד למרשם רגיל!
- זמני המתנה: עד 10 ימי עסקים למרשם רגיל, עד 14 ימי עסקים למולטיפוקל/מרשם מיוחד.
- האופטיקה החברתית חוסכת עלויות יקרות של שכר דירה בקניונים ומותגים מנופחים.
- בקשת ביטול: המיזם פועל בתלות במספר הנרשמים, אנא הקפידו לא לבטל תור ברגע האחרון, ואם קרה משהו - הודיעו לוואטסאפ: 054-540-4183 (לחץ למעבר לוואטסאפ).`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: `${systemInstruction}\n\nשאלת המשתמש: ${message}` }] }
        ],
      });

      if (response.text) {
        return res.json({ reply: response.text });
      }
    } catch (e) {
      console.warn('Gemini call failed in backend:', e);
    }
  }

  // Fallback
  res.json({
    reply: 'אנו באופטיקה הטובה נשמח לעזור! ניתן ליצור קשר עם אביגיל לתורים ב-054-913-1704 או צביקה ב-055-250-2584.',
  });
});

// Explicit route for Standalone JS Widget Embed
app.get(['/optics-bot-widget.js', '/bot-widget.js'], (req, res) => {
  const candidatePaths = [
    path.join(process.cwd(), 'dist', 'bot-widget.js'),
    path.join(process.cwd(), 'public', 'bot-widget.js'),
    path.join(process.cwd(), 'dist', 'optics-bot-widget.js'),
    path.join(process.cwd(), 'public', 'optics-bot-widget.js'),
    path.resolve('dist/bot-widget.js'),
    path.resolve('public/bot-widget.js'),
  ];
  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      return res.sendFile(p);
    }
  }
  res.status(404).send('console.error("optics-bot-widget.js file not found on server");');
});

// Explicit route for Embed Demo page
app.get('/embed-demo.html', (req, res) => {
  const candidatePaths = [
    path.join(process.cwd(), 'dist', 'embed-demo.html'),
    path.join(process.cwd(), 'public', 'embed-demo.html'),
    path.resolve('dist/embed-demo.html'),
    path.resolve('public/embed-demo.html'),
  ];
  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      res.setHeader('Content-Type', 'text/html; charset=UTF-8');
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.sendFile(p);
    }
  }
  res.status(404).send('<h1>Demo page not found</h1>');
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    const publicPath = path.join(process.cwd(), 'public');
    app.use(express.static(distPath));
    app.use(express.static(publicPath));
    app.get('*', (req, res, next) => {
      // If path contains file extension, let express try or return 404
      if (req.path.includes('.')) {
        return next();
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// On Vercel this module is imported by api/[...slug].ts as a serverless
// function handler — the platform routes requests to it directly, so we
// must NOT open our own listening socket there. Locally (npm run dev /
// npm start) VERCEL is unset, so the server starts exactly as before.
if (!process.env.VERCEL) {
  startServer();
}

export default app;
