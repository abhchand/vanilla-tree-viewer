import './InvalidState.scss';

const DEFAULT_MESSAGE = 'There was an error rendering files (see console).';

const render = (props = {}) => {
  // eslint-disable-next-line
  console.error(`vanilla-tree-viewer failed to initialize: ${props.reason}`);

  /*
   * Creates HTMLElement:
   *
   * <div class='vanilla-tree-viewer vanilla-tree-viewer--invalid'>
   *   {message}
   * </div>
   *
   */

  const div = document.createElement('div');

  div.classList.add('vanilla-tree-viewer');
  div.classList.add('vanilla-tree-viewer--invalid');

  div.innerText = props.message || DEFAULT_MESSAGE;

  return div;
};

export { render, DEFAULT_MESSAGE };
