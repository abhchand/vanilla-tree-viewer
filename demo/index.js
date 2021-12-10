import './template.scss';
import Logo from './logo.svg';

import VanillaTreeViewer from '../src/components/VanillaTreeViewer/VanillaTreeViewer';

document.addEventListener('DOMContentLoaded', function() {
  // Load SVG logo
  document.querySelector('.logo-link').innerHTML = Logo;

  VanillaTreeViewer.renderAll();
}, false);
