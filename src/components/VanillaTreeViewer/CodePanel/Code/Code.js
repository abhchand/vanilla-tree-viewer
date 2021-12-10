import './Code.scss';

import * as Err from './Error/Error';
import * as Loading from './Loading/Loading';
import { hljs } from 'components/VanillaTreeViewer/hljs';
import { renderComponent } from 'components/VanillaTreeViewer/Helpers/renderComponent';

class Code {
  constructor(props) {
    this.props = props;

    this.namespacedCss = this.namespacedCss.bind(this);
    this.highlightedContents = this.highlightedContents.bind(this);
    this.renderComponent = this.renderComponent.bind(this);
  }

  namespacedCss() {
    const { file, namespace, syntaxHighlightStyles } = this.props;

    if (!file.style) {
      return null;
    }

    /*
     * The `<style>` tag we're about to create with the
     * fetched CSS will apply to the whole page by default.
     * There could be multiple `VanillaTreeViewer` components
     * on the page, so we want to namespace the CSS so it only
     * applies to this instance.
     *
     * Conveniently, `hljs` prefixes all of it's CSS rules with
     * `.hljs` so we can use this component's id as a namespace
     *
     * e.g.
     *   Input:  .hljs.foo { background-color: black; }
     *   Output: #someId.hljs.foo { background-color: black; }
     *
     */
    const css = syntaxHighlightStyles[file.style];

    return css.replace(/\.hljs/gu, `#${namespace} .hljs`);
  }

  highlightedContents() {
    const { file } = this.props;

    if (!file.language) {
      return file.contents;
    }

    /*
     * Use `hljs` to apply highlighting markup to the file contents
     * See: https://highlightjs.readthedocs.io/en/latest/api.html#highlight-languagename-code-ignore-illegals-continuation
     */
    return hljs.highlight(file.language, file.contents, true).value;
  }

  renderComponent() {
    /*
     * Creates HTMLElement:
     *
     * <div class='vtv__code' tabindex='-1'>
     *   <pre>
     *     <code class='hljs' tabindex='-1'>
     *       {contents}
     *     </code>
     *   </pre>
     *   <style>
     *     {css}
     *   </style>
     * </div>
     *
     */

    const div = document.createElement('div');
    div.classList.add('vtv__code');
    div.setAttribute('tabindex', '-1');

    const style = document.createElement('style');
    style.innerHTML = this.namespacedCss();

    const pre = document.createElement('pre');

    const code = document.createElement('code');
    code.classList.add('hljs');
    code.setAttribute('tabindex', '-1');

    code.innerHTML = this.highlightedContents();
    pre.appendChild(code);
    div.appendChild(pre);
    div.appendChild(style);

    return div;
  }

  render() {
    const {
      fetchFileContents,
      fetchSyntaxHighlightStyle,
      file,
      syntaxHighlightStyles
    } = this.props;

    if (file.error) {
      return renderComponent(Err, { text: file.error });
    }

    /*
     * If we don't have the file contents for this file already set
     * or cached, fetch it asynchronously and display `Loading` in
     * the mean time
     */
    if (!file.contents) {
      fetchFileContents(file.path);
      return renderComponent(Loading);
    }

    /*
     * If a CSS style was specified and we don't have it cached,
     * fetch it asynchronously and display `Loading` in the mean time
     */
    if (file.style && !syntaxHighlightStyles[file.style]) {
      fetchSyntaxHighlightStyle(file.style, file.path);
      return renderComponent(Loading);
    }

    return this.renderComponent();
  }
}

export default Code;
