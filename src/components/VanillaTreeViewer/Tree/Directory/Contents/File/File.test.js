import * as File from './File';
import { DEFAULT_OPTIONS } from 'components/VanillaTreeViewer/Tree/Builder/Constants';
import { expect } from 'chai';
import { renderComponent } from 'components/VanillaTreeViewer/Helpers/renderComponent';
import simulateKeyboardEvent from 'components/VanillaTreeViewer/Helpers/simulateKeyboardEvent';
import treeNodePadding from 'components/VanillaTreeViewer/Helpers/treeNodePadding';

let file, indent, isSelected, updateSelectedPath;

beforeEach(() => {
  file = {
    id: 'file+/alpha/beta/gamma.rb',
    name: 'gamma.rb',
    type: 'file',
    path: '/alpha/beta/gamma.rb',
    contents: `
      def foo
        true
      end
    `,
    url: 'https://example.co/alpha/beta/gamma.rb',
    error: null,
    options: DEFAULT_OPTIONS
  };

  indent = 1;
  isSelected = false;
  updateSelectedPath = jest.fn();
});

describe('<File />', () => {
  it('renders the component', () => {
    const container = render();

    expect(container.classList.contains('vanilla-tree-viewer__tree-node--file'))
      .to.be.true;
    expect(container.classList.contains('selected')).to.be.false;

    expect(container.dataset.path).to.equal(file.path);
    expect(container.tabIndex).to.equal(0);
    expect(container.style.getPropertyValue('padding-left')).to.equal(
      `${treeNodePadding(indent)}px`
    );
  });

  describe('isSelected is true', () => {
    beforeEach(() => {
      isSelected = true;
    });

    it('renders the `selected` class', () => {
      const container = render();
      expect(container.classList.contains('selected')).to.be.true;
    });
  });

  describe('indent is greater than 1', () => {
    beforeEach(() => {
      indent = 7;
    });

    it('renders the proper padding based off the indent', () => {
      const container = render();

      expect(container.style.getPropertyValue('padding-left')).to.equal(
        `${treeNodePadding(7)}px`
      );
    });
  });

  it('renders the File svg icon', () => {
    const container = render();
    const svg = container.getElementsByTagName('svg')[0];

    expect(svg).to.not.be.undefined;
  });

  it('renders the file name', () => {
    const container = render();
    const span = container.getElementsByTagName('span')[0];

    expect(span.innerHTML).to.equal(file.name);
  });

  describe('triggering onClick events', () => {
    it('listens for click events', () => {
      const container = render();
      container.click();
      expect(updateSelectedPath.mock.calls.length).to.eql(1);
    });

    it('listens for keydown events on the ENTER key', () => {
      const container = render();

      simulateKeyboardEvent('keydown', container, 'ENTER');
      expect(updateSelectedPath.mock.calls.length).to.eql(1);
    });

    it('ignores keydown events on other keys', () => {
      const container = render();

      simulateKeyboardEvent('keydown', container, 'ARROW_DOWN');
      expect(updateSelectedPath.mock.calls.length).to.eql(0);
    });
  });
});

const render = (additionalProps = {}) => {
  const fixedProps = {
    file: file,
    updateSelectedPath: updateSelectedPath,
    isSelected: isSelected,
    indent: indent
  };

  const props = { ...fixedProps, ...additionalProps };

  return renderComponent(File, props);
};
