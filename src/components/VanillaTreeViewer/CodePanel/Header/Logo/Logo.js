import './Logo.scss';

import { UTM_CAMPAIGN, VTV_SOURCE } from './constants';
import binocularsIcon from 'components/VanillaTreeViewer/Icons/Binoculars';

const utmSource = () => {
  try {
    return window.location.origin;
  } catch (_e) {
    return 'unknown';
  }
};

const render = (_props) => {
  /*
   * Creates HTMLElement:
   *
   * <div class='vtv--logo'>
   *   <a href='...'>
   *     <svg>...</svg>
   *   </a>
   * </div>
   *
   */

  const div = document.createElement('div');
  div.classList.add('vtv__logo');

  const a = document.createElement('a');
  a.href = `${VTV_SOURCE}?utm_campaign=${UTM_CAMPAIGN}&utm_source=${utmSource()}`;
  a.target = '_blank';

  a.innerHTML = binocularsIcon({
    height: '18px',
    width: '27px'
  });
  div.appendChild(a);

  return div;
};

export { render };
