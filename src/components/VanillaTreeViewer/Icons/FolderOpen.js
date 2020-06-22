/* eslint-disable */
const FolderOpen = (props) => {
  const defaultProps = {
    title: 'folder-open',
    width: '172px',
    height: '130px',
    backgroundColor: '#FFAF00',
    foregroundColor: '#FFD233'
  };

  props = Object.assign(defaultProps, props);

  return `
    <svg width=${props.width} height=${props.height} viewBox="0 0 172 130" version="1.1" xmlns="http://www.w3.org/2000/svg" style="min-width: ${props.width}">
      <title>${props.title}</title>
      <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="folder-open">
          <path d="M15,0 L56,0 L74,17 L139,17 C147.284271,17 154,23.7157288 154,32 L154,115 C154,123.284271 147.284271,130 139,130 L15,130 C6.71572875,130 1.01453063e-15,123.284271 0,115 L0,15 C-1.01453063e-15,6.71572875 6.71572875,1.04035801e-14 15,0 Z" id="folder-back" fill="${props.backgroundColor}"></path>
          <path d="M42.9681619,41 L78.6956522,41 L93.4782609,41 L156.260361,41 C164.544632,41 171.260361,47.7157288 171.260361,56 C171.260361,56.8353361 171.190582,57.6692124 171.051753,58.4929313 L161.107933,117.492931 C159.891007,124.713357 153.638798,130 146.31654,130 L17,130 L28.1256637,53.8319946 C29.201984,46.4633401 35.5213146,41 42.9681619,41 Z" id="folder-front" fill="${props.foregroundColor}"></path>
        </g>
      </g>
  </svg>
  `;
};

export default FolderOpen;
/* eslint-enable */
