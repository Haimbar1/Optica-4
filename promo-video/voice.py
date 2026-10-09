# Hebrew voice-over via Gemini TTS, placed on the caption timeline, mixed over ducked music.
# usage: GEMINI_API_KEY=... python3 voice.py cfg.json music.wav out_audio.wav
import json, sys, os, base64, urllib.request, subprocess, wave, numpy as np
cfg = json.load(open(sys.argv[1])); KEY = os.environ['GEMINI_API_KEY']
MODEL = os.environ.get('TTS_MODEL', 'gemini-2.5-flash-preview-tts'); VOICE = os.environ.get('TTS_VOICE', 'Charon')
SR = 24000; tl = np.zeros(int(SR * cfg['T']['end']))
for i, c in enumerate(cfg['CAPS']):
    text = c.get('say', c['text'])
    body = {"contents": [{"parts": [{"text": "קרא בעברית, בקול חם, בטוח ומקצועי של קריין פרסומת, בקצב ערני: " + text}]}],
            "generationConfig": {"responseModalities": ["AUDIO"], "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": VOICE}}}}}
    req = urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={KEY}",
                                 data=json.dumps(body).encode(), headers={'Content-Type': 'application/json'})
    d = json.load(urllib.request.urlopen(req, timeout=120))
    pcm = base64.b64decode(d['candidates'][0]['content']['parts'][0]['inlineData']['data'])
    open(f'vo_{i}.raw', 'wb').write(pcm)
    # trim silence, fit into the caption window (speed up with atempo if needed, never slow down)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ar', str(SR), '-ac', '1', '-i', f'vo_{i}.raw', '-af',
                    'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse',
                    f'vo_{i}.wav'], check=True)
    w = wave.open(f'vo_{i}.wav'); x = np.frombuffer(w.readframes(w.getnframes()), '<i2').astype(float) / 32768
    slot = c['b'] - c['a']; dur = len(x) / SR
    if dur > slot:
        r = min(dur / slot, 1.35)
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'vo_{i}.wav', '-af', f'atempo={r:.3f}', f'vo_{i}f.wav'], check=True)
        w = wave.open(f'vo_{i}f.wav'); x = np.frombuffer(w.readframes(w.getnframes()), '<i2').astype(float) / 32768
    print(f'seg {i}: {dur:.2f}s -> {len(x)/SR:.2f}s (slot {slot:.2f})')
    s = int(c['a'] * SR); x = x[:len(tl) - s]; tl[s:s + len(x)] += x
wave_out = wave.open('vo.wav', 'wb'); wave_out.setnchannels(1); wave_out.setsampwidth(2); wave_out.setframerate(SR)
wave_out.writeframes((np.clip(tl / max(1e-9, np.abs(tl).max()) * .9, -1, 1) * 32767).astype('<i2').tobytes()); wave_out.close()
# voice normalized, music low and ducked under the voice
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', 'vo.wav', '-i', sys.argv[2], '-filter_complex',
                '[0:a]aresample=44100,loudnorm=I=-16:TP=-1.5,asplit=2[v][sc];[1:a]volume=-14dB[m];'
                '[m][sc]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=300[md];[v][md]amix=inputs=2:normalize=0[out]',
                '-map', '[out]', '-ac', '2', sys.argv[3]], check=True)
