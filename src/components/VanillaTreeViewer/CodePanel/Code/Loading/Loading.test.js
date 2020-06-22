import * as Loading from './Loading';
import { expect } from 'chai';
import { renderComponent } from 'components/VanillaTreeViewer/Helpers/renderComponent';

describe('<Loading />', () => {
  it('renders the Loading component', () => {
    const container = renderComponent(Loading);
    expect(container.innerHTML).to.eql('Loading...');
  });
});
