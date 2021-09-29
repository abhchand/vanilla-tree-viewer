import * as Logo from './Logo';
import { expect } from 'chai';
import { renderComponent } from 'components/VanillaTreeViewer/Helpers/renderComponent';
import { VTV_SOURCE } from './constants';

describe('<Logo />', () => {
  it('renders the SVG logo', () => {
    const logo = renderComponent(Logo);
    const svg = logo.getElementsByTagName('svg')[0];

    expect(svg).to.not.be.null;
  });

  it('links to the VanillaTreeViewer source code', () => {
    const logo = renderComponent(Logo);
    const a = logo.getElementsByTagName('a')[0];

    expect(a.href).to.eql(VTV_SOURCE);
  });
});
