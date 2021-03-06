//import './app.js';
const Sequencer = require("./Sequencer.js");
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
    //if (!isPlaying) rhythmPlay(); 
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

//sequencer setup


 
/*
window.sequencer = new Sequencer( [], //sequencer generated on instruments built
  [ 
    {name: "kick", function: function () {kick()}},
    {name: "snare", function: function () {snare()}},
    {name: "hh", function: function () {hh()}},
    {name: "tom", function: function () {tom()}},
    {name: "cowbell", function: function () {cowbell()}},
  ]
)
*/


window.sequencer = Sequencer.fromScratch(  //sequencer generated on instruments built
  [ 
    {name: "kick", function: kick},
    {name: "snare", function: snare},
    {name: "hh", function: hh},
    {name: "tom", function: tom},
    {name: "cowbell", function: cowbell},
  ],
  32 //var that identifies the number most fast beats the sequencer plays
)


//console.log("I am here now")
console.table(sequencer.instruments);
//let sequence = [];  //sequencer generated on instruments built



console.table(sequencer.sequence);

setupSequencer();
/* building new sequencer pad */

//everything works but don't know why doesn't build the correct num of rows
function setupSequencer() {
  for(var i=0; i<sequencer.instruments.length; i++) {
    //console.log("instruments:"+instruments.length)
    var seqBar = document.createElement("div");
    
    //bar.classList.add("bar");
    seq.append(seqBar);
    for(var j = 0; j < sequencer.numOfBeats; j++) {
      var b = document.createElement("button")
      b.classList.add("box")
      //b.innerText = ""+i+j
      seqBar.append(b)
    }
    
  }
}
/* building new sequencer pad */

function setOnIns(item) {
  item.onclick = (e) => {
    let bars = Array.from(seq.children);
    //console.log(bars)
    //console.log(e.target)
    //console.log(e.target.parentElement)
    let boxes = Array.from(seq.children[bars.indexOf(e.target.parentElement)].children);
    //console.log(boxes)
    
    if (e.target.classList.contains("active")) {
      e.target.classList.remove("active");
      sequencer.sequence[bars.indexOf(e.target.parentElement)][boxes.indexOf(e.target)] = 0;
    }
    else {
      e.target.classList.add("active");
      sequencer.sequence[bars.indexOf(e.target.parentElement)][boxes.indexOf(e.target)] = 1;
    }
    //console.table(sequence)
    
  };  
  
}
//var kick_boxes = document.querySelectorAll(".kick");
/*
var seqBar = document.querySelector("#seq").children;
console.log(seqBar)
seqBar.forEach(
  (list) => {
    list.children.forEach(setOnIns)
  }
)*/

//piece of code used to assign the right onClick function to the sequencer values 
Array.from(document.querySelector("#seq").children).forEach(child => {
  Array.from(child.children).forEach(setOnIns);
  //console.log(child)
});

window.playNewSeq = function playNewSeq() {
    var i = t%sequencer.numOfBeats
    console.log("i:"+i)
    // get the size of the inner array
    for(let j = 0; j <sequencer.sequence.length; j++) {
      //console.log("sequence.length:"+sequence.length)
      //console.log("j:"+j)
      //console.log(sequence[j][i])
      if(sequencer.sequence[j][i]>0) {
        //console.log(instruments[j])      
        sequencer.instruments[j].function();
      } 
  }

  renderSequencer(); 
  t++;
  timer = setTimeout(playNewSeq, interval);
  //step()

}
/*
let start, previousTimeStamp
function step(timestamp) {
  if (start === undefined)
    start = timestamp;
  const elapsed = timestamp - start;
  if(previousTimeStamp!== timestamp) {
  renderSequencer()
  }
  window.requestAnimationFrame(step)
  if (!isPlayingNewSeq) { // Stop the animation after 2 seconds
    previousTimeStamp = timestamp
    window.requestAnimationFrame(step);
  }
}
*/
var isPlayingNewSeq = false;
var newSeq = document.getElementById('newSeq');

//function to start sequencer playing 
newSeq.onclick = function () {
    if (!isPlayingNewSeq) playNewSeq();
    //if (!isPlaying) rhythmPlay(); 
    isPlayingNewSeq = true; 
}

//function to stop sequencer playing 
window.stopNewSeq = function stopNewSeq() {
  clearTimeout(timer);
  t = 0;
  isPlayingNewSeq = false;
}   



/*----------------visual part of sequencer------------------- */

window.renderSequencer = function renderSequencer() {
   //.forEach(child => {
  
    //console.log(child)
  //});
  var bars = Array.from(document.querySelector("#seq").children)
  for(let i = 0; i <sequencer.sequence.length; i++) { 
    var boxes = Array.from(bars[i].children)
    for(let j = 0; j <sequencer.numOfBeats; j++) {
      boxes[j].classList.toggle("active", (sequencer.sequence[i][j]>0));
      if(isPlayingNewSeq) {
      boxes[j].classList.toggle("actPlay", (sequencer.sequence[i][j]>0 && t%sequencer.numOfBeats==j));
      boxes[j].classList.toggle("nonActPlay", (sequencer.sequence[i][j]<=0 && t%sequencer.numOfBeats==j));
      }
      
    } 
  }

}