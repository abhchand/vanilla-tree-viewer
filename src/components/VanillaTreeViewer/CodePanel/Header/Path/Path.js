import './Path.scss';

const render = (props) => {
  /*
   * Creates HTMLElement:
   *
   * <div class='vanilla-tree-viewer--code-path'>
   *   {path}
   * </div>
   *
   */

  const div = document.createElement('div');
  div.classList.add('vanilla-tree-viewer__code-path');

  div.innerText = props.path;

  return div;
};

export { render };
