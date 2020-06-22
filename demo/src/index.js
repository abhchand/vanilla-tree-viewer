import VanillaTreeViewer from '../../src/components/VanillaTreeViewer/VanillaTreeViewer';

const files = [
  {
    path: 'app/controllers/application_controller.rb',
    url: 'https://raw.githubusercontent.com/openstreetmap/openstreetmap-website/master/app/controllers/application_controller.rb'
  },
  {
    path: '/app/assets/stylesheets/embed.scss',
    url: 'https://raw.githubusercontent.com/openstreetmap/openstreetmap-website/master/app/assets/stylesheets/embed.scss',
    options: {
      language: 'css'
    }
  },
  {
    path: '/app/assets/javascripts/id.js',
    url: 'https://raw.githubusercontent.com/openstreetmap/openstreetmap-website/master/app/assets/javascripts/id.js',
    selected: true,
    options: {
      language: 'javascript'
    }
  }
];

const options = {
  language: 'ruby'
}

let viewer = new VanillaTreeViewer('app', files, options);
viewer.render();
