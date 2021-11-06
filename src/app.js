import firebase from 'firebase/app';

import 'firebase/firestore';
import './sounds.js'
import './liveSequencer.js';
import 'regenerator-runtime/runtime';
const Sequencer = require("./Sequencer.js");
const c = new window.AudioContext();

var counter = 0;
var unison = 0;     // variable that give the number of unison notes to set the master gain
var detuneMod = false;

var master = c.createGain();
master.gain.value = 1;
master.connect(c.destination);

const a = 0.01;
const d = 0.02;
const sl = 0.2;
const st = 0.7;
const r = 0.8;

document.getElementById("AT").value = a;    // attack time
document.getElementById("DT").value = d;    // decay time
document.getElementById("SL").value = sl;   // sustain level
document.getElementById("ST").value = st;   // sustain time
document.getElementById("RT").value = r;    // release time

window.play = function play(n) {
    unison +=1
    var now = c.currentTime;
    var g = c.createGain();
    var o = c.createOscillator();
    o.type = "sine";
    var f = c.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.setValueAtTime(1000, now);  


    // detune modulation
    if (detuneMod==true) {
        o.type = "triangle"
        var osc = c.createOscillator();
        var oscGain = c.createGain();
        oscGain.gain.value = 25;
        osc.connect(oscGain);
        oscGain.connect(o.detune);
        osc.frequency.value = 1.5;
        osc.type = "triangle"
        osc.start(); 
    }
      
    
    o.connect(f).connect(g).connect(master)//.connect(reverb);

    if(revOn) {
        createReverb().then(reverb => {
            o.connect(reverb);
            reverb.connect(master);
        })
    }

    o.frequency.value = 261.63 * Math.pow(2, n / 12);
    master.gain.setValueAtTime(1/unison, now);
    o.start(now)

    var aA = strip(document.getElementById("AT").value);
    var aD = strip(document.getElementById("DT").value);
    var aS = strip(document.getElementById("SL").value);
    var aST = strip(document.getElementById("ST").value);
    var aR = strip(document.getElementById("RT").value);

    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(1, now + aA);
    g.gain.linearRampToValueAtTime(aS, now + aA + aD);
    g.gain.setValueAtTime(aS, now + aA + aD + aST);
    g.gain.linearRampToValueAtTime(0, now + aA + aD + aST + aR);
    o.stop(now + aA + aD + aST + aR)
    incrementClicks();
    //listenToCLicks();
    //getClicks();
    //counter += 1;

    setTimeout(function () {unison -= 1}, (aA + aD + aST + aR)*1000)
    render();
}


window.resetCounter = function resetCounter() {
    firebase.firestore().collection("clicks").doc("clicks").update({
        click_num: 0

    }).then(() => {
        console.log("Document updated"); // Document updated
    }).catch((error) => {
        console.error("Error updating doc", error);
    });
}

window.playC = function playC() {
    play(0);
    play(3);
    play(5);
    play(7);
    play(10);
}

window.playG = function playG() {
    play(2);
    play(5);
    play(9);
    play(10);
    play(12);
}

window.playD = function playD() {
    play(0);
    play(2);
    play(5);
    play(9);
}

function strip(number) {
    return (parseFloat(number));
}

function render() {
    document.getElementById("counter").innerHTML = counter;
}
console.log("hi")








var flavour = document.getElementById("flavour");
flavour.onclick = function() {toggleMod();  };

window.toggleMod = function toggleMod() {
    if (detuneMod) {
        detuneMod = false;
        document.querySelector('#flavour').classList.remove("active");
    }
    else {
        detuneMod = true;
        document.querySelector('#flavour').classList.add("active");
    }
}

var revButton = document.getElementById("rev");
revButton.onclick = function() {toggleRevMod();  };
var revOn = false;
window.toggleRevMod = function toggleRevMod() {
    if (revOn) {
        revOn = false;
        document.querySelector('#rev').classList.remove("active");
    }
    else {
        revOn = true;
        document.querySelector('#rev').classList.add("active");
    }
}




//Firestore addition

// Your web app's Firebase configuration

const firebaseConfig = {

    apiKey: "AIzaSyDb6EeG3IRtj_WAvIFkPJePkTRuA-WESA0",
  
    authDomain: "pianoforte-e291f.firebaseapp.com",
  
    projectId: "pianoforte-e291f",
  
    storageBucket: "pianoforte-e291f.appspot.com",
  
    messagingSenderId: "220448670910",
  
    appId: "1:220448670910:web:4ad8bd31af458cd4690aef"
  
  };
  

if (!firebase.apps.length) {
   firebase.initializeApp(firebaseConfig);
}else {
   firebase.app(); // if already initialized, use that one
}
//const db = firebase.firestore();
const db = firebase.firestore();


var clicksRef = db.collection("clicks").doc("clicks");


function incrementClicks() {
    firebase.firestore().collection("clicks").doc("clicks").update({
        click_num: firebase.firestore.FieldValue.increment(1)

    }).then(() => {
        console.log("Document updated"); // Document updated
    }).catch((error) => {
        console.error("Error updating doc", error);
    });

}

firebase
.firestore()
.collection("clicks")
.doc('clicks')
.onSnapshot((snapshot) => {
    console.log("All data in 'books' collection", snapshot.data());
    counter = snapshot.data().click_num;
    render()
});



//https://www.freecodecamp.org/news/the-firestore-tutorial-for-2020-learn-by-example/


async function createReverb() {
    let convolver = c.createConvolver();

    // load impulse response from file
    //let audioUrl = require("../IRs/SC-MesHalfB212-C90-MD421-RoomB1.wav");
    const audioURL = new URL('../IRs/SC-MesHalfB212-C90-MD421-RoomB1.wav', import.meta.url);
    let response = await fetch(audioURL);
    console.log(response);
    let arraybuffer  = await response.arrayBuffer();
    console.log(arraybuffer);
    convolver.buffer = await c.decodeAudioData(arraybuffer);

    return convolver;
}

/*-----------------part for saving values of sequencer -------------------- */
window.downloadSequencer =function downloadSequencer() {
    var docId = "xTYtYhoUX56IY5Uvhp62"
    firebase
        .firestore()
        .collection("SeqSave")
        .doc(docId)
        .onSnapshot((snapshot) => {
            console.log("sequencer downloaded:", snapshot.data());
            window.sequencer = seqConverter.fromFirestore(snapshot)
            renderSequencer();
        });
        
}
    window.saveSequencer =function saveSequencer() {
        var possibleName = prompt("Please enter the name of the snapshot", "Harry Potter");
        var name = "John Doe"
        if (possibleName != null) {
            name = possibleName;
        } 
        firebase
          .firestore()
          .collection("SeqSave")
          .add(seqConverter.toFirestore(sequencer, name))
          .then((ref) => {
            console.log("Added doc with ID: ", ref.id);
            // Added doc with ID:  ZzhIgLqELaoE3eSsOazu
          });
        }






    const seqConverter = {
        toFirestore: (sequencer,name) => {
            var fsSequence = []
            //convert array of numbers used to program the sequencer into a string of numbers parsed by underscore
            for(let i = 0; i <sequencer.sequence.length; i++){
                    var boxesStr = "";
                    for(let j = 0; j<sequencer.sequence[i].length; j++) {
                        boxesStr += sequencer.sequence[i][j];
                        if(j<sequencer.sequence[i].length -1) boxesStr += "_";
                    }
                    fsSequence.push(boxesStr)
                }

            //converting array of object used to specify instruments functions in array of objects made by strings 
            var fsInstruments = [];
            for(let i = 0; i < sequencer.instruments.length; i++) {
                var toInsert = {
                    name: sequencer.instruments[i].name,
                    function: sequencer.instruments[i].function.name
                } 
                fsInstruments.push(toInsert)    
            }
            return {
                Title: name,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                sequence: fsSequence,
                instruments: fsInstruments,
                numOfBeats: sequencer.numOfBeats,
            };
        },

        fromFirestore: (snapshot, options) => {
            const data = snapshot.data(options);
            console.log(snapshot)
            //conversion of sequence from firestore 
            var fsSequence = []
            for(let i = 0; i <data.sequence.length; i++){
                let values = data.sequence[i].split('_')
                if(values.length!=data.numOfBeats) console.error("something doesn't work on sequencer firestore handling");
                var numValues = values.map(Number)
                fsSequence.push(numValues)
            }

            //conversion of instruments from firestore
            var fsInstruments = []
            for(let i = 0; i <data.instruments.length; i++){
                let ins = {
                    name: data.instruments[i].name,
                    function: Function(data.instruments[i].function+"()")
                }
                //if(values.length!=data.numOfBeats) console.error("something doesn't work on sequencer firestore handling");
                
                fsInstruments.push(ins)
            }
            return new Sequencer(fsSequence, fsInstruments,data.numOfBeats);
        }
    
    }
    key="763fb7be9fa7445b836c7d0967859cda"


window.spoonacularQueryRecipeList = async function() {
    const spoonURL = new URL("https://api.spoonacular.com/recipes/complexSearch?apiKey="+key, import.meta.url);
    let response = await fetch(spoonURL)
        .then(response => response.json())
        .then(data => console.log(data));;
    //console.log(response)
}

window.spoonacularQueryGetRecipe = async function() {
    const spoonURL = new URL("https://api.spoonacular.com/recipes/complexSearch?apiKey="+key, import.meta.url);
    let response = await fetch(spoonURL)
        .then(response => response.json())
        .then(data => console.log(data));;
    //console.log(response)
}
    
    
