import Code from './Code';
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

describe('<Code />', () => {
  describe('rendering the component', () => {
    it('renders the container', () => {
      const container = render();

      expect(container.classList.contains('vanilla-tree-viewer__code')).to.be
        .true;
      expect(container.tabIndex).to.eql(-1);
    });

    describe('syntax highlighting', () => {
      it('renders the highlighted code', () => {
        const container = render();

        const pre = container.getElementsByTagName('pre')[0];
        const code = pre.getElementsByTagName('code')[0];

        expect(code.classList.contains('hljs')).to.be.true;
        expect(code.tabIndex).to.eql(-1);
        expect(code.innerHTML.trim()).to.eql(
          `
        <span class="hljs-function"><span class="hljs-keyword">def</span> <span class="hljs-title">foo</span></span>
        <span class="hljs-literal">true</span>
      <span class="hljs-keyword">end</span>
          `.trim()
        );
      });

      describe('no language is specified', () => {
        beforeEach(() => {
          delete file.options.language;
        });

        it('it renders the code without highlighting', () => {
          const container = render();

          const pre = container.getElementsByTagName('pre')[0];
          const code = pre.getElementsByTagName('code')[0];
          expect(code.innerHTML.trim()).to.eql(
            `
      def foo
        true
      end
            `.trim()
          );
        });
      });
    });

    describe('syntax styling', () => {
      it('renders the namespaced styling', () => {
        const container = render();
        const style = container.getElementsByTagName('style')[0];

        expect(style.innerHTML).to.eql(
          '#app .hljs{display:block;}#app .hljs,#app .hljs-subst,#app .hljs-tag{color:#ffffff}'
        );
      });

      describe('no language is specified', () => {
        beforeEach(() => {
          delete file.options.style;
        });

        it('renders no styling', () => {
          const container = render();
          const style = container.getElementsByTagName('style')[0];

          expect(style.innerHTML).to.eql('');
        });
      });
    });
  });

  describe('file has an error', () => {
    beforeEach(() => {
      file.error = 'some error';
    });

    it('renders the Error', () => {
      const error = render();

      expect(error.classList.contains('vanilla-tree-viewer__code-error')).to.be
        .true;
      expect(error.innerHTML).to.eql('some error');
    });
  });

  describe('file has no contents', () => {
    beforeEach(() => {
      file.contents = null;
    });

    it('calls fetchFileContents()', () => {
      render();
      expect(fetchFileContents.mock.calls.length).to.eql(1);
    });

    it('renders the Loading state', () => {
      const loading = render();

      expect(loading.classList.contains('vanilla-tree-viewer__code-loading')).to
        .be.true;
      expect(loading.innerHTML).to.eql('Loading...');
    });
  });

  describe('no cached syntax highlighting style exists', () => {
    beforeEach(() => {
      syntaxHighlightStyles = {};
    });

    it('calls fetchSyntaxHighlightStyle()', () => {
      render();
      expect(fetchSyntaxHighlightStyle.mock.calls.length).to.eql(1);
    });

    it('renders the Loading state', () => {
      const loading = render();

      expect(loading.classList.contains('vanilla-tree-viewer__code-loading')).to
        .be.true;
      expect(loading.innerHTML).to.eql('Loading...');
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

  return renderComponent(Code, props);
};
