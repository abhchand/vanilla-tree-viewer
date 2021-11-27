/*
 * Removes any `null` or `undefined`
 * keys from an object
 */
const removeBlanks = (obj) => {
  Object.keys(obj).forEach((key) => {
    /*
     * Use `==` explicitly to catch both `null` and
     * `undefined`
     */
    // eslint-disable-next-line no-eq-null
    if (obj[key] == null || obj[key] === '') {
      delete obj[key];
    }
  });

  return obj;
};

const replaceUserNodeInDOM = (userNode, nodeIdx) => {
  // Preserve `id` if it exists, if not generate a new value
  const id = userNode.id || `vtv--${nodeIdx + 1}`;

  // Add `.vtv-wrapper` to indicate this node has been parsed.
  userNode.classList.add('vtv-wrapper');

  // Create mount point
  const mountNode = document.createElement('div');
  mountNode.id = id;
  mountNode.classList = userNode.classList;

  // Replace user node with new node
  userNode.parentNode.replaceChild(mountNode, userNode);

  return id;
};

/*
 * Parses user-defined nodes in the DOM on which `VanillaTreeViewer`
 * instances will be mounted.
 *
 * Specifically, this does 2 things:
 *
 *  1. Parses options from each user-defined node
 *  2. Replaces each user-defined node with a generic mount node
 *
 *
 * Users specify optionurations using inline HTML and `data-*`
 * attributes, all of which will be parsed here and removed. The full list
 * of attributes a user may specify can be found in the `README`.
 *
 * Users *must* specify the `.vtv` class on each node, since this is how
 * `VanillaTreeViewer` know whether to parse that node.
 *
 * Each mount node will be assigned a sequential `id` for uniqueness. However
 * if the user already specified an `id`, it will be used instead.
 *
 * Each mount node will be assigned a class of `.vtv-wrapper` to mark this node
 * as parsed. Any custom classes defined on the node will still be preserved.
 *
 * This function does *not* perform any validation. This is performed
 * later when initializing and mounting the `VanillaTreeViewer` object
 *
 * # Example
 *
 * Imagine a DOM with a single parent node containing 2 file nodes:
 *
 *     <ol data-language="ruby" class="vtv foo">
 *
 *       <!-- FILE 1 -->
 *       <li
 *         data-path="app/models/company.rb"
 *         data-url="https://example.com/path/to/company.rb">
 *       </li>
 *
 *       <!-- FILE 2 -->
 *       <li
 *         data-path="app/javascript/index.js"
 *         data-selected=true
 *         data-language="javascript">
 *         var foo = 'bar';
 *
 *         export { foo };
 *       </li>
 *     </ol>
 *
 * When parsing the above DOM, this function will return:
 *
 *     [
 *       [
 *         'vtv--1',
 *         [
 *           {
 *             path: 'app/models/company.rb',
 *             url: 'https://example.com/path/to/company.rb',
 *             language: 'ruby'
 *           },
 *           {
 *             path: 'app/javascript/index.js',
 *             contents: 'var foo = .... { foo };',
 *             selected: true,
 *             language: 'javascript'
 *           }
 *         ]
 *       ]
 *     ]
 *
 * Additionally, the user defined node will be entirely replaced with
 * the following mount node:
 *
 *     <div id='vtv--1' class="vtv foo vtv-wrapper"></div>
 */
const parseUserNodes = () => {
  const nodes = [];

  document.querySelectorAll('.vtv').forEach((userNode, userNodeIdx) => {
    /*
     * Sanity check: If the node has a `vtv-wrapper` class, we've already
     * parsed this node and we can safely ignore this node.
     */
    if (userNode.classList.contains('vtv-wrapper')) {
      return;
    }

    const files = [];

    /*
     * Common options defined on the parent node. Will be applied as fallbacks
     * to each individual file node
     */
    const sharedOptions = removeBlanks({
      language: userNode.dataset.language,
      style: userNode.dataset.style
    });

    // Find every file node under the user node
    userNode.querySelectorAll('li').forEach((fileNode) => {
      /*
       * We only want to consider direct children. Ideally we'd use
       * something like `querySelectorAll('> li')` for this, but that's
       * not supported.
       */
      if (fileNode.parentNode !== userNode) {
        return;
      }

      files.push(
        removeBlanks({
          path: fileNode.dataset.path,
          url: fileNode.dataset.url,
          contents: fileNode.innerHTML.trim(),
          selected:
            typeof fileNode.dataset.selected === 'string' &&
            fileNode.dataset.selected.toLowerCase() === 'true'
              ? true
              : null,
          language: fileNode.dataset.language || sharedOptions.language,
          style: fileNode.dataset.style || sharedOptions.style
        })
      );
    });

    // Create a new mount node to replace the existing user node
    const mountId = replaceUserNodeInDOM(userNode, userNodeIdx);

    nodes.push([mountId, files]);
  });

  return nodes;
};

export { parseUserNodes };
