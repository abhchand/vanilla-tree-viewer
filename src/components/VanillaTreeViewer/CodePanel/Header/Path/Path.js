import './Path.scss';

const render = (props) => {
  /*
   * Creates HTMLElement:
   *
   * <div class='vtv--code-path'>
   *   {path}
   * </div>
   *
   */

  const div = document.createElement('div');
  div.classList.add('vtv__code-path');
  div.innerText = props.path;

  return div;
};

export { render };
