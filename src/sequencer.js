//list of instruments to play
//console.table(instruments);
module.exports = class Sequencer {
    //standard constructor where all the parameters are specified
    constructor (sequence, instruments,numOfBeats) {
      this.sequence = sequence;
      this.instruments = instruments;
      this.numOfBeats = numOfBeats;  
    }
  
    //Method for building a sequencer not having the matrix built already
    static fromScratch(instruments,numOfBeats) {
      let sequence = [];
      instruments.forEach( () => {
          sequence.push(new Array(numOfBeats).fill(0));
      });
        this.sequence = sequence;
        return new Sequencer(sequence,instruments,numOfBeats)
    }
  
    toString() {
        return this.sequence + ', ' + this.instruments+", "+this.numOfBeats;
    }
  };