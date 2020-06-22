/* eslint-disable */
const File = (props) => {
  const defaultProps = {
    title: 'file',
    width: '104px',
    height: '134px',
    backgroundColor: '#FFFFFF',
    borderColor: '#000000'
  };

  props = Object.assign(defaultProps, props);

  return `
    <svg width=${props.width} height=${props.height} viewBox="0 0 104 134" version="1.1" xmlns="http://www.w3.org/2000/svg" style="min-width: ${props.width}">
      <title>${props.title}</title>
      <g id="Page-1" stroke="none" stroke-width="1" fill="none" fillRule="evenodd">
        <g id="file" transform="translate(2.000000, 2.000000)" fill="${props.backgroundColor}" stroke="${props.borderColor}" stroke-width="3">
          <polygon points="0 0 70 0 100 30 100 130 0 130"></polygon>
        </g>
      </g>
    </svg>
  `;
};

export default File;
/* eslint-enable */
