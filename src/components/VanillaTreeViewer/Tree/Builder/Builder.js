import { DEFAULT_OPTIONS } from './Constants';

// eslint-disable-next-line
function newTreeNode(type, name, path, file) {
  const treeNode = {
    // This is not a great id, but it's unique :)
    id: `${type}+${path}`,
    name: name,
    type: type,
    path: path
  };

  if (type === 'directory') {
    // All directories are open by default
    treeNode.isOpen = true;
    treeNode.childPaths = [];
  }

  if (type === 'file') {
    /*
     * Upstream validations will guarantee that one of `url`
     * or `contents` is present. If `contents` are blank, it
     * will be fetched and populated from the `url` later.
     */
    treeNode.contents = file.contents || null;
    treeNode.url = file.url;
    treeNode.error = null;
    treeNode.language = file.language;
    treeNode.style = file.style;
  }

  return treeNode;
}

function normalizePath(path) {
  let newPath = path;

  if (newPath[0] !== '/') {
    newPath = `/${newPath}`;
  }

  return newPath;
}

function addToDirectoryTree(tree, file) {
  /*
   * Parse each segment of the path, accounting for the 'root'
   * segment/directory as ''.
   *
   * e.g.
   *   '/a/b/c.py' -> ['', 'a', 'b', 'c.py']
   */
  const segments = normalizePath(file.path).split('/');

  let parentPath = null;
  let currentPath = '';

  // Merge any defaults into the individual `file`
  const fileWithDefaults = { ...DEFAULT_OPTIONS, ...file };

  segments.forEach((segment, idx) => {
    parentPath = currentPath;
    currentPath += idx === 1 ? segment : `/${segment}`;

    /*
     * Assume the last segment of the path is the actual file basename.
     * Anything before that is a directory.
     */
    const type = idx === segments.length - 1 ? 'file' : 'directory';

    /*
     * If the current path is a directory which already exists, skip
     * it so we don't re-create it
     */
    if (type === 'directory' && tree[currentPath]) {
      return;
    }

    /*
     * Add a new node and add it to the parent (which is guranteed
     * to be a directory object with a `childPaths` key)
     */
    tree[currentPath] = newTreeNode(
      type,
      segment,
      currentPath,
      fileWithDefaults
    );
    tree[parentPath].childPaths.push(currentPath);
  });

  return tree;
}

function toDirectoryTree(files) {
  let tree = {};
  tree['/'] = newTreeNode('directory', '/', '/', null);

  files.forEach((file) => {
    tree = addToDirectoryTree(tree, file);
  });

  return tree;
}

export { normalizePath, toDirectoryTree };
