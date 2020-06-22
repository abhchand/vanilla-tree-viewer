import * as Path from './Path';
import { expect } from 'chai';
import { renderComponent } from 'components/VanillaTreeViewer/Helpers/renderComponent';

describe('<Path />', () => {
  it('renders the component', () => {
    const container = renderComponent(Path, { path: '/some/path' });
    expect(container.innerText).to.eql('/some/path');
  });
});
