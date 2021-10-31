import './app.js';
/* ------    S E Q U E N C E R   ------ */

var t = 0;
const bpm = 90;
const interval = 15000/bpm;
let timer;
var kick_seq = document.getElementById("kick-sequencer");
var snr_seq = document.getElementById("snare-sequencer");
var len = kick_seq.children.length;
let kick_arr = new Array(len).fill(0);
let snr_arr = new Array(len).fill(0);


var kick_boxes = document.querySelectorAll(".kick");
var snr_boxes = document.querySelectorAll(".snr");
kick_boxes.forEach(setOnKick)
snr_boxes.forEach(setOnSnr)

var seqButton = document.getElementById("seq-on");
var seq_on = false
seqButton.onclick = () => {
    seq_on = !seq_on
    seqButton.classList.toggle("active");
}

window.WhenHH = function WhenHH() {
  return (t%2 == 0 || t%4 == 3);
}

// funziona ma non mi piace il concetto
window.WhenKick = function WhenKick () {
    if (seq_on) {
        for (let i in kick_arr) {
            if (kick_arr.at(i) == 1) {
            if (t % len == i) return true;
            }
        }
    }
    else {
        return (t%8 == 0 || t%8 == 3);
    }
    
}

window.WhenSnare = function WhenSnare () {
  if (seq_on) {
      for (let i in snr_arr) {
          if (snr_arr.at(i) == 1) {
          if (t % len == i) return true;
          }
      }
  }
  else {
      return t%8 == 4;
  }
}

var isPlaying = false;
var tunz = document.getElementById('tunz');
tunz.onclick = function () {
    if (!isPlaying) rhythm(); 
    isPlaying = true; 
}


window.rhythm = function rhythm() {
    if (WhenKick()) kick();
    if (WhenSnare()) snare();
    if (WhenHH()) hh();
    if (t%32==0) playC();
    if (t%32==8) playG();
    if (t%32==16) playD();
    if (t%32==24) playC();
    t++;
    timer = setTimeout(rhythm, interval);    
}

window.stop = function stop() {
    clearTimeout(timer);
    t = 0;
    isPlaying = false;
}   




function setOnKick(item) {
    item.onclick = (e) => {
      let a = Array.from(kick_seq.children);
      
      if (e.target.classList.contains("active")) {
        e.target.classList.remove("active");
        kick_arr[a.indexOf(e.target)] = 0;
      }
      else {
        e.target.classList.add("active");
        kick_arr[a.indexOf(e.target)] = 1;
      }
      console.log(kick_arr);
    };  
}

function setOnSnr(item) {
    item.onclick = (e) => {
      let b = Array.from(snr_seq.children);
      
      if (e.target.classList.contains("active")) {
        e.target.classList.remove("active");
        snr_arr[b.indexOf(e.target)] = 0;
      }
      else {
        e.target.classList.add("active");
        snr_arr[b.indexOf(e.target)] = 1;
      }
      console.log(snr_arr);
    };  
}

/* ------    S E Q U E N C E R   ------ */


var instruments = [ kick(), snare(), hh(), cowbell(), tom()];
console.table(instruments);
let sequence = [];
var numOfBeats = 16; //var that identifies the number most fast beats the sequencer plays
instruments.forEach( () => {
  sequence.push(new Array(numOfBeats).fill(0));
});

console.table(sequence);

for(var i=0; i<instruments.length; i++) {
  var bar = document.createElement("div");
  bar.classList.add("bar");
  seq.append(bar);
  for(var j = 0; j < numOfBeats; j++) {
    var b = document.createElement("button")
    b.classList.add("box")
    bar.append(b)
  }

}

window.rhythmPlay = function rhythmPlay() {
  for (let i = 0; i <numOfBeats; i = (i%sequence.length)+1) {
    // get the size of the inner array
    for(let j = 0; j <sequence.length; j = (j%sequence.length)+1) {
    if(sequence[i][j]>0) {
      instruments[j]();
    } 
  }
}
  t++;
  timer = setTimeout(rhythm, interval);
}
