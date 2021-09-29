import './Logo.scss';

import binocularsIcon from 'components/VanillaTreeViewer/Icons/Binoculars';
import { VTV_SOURCE } from './constants';

const render = (_props) => {
  /*
   * Creates HTMLElement:
   *
   * <div class='vanilla-tree-viewer--logo'>
   *   <a href='...'>
   *     <svg>...</svg>
   *   </a>
   * </div>
   *
   */

  const div = document.createElement('div');
  div.classList.add('vanilla-tree-viewer__logo');

  const a = document.createElement('a');
  a.href = VTV_SOURCE;
  a.target = '_blank';

  a.innerHTML = binocularsIcon({
    height: '18px',
    width: '27px',
    title: 'vanilla-tree-viewer'
  });
  div.appendChild(a);

  return div;
};

export { render };
