import VanillaTreeViewer from '../src/components/VanillaTreeViewer/VanillaTreeViewer';

const files = [
  {
    path: 'src/dateParser.js',
    url: 'https://raw.githubusercontent.com/nmn/react-timeago/master/src/dateParser.js'
  },
  {
    path: 'src/index.js',
    url: 'https://raw.githubusercontent.com/nmn/react-timeago/master/src/index.js'
  },
  {
    path: '/package.json',
    url: 'https://raw.githubusercontent.com/nmn/react-timeago/master/package.json',
    options: { language: 'json' }
  }
];

const options = {
  language: 'javascript'
}

let viewer = new VanillaTreeViewer('app', files, options);
viewer.render();
