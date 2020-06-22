/* eslint-disable */
const FolderClosed = (props) => {
  const defaultProps = {
    title: 'folder-closed',
    width: '161px',
    height: '130px',
    backgroundColor: '#FFAF00',
    foregroundColor: '#FFD233'
  };

  props = Object.assign(defaultProps, props);

  return `
    <svg width=${props.width} height=${props.height} viewBox="0 0 161 130" version="1.1" xmlns="http://www.w3.org/2000/svg" style="min-width: ${props.width}">
      <title>${props.title}</title>
      <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="folder-closed">
          <path d="M15,0 L56,0 L74,17 L146,17 C154.284271,17 161,23.7157288 161,32 L161,115 C161,123.284271 154.284271,130 146,130 L15,130 C6.71572875,130 1.01453063e-15,123.284271 0,115 L0,15 C-1.01453063e-15,6.71572875 6.71572875,1.04035801e-14 15,0 Z" id="folder-back" fill="${props.backgroundColor}"></path>
          <path d="M15,17 L56,17 L73,17 L146,17 C154.284271,17 161,23.7157288 161,32 L161,115 C161,123.284271 154.284271,130 146,130 L15,130 C6.71572875,130 1.01453063e-15,123.284271 0,115 L0,32 C-1.01453063e-15,23.7157288 6.71572875,17 15,17 Z" id="folder-front" fill="${props.foregroundColor}"></path>
        </g>
      </g>
  </svg>
  `;
};

export default FolderClosed;
/* eslint-enable */
