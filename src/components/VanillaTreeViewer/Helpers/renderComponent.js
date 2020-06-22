/*
 * Determines if an entity is a function or a Class, since
 * they both have `typeof === 'function'` in JavaScript
 *
 * There's no truly reliable way to do this, but the below
 * gives a reasonable implementation:
 *   https://stackoverflow.com/a/56035104/2490003
 *
 */
function isFunction(funcOrClass) {
  const propertyNames = Object.getOwnPropertyNames(funcOrClass);
  return !propertyNames.includes('prototype') || propertyNames.includes('arguments');
}

/*
 * Renders a component by calling the appropriate
 * render() method.
 *
 * This accounts for all the various ways we export
 * a component
 *
 *   * Component may be exported as a Class (that implements
 *     a `render()` function) that is then imported and
 *     instantiated.
 *       import Component from './Some/Component';
 *       const component = new Component(props);
 *       component.render();
 *
 *   * Component may be exported as a `render()` function
 *     and imported as a function that's directly called
 *       import { render } from './Some/Component';
 *       render(props);
 *
 *   * Component may be exported as a `render()` function
 *     and imported as an named import
 *       import * as Component from './Some/Component';
 *       Component.render(props);
 *
 */
function renderComponent(Component, props = {}) {
  if (typeof Component === 'function') {

    /*
     * Both functions and classes are of type 'function',
     * so test for which one it truly is
     */

    if (isFunction(Component)) {
      // This is a function
      // eslint-disable-next-line
      return Component(props);
    }
    // This is a class
    const klass = new Component(props);
    return klass.render();
  }

  // This is an object with a `render()` key
  if (typeof Component === 'object' && Object.prototype.hasOwnProperty.call(Component, 'render')) {
    return Component.render(props);
  }

  return null;
}

export {
  renderComponent
};
