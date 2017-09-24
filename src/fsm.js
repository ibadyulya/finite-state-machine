class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) 
    {
      //#Constructor, throws an exception if config isn\'t passed;
      if (!config) throw new Error();
      this.config = config;
      this.statesArr = [this.config.initial];
      this.redoDisabler = [];
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() 
    {
      //#getState, returns initial state after creation;
      return this.statesArr[this.statesArr.length - 1];
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) 
    {
      //#changeState, changes state;
      if (this.getStates().indexOf(state) == -1) throw new Error();
      if (this.config.states[state]) 
      {
        this.statesArr.push(state);
        //disables redo after changeState call;
        this.redoDisabler = [];
      }
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) 
    {
      
      //throws an exception if event in current state isn\'t exist;
      if (!this.config.states[this.getState()].transitions[event]) 
      {
        throw new Error();
      } 
      //#trigger, changes initial state according to event;
      //correctly changes states [3 in row];
      //correctly changes states [circular];
      this.statesArr.push(this.config.states[this.getState()].transitions[event]);
      //disables redo after trigger call;
      this.redoDisabler = [];
    }

    /**
     * Resets FSM state to initial.
     */
    reset() 
    {
      //#reset, resets current state to initial;
      this.changeState(this.config.initial);
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) 
    {
      if (event == undefined) return Object.keys(this.config.states);
      var getSt = [];
      for (var p in this.config.states) 
      {
          if (event in this.config.states[p].transitions) getSt.push(p);
      }
      return getSt;
      //returns all states if argument is empty;
      //returns correct states for event;
      //returns empty array for not valid array;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() 
    {
      //goes back to prev step after trigger;
      //goes back to prev after changeState;
      if (this.statesArr.length !== 1) 
      {
        this.redoDisabler.push(this.statesArr.pop());
        //returns true if transition was successful;
        return true;
      } 
      else 
      //returns false for initial FSM;
      //returns false if undo is not available;
      return false;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() 
    {
      //cancels undo;
      //correct cancels multiple undos;
      var p = this.redoDisabler.pop();
      if (!p) 
      {
        //returns false if redo is not available;
        //returns false for initial FSM;
        return false;
      } 
      this.statesArr.push(p);
      return true;
      //returns true if transition was successful;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
      this.statesArr = [this.config.initial];
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/