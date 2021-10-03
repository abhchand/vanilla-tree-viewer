import Directory from './Directory';
import { expect } from 'chai';
import { renderComponent } from 'components/VanillaTreeViewer/Helpers/renderComponent';
import simulateKeyboardEvent from 'components/VanillaTreeViewer/Helpers/simulateKeyboardEvent';
import { toDirectoryTree } from 'components/VanillaTreeViewer/Tree/Builder/Builder';
import treeNodePadding from 'components/VanillaTreeViewer/Helpers/treeNodePadding';

let indent, path, selectedFileId, toggleDirectory, tree, updateSelectedPath;

beforeEach(() => {
  tree = {
    '/': {
      id: 'directory+/',
      isOpen: true,
      name: '/',
      path: '/',
      type: 'directory',
      childPaths: []
    }
  };

  path = '/';
  indent = 0;
  toggleDirectory = jest.fn();
  updateSelectedPath = jest.fn();
  selectedFileId = null;
});

describe('<Directory />', () => {
  it('renders the component', () => {
    const items = render();

    expect(items.length).to.equal(1);
    const container = items[0];

    expect(container.classList.contains('vtv__tree-node--directory')).to.be
      .true;

    expect(container.dataset.path).to.equal('/');
    expect(container.tabIndex).to.equal(0);
    expect(container.style.getPropertyValue('padding-left')).to.equal(
      `${treeNodePadding(indent)}px`
    );
  });

  it('renders the FolderOpen svg icon', () => {
    const container = render()[0];
    const svg = container.getElementsByTagName('svg')[0];

    expect(svg.id).to.equal('folder-open');
  });

  it('renders the Directory name', () => {
    const container = render()[0];
    const span = container.getElementsByTagName('span')[0];

    expect(span.innerHTML).to.equal(tree[path].name);
  });

  describe('triggering onClick events', () => {
    it('listens for click events', () => {
      const container = render()[0];
      container.click();
      expect(toggleDirectory.mock.calls.length).to.eql(1);
    });

    it('listens for keydown events on the ENTER key', () => {
      const container = render()[0];

      simulateKeyboardEvent('keydown', container, 'ENTER');
      expect(toggleDirectory.mock.calls.length).to.eql(1);
    });

    it('ignores keydown events on other keys', () => {
      const container = render()[0];

      simulateKeyboardEvent('keydown', container, 'ARROW_DOWN');
      expect(toggleDirectory.mock.calls.length).to.eql(0);
    });
  });

  /*
   * Since `Contents` and `Directory` call each other recursively,
   * it's easier to the rendered tree in one place. The below
   * tests provide coverage for `Contents`
   */
  describe('directory contents', () => {
    beforeEach(() => {
      /*
       * The below file structure gives us
       *  - A nested set of directories
       *  - A directory that renders both subdirectories and files
       *
       */

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
    });

    it('renders the nested tree of directories and files', () => {
      const items = render();

      expect(items.length).to.equal(4);

      // '/'
      expect(items[0].dataset.path).to.equal('/');
      expect(items[0].classList.contains('vtv__tree-node--directory')).to.be
        .true;

      // '/delta/'
      expect(items[1].dataset.path).to.equal('/delta');
      expect(items[1].classList.contains('vtv__tree-node--directory')).to.be
        .true;

      // '/delta/epsilon.js'
      expect(items[2].dataset.path).to.equal('/delta/epsilon.js');
      expect(items[2].classList.contains('vtv__tree-node--file')).to.be.true;

      // '/gamma.rb'
      expect(items[3].dataset.path).to.equal('/gamma.rb');
      expect(items[3].classList.contains('vtv__tree-node--file')).to.be.true;
    });

    describe('selectedFileId is present', () => {
      beforeEach(() => {
        selectedFileId = tree['/gamma.rb'].id;
      });

      it('renders the `selected` class', () => {
        const items = render();

        expect(items[0].classList.contains('selected')).to.be.false;
        expect(items[1].classList.contains('selected')).to.be.false;
        expect(items[2].classList.contains('selected')).to.be.false;
        expect(items[3].classList.contains('selected')).to.be.true;
      });
    });

    describe('renders with the correct indentation', () => {
      beforeEach(() => {
        indent = 0;
      });

      it('renders the proper padding based off the indent', () => {
        const items = render();

        [
          { idx: 0, indent: 0 },
          { idx: 1, indent: 1 },
          { idx: 2, indent: 2 },
          { idx: 3, indent: 1 }
        ].forEach((data) => {
          expect(
            items[data.idx].style.getPropertyValue('padding-left')
          ).to.equal(`${treeNodePadding(data.indent)}px`);
        });
      });
    });

    describe('directory is closed', () => {
      beforeEach(() => {
        tree['/delta'].isOpen = false;
      });

      it('does not render the directory contents', () => {
        const items = render();

        expect(items.length).to.equal(3);

        // '/'
        expect(items[0].dataset.path).to.equal('/');
        expect(items[0].classList.contains('vtv__tree-node--directory')).to.be
          .true;

        // '/delta/'
        expect(items[1].dataset.path).to.equal('/delta');
        expect(items[1].classList.contains('vtv__tree-node--directory')).to.be
          .true;

        // '/delta/epsilon.js' -> not rendered

        // '/gamma.rb'
        expect(items[2].dataset.path).to.equal('/gamma.rb');
        expect(items[2].classList.contains('vtv__tree-node--file')).to.be.true;
      });

      it('renders the FolderClosed svg icon', () => {
        const container = render()[1];
        const svg = container.getElementsByTagName('svg')[0];

        expect(svg.id).to.equal('folder-closed');
      });
    });

    describe('triggering onClick events', () => {
      it('listens for click events on directories', () => {
        const items = render();

        // '/delta/'
        items[1].click();
        expect(toggleDirectory.mock.calls.length).to.eql(1);

        // '/'
        items[0].click();
        expect(toggleDirectory.mock.calls.length).to.eql(2);
      });

      it('listens for click events on files', () => {
        const items = render();

        // '/delta/epsilon.js'
        items[2].click();
        expect(updateSelectedPath.mock.calls.length).to.eql(1);

        // '/gamma.rb'
        items[3].click();
        expect(updateSelectedPath.mock.calls.length).to.eql(2);
      });
    });
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

  return renderComponent(Directory, props);
};
