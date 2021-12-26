import './Header.scss';

import * as Logo from './Logo/Logo';
import * as Path from './Path/Path';
import * as WrapTextToggle from './WrapTextToggle/WrapTextToggle';
import { renderComponent } from 'components/VanillaTreeViewer/Helpers/renderComponent';

const render = (props) => {
  /*
   * Creates HTMLElement:
   *
   * <div class='vtv__code-panel-header'>
   *   {Path}
   *   {WrapTextToggle}
   *   {Logo}
   * </div>
   *
   */

  const div = document.createElement('div');
  div.classList.add('vtv__code-panel-header');

  const path = renderComponent(Path, { path: props.file.path });
  const toggle = renderComponent(WrapTextToggle, {
    wrapText: props.wrapText,
    toggleWrapText: props.toggleWrapText
  });
  const logo = renderComponent(Logo);

  div.appendChild(path);
  div.appendChild(toggle);
  div.appendChild(logo);

  return div;
};

export { render };
