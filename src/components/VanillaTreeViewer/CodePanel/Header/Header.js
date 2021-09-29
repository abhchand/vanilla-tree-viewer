import './Header.scss';

import * as Logo from './Logo/Logo';
import * as Path from './Path/Path';
import { renderComponent } from 'components/VanillaTreeViewer/Helpers/renderComponent';

const render = (props) => {
  /*
   * Creates HTMLElement:
   *
   * <div class='vanilla-tree-viewer__code-panel-header'>
   *   {Path}
   *   {Logo}
   * </div>
   *
   */

  const div = document.createElement('div');
  div.classList.add('vanilla-tree-viewer__code-panel-header');

  const path = renderComponent(Path, { path: props.file.path });
  const logo = renderComponent(Logo);

  div.appendChild(path);
  div.appendChild(logo);

  return div;
};

export { render };
