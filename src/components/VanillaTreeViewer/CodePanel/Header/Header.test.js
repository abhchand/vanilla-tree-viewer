import * as Header from './Header';
import { expect } from 'chai';
import { renderComponent } from 'components/VanillaTreeViewer/Helpers/renderComponent';

describe('<Header />', () => {
  it('renders the Header with the Path', () => {
    const file = {
      path: '/some/path'
    };

    const container = renderComponent(Header, { file: file });

    const path = container.getElementsByClassName(
      'vanilla-tree-viewer__code-path'
    )[0];
    expect(path.innerText).to.eql('/some/path');
  });
});
