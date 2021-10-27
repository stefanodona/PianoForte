c = new AudioContext();

var counter = 0;

g = c.createGain();
g.connect(c.destination);

function play(n) {
    o = c.createOscillator();
    o.connect(g);
    o.frequency.value
}

