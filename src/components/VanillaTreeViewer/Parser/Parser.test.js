import { expect } from 'chai';
import { parseUserNodes } from './Parser';

describe('Parser.parseUserNodes', () => {
  describe('mount id', () => {
    it('generates a mount id for each parent node', () => {
      document.body.innerHTML = `
        <ol class='vtv'><li></li></ol>
        <ol class='vtv'><li></li></ol>
        `;

      const result = parseUserNodes();
      expect(result.length).to.equal(2);

      let mountId = result[0][0];
      expect(mountId).to.eql('vtv--1');

      mountId = result[1][0];
      expect(mountId).to.eql('vtv--2');
    });

    describe('parent node already has an `id`', () => {
      it('preserves the `id` for the parent node', () => {
        document.body.innerHTML = `
          <ol id='foo' class='vtv'><li></li></ol>
          <ol class='vtv'><li></li></ol>
          `;

        const result = parseUserNodes();
        expect(result.length).to.equal(2);

        let mountId = result[0][0];
        expect(mountId).to.eql('foo');

        mountId = result[1][0];
        expect(mountId).to.eql('vtv--2');
      });
    });

    describe('parent node has a `.vtv-wrapper` class', () => {
      it('does not process the user node', () => {
        document.body.innerHTML = `
          <ol class='vtv vtv-wrapper'><li></li></ol>
          <ol class='vtv'><li></li></ol>
          `;

        const result = parseUserNodes();
        expect(result.length).to.equal(1);

        /*
         * Even though the first node is skipped, the index/counter
         * is still preserved so the `id` is generated with `2`
         */
        const mountId = result[0][0];
        expect(mountId).to.eql('vtv--2');
      });
    });
  });

  describe('file options', () => {
    describe('parsing the `path` option', () => {
      it('parses the option from the file node', () => {
        document.body.innerHTML = `
          <ol class='vtv'>
            <li data-path="alpha/beta.js"></li>
          </ol>
          `;

        const result = parseUserNodes();
        expect(result.length).to.equal(1);

        const files = result[0][1];

        expect(files).to.deep.equal([{ path: 'alpha/beta.js' }]);
      });
    });

    describe('parsing the `url` option', () => {
      it('parses the option from the file node', () => {
        document.body.innerHTML = `
          <ol class='vtv'>
            <li data-url="https://example.co/path/to/beta.js"></li>
          </ol>
          `;

        const result = parseUserNodes();
        const files = result[0][1];

        expect(result.length).to.equal(1);
        expect(files).to.deep.equal([
          { url: 'https://example.co/path/to/beta.js' }
        ]);
      });
    });

    describe('parsing the `contents` option', () => {
      it('parses the option from the file node', () => {
        document.body.innerHTML = `
          <ol class='vtv'>
            <li>function foo() { return bar(); }</li>
          </ol>
          `;

        const result = parseUserNodes();
        const files = result[0][1];

        expect(result.length).to.equal(1);
        expect(files).to.deep.equal([
          { contents: 'function foo() { return bar(); }' }
        ]);
      });

      it('trims the content', () => {
        document.body.innerHTML = `
          <ol class='vtv'>
            <li>

            function foo() { return bar(); }
            </li>
          </ol>
          `;

        const result = parseUserNodes();
        const files = result[0][1];

        expect(result.length).to.equal(1);
        expect(files).to.deep.equal([
          { contents: 'function foo() { return bar(); }' }
        ]);
      });

      it('handles newlines', () => {
        document.body.innerHTML = `
          <ol class='vtv'>
            <li>
              function foo() {
                return bar();
              }
            </li>
          </ol>
          `;

        const result = parseUserNodes();
        const files = result[0][1];

        expect(result.length).to.equal(1);
        expect(files).to.deep.equal([
          {
            contents:
              'function foo() {\n                return bar();\n              }'
          }
        ]);
      });
    });

    describe('parsing the `selected` option', () => {
      it('parses the option from the file node', () => {
        document.body.innerHTML = `
          <ol class='vtv'>
            <li data-selected=true></li>
          </ol>
          `;

        const result = parseUserNodes();
        const files = result[0][1];

        expect(result.length).to.equal(1);
        expect(files).to.deep.equal([{ selected: true }]);
      });

      it('handles string values', () => {
        document.body.innerHTML = `
          <ol class='vtv'>
            <li data-selected="true"></li>
          </ol>
          `;

        const result = parseUserNodes();
        const files = result[0][1];

        expect(result.length).to.equal(1);
        expect(files).to.deep.equal([{ selected: true }]);
      });

      it('is case insensitive', () => {
        document.body.innerHTML = `
          <ol class='vtv'>
            <li data-selected=TrUe></li>
          </ol>
          `;

        const result = parseUserNodes();
        const files = result[0][1];

        expect(result.length).to.equal(1);
        expect(files).to.deep.equal([{ selected: true }]);
      });

      it('defaults to `null` for anything else', () => {
        document.body.innerHTML = `
          <ol class='vtv'>
            <li data-selected=false></li>
          </ol>
          `;

        const result = parseUserNodes();
        const files = result[0][1];

        expect(result.length).to.equal(1);
        /*
         * `null`/blank values are removed from the option
         * automatically, resulting in an empty object
         */
        expect(files).to.deep.equal([{}]);
      });
    });

    describe('parsing the `language` option', () => {
      it('parses the option from the parent node', () => {
        document.body.innerHTML = `
          <ol class='vtv' data-language="java">
            <li></li>
          </ol>
          `;

        const result = parseUserNodes();
        const files = result[0][1];

        expect(result.length).to.equal(1);
        expect(files).to.deep.equal([{ language: 'java' }]);
      });

      it('overrides with any value set on the file node', () => {
        document.body.innerHTML = `
          <ol class='vtv' data-language="java">
            <li data-language="javascript"></li>
          </ol>
          `;

        const result = parseUserNodes();
        const files = result[0][1];

        expect(result.length).to.equal(1);
        expect(files).to.deep.equal([{ language: 'javascript' }]);
      });
    });

    describe('parsing the `style` option', () => {
      it('parses the option from the parent node', () => {
        document.body.innerHTML = `
          <ol class='vtv' data-style="monokai">
            <li></li>
          </ol>
          `;

        const result = parseUserNodes();
        const files = result[0][1];

        expect(result.length).to.equal(1);
        expect(files).to.deep.equal([{ style: 'monokai' }]);
      });

      it('overrides with any value set on the file node', () => {
        document.body.innerHTML = `
          <ol class='vtv' data-style="monokai">
            <li data-style="yuri"></li>
          </ol>
          `;

        const result = parseUserNodes();
        const files = result[0][1];

        expect(result.length).to.equal(1);
        expect(files).to.deep.equal([{ style: 'yuri' }]);
      });
    });

    it('correctly parses multiple parent nodes', () => {
      document.body.innerHTML = `
        <ol class='vtv'>
          <li data-path="alpha/beta.js"></li>
        </ol>

        <ol class='vtv'>
          <li data-path="gamma/delta.js"></li>
        </ol>
        `;

      const result = parseUserNodes();
      expect(result.length).to.equal(2);

      let files = result[0][1];

      expect(files).to.deep.equal([{ path: 'alpha/beta.js' }]);

      files = result[1][1];

      expect(files).to.deep.equal([{ path: 'gamma/delta.js' }]);
    });

    it('correctly parses multiple file nodes', () => {
      document.body.innerHTML = `
        <ol class='vtv'>
          <li data-path="alpha/beta.js"></li>
          <li data-path="gamma/delta.js"></li>
        </ol>
        `;

      const result = parseUserNodes();
      const files = result[0][1];

      expect(result.length).to.equal(1);
      expect(files).to.deep.equal([
        { path: 'alpha/beta.js' },
        { path: 'gamma/delta.js' }
      ]);
    });

    it('only parses file nodes which are direct children of the parent node', () => {
      document.body.innerHTML = `
        <ol class='vtv'>
          <li data-path="alpha/beta.js"></li>
          <div>
            <li data-path="gamma/delta.js"></li>
          </div>
        </ol>
        `;

      const result = parseUserNodes();
      const files = result[0][1];

      expect(result.length).to.equal(1);
      expect(files).to.deep.equal([{ path: 'alpha/beta.js' }]);
    });

    it('ignores parent nodes that already have the `.vtv-wrapper` class', () => {
      document.body.innerHTML = `
        <ol class='vtv vtv-wrapper'>
          <li data-path="alpha/beta.js"></li>
        </ol>
        `;

      const result = parseUserNodes();
      expect(result.length).to.equal(0);
    });
  });

  describe('replacing user node with a mount node', () => {
    it('replaces the user nodes with a mount nodes', () => {
      document.body.innerHTML = `
        <ol class='vtv'><li></li></ol>
        <ol class='vtv'><li></li></ol>
        `.trim();

      parseUserNodes();

      expect(document.body.innerHTML).to.eql(
        `
        <div id="vtv--1" class="vtv vtv-wrapper"></div>
        <div id="vtv--2" class="vtv vtv-wrapper"></div>
        `.trim()
      );
    });

    describe('user node already has an `id` specified', () => {
      it('preserves the original `id` value', () => {
        document.body.innerHTML = `
          <ol class='vtv'><li></li></ol>
          <ol id='foo' class='vtv'><li></li></ol>
          `.trim();

        parseUserNodes();

        expect(document.body.innerHTML).to.eql(
          `
          <div id="vtv--1" class="vtv vtv-wrapper"></div>
          <div id="foo" class="vtv vtv-wrapper"></div>
          `.trim()
        );
      });
    });

    describe('user node has a `.vtv-wrapper` class set', () => {
      it('does not process the user node', () => {
        document.body.innerHTML =
          `<ol class="vtv vtv-wrapper"><li></li></ol>`.trim();

        parseUserNodes();

        expect(document.body.innerHTML).to.eql(
          `<ol class="vtv vtv-wrapper"><li></li></ol>`.trim()
        );
      });
    });

    describe('user node has other classes set', () => {
      it('preserves the original class list', () => {
        document.body.innerHTML = `
          <ol class='vtv'><li></li></ol>
          <ol class='vtv foo bar'><li></li></ol>
          `.trim();

        parseUserNodes();

        expect(document.body.innerHTML).to.eql(
          `
          <div id="vtv--1" class="vtv vtv-wrapper"></div>
          <div id="vtv--2" class="vtv foo bar vtv-wrapper"></div>
          `.trim()
        );
      });
    });
  });
});
