/* eslint-disable */
const File = (props) => {
  return `
    <svg width=${props.width || '104px'} height=${
    props.height || '134px'
  } viewBox="0 0 104 134" xmlns="http://www.w3.org/2000/svg" style="min-width: ${
    props.width
  }">
      <g stroke="none" stroke-width="1" fill="none" fillRule="evenodd">
        <g id="file" transform="translate(2.000000, 2.000000)" fill="${
          props.backgroundColor
        }" stroke="#000000" stroke-width="3">
          <polygon points="0 0 70 0 100 30 100 130 0 130"></polygon>
        </g>
      </g>
    </svg>
  `;
};

export default File;
/* eslint-enable */
