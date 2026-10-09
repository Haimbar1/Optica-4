# סרטון קידום 20 שניות — האופטיקה החברתית

`optica-promo-20s-v1.mp4` — 1080×1920 (Reels / Stories / סטטוס), 20 שניות, מוזיקת רקע + כתוביות. **בלי דיבוב עדיין.**

איך זה נבנה:
- `web/index.html` — כל האנימציה (HTML/CSS, פונקציה `render(t)` דטרמיניסטית). הזמנים והכתוביות ב-`cfg.json`.
- `render.mjs` — מצלם 600 פריימים עם Playwright/Chromium (`node render.mjs full frames cfg.json`).
- `music.py` — מוזיקת רקע + אפקטים (whoosh, פיצוץ מתנה) מסונתזים, בלי זכויות יוצרים.
- `voice.py` — דיבוב עברית ב-Gemini TTS לפי הכתוביות, מוזיקה מונמכת מתחת לקול (צריך `GEMINI_API_KEY`).

הרכבה:
```
python3 music.py cfg.json music.wav
node render.mjs full frames cfg.json
GEMINI_API_KEY=... python3 voice.py cfg.json music.wav audio.wav
ffmpeg -framerate 30 -i frames/f_%04d.jpg -i audio.wav -c:v libx264 -crf 19 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest out.mp4
```
