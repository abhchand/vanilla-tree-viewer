import * as Tree from './Tree';
import { expect } from 'chai';
import { renderComponent } from 'components/VanillaTreeViewer/Helpers/renderComponent';
import { toDirectoryTree } from 'components/VanillaTreeViewer/Tree/Builder/Builder';

let indent,
  path,
  selectedFileId,
  toggleDirectory,
  tree,
  updateSelectedPath;

beforeEach(() => {
  const files = [
    { path: 'gamma.rb', url: 'https://example.co/path/to/gamma.rb' },
    {
      path: '/delta/epsilon.js',
      url: 'https://example.co/path/to/epsilon.js',
      options: { language: 'javascript' }
    }
  ];

  const options = { language: 'ruby' };

  tree = toDirectoryTree(files, options);
  path = '/';
  indent = 0;
  toggleDirectory = jest.fn();
  updateSelectedPath = jest.fn();
  selectedFileId = null;
});

describe('<Tree />', () => {
  it('renders the component', () => {
    const container = render();

    expect(container.classList.contains('vanilla-tree-viewer__tree')).to.be.true;
  });

  it('renders the directory tree', () => {
    const container = render();
    const items = container.getElementsByTagName('li');

    expect(items.length).to.equal(4);

    // '/'
    expect(items[0].dataset.path).to.equal('/');
    expect(items[0].classList.contains('vanilla-tree-viewer__tree-node--directory')).to.be.true;

    // '/delta/'
    expect(items[1].dataset.path).to.equal('/delta');
    expect(items[1].classList.contains('vanilla-tree-viewer__tree-node--directory')).to.be.true;

    // '/delta/epsilon.js'
    expect(items[2].dataset.path).to.equal('/delta/epsilon.js');
    expect(items[2].classList.contains('vanilla-tree-viewer__tree-node--file')).to.be.true;

    // '/gamma.rb'
    expect(items[3].dataset.path).to.equal('/gamma.rb');
    expect(items[3].classList.contains('vanilla-tree-viewer__tree-node--file')).to.be.true;
  });
});

const render = (additionalProps = {}) => {
  const fixedProps = {
    tree: tree,
    path: path,
    indent: indent,
    toggleDirectory: toggleDirectory,
    updateSelectedPath: updateSelectedPath,
    selectedFileId: selectedFileId
  };

  const props = { ...fixedProps, ...additionalProps };

  return renderComponent(Tree, props);
};
