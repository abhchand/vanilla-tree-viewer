import Store from './Store/Store';

export default class Component {
  constructor(props = {}) {
    const self = this;

    if (props.store instanceof Store) {
      this.store = props.store;
      this.store.events.subscribe('stateChange', () => self.render());
    }

    if (Object.prototype.hasOwnProperty.call(props, 'element')) {
      this.element = props.element;
    }
  }
}
