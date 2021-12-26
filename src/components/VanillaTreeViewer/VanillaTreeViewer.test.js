import { DEFAULT_MESSAGE as DEFAULT_INVALID_STATE_MESSAGE } from 'components/VanillaTreeViewer/InvalidState/InvalidState';
import { DEFAULT_OPTIONS } from 'components/VanillaTreeViewer/Tree/Builder/Constants';
import { expect } from 'chai';
import fetchMock from 'fetch-mock';
import { hljsStyleUrl } from 'components/VanillaTreeViewer/hljs';
import VanillaTreeViewer from 'components/VanillaTreeViewer/VanillaTreeViewer';

let fileNodesData, id, parentNodeData;

fetchMock.config.overwriteRoutes = true;

beforeEach(() => {
  parentNodeData = {};

  fileNodesData = [
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

  /*
   * Most tests use a single node to test with, which will
   * be assigned a sequential `id` of 1. Any individual test
   * testing with multiple nodes can modify this as needed
   */
  id = 'vtv--1';

  // Mock fetch() calls to retrieve file contents and styles

  fetchMock.get('https://example.co/path/to/gamma.rb', 'def foo;true;end');
  fetchMock.get(
    'https://example.co/path/to/epsilon.js',
    "const foo = () => { alert('foo'); }"
  );
  fetchMock.get(
    hljsStyleUrl(DEFAULT_OPTIONS.style),
    'pre code.hljs{display:block;}code.hljs,.hljs-subst,.hljs-tag{color:#ffffff}'
  );
});

afterEach(() => {
  fetchMock.restore();
});

describe('<VanillaTreeViewer />', () => {
  it('renders the component', async () => {
    render();
    await waitUntil(hasRenderedCode);

    expect(rendered().classList.contains('vtv-root')).to.be.true;
  });

  it('renders the path', async () => {
    render();
    await waitUntil(hasRenderedCode);

    const path = rendered().getElementsByClassName('vtv__code-path')[0];
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

  describe('determining file contents', () => {
    it('fetches the file contents from the `url`', async () => {
      fileNodesData[0].url = 'https://example.co/path/to/gamma.rb';
      fileNodesData[0].contents = null;

      render();
      await waitUntil(hasRenderedCode);

      const code = rendered().getElementsByClassName('vtv__code')[0];
      const codeTag = code.getElementsByTagName('code')[0];
      expect(codeTag.innerHTML).to.equal('def foo;true;end');
    });

    it('allows specifying file contents directly with `contents`', async () => {
      fileNodesData[0].url = null;
      fileNodesData[0].contents = 'def foo;nil;end';

      render();
      await waitUntil(hasRenderedCode);

      const code = rendered().getElementsByClassName('vtv__code')[0];
      const codeTag = code.getElementsByTagName('code')[0];
      expect(codeTag.innerHTML).to.equal('def foo;nil;end');
    });

    it('The `contents` option takes precedence over `url`', async () => {
      fileNodesData[0].url = 'https://example.co/path/to/gamma.rb';
      fileNodesData[0].contents = 'def foo;nil;end';

      render();
      await waitUntil(hasRenderedCode);

      const code = rendered().getElementsByClassName('vtv__code')[0];
      const codeTag = code.getElementsByTagName('code')[0];
      expect(codeTag.innerHTML).to.equal('def foo;nil;end');
    });
  });

  describe('rendering style', () => {
    it('renders the default style', async () => {
      render();
      await waitUntil(hasRenderedCode);

      const code = rendered().getElementsByClassName('vtv__code')[0];
      const style = code.getElementsByTagName('style')[0];
      expect(style.innerHTML).to.equal(
        `#${id} pre code.hljs{display:block;}#${id} code.hljs,.hljs-subst,.hljs-tag{color:#ffffff}`
      );
    });

    describe('a style is specified for a file', () => {
      it('renders the specified style', async () => {
        fileNodesData[0].style = 'my-file-style';
        fetchMock.get(
          hljsStyleUrl('my-file-style'),
          'code.hljs{display:flex;}'
        );

        render();
        await waitUntil(hasRenderedCode);

        const code = rendered().getElementsByClassName('vtv__code')[0];
        const style = code.getElementsByTagName('style')[0];
        expect(style.innerHTML).to.equal(`#${id} code.hljs{display:flex;}`);
      });
    });
  });

  describe('syntax highlighting', () => {
    it('performs no syntax highlighting by default', async () => {
      render();
      await waitUntil(hasRenderedCode);

      const code = rendered().getElementsByClassName('vtv__code')[0];
      const codeTag = code.getElementsByTagName('code')[0];
      expect(codeTag.innerHTML).to.equal('def foo;true;end');
    });

    describe('a syntax highlighting language is specified for a file', () => {
      it('highlights the specified file', async () => {
        fileNodesData[0].language = 'javascript';

        render();
        await waitUntil(hasRenderedCode);

        const code = rendered().getElementsByClassName('vtv__code')[0];
        const codeTag = code.getElementsByTagName('code')[0];
        expect(codeTag.innerHTML).to.equal(
          'def foo;<span class="hljs-literal">true</span>;end'
        );
      });
    });
  });

  describe('validation and error handling', () => {
    it('renders the InvalidState when the files object is invalid', () => {
      delete fileNodesData[0].path;

      render();

      const component = rendered();
      expect(component.classList.contains('vtv--invalid')).to.be.true;
      expect(component.innerText).to.equal(DEFAULT_INVALID_STATE_MESSAGE);
    });

    it('renders an error when the file contents dont fetch', async () => {
      fetchMock.get('https://example.co/path/to/gamma.rb', {
        throws: new TypeError('Some error')
      });

      render();
      await waitUntil(hasRenderedError);

      const error = rendered().getElementsByClassName('vtv__code-error')[0];
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

      const error = rendered().getElementsByClassName('vtv__code-error')[0];
      expect(error.innerHTML).to.equal(
        `Could not fetch highlight styling from ${hljsStyleUrl(
          DEFAULT_OPTIONS.style
        )}`
      );
    });
  });

  describe('initial file selection', () => {
    it('selects the file marked with selected: true', async () => {
      fileNodesData[0].selected = false;
      fileNodesData[1].selected = true;

      render();
      await waitUntil(hasRenderedCode);

      const component = rendered();

      // Verify selection
      const selectedFile = findTreeNodeByPath('/delta/epsilon.js');
      expect(selectedFile.classList.contains('selected')).to.be.true;

      // Verify code contents
      const code = component.getElementsByClassName('vtv__code')[0];
      const codeTag = code.getElementsByTagName('code')[0];
      expect(codeTag.innerHTML).to.equal(
        "const foo = () =&gt; { alert('foo'); }"
      );

      // Verify path
      const path = component.getElementsByClassName('vtv__code-path')[0];
      expect(path.innerText).to.equal('/delta/epsilon.js');
    });

    it('renders the first file when no file is marked selected: true', async () => {
      delete fileNodesData[0].selected;
      delete fileNodesData[1].selected;

      render();
      await waitUntil(hasRenderedCode);

      // Verify selection
      const selectedFile = findTreeNodeByPath('/gamma.rb');
      expect(selectedFile.classList.contains('selected')).to.be.true;

      // Verify paths
      const path = rendered().getElementsByClassName('vtv__code-path')[0];
      expect(path.innerText).to.equal('/gamma.rb');
    });

    it('renders the first file when multiple files are marked selected: true', async () => {
      fileNodesData[0].selected = true;
      fileNodesData[1].selected = true;

      render();
      await waitUntil(hasRenderedCode);

      // Verify selection
      const selectedFile = findTreeNodeByPath('/gamma.rb');
      expect(selectedFile.classList.contains('selected')).to.be.true;

      // Verify paths
      const path = rendered().getElementsByClassName('vtv__code-path')[0];
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
      const path = component.getElementsByClassName('vtv__code-path')[0];
      expect(path.innerText).to.equal('/delta/epsilon.js');

      // Selected
      expect(secondFile.classList.contains('selected')).to.be.true;

      // File Contents
      const code = component.getElementsByClassName('vtv__code')[0];
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
        let error = rendered().getElementsByClassName('vtv__code-error')[0];
        expect(error).to.be.undefined;

        // Render second file by clicking on it
        const secondFile = findTreeNodeByPath('/delta/epsilon.js');
        secondFile.click();
        await waitUntil(hasRenderedError);

        // Verify error is displayed
        error = rendered().getElementsByClassName('vtv__code-error')[0];
        expect(error.innerHTML).to.equal(
          'Could not fetch file contents from https://example.co/path/to/epsilon.js'
        );
      });

      it("renders an error when the second file's styles dont fetch", async () => {
        fileNodesData[1].style = 'bad-style';
        fetchMock.get(hljsStyleUrl('bad-style'), {
          throws: new TypeError('Some error')
        });

        // First file should render correctly
        render();
        await waitUntil(hasRenderedCode);
        let error = rendered().getElementsByClassName('vtv__code-error')[0];
        expect(error).to.be.undefined;

        // Render second file by clicking on it
        const secondFile = findTreeNodeByPath('/delta/epsilon.js');
        secondFile.click();
        await waitUntil(hasRenderedError);

        // Verify error is displayed
        error = rendered().getElementsByClassName('vtv__code-error')[0];
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

  describe('toggling text wrapping', () => {
    const toggle = () => document.querySelector('.vtv__wrap-text-toggle');
    const code = () => document.querySelector('code');

    const hasActiveClass = () =>
      toggle().classList.contains('vtv__wrap-text-toggle--active');
    const hasWrapStyle = () =>
      Boolean((code().attributes.style || {}).nodeValue);

    const clickWrapTextToggle = () => toggle().querySelector('button').click();

    const expectWrapTextEnabled = () => {
      expect(hasActiveClass()).to.be.true;
      expect(hasWrapStyle()).to.be.true;
    };
    const expectWrapTextDisabled = () => {
      expect(hasActiveClass()).to.be.false;
      expect(hasWrapStyle()).to.be.false;
    };

    it('can toggle text wrapping', async () => {
      render();
      await waitUntil(hasRenderedCode);

      expectWrapTextDisabled();

      clickWrapTextToggle();
      expectWrapTextEnabled();

      clickWrapTextToggle();
      expectWrapTextDisabled();
    });
  });
});

const buildNodes = () => {
  // Create parent node and populate attributes
  const parentNode = document.createElement('ol');
  parentNode.classList.add('vtv');

  Object.keys(parentNodeData).forEach((key) => {
    parentNode.setAttribute(`data-${key}`, parentNodeData[key]);
  });

  fileNodesData.forEach((fileNodeData) => {
    // Create file node and populate attributes
    const fileNode = document.createElement('li');

    Object.keys(fileNodeData).forEach((key) => {
      /*
       * The `contents` key is an exception: We need to set the
       * `innerHTML` instead of a `data-*` attribute
       */
      if (key === 'contents') {
        if (fileNodeData[key] !== null) {
          fileNode.innerHTML = fileNodeData[key];
        }
        return;
      }

      fileNode.setAttribute(`data-${key}`, fileNodeData[key]);
    });

    parentNode.appendChild(fileNode);
  });

  return parentNode;
};

const rendered = () => {
  // NOTE: `querySelector` will only find the first instance
  return document.querySelector('.vtv-wrapper').children[0];
};

const displayedNodePaths = () => {
  const component = rendered();
  const allNodes = component.getElementsByClassName('vtv__tree-node');

  const paths = [];
  for (const item of allNodes) {
    paths.push(item.dataset.path);
  }

  return paths;
};

const expectAllNodesToBeFullWidth = () => {
  const scrollWidth = document.querySelector('.vtv__tree').scrollWidth;

  const nodes = rendered().getElementsByClassName('vtv__tree-node');
  for (let i = 0; i < nodes.length; i++) {
    expect(nodes[i].style.width).equal(`${scrollWidth}px`);
  }
};

const findTreeNodeByPath = (path) => {
  const component = rendered();
  const allNodes = component.getElementsByClassName('vtv__tree-node');

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
  return rendered().getElementsByClassName('vtv__code').length > 0;
};

const hasRenderedError = () => {
  return rendered().getElementsByClassName('vtv__code-error').length > 0;
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
  document.body.innerHTML = '';

  // Construct a fake DOM from the raw parent and file nodes data
  const parentNode = buildNodes();
  document.body.appendChild(parentNode);

  /*
   * `document.readyState` should already be `complete` so `renderAll`
   * renders immediately, but confirm that explicitly
   */
  expect(document.readyState).to.equal('complete');

  VanillaTreeViewer.renderAll();

  return rendered();
};
