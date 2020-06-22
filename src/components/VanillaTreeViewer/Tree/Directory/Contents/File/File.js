import './File.scss';

import { keyCodes, parseKeyCode } from 'components/VanillaTreeViewer/Helpers/Keys';
import FileIcon from 'components/VanillaTreeViewer/Icons/File';
import treeNodePadding from 'components/VanillaTreeViewer/Helpers/treeNodePadding';

function render(props) {
  const { indent, isSelected } = props;

  const onClick = (e) => {
    const path = e.currentTarget.dataset.path;
    props.updateSelectedPath(path);
  };

  /*
   * Creates HTMLElement:
   *
   * <li class='vanilla-tree-viewer__tree-node \
   *   vanilla-tree-viewer__tree-node--file' ...>s
   *   <svg>...</svg>
   *   <span>{file.name}</span>
   * </div>
   *
   */

  const li = document.createElement('li');

  li.setAttribute('data-path', props.file.path);
  li.setAttribute('style', `padding-left: ${treeNodePadding(indent)}px;`);
  li.setAttribute('tabindex', '0');

  li.classList.add(
    'vanilla-tree-viewer__tree-node',
    'vanilla-tree-viewer__tree-node--file'
  );
  if (isSelected) { li.classList.add('selected'); }

  li.addEventListener('click', onClick);
  li.addEventListener('keydown', (e) => {
    if (parseKeyCode(e) === keyCodes.ENTER) {
      onClick(e);
    }
  });

  // eslint-disable-next-line
  const svg = FileIcon({
    height: '18px',
    width: '14px',
    backgroundColor: '#525154'
  });

  const span = document.createElement('span');
  span.innerHTML = props.file.name;

  li.innerHTML = svg;
  li.appendChild(span);

  return li;
}

export {
  render
};
