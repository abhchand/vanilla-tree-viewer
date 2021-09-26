import { normalizePath, toDirectoryTree } from './Builder';
import { DEFAULT_OPTIONS } from './Constants';
import { expect } from 'chai';

let files;
const globalOptions = {};

beforeEach(() => {
  files = [
    {
      path: 'alpha/beta/gamma.rb',
      url: 'https://example.co/alpha/beta/gamma.rb',
      selected: true
    },
    {
      path: 'delta/epsilon.rb',
      url: 'https://example.co/delta/epsilon.rb'
    }
  ];
});

describe('Builder.toDirectoryTree', () => {
  it('builds a directory tree', () => {
    const tree = toDirectoryTree(files, globalOptions);

    const expected = {
      '/': {
        id: 'directory+/',
        name: '/',
        type: 'directory',
        path: '/',
        isOpen: true,
        childPaths: ['/alpha', '/delta']
      },
      '/alpha': {
        id: 'directory+/alpha',
        name: 'alpha',
        type: 'directory',
        path: '/alpha',
        isOpen: true,
        childPaths: ['/alpha/beta']
      },
      '/alpha/beta': {
        id: 'directory+/alpha/beta',
        name: 'beta',
        type: 'directory',
        path: '/alpha/beta',
        isOpen: true,
        childPaths: ['/alpha/beta/gamma.rb']
      },
      '/alpha/beta/gamma.rb': {
        id: 'file+/alpha/beta/gamma.rb',
        name: 'gamma.rb',
        type: 'file',
        path: '/alpha/beta/gamma.rb',
        contents: null,
        url: 'https://example.co/alpha/beta/gamma.rb',
        error: null,
        options: DEFAULT_OPTIONS
      },
      '/delta': {
        id: 'directory+/delta',
        name: 'delta',
        type: 'directory',
        path: '/delta',
        isOpen: true,
        childPaths: ['/delta/epsilon.rb']
      },
      '/delta/epsilon.rb': {
        id: 'file+/delta/epsilon.rb',
        name: 'epsilon.rb',
        type: 'file',
        path: '/delta/epsilon.rb',
        contents: null,
        url: 'https://example.co/delta/epsilon.rb',
        error: null,
        options: DEFAULT_OPTIONS
      }
    };

    expect(tree).to.deep.equal(expected);
  });

  describe('parsing paths', () => {
    it('handles paths case insensitively', () => {
      files[0].path = 'AlPhA/BeTA/gaMMa.rb';

      const tree = toDirectoryTree(files, globalOptions);
      const node = tree['/alpha/beta/gamma.rb'];

      expect(node.name).to.equal('gamma.rb');
      expect(node.path).to.equal('/alpha/beta/gamma.rb');
    });

    it("handles paths prefixed with '/'", () => {
      files[0].path = '/alpha/beta/gamma.rb';

      const tree = toDirectoryTree(files, globalOptions);
      const node = tree['/alpha/beta/gamma.rb'];

      expect(node.name).to.equal('gamma.rb');
      expect(node.path).to.equal('/alpha/beta/gamma.rb');
    });

    it('blindly assumes the last path segment is the filename', () => {
      files[0].path = 'foo/bar/baz';

      const tree = toDirectoryTree(files, globalOptions);
      const node = tree['/foo/bar/baz'];

      expect(node.name).to.equal('baz');
      expect(node.path).to.equal('/foo/bar/baz');
    });
  });

  describe('parsing directories', () => {
    it('handles paths with overlapping directories', () => {
      files[1].path = '/alpha/omega.rb';
      files[1].url = 'https://example.co/alpha/omega.rb';

      const tree = toDirectoryTree(files, globalOptions);

      // No need to retest all nodes, just test the nodes impacted

      let expected, node;

      node = tree['/alpha/beta/gamma.rb'];
      expected = {
        id: 'file+/alpha/beta/gamma.rb',
        name: 'gamma.rb',
        type: 'file',
        path: '/alpha/beta/gamma.rb',
        contents: null,
        url: 'https://example.co/alpha/beta/gamma.rb',
        error: null,
        options: DEFAULT_OPTIONS
      };
      expect(node).to.deep.equal(expected);

      node = tree['/alpha/omega.rb'];
      expected = {
        id: 'file+/alpha/omega.rb',
        name: 'omega.rb',
        type: 'file',
        path: '/alpha/omega.rb',
        contents: null,
        url: 'https://example.co/alpha/omega.rb',
        error: null,
        options: DEFAULT_OPTIONS
      };
      expect(node).to.deep.equal(expected);

      node = tree['/alpha'];
      expected = {
        id: 'directory+/alpha',
        name: 'alpha',
        type: 'directory',
        path: '/alpha',
        isOpen: true,
        childPaths: [
          '/alpha/beta',
          // `/alpha` now has a new child
          '/alpha/omega.rb'
        ]
      };
      expect(node).to.deep.equal(expected);
    });

    it('handles directories and filenames with the same name', () => {
      files[1].path = '/alpha/beta.rb';
      files[1].url = 'https://example.co/alpha/beta.rb';

      const tree = toDirectoryTree(files, globalOptions);

      // No need to retest all nodes, just test the nodes impacted

      let expected, node;

      node = tree['/alpha/beta.rb'];
      expected = {
        id: 'file+/alpha/beta.rb',
        name: 'beta.rb',
        type: 'file',
        path: '/alpha/beta.rb',
        contents: null,
        url: 'https://example.co/alpha/beta.rb',
        error: null,
        options: DEFAULT_OPTIONS
      };
      expect(node).to.deep.equal(expected);

      node = tree['/alpha/beta'];
      expected = {
        id: 'directory+/alpha/beta',
        name: 'beta',
        type: 'directory',
        path: '/alpha/beta',
        isOpen: true,
        childPaths: ['/alpha/beta/gamma.rb']
      };
      expect(node).to.deep.equal(expected);
    });
  });

  describe('parsing options', () => {
    beforeEach(() => {
      files[0].options = {};
      files[0].options.style = 'file-style';
      globalOptions.style = 'global-style';
    });

    describe('highlight options', () => {
      it('uses the file-level option if present', () => {
        const tree = toDirectoryTree(files, globalOptions);

        const node = tree['/alpha/beta/gamma.rb'];
        expect(node.options.style).to.equal('file-style');
      });

      it('falls back on the global option if file option is blank', () => {
        const tree = toDirectoryTree(files, globalOptions);

        const node = tree['/delta/epsilon.rb'];
        expect(node.options.style).to.equal('global-style');
      });

      it('falls back on the default option if no option provided', () => {
        delete files[0].options.style;
        delete globalOptions.style;

        const tree = toDirectoryTree(files, globalOptions);
        let node;

        // Just double-check we're testing against valid data here
        expect(DEFAULT_OPTIONS.style.length).to.be.gt(0);

        node = tree['/alpha/beta/gamma.rb'];
        expect(node.options.style).to.equal(DEFAULT_OPTIONS.style);

        node = tree['/delta/epsilon.rb'];
        expect(node.options.style).to.equal(DEFAULT_OPTIONS.style);
      });
    });
  });
});

describe('Builder.normalizePath', () => {
  it("adds the '/' prefix if missing", () => {
    expect(normalizePath('foo')).to.equal('/foo');
  });

  it('downcases the path', () => {
    expect(normalizePath('/FoO')).to.equal('/foo');
  });
});
