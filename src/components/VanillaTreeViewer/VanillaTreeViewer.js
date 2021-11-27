import './VanillaTreeViewer.scss';

import * as CodePanel from './CodePanel/CodePanel';
import * as InvalidState from './InvalidState/InvalidState';
import * as Tree from './Tree/Tree';
import { normalizePath, toDirectoryTree } from './Tree/Builder/Builder';
import Component from 'lib/Component';
import defaultSelectedPath from './Helpers/defaultSelectedPath';
import { hljsStyleUrl } from './hljs';
import { parseUserNodes } from './Parser/Parser';
import { renderComponent } from './Helpers/renderComponent';
import setTreeNodeToFullWidth from './Helpers/setTreeNodeToFullWidth';
import Store from 'lib/Store/Store';
import { validateFiles } from './Validator/Validator';

class VanillaTreeViewer extends Component {
  static renderAll() {
    /*
     * Extract configuration from each user-defined node
     * and render a `VanillaTreeViewer` instance on that node
     */
    parseUserNodes().forEach((args) => new VanillaTreeViewer(...args).render());
  }

  constructor(id, files) {
    super({
      store: new Store({}),
      element: document.getElementById(id)
    });

    this.id = id;

    this.toggleDirectory = this.toggleDirectory.bind(this);
    this.updateSelectedPath = this.updateSelectedPath.bind(this);
    this.fetchFileContents = this.fetchFileContents.bind(this);
    this.fetchSyntaxHighlightStyle = this.fetchSyntaxHighlightStyle.bind(this);
    this.renderIntoDOM = this.renderIntoDOM.bind(this);
    this.renderComponent = this.renderComponent.bind(this);
    this.afterRender = this.afterRender.bind(this);
    this.render = this.render.bind(this);

    const validationResult = validateFiles(files);
    let selectedPath, tree;

    if (validationResult.isValid) {
      selectedPath = normalizePath(defaultSelectedPath(files));
      tree = toDirectoryTree(files);
    }

    this.store.state = {
      tree: tree,
      selectedPath: selectedPath,
      syntaxHighlightStyles: {},
      errorText: validationResult.error
    };
  }

  toggleDirectory(path) {
    const { tree } = this.store.state;

    tree[path].isOpen = !tree[path].isOpen;
    this.store.setState({ tree: tree });
  }

  updateSelectedPath(path) {
    this.store.setState({ selectedPath: path });
  }

  // Fetches the file contents for a given path via GET
  fetchFileContents(path) {
    const { tree } = this.store.state;
    const url = tree[path].url;

    if (tree[path].contents) {
      return;
    }

    fetch(url)
      .then((response) => response.text())
      .then((contents) => {
        tree[path].contents = contents;
        this.store.setState({ tree: tree });
      })
      .catch((_error) => {
        tree[path].error = `Could not fetch file contents from ${url}`;
        this.store.setState({ tree: tree });
      });
  }

  // Fetches the highlight.js styles from a CDN given the style name
  fetchSyntaxHighlightStyle(styleNameParam, path) {
    const styleName = styleNameParam.toLowerCase();
    const { syntaxHighlightStyles, tree } = this.store.state;

    // If it's already cached, don't re-fetch
    if (
      Object.prototype.hasOwnProperty.call(syntaxHighlightStyles, styleName)
    ) {
      return;
    }

    const url = hljsStyleUrl(styleName);

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.text();
      })
      .then((contents) => {
        syntaxHighlightStyles[styleName] = contents;
        this.store.setState({ syntaxHighlightStyles: syntaxHighlightStyles });
      })
      .catch((_error) => {
        tree[path].error = `Could not fetch highlight styling from ${url}`;
        this.store.setState({ tree: tree });
      });
  }

  renderIntoDOM(childElement) {
    this.element.innerHTML = '';
    this.element.appendChild(childElement);
  }

  // Renders the VanillaTreeViewer component
  renderComponent() {
    const { selectedPath, syntaxHighlightStyles, tree } = this.store.state;

    /*
     * Creates HTMLElement:
     *
     * <div class='vtv-root'>
     *   {Tree}
     *   {CodePanel}
     * </div>
     *
     */

    const div = document.createElement('div');
    div.classList.add('vtv-root');

    const treeEl = renderComponent(Tree, {
      tree: tree,
      toggleDirectory: this.toggleDirectory,
      updateSelectedPath: this.updateSelectedPath,
      selectedFileId: tree[selectedPath].id
    });

    const codePanel = renderComponent(CodePanel, {
      namespace: this.id,
      file: tree[selectedPath],
      syntaxHighlightStyles: syntaxHighlightStyles,
      fetchFileContents: this.fetchFileContents,
      fetchSyntaxHighlightStyle: this.fetchSyntaxHighlightStyle
    });

    div.appendChild(treeEl);
    div.appendChild(codePanel);

    return div;
  }

  // eslint-disable-next-line class-methods-use-this
  afterRender() {
    setTreeNodeToFullWidth();
  }

  render() {
    const { errorText } = this.store.state;
    const content = errorText
      ? renderComponent(InvalidState, { reason: errorText })
      : this.renderComponent();

    this.renderIntoDOM(content);
    this.afterRender();
  }
}

export default VanillaTreeViewer;
