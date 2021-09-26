import * as CodePanel from './CodePanel';
import { DEFAULT_OPTIONS } from 'components/VanillaTreeViewer/Tree/Builder/Constants';
import { expect } from 'chai';
import { renderComponent } from 'components/VanillaTreeViewer/Helpers/renderComponent';

let fetchFileContents, fetchSyntaxHighlightStyle, file, syntaxHighlightStyles;

const namespace = 'app';

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
    options: {
      ...DEFAULT_OPTIONS,
      ...{
        style: 'custom-style',
        language: 'ruby'
      }
    }
  };

  fetchFileContents = jest.fn();
  fetchSyntaxHighlightStyle = jest.fn();

  syntaxHighlightStyles = {
    'custom-style':
      '.hljs{display:block;}.hljs,.hljs-subst,.hljs-tag{color:#ffffff}'
  };
});

describe('<CodePanel />', () => {
  it('renders the container', () => {
    const container = render();
    expect(container.classList.contains('vanilla-tree-viewer__code-panel')).to
      .be.true;
  });

  it('renders the Header', () => {
    const container = render();
    const header = container.getElementsByClassName(
      'vanilla-tree-viewer__code-panel-header'
    )[0];
    const path = header.getElementsByClassName(
      'vanilla-tree-viewer__code-path'
    )[0];

    expect(path.innerText).to.eql(file.path);
  });

  it('renders the Code', () => {
    const container = render();

    const pre = container.getElementsByTagName('pre')[0];
    const code = pre.getElementsByTagName('code')[0];

    /*
     * /* Don't bother testing the rendered code syntax is taken care of
     * /* in `Code.test.js`, and it's messy to duplicate herre.
     * /* If the `.hljs` class is present, we can assume the code was
     * /* highlighted correctly.
     */
    expect(code.classList.contains('hljs')).to.be.true;
  });

  describe('it passes fetchFileContents() through to `Code`', () => {
    /*
     * Simulate this by picking a single scenario that would cause
     * the function to be called: file contents being empty
     */
    beforeEach(() => {
      file.contents = null;
    });

    it('calls fetchFileContents()', () => {
      render();
      expect(fetchFileContents.mock.calls.length).to.eql(1);
    });
  });

  describe('it passes fetchSyntaxHighlightStyle() through to `Code`', () => {
    /*
     * Simulate this by picking a single scenario that would cause
     * the function to be called: syntax highlight styles are empty
     */
    beforeEach(() => {
      syntaxHighlightStyles = {};
    });

    it('calls fetchSyntaxHighlightStyle()', () => {
      render();
      expect(fetchSyntaxHighlightStyle.mock.calls.length).to.eql(1);
    });
  });
});

const render = (additionalProps = {}) => {
  const fixedProps = {
    namespace: namespace,
    file: file,
    syntaxHighlightStyles: syntaxHighlightStyles,
    fetchFileContents: fetchFileContents,
    fetchSyntaxHighlightStyle: fetchSyntaxHighlightStyle
  };

  const props = { ...fixedProps, ...additionalProps };

  return renderComponent(CodePanel, props);
};
