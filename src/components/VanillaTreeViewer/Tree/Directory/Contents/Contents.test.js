/*
 * Since `Contents` and `Directory` call each other recursively,
 * it's easier to the rendered tree in one place. Test coverage
 * for `Contents` is included as part of the the `Directory` tests
 */

import { expect } from 'chai';

it('returns true', () => { expect(true).to.be.true; });
