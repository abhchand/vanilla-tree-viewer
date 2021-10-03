import PubSub from './PubSub';

/*
 * A minimal implementation of a data store
 */
class Store {
  constructor(params) {
    this.state = params.state || {};
    this.events = new PubSub();
  }

  setState(newState) {
    this.state = Object.assign(this.state, newState);
    this.events.publish('stateChange', this.state);
  }
}

export default Store;
