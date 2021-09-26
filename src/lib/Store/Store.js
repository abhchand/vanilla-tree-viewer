import PubSub from './PubSub';

class Store {
  constructor(params) {
    this.actions = params.actions || {};
    this.mutations = params.mutations || {};
    this.state = params.state || {};

    this.events = new PubSub();
  }

  setState(newState) {
    this.state = Object.assign(this.state, newState);
    this.events.publish('stateChange', this.state);
  }
}

export default Store;
