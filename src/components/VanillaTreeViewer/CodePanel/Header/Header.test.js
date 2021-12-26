import * as Header from './Header';
import { expect } from 'chai';
import { renderComponent } from 'components/VanillaTreeViewer/Helpers/renderComponent';

let file, toggleWrapText, wrapText;

describe('<Header />', () => {
  beforeEach(() => {
    file = { path: '/some/path' };
    wrapText = false;
    toggleWrapText = jest.fn();
  });

  it('renders the Path', () => {
    const container = render();

    const path = container.getElementsByClassName('vtv__code-path')[0];
    expect(path.innerText).to.eql('/some/path');
  });

  it('renders the WrapTextToggle', () => {
    const container = render();

    const toggle = container.getElementsByClassName('vtv__wrap-text-toggle')[0];
    const button = toggle.getElementsByTagName('button')[0];

    expect(button).to.not.be.null;
  });

  it('renders the Logo', () => {
    const container = render();

    const logo = container.getElementsByClassName('vtv__logo')[0];
    const svg = logo.getElementsByTagName('svg')[0];

    expect(svg).to.not.be.null;
  });
});

const render = () => {
  return renderComponent(Header, {
    file: file,
    wrapText: wrapText,
    toggleWrapText: toggleWrapText
  });
};
