/* eslint-disable */
const WrapText = (props) => {
  const color = props.color || '#000000';

  return `
  <svg width=${props.size || '100px'} height=${
    props.size || '100px'
  } viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <title>Wrap Text</title>
    <g id="wrap-text-icon" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <path d="M10,25.5 L90,25.5" id="Line" stroke="${color}" stroke-width="6" stroke-linecap="round"></path>
      <path d="M10,48.5 L80,48.5 C88.6666667,49.5 93,53.3333333 93,60 C93,66.6666667 88.6666667,70.6666667 80,72 L65,72" id="Line" stroke="${color}" stroke-width="6" stroke-linecap="round"></path>
      <path d="M10,71.5 L40,71.5" id="Line" stroke="${color}" stroke-width="6" stroke-linecap="round"></path>
      <path d="M62.2275578,62.9615277 L69.2454838,74.9922579 C69.8020444,75.9463618 69.4797719,77.1709972 68.5256681,77.7275578 C68.2197959,77.9059832 67.8720353,78 67.517926,78 L53.482074,78 C52.3775045,78 51.482074,77.1045695 51.482074,76 C51.482074,75.6458907 51.5760908,75.2981301 51.7545162,74.9922579 L58.7724422,62.9615277 C59.3290028,62.0074238 60.5536382,61.6851513 61.5077421,62.2417119 C61.8057493,62.4155495 62.0537202,62.6635204 62.2275578,62.9615277 Z" id="Triangle" fill="${color}" transform="translate(60.500000, 69.000000) rotate(30.000000) translate(-60.500000, -69.000000) "></path>
    </g>
  </svg>`;
};

export default WrapText;
/* eslint-enable */
