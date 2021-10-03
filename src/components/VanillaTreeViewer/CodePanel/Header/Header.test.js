import * as Header from './Header';
import { expect } from 'chai';
import { renderComponent } from 'components/VanillaTreeViewer/Helpers/renderComponent';

describe('<Header />', () => {
  it('renders the Path', () => {
    const file = {
      path: '/some/path'
    };

    const container = renderComponent(Header, { file: file });

    const path = container.getElementsByClassName('vtv__code-path')[0];
    expect(path.innerText).to.eql('/some/path');
  });

  it('renders the Logo', () => {
    const file = {
      path: '/some/path'
    };

    const container = renderComponent(Header, { file: file });

    const logo = container.getElementsByClassName('vtv__logo')[0];
    const svg = logo.getElementsByTagName('svg')[0];

    expect(svg).to.not.be.null;
  });
});
