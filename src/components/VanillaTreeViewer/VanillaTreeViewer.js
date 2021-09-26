import './VanillaTreeViewer.scss';

import * as CodePanel from './CodePanel/CodePanel';
import * as InvalidState from './InvalidState/InvalidState';
import * as Tree from './Tree/Tree';
import { normalizePath, toDirectoryTree } from './Tree/Builder/Builder';
import Component from 'lib/Component';
import defaultSelectedPath from './Helpers/defaultSelectedPath';
import { hljsStyleUrl } from './hljs';
import { renderComponent } from './Helpers/renderComponent';
import Store from 'lib/Store/Store';
import { validateFiles } from './Validator/Validator';

class VanillaTreeViewer extends Component {
  constructor(id, files, options) {
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
    this.renderInvalid = this.renderInvalid.bind(this);
    this.render = this.render.bind(this);

    const validationResult = validateFiles(files);
    let selectedPath, tree;

    if (validationResult.isValid) {
      selectedPath = normalizePath(defaultSelectedPath(files));
      tree = toDirectoryTree(files, options);
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

  fetchSyntaxHighlightStyle(styleNameParam, path) {
    const styleName = styleNameParam.toLowerCase();
    const { syntaxHighlightStyles, tree } = this.store.state;

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

  renderIntoDOM(element) {
    this.element.innerHTML = '';
    this.element.appendChild(element);
  }

  renderComponent() {
    const { selectedPath, syntaxHighlightStyles, tree } = this.store.state;

    /*
     * Creates HTMLElement:
     *
     * <div class='vanilla-tree-viewer'>
     *   {Tree}
     *   {CodePanel}
     * </div>
     *
     */

    const div = document.createElement('div');
    div.classList.add('vanilla-tree-viewer');

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

  renderInvalid() {
    const { errorText } = this.store.state;

    return renderComponent(InvalidState, { reason: errorText });
  }

  render() {
    const { errorText } = this.store.state;
    const content = errorText ? this.renderInvalid() : this.renderComponent();

    this.renderIntoDOM(content);
  }
}

export default VanillaTreeViewer;
