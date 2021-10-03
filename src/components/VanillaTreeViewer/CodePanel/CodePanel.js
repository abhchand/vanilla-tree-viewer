import './CodePanel.scss';

import * as Header from './Header/Header';
import Code from './Code/Code';
import { renderComponent } from 'components/VanillaTreeViewer/Helpers/renderComponent';

const render = (props) => {
  /*
   * Builds a code pane:
   *
   * <div class='vanilla-tree-viewer__code-panel'>
   *   {Header}
   *   {Code}
   * </div>
   */

  // Build <div>

  const div = document.createElement('div');
  div.classList.add('vanilla-tree-viewer__code-panel');

  // Build Header and Code

  const header = renderComponent(Header, { file: props.file });
  const code = renderComponent(Code, {
    namespace: props.namespace,
    file: props.file,
    syntaxHighlightStyles: props.syntaxHighlightStyles,
    fetchFileContents: props.fetchFileContents,
    fetchSyntaxHighlightStyle: props.fetchSyntaxHighlightStyle
  });

  // Assemble

  div.appendChild(header);
  div.appendChild(code);

  return div;
};

export { render };
