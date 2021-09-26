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
    // File contents will be fetched & populated later
    treeNode.contents = null;
    treeNode.url = file.url;
    treeNode.error = null;
    treeNode.options = file.options;
  }

  return treeNode;
}

function normalizePath(path) {
  let newPath = path;

  if (newPath[0] !== '/') {
    newPath = `/${newPath}`;
  }

  return newPath.toLowerCase();
}

function addToDirectoryTree(tree, file, globalOptions) {
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

  // Merge any relevant global options / defaults into the individual `file`
  file.options = {
    ...DEFAULT_OPTIONS,
    ...(globalOptions || {}),
    ...(file.options || {})
  };

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
    tree[currentPath] = newTreeNode(type, segment, currentPath, file);
    tree[parentPath].childPaths.push(currentPath);
  });

  return tree;
}

function toDirectoryTree(files, globalOptions) {
  let tree = {};
  tree['/'] = newTreeNode('directory', '/', '/', null);

  files.forEach((file) => {
    tree = addToDirectoryTree(tree, file, globalOptions);
  });

  return tree;
}

export { normalizePath, toDirectoryTree };
