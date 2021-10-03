import './Error.scss';

const render = (props) => {
  /*
   * Creates HTMLElement:
   *
   * <div class='vtv__code-error'>
   *   {text}
   * </div>
   *
   */

  const div = document.createElement('div');
  div.classList.add('vtv__code-error');
  div.innerHTML = props.text;

  return div;
};

export { render };
