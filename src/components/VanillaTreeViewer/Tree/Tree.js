import './Tree.scss';

import Directory from './Directory/Directory';
import { renderComponent } from 'components/VanillaTreeViewer/Helpers/renderComponent';

const render = (props) => {
  const ul = document.createElement('ul');
  ul.classList.add('vanilla-tree-viewer__tree');

  const children = renderComponent(
    Directory,
    {
      tree: props.tree,
      path: '/',
      indent: 0,
      toggleDirectory: props.toggleDirectory,
      updateSelectedPath: props.updateSelectedPath,
      selectedFileId: props.selectedFileId
    }
  );

  children.forEach((child) => ul.appendChild(child));

  return ul;
};

export {
  render
};
