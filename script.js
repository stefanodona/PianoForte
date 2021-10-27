c = new AudioContext();

var counter = 0;

g = c.createGain();
g.connect(c.destination);

const a = 0.01;
const d = 0.02;
const sl = 0.2;
const st = 0.2;
const r = 0.5;

document.getElementById("AT").value = a;    // attack time
document.getElementById("DT").value = d;    // decay time
document.getElementById("SL").value = sl;   // sustain level
document.getElementById("ST").value = st;   // sustain time
document.getElementById("RT").value = r;    // release time

function play(n) {
    o = c.createOscillator();
    o.connect(g);
    o.frequency.value = Math.pow(2, n / 12);
    now = c.currentTime;

    o.start(now)
    o.stop(now+aA+aD+aS+aST+)

    aA = strip(document.getElementById("AT").value);
    aD = strip(document.getElementById("DT").value);
    aS = strip(document.getElementById("SL").value);
    aST = strip(document.getElementById("ST").value);
    aR = strip(document.getElementById("RT").value);

    g.gain.setValueAtTime(0, c.currentTime);
    g.gain.linearRampToValueAtTime(1, c.currentTime + aA);
    g.gain.linearRampToValueAtTime(aS, c.currentTime + aA + aD);
    g.gain.setValueAtTime(aS, c.currentTime + aA + aD + aST);
    g.gain.linearRampToValueAtTime(0, c.currentTime + aA + aD + aST + aR);
    o.stop(c.currentTime + aA + aD + aST + aR)

}

function strip(number) {
    return (parseFloat(number));
}
