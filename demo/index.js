import VanillaTreeViewer from '../src/components/VanillaTreeViewer/VanillaTreeViewer';

const files = [
  {
    path: 'lib/core/transformData.js',
    url: 'https://raw.githubusercontent.com/axios/axios/master/lib/core/transformData.js'
  },
  {
    path: 'lib/axios.js',
    url: 'https://raw.githubusercontent.com/axios/axios/master/lib/axios.js'
  },
  {
    path: 'package.json',
    url: 'https://raw.githubusercontent.com/axios/axios/master/package.json',
    options: { language: 'json' }
  }
];

const options = {
  language: 'javascript'
}

let viewer = new VanillaTreeViewer('app', files, options);
viewer.render();
