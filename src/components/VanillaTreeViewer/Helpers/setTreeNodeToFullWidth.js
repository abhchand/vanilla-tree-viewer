/*
 * The tree nodes need to have their width set to full width of
 * their parent container. This is so the background highlighting extends
 * all the way across the container.
 *
 * Since the parent has `overflow: scroll`, setting the
 * children to `width: 100%` does not account the full hidden/scroll width.
 *
 * There's no good programmatic way to set this via CSS. We could use an
 * inline `calc(100% + X)` on each child but that doesn't scale when
 * the indentend folders are deeply nested (e.g. > 5 levels).
 *
 * Ultimately the approach is to use a few lines of JavaScript to
 * programmatically set this. This needs to be executed *after* the elements
 * have been rendered so that we can fetch the `scrollWidth` of the parent container
 */
function setTreeNodeToFullWidth() {
  const tree = document.querySelector('.vanilla-tree-viewer__tree');
  if (!tree) {
    return;
  }

  document
    .querySelectorAll('.vanilla-tree-viewer__tree-node')
    .forEach((element) => {
      element.style.width = `${tree.scrollWidth}px`;
    });
}

export default setTreeNodeToFullWidth;
