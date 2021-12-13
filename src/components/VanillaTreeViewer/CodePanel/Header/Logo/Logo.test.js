import * as Logo from './Logo';
import { UTM_CAMPAIGN, VTV_SOURCE } from './constants';
import { expect } from 'chai';
import { renderComponent } from 'components/VanillaTreeViewer/Helpers/renderComponent';

describe('<Logo />', () => {
  let mockWindow;

  beforeEach(() => {
    mockWindow = {
      location: {
        origin: 'https://example.com/foo'
      }
    };

    jest.spyOn(global, 'window', 'get').mockImplementation(() => mockWindow);
  });

  it('renders the SVG logo', () => {
    const logo = renderComponent(Logo);
    const svg = logo.getElementsByTagName('svg')[0];

    expect(svg).to.not.be.null;
  });

  describe('generating the link', () => {
    it('generates the source link, with utm params', () => {
      const logo = renderComponent(Logo);
      const a = logo.getElementsByTagName('a')[0];

      expect(a.href).to.eql(
        `${VTV_SOURCE}?utm_campaign=${UTM_CAMPAIGN}&utm_source=https://example.com/foo`
      );
    });

    describe('window origin can not be determine', () => {
      beforeEach(() => {
        mockWindow = {};
      });

      it('still generates the link without error', () => {
        const logo = renderComponent(Logo);
        const a = logo.getElementsByTagName('a')[0];

        expect(a.href).to.eql(
          `${VTV_SOURCE}?utm_campaign=${UTM_CAMPAIGN}&utm_source=unknown`
        );
      });
    });
  });
});
