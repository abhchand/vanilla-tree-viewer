import { keyCodes } from './Keys.js';

/*
 * Simulates a keyboard event. Used for testing, taken
 * from https://stackoverflow.com/a/11885974/2490003
 */

function simulateKeyboardEvent(eventType, target, keyName) {
  // Translate key name to a key code
  const keyCode = keyCodes[keyName];
  if (!keyCode) {
    // eslint-disable-next-line
    console.error(`Unknown keyName: ${keyName}`);
    return;
  }

  const event = new KeyboardEvent(
    // Keydown, keyup, etc...
    eventType,
    {
      bubbles: true,
      cancelable: true,
      shiftKey: false,
      keyCode: keyCode,
      which: keyCode
    }
  );

  target.dispatchEvent(event);
}

export default simulateKeyboardEvent;
