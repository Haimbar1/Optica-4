# סרטון קידום 20 שניות — האופטיקה החברתית

סרטון לפייסבוק ולאינסטגרם, 20 שניות, דיבוב בעברית (Gemini TTS) + מוזיקת רקע חלשה + כתוביות:
- `optica-promo-9x16.mp4` — 1080×1920, לרילס / סטורי (פייסבוק ואינסטגרם).
- `optica-promo-4x5.mp4` — 1080×1350, לפוסט בפיד.

איך זה נבנה:
- `web/index.html` — כל האנימציה (HTML/CSS, פונקציה `render(t)` דטרמיניסטית). הזמנים והכתוביות ב-`cfg.json`.
- `render.mjs` — מצלם 600 פריימים עם Playwright/Chromium (`node render.mjs full frames cfg.json`).
- `music.py` — מוזיקת רקע + אפקטים (whoosh, פיצוץ מתנה) מסונתזים, בלי זכויות יוצרים.
- `voice.py` — דיבוב עברית ב-Gemini TTS לפי הכתוביות, מוזיקה מונמכת מתחת לקול (צריך `GEMINI_API_KEY`).

הרכבה:
```
GEMINI_API_KEY=... python3 voice.py cfg.json music.py audio.wav   # מתזמן את הסצנות לפי הקול → cfg_timed.json
node render.mjs full frames cfg_timed.json   # לגרסת 4:5 להוסיף "FMT": "4x5" ל-cfg
ffmpeg -framerate 30 -i frames/f_%04d.jpg -i audio.wav -c:v libx264 -crf 19 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest out.mp4
```
