import numpy as np, wave, json, sys
SR=44100; DUR=20.0; N=int(SR*DUR)
cfg=json.load(open(sys.argv[1])); T=cfg['T']
t=np.arange(N)/SR
L=np.zeros(N); R=np.zeros(N)
rng=np.random.default_rng(3)
def f(m): return 440*2**((m-69)/12)
BPM=96; beat=60/BPM; bar=4*beat
prog=[[48,52,55,60],[47,50,55,62],[45,48,52,57],[41,45,48,53]]  # C, G/B, Am, F
def add(sig,start,pan=0.0,gain=1.0):
    i=int(start*SR); 
    if i>=N: return
    s=sig[:N-i]*gain
    L[i:i+len(s)]+=s*(1-pan)/1.0*0.5*(1+(-pan if pan<0 else 0)) if False else s*np.sqrt((1-pan)/2)
    R[i:i+len(s)]+=s*np.sqrt((1+pan)/2)
def env(n,a,r):
    e=np.ones(n); na=int(a*SR); nr=int(r*SR)
    e[:na]=np.linspace(0,1,na); e[-nr:]*=np.linspace(1,0,nr); return e
nbars=int(np.ceil(DUR/bar))+1
for b in range(nbars):
    ch=prog[b%4]; st=b*bar; n=int((bar+0.6)*SR); tt=np.arange(n)/SR
    # warm pad
    pad=np.zeros(n)
    for m in ch:
        for det in (-0.08,0.08):
            fr=f(m+12)*(1+det/100*3)
            for h in range(1,6):
                pad+=np.sin(2*np.pi*fr*h*tt+rng.random()*6)/h**1.6
    pad*=env(n,0.5,0.7)*0.018
    add(pad,st,pan=-0.3); add(pad*0.9,st+0.01,pan=0.3)
    # bass
    for k in (0,2):
        bn=int(beat*1.8*SR); bt=np.arange(bn)/SR
        bs=(np.sin(2*np.pi*f(ch[0]-12)*bt)+0.3*np.sin(2*np.pi*f(ch[0])*bt))*np.exp(-bt*2.2)*env(bn,0.01,0.1)*0.10
        if st+k*beat>=bar*0.5: add(bs,st+k*beat)
    # pluck arpeggio (8ths)
    arp=[ch[1]+24,ch[2]+24,ch[3]+24,ch[2]+24,ch[1]+24,ch[2]+24,ch[3]+24,ch[0]+36]
    for k,m in enumerate(arp):
        pn=int(0.6*SR); pt=np.arange(pn)/SR; fr=f(m)
        pl=(np.sin(2*np.pi*fr*pt)+0.35*np.sin(4*np.pi*fr*pt)+0.12*np.sin(6*np.pi*fr*pt))*np.exp(-pt*7)*env(pn,0.004,0.05)*0.045
        add(pl,st+k*beat/2,pan=0.35*(1 if k%2 else -1))
    # drums from bar 2
    if b>=1:
        for k in range(4):
            kn=int(0.3*SR); kt=np.arange(kn)/SR
            kick=np.sin(2*np.pi*(50+90*np.exp(-kt*30))*kt)*np.exp(-kt*12)*0.16
            add(kick,st+k*beat)
            hn=int(0.08*SR); hat=rng.standard_normal(hn); hat=np.diff(hat,prepend=0)*np.exp(-np.arange(hn)/SR*60)*0.018
            add(hat,st+k*beat+beat/2,pan=0.2)
        # soft clap on 2,4
        for k in (1,3):
            cn=int(0.2*SR); c=np.diff(rng.standard_normal(cn),prepend=0)*np.exp(-np.arange(cn)/SR*25)*0.025
            add(c,st+k*beat,pan=-0.1)
# SFX: whooshes at transitions
def whoosh(at,length=0.7,g=0.10):
    n=int(length*SR); x=rng.standard_normal(n)
    # sweep lowpass via moving average with varying window -> simple: band by diff + envelope
    e=np.sin(np.linspace(0,np.pi,n))**2
    y=np.convolve(x,np.ones(8)/8,'same')*e*g
    add(y,at-length*0.5,pan=-0.6); add(y[::-1]*0.6,at-length*0.5,pan=0.6)
for k in ('s2','s3','s4','s5'): whoosh(T[k])
# 150 punch
pn=int(0.5*SR); pt=np.arange(pn)/SR
add(np.sin(2*np.pi*(60+140*np.exp(-pt*25))*pt)*np.exp(-pt*8)*0.22, T['s3']+0.55)
# gift: riser, pop, sparkles
gb=T['s5']+1.25
rn=int(1.0*SR); rt=np.arange(rn)/SR
riser=np.convolve(rng.standard_normal(rn),np.ones(4)/4,'same')*(rt/rt[-1])**2*0.06+np.sin(2*np.pi*(300+900*(rt/rt[-1])**2)*rt)*(rt/rt[-1])**2*0.03
add(riser,gb-1.0)
add(np.sin(2*np.pi*(80+300*np.exp(-pt*30))*pt)*np.exp(-pt*10)*0.3,gb)
add(np.convolve(rng.standard_normal(pn),np.ones(3)/3,'same')*np.exp(-pt*14)*0.12,gb)
for k in range(14):
    sn=int(0.5*SR); st_=np.arange(sn)/SR; fr=f(84+[0,4,7,12,16,19,24][k%7])
    add(np.sin(2*np.pi*fr*st_)*np.exp(-st_*9)*0.03,gb+0.05+k*0.06,pan=rng.uniform(-.8,.8))
mix=np.stack([L,R],1)
# fade out end
fo=int(0.8*SR); mix[-fo:]*=np.linspace(1,0,fo)[:,None]
fi=int(0.05*SR); mix[:fi]*=np.linspace(0,1,fi)[:,None]
mix/=np.max(np.abs(mix))*1.12
with wave.open(sys.argv[2],'wb') as w:
    w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((mix*32767).astype('<i2').tobytes())
