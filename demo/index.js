import './template.scss';
import Logo from './logo.svg';

import VanillaTreeViewer from '../src/components/VanillaTreeViewer/VanillaTreeViewer';
VanillaTreeViewer.renderAll();

document.addEventListener('DOMContentLoaded', function() {
  // Load SVG logo
  document.querySelector('.logo-link').innerHTML = Logo;
}, false);
