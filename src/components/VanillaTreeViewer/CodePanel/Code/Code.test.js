import Code from './Code';
import { DEFAULT_OPTIONS } from 'components/VanillaTreeViewer/Tree/Builder/Constants';
import { expect } from 'chai';
import { renderComponent } from 'components/VanillaTreeViewer/Helpers/renderComponent';

let fetchFileContents,
  fetchSyntaxHighlightStyle,
  file,
  syntaxHighlightStyles,
  wrapText;

const namespace = 'app';

beforeEach(() => {
  file = {
    ...DEFAULT_OPTIONS,
    ...{
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
      language: 'ruby',
      style: 'custom-style'
    }
  };

  fetchFileContents = jest.fn();
  fetchSyntaxHighlightStyle = jest.fn();

  syntaxHighlightStyles = {
    'custom-style':
      'pre code.hljs{display:block;}code.hljs{border: none;}.hljs-subst,.hljs-tag{color:#ffffff}'
  };

  wrapText = false;
});

describe('<Code />', () => {
  describe('rendering the component', () => {
    it('renders the container', () => {
      const container = render();

      expect(container.classList.contains('vtv__code')).to.be.true;
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
          delete file.language;
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
          '#app pre code.hljs{display:block;}#app code.hljs{border: none;}#app .hljs-subst,.hljs-tag{color:#ffffff}'
        );
      });

      describe('no language is specified', () => {
        beforeEach(() => {
          delete file.style;
        });

        it('renders no styling', () => {
          const container = render();
          const style = container.getElementsByTagName('style')[0];

          expect(style.innerHTML).to.eql('');
        });
      });

      describe('wrapping text', () => {
        it('renders no `style` by default', () => {
          const container = render();
          const code = container.getElementsByTagName('code')[0];

          expect(code.attributes.style).to.be.undefined;
        });

        describe('`wrapText` is set to `true`', () => {
          beforeEach(() => (wrapText = true));

          it('renders a `style` to wrap text', () => {
            const container = render();
            const code = container.getElementsByTagName('code')[0];

            expect(code.attributes.style.nodeValue).to.equal(
              'white-space: break-spaces;word-wrap: initial;'
            );
          });
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

      expect(error.classList.contains('vtv__code-error')).to.be.true;
      expect(error.innerHTML).to.eql('some error');
    });
  });

  describe('determining file contents', () => {
    describe('file has `url` set, but not `contents`', () => {
      beforeEach(() => {
        file.contents = null;
      });

      it('calls fetchFileContents()', () => {
        render();
        expect(fetchFileContents.mock.calls.length).to.eql(1);
      });

      it('renders the Loading state', () => {
        const loading = render();

        expect(loading.classList.contains('vtv__code-loading')).to.be.true;
        expect(loading.innerHTML).to.eql('Loading...');
      });
    });

    describe('file has `contents` set, but not `url`', () => {
      beforeEach(() => {
        file.url = null;
        file.contents = 'class Foo < Bar\nend';
      });

      it('does not call fetchFileContents()', () => {
        render();
        expect(fetchFileContents.mock.calls.length).to.eql(0);
      });

      it('does not render the Loading state', () => {
        const loading = render();

        expect(loading.classList.contains('vtv__code-loading')).to.be.false;
      });
    });

    describe('both `contents` and `url` are set', () => {
      beforeEach(() => {
        file.contents = 'class Foo < Bar\nend';
      });

      it('does not call fetchFileContents()', () => {
        render();
        expect(fetchFileContents.mock.calls.length).to.eql(0);
      });

      it('does not render the Loading state', () => {
        const loading = render();

        expect(loading.classList.contains('vtv__code-loading')).to.be.false;
      });
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

      expect(loading.classList.contains('vtv__code-loading')).to.be.true;
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
    fetchSyntaxHighlightStyle: fetchSyntaxHighlightStyle,
    wrapText: wrapText
  };

  const props = { ...fixedProps, ...additionalProps };

  return renderComponent(Code, props);
};
