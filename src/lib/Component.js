import Store from './Store/Store';

/*
 * Base Component that all components inherit from.
 */
export default class Component {
  constructor(props = {}) {
    const self = this;

    if (props.store instanceof Store) {
      this.store = props.store;
      this.store.events.subscribe('stateChange', () => self.render());
    }

    // Store the `element` for convenience if present
    if (Object.prototype.hasOwnProperty.call(props, 'element')) {
      this.element = props.element;
    }
  }
}
