import './Loading.scss';

const render = (_props = {}) => {

  /*
   * Creates HTMLElement:
   *
   * <div class='vanilla-tree-viewer__code-loading'>
   *   Loading...
   * </div>
   *
   */

  const div = document.createElement('div');
  div.classList.add('vanilla-tree-viewer__code-loading');
  div.innerHTML = 'Loading...';

  return div;
};

export {
  render
};
