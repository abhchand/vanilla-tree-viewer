<div align="center">
  <h1>vanilla-tree-viewer</h1>

  <a href="https://github.com/abhchand/vanilla-tree-viewer">
    <img
      width="100"
      alt="binoculars"
      src="https://raw.githubusercontent.com/abhchand/vanilla-tree-viewer/master/meta/logo.png"
    />
  </a>

  <p>Vanilla Tree Viewer is a minimalist file browser for easily sharing several files at once</p>
</div>

---

[![Build Status][ci-badge]][ci] [![NPM Version][npm-version-badge]][npm-version] [![MIT License][license-badge]][license] [![PRs Welcome][prs-badge]][prs]

[![Watch on GitHub][github-watch-badge]][github-watch]
[![Star on GitHub][github-star-badge]][github-star]
[![Tweet][twitter-badge]][twitter]


Want to show off multiple files or code snippets in an elegant and space saving way?

`VanillaTreeViewer` is a minimalist file browser for easily sharing several files at once.

Perfect for blog posts, tutorials, documentation, etc...

You can [view a live demo here](https://abhchand.me/vanilla-tree-viewer) or [view this project on npm here](https://www.npmjs.com/package/vanilla-tree-viewer)


<img src="meta/demo.png" />


### Features

* Lightweight (built with pure JavaScript!)
* Only 1 dependency - `VanillaTreeViewer` uses the wonderful [highlight.js](https://highlightjs.org/) library for syntax highlighting.
* Mobile friendly out of the box
* Easily customize-able syntax highlighting and component styling
* Well tested

# Table of Contents

- [Quick Start](#quick-start)
  - [A note on `<script>` tag placement](#a-note-on-script-tag-placement)
- [Configuration](#configuration)
  - [`id`](#config-id)
  - [`files`](#config-files)
  - [`options`](#config-options)
  - [Less Common Languages](#less-common-languages)
  - [Customizing `VanillaTreeViewer`'s styling](#customizing-vanilla-tree-viewers-styling)
- [Development](#development)
- [Issues / Contributing](#issues-contributing)
- [Changelog](#changelog)

# <a name="quick-start"></a>Quick Start

Import the latest VanillaTreeViewer **script** and **styling** from our CDN ([See all available versions](https://cdn.jsdelivr.net/gh/abhchand/vanilla-tree-viewer@master/dist/))

```erb
<head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/abhchand/vanilla-tree-viewer@1.0.0-beta.2/dist/main.min.css" >
  <script type="text/javascript" src="https://cdn.jsdelivr.net/gh/abhchand/vanilla-tree-viewer@1.0.0-beta.2/dist/index.min.js"></script>
</head>
```

Define a DOM node on which to render a new viewer. You can define multiple viewers and DOM nodes, as long as they each have a unique `id`.

```erb
<body>
  <div id='my-viewer'></div>
</body>
```

At the bottom of your page, include a `<script>` tag that defines the list of files and initializes the viewer.

```erb
<script>
  const files = [
    {
      path: 'src/index.js',
      url: 'https://raw.githubusercontent.com/nmn/react-timeago/master/src/index.js'
    },
    {
      path: '/package.json',
      url: 'https://raw.githubusercontent.com/nmn/react-timeago/master/package.json',
      // Override the shared options for this specific file
      options: { language: 'json' }
    }
  ];

  var sharedOptions = { language: 'javascript' }

  var viewer = new VanillaTreeViewer('my-viewer', files, sharedOptions);
  viewer.render();
</script>
```

For a fully functioning copy-pastable example that you can also run locally, see [`examples/simple.html`](https://github.com/abhchand/vanilla-tree-viewer/blob/master/examples/simple.html)

### <a name="a-note-on-script-tag-placement"></a>A note on `<script>` tag placement

In the above code snippet we placed our `<script>` tag at the end so the script runs _after_ our DOM node `#my-viewer` has rendered.

Alternately you can place the `<script>` tag at the top and have it wait till the DOM content is loaded:

```js
document.addEventListener('DOMContentLoaded', function() {
  // Include script content from above here
}, false);
```

# <a name="configuration"></a>Configuration

```
var viewer = new VanillaTreeViewer(id, files, options);
viewer.render();
```

### <a name="config-id"></a>`id`

A `String` representing the HTML `id` of the DOM node the viewer will be rendered under.

You can render multiple instances of the viewer, but keep in mind -

* Each instance needs to have a unique HTML `id`
* You'll need to instantiate a new `VanillaTreeViewer` object and call `render()` for each instance of the viewer

### <a name="config-files"></a>`files`

`VanillaTreeViewer` expects an array of objects (`files = [{}, {}, ...]`) defining the list of files to display.

Each file object can have the following keys:

| Key  | Type | Required? | Description
| ------------- | ------------- | ------------- | ------------- |
| `path`  | `String` | Yes  | The path under which the file should be displayed in the viewer tree |
| `url`  | `String` | Yes  | The URL to fetch the file contents from (e.g. Github Raw URLs). A simple GET request is performed to fetch file contents |
| `selected` | `Boolean` | No | Indicates whether this file should be selected when the viewer loads. If more than one file is marked `selected: true`, the first one is chosen. Similarly, if no file is marked `selected: true`, the first file in the list will be selected by default.
| `options` | `Object{}` | No | File-level options that will apply only to this file. See `options` below for a full list of supported options |


### <a name="config-options"></a>`options`

The `options` are -

| Key  | Type | Default | Description
| ------------- | ------------- | ------------- | ------------- |
| `language` | `String` | `null` | The `highlight.js` language to use for syntax highlighting. [See a full list of supported languages](https://github.com/highlightjs/highlight.js/tree/master/src/languages).
| `style` | `String` | `'monokai-sublime'` | The `highlight.js` style (color theme) to use for syntax highlighting. [See a full list of supported styles](https://github.com/highlightjs/highlight.js/tree/master/src/styles).

**NOTE**: The [`highlight.js` demo page](https://highlightjs.org/static/demo/) will let you preview various languages and styles.

Options can be defined per file or as a shared set of options passed to `VanillaTreeViewer`. For each file, options are evaluated in the following order of precedence:

1. File level options
2. Shared options
3. Default options

### <a name="less-common-languages"></a>Less Common Languages

To keep the bundle size small, `Highlight.js` ships with language support for only the most common languages by default. See the [Common Languages outlined here](https://highlightjs.org/download/)

If you require syntax highlighting for a less common language, you'll have to include the syntax definitions from `Highlight.js` manually (which uses CDN JS for hosting).

Be sure to include this _after_ sourcing the `VanillaTreeViewer` script

Example for ActionScript:

```erb
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/abhchand/vanilla-tree-viewer@1.0.0-beta.2/dist/index.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.1.0/languages/actionscript.min.js">
```

You can find the full list of language syntax definitions maintained by `highlight.js` [here](https://cdnjs.com/libraries/highlight.js/10.1.1).

### <a name="customizing-vanilla-tree-viewers-styling"></a>Customizing `VanillaTreeViewer`'s styling

The default styling for `VanillaTreeViewer` is based off the look and feel of [Sublime Text](https://www.sublimetext.com/).

`VanillaTreeViewer` does not provide a programmatic way to customize the component itself, but if you need to customize the look and feel further you can easily override the CSS for the `VanillaTreeViewer` component.

The component layout itself is fairly simple as it's just a few `<div>`s of content. Additionally, all css classes begin with `.vanilla-tree-viewer*` as a prefix.

# <a name="development"></a>Development

If you'd like to edit or develop the component locally, you can run:

```
git clone https://github.com/abhchand/vanilla-tree-viewer.git

yarn install
yarn run dev
```

This will open `http://localhost:3035` in a browser window. Any changes made to the `src/` or to the `demo/index.jsx` file will be hot reloaded.

# <a name="issues-contributing"></a>Issues / Contributing

- If you have an issue or feature request, please [open an issue here](https://github.com/abhchand/vanilla-tree-viewer/issues/new).

- Contribution is encouraged! But please open an issue first to suggest a new feature and confirm that it will be accepted before filing a pull request.

You can also help support this project. If you've found this or any other of my projects useful, I would greatly appreciate if you could [buy me a coffee](https://www.buymeacoffee.com/abhchand)!

# <a name="changelog"></a>Changelog

See [release notes](https://github.com/abhchand/vanilla-tree-viewer/releases)

[ci-badge]:
  https://img.shields.io/travis/abhchand/vanilla-tree-viewer/master?style=flat-square
[ci]:
  https://travis-ci.org/abhchand/vanilla-tree-viewer
[npm-version-badge]:
  https://img.shields.io/npm/v/vanilla-tree-viewer.svg?style=flat-square
[npm-version]:
  https://www.npmjs.com/package/vanilla-tree-viewer
[license-badge]:
  https://img.shields.io/npm/l/vanilla-tree-viewer.svg?style=flat-square
[license]:
  https://github.com/abhchand/vanilla-tree-viewer/blob/master/LICENSE
[prs-badge]:
  https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[github-watch-badge]:
  https://img.shields.io/github/watchers/abhchand/vanilla-tree-viewer.svg?style=social
[github-watch]: https://github.com/abhchand/vanilla-tree-viewer/watchers
[github-star-badge]:
  https://img.shields.io/github/stars/abhchand/vanilla-tree-viewer.svg?style=social
[github-star]: https://github.com/abhchand/vanilla-tree-viewer/stargazers
[twitter]:
  https://twitter.com/intent/tweet?text=Check%20out%20vanilla-tree-viewer%20by%20%40YeaaaahBoiiii%20https%3A%2F%2Fgithub.com%2Fabhchand%2Fvanilla-tree-viewer%20%F0%9F%91%8D
[twitter-badge]:
  https://img.shields.io/twitter/url/https/github.com/abhchand/vanilla-tree-viewer.svg?style=social
