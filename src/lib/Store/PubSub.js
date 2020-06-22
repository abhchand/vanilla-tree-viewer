export default class PubSub {

  constructor() {
    this.events = {};
  }

  /**
   * Either create a new event instance for passed `event` name
   * or push a new callback into the existing collection
   *
   * @param {string} event
   * @param {function} callback
   * @returns {number} A count of callbacks for this event
   * @memberof PubSub
   */
  subscribe(event, callback) {
    if (!Object.prototype.hasOwnProperty.call(this.events, event)) {
      this.events[event] = [];
    }

    return this.events[event].push(callback);
  }

  /**
   * If the passed event has callbacks attached to it, loop through each one
   * and call it
   *
   * @param {string} event
   * @param {object} [data={}]
   * @returns {array} The callbacks for this event, or an empty array if no
   * event existing
   * @memberof PubSub
   */
  publish(event, data = {}) {
    if (!Object.prototype.hasOwnProperty.call(this.events, event)) {
      return [];
    }

    return this.events[event].map((callback) => callback(data));
  }

}
