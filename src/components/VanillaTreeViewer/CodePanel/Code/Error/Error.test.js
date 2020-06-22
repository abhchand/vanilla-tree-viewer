import * as Error from './Error';
import { expect } from 'chai';
import { renderComponent } from 'components/VanillaTreeViewer/Helpers/renderComponent';

describe('<Error />', () => {
  it('renders the Error component', () => {
    const container = renderComponent(Error, { text: 'some error' });
    expect(container.innerHTML).to.eql('some error');
  });
});
