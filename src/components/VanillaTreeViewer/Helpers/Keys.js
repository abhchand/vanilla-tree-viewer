const keyCodes = Object.freeze({
  ARROW_DOWN:  40,
  ARROW_LEFT:  37,
  ARROW_RIGHT: 39,
  ARROW_UP:    38,
  ENTER:       13,
  ESCAPE:      27,
  LETTER_J:    74,
  LETTER_K:    75
});

function parseKeyCode(event) {
  // See: https://stackoverflow.com/q/4285627/2490003
  return typeof event.which == 'number' ? event.which : event.keyCode;
}

export {
  keyCodes,
  parseKeyCode
};
