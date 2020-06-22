const PADDING_WIDTH_PX = 15;

function treeNodePadding(indentLevel) {
  // eslint-disable-next-line
  return PADDING_WIDTH_PX + (indentLevel * PADDING_WIDTH_PX);
}

export default treeNodePadding;
