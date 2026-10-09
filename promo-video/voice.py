# Hebrew voice-over via Gemini TTS. Re-times the scenes to the voice, writes cfg_timed.json + audio.
# usage: GEMINI_API_KEY=... python3 voice.py cfg.json music.py out_audio.wav
import json, sys, os, base64, urllib.request, subprocess, wave, hashlib, numpy as np
cfg = json.load(open(sys.argv[1])); KEY = os.environ['GEMINI_API_KEY']
MODEL = os.environ.get('TTS_MODEL', 'gemini-2.5-flash-preview-tts'); VOICE = os.environ.get('TTS_VOICE', 'Zephyr')
STYLE = os.environ.get("TTS_STYLE", "דברי בעברית ישראלית עכשווית וטבעית, כמו אישה צעירה בת 28 שממליצה לחברה – קלילה, חמה ומחייכת, לא פורמלית ולא כמו קריינית של פעם: ")
SR = 24000; END = cfg['T']['end']; GAP = 0.18
def tts(text):
    h = hashlib.md5((MODEL + VOICE + STYLE + text).encode()).hexdigest()[:10]; f = f'vo_{h}.wav'
    if not os.path.exists(f):
        body = {"contents": [{"parts": [{"text": STYLE + text}]}],
                "generationConfig": {"responseModalities": ["AUDIO"], "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": VOICE}}}}}
        req = urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent",
                                     data=json.dumps(body).encode(), headers={'Content-Type': 'application/json', 'x-goog-api-key': KEY})
        pcm = base64.b64decode(json.load(urllib.request.urlopen(req, timeout=180))['candidates'][0]['content']['parts'][0]['inlineData']['data'])
        open('tmp.raw', 'wb').write(pcm)
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ar', str(SR), '-ac', '1', '-i', 'tmp.raw', '-af',
                        'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse', f], check=True)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f, '-af', 'silenceremove=stop_periods=-1:stop_duration=0.22:stop_threshold=-40dB:stop_silence=0.16', 'p_' + f], check=True)
    w = wave.open('p_' + f); return 'p_' + f, w.getnframes() / SR
segs = [tts(c['say']) for c in cfg['CAPS']]
nat = sum(d for _, d in segs); avail = END - 0.25 - 0.6 - GAP * (len(segs) - 1)   # lead-in, tail
tempo = max(1.0, nat / avail); print(f'natural {nat:.2f}s, available {avail:.2f}s, tempo x{tempo:.3f}')
tl = np.zeros(int(SR * END)); t = 0.25; caps = []
for (f, d), c in zip(segs, cfg['CAPS']):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f, '-af', f'atempo={tempo:.4f}', 'seg.wav'], check=True)
    w = wave.open('seg.wav'); x = np.frombuffer(w.readframes(w.getnframes()), '<i2').astype(float) / 32768
    s = int(t * SR); x = x[:len(tl) - s]; tl[s:s + len(x)] += x
    caps.append({**c, 'a': round(t, 2), 'b': round(t + len(x) / SR + .12, 2)}); t += len(x) / SR + GAP
# scene starts follow the voice: scene k starts slightly before its line
out = dict(cfg); out['CAPS'] = caps
out['T'] = {**cfg['T'], **{k: round(caps[i]['a'] - .15, 2) for i, k in ((1, 's2'), (2, 's3'), (3, 's4'), (4, 's5'))}}
json.dump(out, open('cfg_timed.json', 'w'), ensure_ascii=False, indent=1); print(out['T'])
w = wave.open('vo.wav', 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((np.clip(tl, -1, 1) * 32767).astype('<i2').tobytes()); w.close()
subprocess.run(['python3', sys.argv[2], 'cfg_timed.json', 'music.wav'], check=True)   # music/SFX follow the new timing
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', 'vo.wav', '-i', 'music.wav', '-filter_complex',
                '[0:a]aresample=44100,highpass=f=70,acompressor=threshold=0.1:ratio=3:attack=5:release=80,loudnorm=I=-15:TP=-1.5:LRA=7,aresample=44100,apad=whole_dur=%s,asplit=2[v][sc];'
                '[1:a]volume=-13dB[m];[m][sc]sidechaincompress=threshold=0.02:ratio=5:attack=15:release=350[md];'
                '[v][md]amix=inputs=2:normalize=0:duration=longest,alimiter=limit=0.9,atrim=0:%s[out]' % (END, END), '-map', '[out]', '-ac', '2', '-ar', '44100', sys.argv[3]], check=True)
