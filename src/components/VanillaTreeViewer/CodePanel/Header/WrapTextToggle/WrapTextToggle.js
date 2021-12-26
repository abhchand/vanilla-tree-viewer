import './WrapTextToggle.scss';

import wrapTextIcon from 'components/VanillaTreeViewer/Icons/WrapText';

const render = (props) => {
  /*
   * Creates HTMLElement:
   *
   * <div class='vtv__wrap-text-toggle'>
   *   <button>
   *     <svg>...</svg>
   *   </a>
   * </div>
   *
   */

  const div = document.createElement('div');
  div.classList.add('vtv__wrap-text-toggle');

  if (props.wrapText) {
    div.classList.add('vtv__wrap-text-toggle--active');
  }

  const button = document.createElement('button');
  button.addEventListener('click', props.toggleWrapText);

  button.innerHTML = wrapTextIcon({});
  div.appendChild(button);

  return div;
};

export { render };
