import * as WrapTextToggle from './WrapTextToggle';
import { expect } from 'chai';
import { renderComponent } from 'components/VanillaTreeViewer/Helpers/renderComponent';

let toggleWrapText, wrapText;

describe('<WrapTextToggle />', () => {
  beforeEach(() => {
    wrapText = false;
    toggleWrapText = jest.fn();
  });

  it('renders the WrapTextToggle', () => {
    // Verify container and class
    const container = render();
    expect(container.classList.contains('vtv__wrap-text-toggle')).to.be.true;

    // Verify `<button>` presence
    const button = container.querySelector('button');
    expect(button).to.exist;

    // Verify `<svg>` presence
    const svg = button.querySelector('svg');
    expect(svg).to.exist;
  });

  describe('active CSS class', () => {
    it('does not set the `--active` CSS class', () => {
      const container = render();

      expect(container.classList.contains('vtv__wrap-text-toggle--active')).to
        .be.false;
    });

    describe('wrapping is enabled', () => {
      beforeEach(() => (wrapText = true));

      it('sets the `--active` CSS class', () => {
        const container = render();

        expect(container.classList.contains('vtv__wrap-text-toggle--active')).to
          .be.true;
      });
    });
  });

  describe('the button is clicked', () => {
    it('calls the `toggleWrapText` prop', () => {
      const container = render();
      container.querySelector('button').click();
      expect(toggleWrapText.mock.calls.length).to.eql(1);
    });
  });
});

const render = () => {
  return renderComponent(WrapTextToggle, {
    wrapText: wrapText,
    toggleWrapText: toggleWrapText
  });
};
