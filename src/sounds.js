// --------------------------------------------
// | S O U N D   S Y N T H E S I S   F I L E  |
// --------------------------------------------

const c = new window.AudioContext();

/* ------   K I C K   ------ */
window.kick = function kick() {
    var o = c.createOscillator();
    var g = c.createGain();
    var now = c.currentTime;
    
    o.frequency.setValueAtTime(80, now);
    g.gain.setValueAtTime(2, now);

    o.frequency.exponentialRampToValueAtTime(0.01, now + 0.3);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    
    o.start();
    o.stop(now + 0.5);

    o.connect(g).connect(c.destination);
}
/* ------   K I C K   ------ */


/* ------   S N A R E   ------ */
window.snare = function snare() {
    var g = c.createGain();
    var f = c.createBiquadFilter();
    var bs = c.createBufferSource();
    var b = c.createBuffer(1, 4096, c.sampleRate);
    var data = b.getChannelData(0);

    for (var i = 0; i < 4096; i++) data[i] = Math.random();
    
    f.type = "highpass";
    f.frequency.setValueAtTime(70, c.currentTime);
    g.gain.setValueAtTime(3, c.currentTime);

    g.gain.exponentialRampToValueAtTime(0.00001, c.currentTime + 0.3);
    f.frequency.exponentialRampToValueAtTime(100, c.currentTime + 0.01);
  
    bs.buffer = b;
    bs.loop = true;
    
    bs.start();
    bs.stop(c.currentTime + 0.2);

    bs.connect(g).connect(f).connect(c.destination);
}
/* ------   S N A R E   ------ */


/* ------   H I  H A T   ------ */
window.hh = function hh() {
    var g = c.createGain();
    var f = c.createBiquadFilter();
    var bs = c.createBufferSource();
    var b = c.createBuffer(1, 4096, c.sampleRate);
    var data = b.getChannelData(0);
    var now = c.currentTime;
    
    for (var i = 0; i < 4096; i++) data[i] = Math.random();
    
    g.gain.setValueAtTime(0.2, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.00001, c.currentTime + 0.3);
    
    f.type = "highpass";
    f.frequency.value = 10000;
  
    bs.buffer = b;
    bs.loop = true;

    bs.start();
    bs.stop(now + 0.05);

    bs.connect(g).connect(f).connect(c.destination);
}
/* ------   H I  H A T   ------ */


/* ------   C O W B E L L   ------ */
window.cowbell = function cowbell () {
    var o = c.createOscillator();
    var f = c.createBiquadFilter();
    var g = c.createGain();
    var now = c.currentTime;
    
    o.type = "square";
    f.type = "bandpass";
    o.frequency.value = 800;
    f.frequency.value = 1000;
    
    g.gain.setValueAtTime(1, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + d)
    
    o.start(now);
    o.stop(now + d);
    
    o.connect(f).connect(g).connect(c.destination);
    
}
/* ------   C O W B E L L   ------ */


/* ------   T O M   ------ */
window.tom = function tom() {
    var o = c.createOscillator();
    var o2 = c.createOscillator();
    var g = c.createGain();
    var f = c.createBiquadFilter();
    var now = c.currentTime;

    o.type = "square";
    o2.type = "triangle";
    f.type = "lowpass";

    o.frequency.setValueAtTime(150, now);
    o2.frequency.value = 80;
    f.frequency.setValueAtTime(300, now);
    g.gain.setValueAtTime(1, now);

    o.frequency.exponentialRampToValueAtTime(80, now + 0.3);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
    f.frequency.exponentialRampToValueAtTime(80, now + 0.2)

    o.start(now);
    o2.start(now);
    o.stop(now + 0.4);
    o2.stop(now + 0.4);

    o.connect(f).connect(g).connect(c.destination);
    o2.connect(g).connect(c.destination);
}
/* ------   T O M   ------ */   