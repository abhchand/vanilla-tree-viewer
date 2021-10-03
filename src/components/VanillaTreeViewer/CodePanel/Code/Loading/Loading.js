import './Loading.scss';

const render = (_props = {}) => {
  /*
   * Creates HTMLElement:
   *
   * <div class='vtv__code-loading'>
   *   Loading...
   * </div>
   *
   */

  const div = document.createElement('div');
  div.classList.add('vtv__code-loading');
  div.innerHTML = 'Loading...';

  return div;
};

export { render };
