import './Error.scss';

const render = (props) => {

  /*
   * Creates HTMLElement:
   *
   * <div class='vanilla-tree-viewer__code-error'>
   *   {text}
   * </div>
   *
   */

  const div = document.createElement('div');
  div.classList.add('vanilla-tree-viewer__code-error');
  div.innerHTML = props.text;

  return div;
};

export {
  render
};
