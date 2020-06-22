import './Directory.scss';

import { keyCodes, parseKeyCode } from 'components/VanillaTreeViewer/Helpers/Keys';
import Contents from './Contents/Contents';
import FolderClosedIcon from 'components/VanillaTreeViewer/Icons/FolderClosed';
import FolderOpenIcon from 'components/VanillaTreeViewer/Icons/FolderOpen';
import { renderComponent } from 'components/VanillaTreeViewer/Helpers/renderComponent';
import treeNodePadding from 'components/VanillaTreeViewer/Helpers/treeNodePadding';

class Directory {

  constructor(props) {
    this.props = props;

    this.renderDirectory = this.renderDirectory.bind(this);
    this.renderContents = this.renderContents.bind(this);
    this.render = this.render.bind(this);
  }

  renderDirectory() {
    const { indent, path, tree } = this.props;

    const onClick = (e) => {
      // eslint-disable-next-line
      const path = e.currentTarget.dataset.path;
      this.props.toggleDirectory(path);
    };

    /*
     * Creates HTMLElement:
     *
     * <li class='vanilla-tree-viewer__tree-node
     *   vanilla-tree-viewer__tree-node--directory' ...>
     *   <svg>...</svg>
     *   <span>{directoryName}</span>
     * </div>
     *
     */

    const li = document.createElement('li');

    li.setAttribute('data-path', path);
    li.setAttribute('style', `padding-left: ${treeNodePadding(indent)}px;`);
    li.setAttribute('tabindex', '0');

    li.classList.add(
      'vanilla-tree-viewer__tree-node',
      'vanilla-tree-viewer__tree-node--directory'
    );

    li.addEventListener('click', onClick);
    li.addEventListener('keydown', (e) => {
      if (parseKeyCode(e) === keyCodes.ENTER) {
        onClick(e);
      }
    });

    const iconClass = tree[path].isOpen ? FolderOpenIcon : FolderClosedIcon;
    const icon = iconClass({ height: '18px', width: '24px' });

    const span = document.createElement('span');
    span.innerHTML = tree[path].name;

    li.innerHTML = icon;
    li.appendChild(span);

    return li;
  }

  renderContents() {
    const {
      indent,
      path,
      selectedFileId,
      toggleDirectory,
      tree,
      updateSelectedPath
    } = this.props;

    return renderComponent(
      Contents,
      {
        tree: tree,
        parentPath: tree[path].path,
        indent: indent + 1,
        toggleDirectory: toggleDirectory,
        updateSelectedPath: updateSelectedPath,
        selectedFileId: selectedFileId
      }
    );
  }

  render() {
    const { path, tree } = this.props;

    let items = [this.renderDirectory()];

    if (tree[path].isOpen) {
      items = items.concat(this.renderContents());
    }

    return items;
  }

}

export default Directory;
