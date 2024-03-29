/* eslint-disable */
const Binoculars = (props) => {
  return `
    <svg width=${props.width || '491px'} height=${
    props.height || '330px'
  } xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 491 330" xmlns:v="https://vecta.io/nano"><title>${
    props.title || 'VanillaTreeViewer Logo'
  }</title><g fill="none" fill-rule="evenodd"><g fill="#6a6666"><path d="M210 95c12.328-9.333 24.328-14 36-14s23.338 4.667 35 14v148c-11.343 15.333-23.01 23-35 23s-23.99-7.667-36-23V95z"/><use xlink:href="#B"/></g><use xlink:href="#C" fill="#474b57"/><circle fill="#6499ea" cx="105.188" cy="213.786" r="72.5"/><path d="M52.188 197.286c-2-.267-3.167-1.267-3.5-3 5.629-23.518 25.789-40 51.032-40l.5.002c2.312.665 3.468 2.331 3.468 4.998s-1.156 4.667-3.468 6c-19.217 0-35.49 12.606-41 30-2.688 1.6-5.032 2.267-7.032 2z" fill="#d8d8d8"/><g transform="matrix(-1 0 0 1 491 0)"><use xlink:href="#B" fill="#6a6666"/><use xlink:href="#C" fill="#474b57"/><g transform="matrix(-1 0 0 1 177.6875 141.285714)"><circle fill="#6499ea" cx="72.5" cy="72.5" r="72.5"/><path d="M19.5 56c-2-.267-3.167-1.267-3.5-3 5.629-23.518 25.789-40 51.032-40l.5.002C69.844 13.667 71 15.333 71 18s-1.156 4.667-3.468 6c-19.217 0-35.49 12.606-41 30-2.688 1.6-5.032 2.267-7.032 2z" fill="#d8d8d8"/></g></g></g><defs ><path id="B" d="M101.688 14.286c10.667-13.333 29.333-17.333 56-12s41.667 17 45 35v48l-125-20c-1.333-2 0-7.667 4-17s10.667-20.667 20-34z"/><path id="C" d="M67.688 70.286c18-11.334 34.333-17 49-17 49.943 0 85.478 21.956 92 35 6.579 13.159 10.253 85.277 3 148-1.534 13.265-5.867 24.265-13 33-59.333 72.667-115 80-167 22s-40-131.667 36-221z"/></defs></svg>
  `.trim();
};

export default Binoculars;
/* eslint-enable */
