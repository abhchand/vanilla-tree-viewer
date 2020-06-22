import * as InvalidState from './InvalidState';
import { expect } from 'chai';
import { renderComponent } from 'components/VanillaTreeViewer/Helpers/renderComponent';

describe('<InvalidState />', () => {
  it('renders the component', () => {
    const container = renderComponent(
      InvalidState,
      { reason: 'some reason' }
    );

    expect(container.innerText).to.eql(InvalidState.DEFAULT_MESSAGE);
  });

  describe('it can override the message', () => {
    it('renders the component with custom message', () => {
      const container = renderComponent(
        InvalidState,
        { reason: 'some reason', message: 'some message' }
      );

      expect(container.innerText).to.eql('some message');
    });
  });
});
