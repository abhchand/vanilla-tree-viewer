import VanillaTreeViewer from '../src/components/VanillaTreeViewer/VanillaTreeViewer';

const files = [
  {
    path: 'lib/core/transformData.js',
    url: 'https://raw.githubusercontent.com/axios/axios/master/lib/core/transformData.js',
    language: 'javascript'
  },
  {
    path: 'lib/axios.js',
    url: 'https://raw.githubusercontent.com/axios/axios/master/lib/axios.js',
    language: 'javascript'
  },
  {
    path: 'package.json',
    url: 'https://raw.githubusercontent.com/axios/axios/master/package.json',
    language: 'json'
  }
];

let viewer = new VanillaTreeViewer('app', files);
viewer.render();
