import { DEFAULT_MESSAGE as DEFAULT_INVALID_STATE_MESSAGE } from 'components/VanillaTreeViewer/InvalidState/InvalidState';
import { DEFAULT_OPTIONS } from 'components/VanillaTreeViewer/Tree/Builder/Constants';
import { expect } from 'chai';
import fetchMock from 'fetch-mock';
import { hljsStyleUrl } from 'components/VanillaTreeViewer/hljs';
import VanillaTreeViewer from 'components/VanillaTreeViewer/VanillaTreeViewer';

let files, options;

fetchMock.config.overwriteRoutes = true;

const id = 'app';

beforeEach(() => {
  files = [
    {
      path: 'gamma.rb',
      url: 'https://example.co/path/to/gamma.rb',
      selected: true
    },
    {
      path: 'delta/epsilon.js',
      url: 'https://example.co/path/to/epsilon.js'
    }
  ];

  options = {};

  // Set up DOM to mount component
  document.body.innerHTML = `<div id='${id}'></div>`;

  // Mock fetch() calls to retrieve file contents and styles

  fetchMock.get('https://example.co/path/to/gamma.rb', 'def foo;true;end');
  fetchMock.get(
    'https://example.co/path/to/epsilon.js',
    "const foo = () => { alert('foo'); }"
  );
  fetchMock.get(
    hljsStyleUrl(DEFAULT_OPTIONS.style),
    '.hljs{display:block;}.hljs,.hljs-subst,.hljs-tag{color:#ffffff}'
  );
});

afterEach(() => {
  fetchMock.restore();
});

describe('<VanillaTreeViewer />', () => {
  it('renders the component', async () => {
    render();
    await waitUntil(hasRenderedCode);

    expect(rendered().classList.contains('vanilla-tree-viewer')).to.be.true;
  });

  it('renders the path', async () => {
    render();
    await waitUntil(hasRenderedCode);

    const path = rendered().getElementsByClassName(
      'vanilla-tree-viewer__code-path'
    )[0];
    expect(path.innerText).to.equal('/gamma.rb');
  });

  it('renders the directory tree', async () => {
    render();
    await waitUntil(hasRenderedCode);

    expect(displayedNodePaths()).to.eql([
      '/',
      '/delta',
      '/delta/epsilon.js',
      '/gamma.rb'
    ]);
  });

  describe('rendering style', () => {
    it('renders the default style', async () => {
      render();
      await waitUntil(hasRenderedCode);

      const code = rendered().getElementsByClassName(
        'vanilla-tree-viewer__code'
      )[0];
      const style = code.getElementsByTagName('style')[0];
      expect(style.innerHTML).to.equal(
        `#${id} .hljs{display:block;}#${id} .hljs,#${id} .hljs-subst,#${id} .hljs-tag{color:#ffffff}`
      );
    });

    it('overrides styling for all files with the global options', async () => {
      options.style = 'my-global-style';
      fetchMock.get(
        hljsStyleUrl('my-global-style'),
        '.hljs{display:inline-block;}'
      );

      render();
      await waitUntil(hasRenderedCode);

      const code = rendered().getElementsByClassName(
        'vanilla-tree-viewer__code'
      )[0];
      const style = code.getElementsByTagName('style')[0];
      expect(style.innerHTML).to.equal(`#${id} .hljs{display:inline-block;}`);
    });

    it('overrides styling for specific files with the file-level options', async () => {
      options.style = 'my-global-style';
      fetchMock.get(
        hljsStyleUrl('my-global-style'),
        '.hljs{display:inline-block;}'
      );

      files[0].options = {};
      files[0].options.style = 'my-file-style';
      fetchMock.get(hljsStyleUrl('my-file-style'), '.hljs{display:flex;}');

      render();
      await waitUntil(hasRenderedCode);

      const code = rendered().getElementsByClassName(
        'vanilla-tree-viewer__code'
      )[0];
      const style = code.getElementsByTagName('style')[0];
      expect(style.innerHTML).to.equal(`#${id} .hljs{display:flex;}`);
    });
  });

  describe('syntax highlighting', () => {
    it('performs no syntax highlighting by default', async () => {
      render();
      await waitUntil(hasRenderedCode);

      const code = rendered().getElementsByClassName(
        'vanilla-tree-viewer__code'
      )[0];
      const codeTag = code.getElementsByTagName('code')[0];
      expect(codeTag.innerHTML).to.equal('def foo;true;end');
    });

    it('overrides highlighting for all files with the global options', async () => {
      options.language = 'ruby';

      render();
      await waitUntil(hasRenderedCode);

      const code = rendered().getElementsByClassName(
        'vanilla-tree-viewer__code'
      )[0];
      const codeTag = code.getElementsByTagName('code')[0];
      expect(codeTag.innerHTML).to.equal(
        '<span class="hljs-function">' +
          '<span class="hljs-keyword">def</span> ' +
          '<span class="hljs-title">foo</span>;</span>' +
          '<span class="hljs-literal">true</span>;' +
          '<span class="hljs-keyword">end</span>'
      );
    });

    it('overrides highlighting for specific files with the file-level options', async () => {
      options.language = 'ruby';
      files[0].options = {};
      files[0].options.language = 'javascript';

      render();
      await waitUntil(hasRenderedCode);

      const code = rendered().getElementsByClassName(
        'vanilla-tree-viewer__code'
      )[0];
      const codeTag = code.getElementsByTagName('code')[0];
      expect(codeTag.innerHTML).to.equal(
        'def foo;<span class="hljs-literal">true</span>;end'
      );
    });
  });

  describe('validation and error handling', () => {
    it('renders the InvalidState when the files object is invalid', () => {
      delete files[0].path;

      render();

      const component = rendered();
      expect(component.classList.contains('vanilla-tree-viewer--invalid')).to.be
        .true;
      expect(component.innerText).to.equal(DEFAULT_INVALID_STATE_MESSAGE);
    });

    it('renders an error when the file contents dont fetch', async () => {
      fetchMock.get('https://example.co/path/to/gamma.rb', {
        throws: new TypeError('Some error')
      });

      render();
      await waitUntil(hasRenderedError);

      const error = rendered().getElementsByClassName(
        'vanilla-tree-viewer__code-error'
      )[0];
      expect(error.innerHTML).to.equal(
        'Could not fetch file contents from https://example.co/path/to/gamma.rb'
      );
    });

    it('renders an error when the styles dont fetch', async () => {
      fetchMock.get(hljsStyleUrl(DEFAULT_OPTIONS.style), {
        throws: new TypeError('Some error')
      });

      render();
      await waitUntil(hasRenderedError);

      const error = rendered().getElementsByClassName(
        'vanilla-tree-viewer__code-error'
      )[0];
      expect(error.innerHTML).to.equal(
        `Could not fetch highlight styling from ${hljsStyleUrl(
          DEFAULT_OPTIONS.style
        )}`
      );
    });
  });

  describe('initial file selection', () => {
    it('selects the file marked with selected: true', async () => {
      files[0].selected = false;
      files[1].selected = true;

      render();
      await waitUntil(hasRenderedCode);

      const component = rendered();

      // Verify selection
      const selectedFile = findTreeNodeByPath('/delta/epsilon.js');
      expect(selectedFile.classList.contains('selected')).to.be.true;

      // Verify code contents
      const code = component.getElementsByClassName(
        'vanilla-tree-viewer__code'
      )[0];
      const codeTag = code.getElementsByTagName('code')[0];
      expect(codeTag.innerHTML).to.equal(
        "const foo = () =&gt; { alert('foo'); }"
      );

      // Verify path
      const path = component.getElementsByClassName(
        'vanilla-tree-viewer__code-path'
      )[0];
      expect(path.innerText).to.equal('/delta/epsilon.js');
    });

    it('renders the first file when no file is marked selected: true', async () => {
      delete files[0].selected;
      delete files[1].selected;

      render();
      await waitUntil(hasRenderedCode);

      // Verify selection
      const selectedFile = findTreeNodeByPath('/gamma.rb');
      expect(selectedFile.classList.contains('selected')).to.be.true;

      // Verify paths
      const path = rendered().getElementsByClassName(
        'vanilla-tree-viewer__code-path'
      )[0];
      expect(path.innerText).to.equal('/gamma.rb');
    });

    it('renders the first file when multiple files are marked selected: true', async () => {
      files[0].selected = true;
      files[1].selected = true;

      render();
      await waitUntil(hasRenderedCode);

      // Verify selection
      const selectedFile = findTreeNodeByPath('/gamma.rb');
      expect(selectedFile.classList.contains('selected')).to.be.true;

      // Verify paths
      const path = rendered().getElementsByClassName(
        'vanilla-tree-viewer__code-path'
      )[0];
      expect(path.innerText).to.equal('/gamma.rb');
    });

    describe('after rendering', () => {
      it('sets the tree node as full-width', async () => {
        render();
        await waitUntil(hasRenderedCode);

        expectAllNodesToBeFullWidth();
      });
    });
  });

  describe('switching between files', () => {
    it('updates the file contents, path, and selected file', async () => {
      render();
      await waitUntil(hasRenderedCode);

      let secondFile = findTreeNodeByPath('/delta/epsilon.js');
      secondFile.click();
      await waitUntil(hasRenderedCode);

      // Refresh elements
      const component = rendered();
      secondFile = findTreeNodeByPath('/delta/epsilon.js');

      // Path
      const path = component.getElementsByClassName(
        'vanilla-tree-viewer__code-path'
      )[0];
      expect(path.innerText).to.equal('/delta/epsilon.js');

      // Selected
      expect(secondFile.classList.contains('selected')).to.be.true;

      // File Contents
      const code = component.getElementsByClassName(
        'vanilla-tree-viewer__code'
      )[0];
      const codeTag = code.getElementsByTagName('code')[0];
      expect(codeTag.innerHTML).to.equal(
        "const foo = () =&gt; { alert('foo'); }"
      );
    });

    describe('after rendering', () => {
      it('sets the tree node as full-width', async () => {
        render();
        await waitUntil(hasRenderedCode);

        const secondFile = findTreeNodeByPath('/delta/epsilon.js');
        secondFile.click();
        await waitUntil(hasRenderedCode);

        expectAllNodesToBeFullWidth();
      });
    });

    describe('validation and error handling', () => {
      it("renders an error when the second file's contents dont fetch", async () => {
        fetchMock.get('https://example.co/path/to/epsilon.js', {
          throws: new TypeError('Some error')
        });

        // First file should render correctly
        render();
        await waitUntil(hasRenderedCode);
        let error = rendered().getElementsByClassName(
          'vanilla-tree-viewer__code-error'
        )[0];
        expect(error).to.be.undefined;

        // Render second file by clicking on it
        const secondFile = findTreeNodeByPath('/delta/epsilon.js');
        secondFile.click();
        await waitUntil(hasRenderedError);

        // Verify error is displayed
        error = rendered().getElementsByClassName(
          'vanilla-tree-viewer__code-error'
        )[0];
        expect(error.innerHTML).to.equal(
          'Could not fetch file contents from https://example.co/path/to/epsilon.js'
        );
      });

      it("renders an error when the second file's styles dont fetch", async () => {
        files[1].options = {};
        files[1].options.style = 'bad-style';
        fetchMock.get(hljsStyleUrl('bad-style'), {
          throws: new TypeError('Some error')
        });

        // First file should render correctly
        render();
        await waitUntil(hasRenderedCode);
        let error = rendered().getElementsByClassName(
          'vanilla-tree-viewer__code-error'
        )[0];
        expect(error).to.be.undefined;

        // Render second file by clicking on it
        const secondFile = findTreeNodeByPath('/delta/epsilon.js');
        secondFile.click();
        await waitUntil(hasRenderedError);

        // Verify error is displayed
        error = rendered().getElementsByClassName(
          'vanilla-tree-viewer__code-error'
        )[0];
        expect(error.innerHTML).to.equal(
          `Could not fetch highlight styling from ${hljsStyleUrl('bad-style')}`
        );
      });
    });
  });

  describe('toggling directories', () => {
    it('can toggle directories', async () => {
      render();
      await waitUntil(hasRenderedCode);

      const directory = findTreeNodeByPath('/delta');

      // Expanded
      expect(displayedNodePaths()).to.eql([
        '/',
        '/delta',
        '/delta/epsilon.js',
        '/gamma.rb'
      ]);

      // Collapsed
      directory.click();
      expect(displayedNodePaths()).to.eql(['/', '/delta', '/gamma.rb']);

      // Expanded
      directory.click();
      expect(displayedNodePaths()).to.eql([
        '/',
        '/delta',
        '/delta/epsilon.js',
        '/gamma.rb'
      ]);
    });

    describe('after rendering', () => {
      it('sets the tree node as full-width', async () => {
        render();
        await waitUntil(hasRenderedCode);

        const directory = findTreeNodeByPath('/delta');

        // Collapse directory
        directory.click();
        expectAllNodesToBeFullWidth();

        // Expand directory
        directory.click();
        expectAllNodesToBeFullWidth();
      });
    });
  });
});

const rendered = () => {
  return document.getElementById(id).children[0];
};

const displayedNodePaths = () => {
  const component = rendered();
  const allNodes = component.getElementsByClassName(
    'vanilla-tree-viewer__tree-node'
  );

  const paths = [];
  for (const item of allNodes) {
    paths.push(item.dataset.path);
  }

  return paths;
};

const expectAllNodesToBeFullWidth = () => {
  const scrollWidth = document.querySelector(
    '.vanilla-tree-viewer__tree'
  ).scrollWidth;

  const nodes = rendered().getElementsByClassName(
    'vanilla-tree-viewer__tree-node'
  );
  for (let i = 0; i < nodes.length; i++) {
    expect(nodes[i].style.width).equal(`${scrollWidth}px`);
  }
};

const findTreeNodeByPath = (path) => {
  const component = rendered();
  const allNodes = component.getElementsByClassName(
    'vanilla-tree-viewer__tree-node'
  );

  let targetNode;
  for (const item of allNodes) {
    if (item.dataset.path === path) {
      targetNode = item;
      break;
    }
  }

  return targetNode;
};

const hasRenderedCode = () => {
  return (
    rendered().getElementsByClassName('vanilla-tree-viewer__code').length > 0
  );
};

const hasRenderedError = () => {
  return (
    rendered().getElementsByClassName('vanilla-tree-viewer__code-error')
      .length > 0
  );
};

const waitUntil = (condition) => {
  return new Promise((resolve, _reject) => {
    // eslint-disable-next-line
    (function waitForCondition(condition) {
      if (condition()) {
        return resolve();
      }
      setTimeout(waitForCondition, 100, condition);
    })(condition);
  });
};

const render = () => {
  const viewer = new VanillaTreeViewer(id, files, options);
  viewer.render();

  return rendered();
};
