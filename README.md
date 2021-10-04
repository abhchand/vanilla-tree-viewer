<div align="center">
  <h1>vanilla-tree-viewer</h1>

  <a href="https://github.com/abhchand/vanilla-tree-viewer">
    <img
      width="100"
      alt="binoculars"
      src="https://raw.githubusercontent.com/abhchand/vanilla-tree-viewer/master/meta/logo.png"
    />
  </a>

  <p>`VanillaTreeViewer` is a minimalist file browser for compactly displaying several files at once</p>
</div>

---

[![Build Status][ci-badge]][ci] [![NPM Version][npm-version-badge]][npm-version] [![MIT License][license-badge]][license] [![PRs Welcome][prs-badge]][prs]

[![Watch on GitHub][github-watch-badge]][github-watch]
[![Star on GitHub][github-star-badge]][github-star]
[![Tweet][twitter-badge]][twitter]

Show off multiple files or code snippets in an elegant and space saving way.

Perfect for blog posts ([like this one](https://abhchand.me/blog/use-react-in-rails-without-the-react-rails-gem)), tutorials, documentation, etc...

* [view a live demo](https://abhchand.me/vanilla-tree-viewer)
* [view this project on npm](https://www.npmjs.com/package/vanilla-tree-viewer)

<img src="meta/demo.png" />


### Benefits

* Lightweight
  * built with pure JavaScript
  * only 1 dependency! `VanillaTreeViewer` uses the wonderful [highlight.js](https://highlightjs.org/) library for syntax highlighting
* Mobile-friendly
* Easily customize-able syntax highlighting and component styling
* Well tested

# Table of Contents

- [3-Step Quick Start](#three-step-quick-start)
  - [`<script>` tag placement](#script-tag-placement)
- [Syntax Highlighting](#syntax-highlighting)
  - [Default Language Support](#default-language-support)
  - [Highlighting Other Languages](#highlighting-other-languages)
- [Configuration](#configuration)
  - [`id`](#config-id)
  - [`files`](#config-files)
  - [`options`](#config-options)
- [Customization](#customization)
  - [Configuring Width and Alignment](#configuring-width-and-alignment)
  - [Customizing Styling](#customizing-styling)
- [Development](#development)
- [Building Releases](#building-releases)
- [Issues / Contributing](#issues-contributing)
- [Changelog](#changelog)

# <a name="three-step-quick-start"></a>3-Step Quick Start

Import the latest **script** and **styling** from our CDN ([See all available versions](https://cdn.jsdelivr.net/gh/abhchand/vanilla-tree-viewer@master/dist/))

```html
<head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/abhchand/vanilla-tree-viewer@1.0.0/dist/main.min.css" >
  <script type="text/javascript" src="https://cdn.jsdelivr.net/gh/abhchand/vanilla-tree-viewer@1.0.0/dist/index.min.js"></script>
</head>
```

Define one or more DOM nodes (with unique `id`s) on which to render a new viewer.

```html
<div id='my-viewer'></div>
```

At the bottom of your page, include a `<script>` tag that defines the list of files and initializes the viewer.

```html
<script>
  const files = [
    {
      path: 'lib/axios.js',
      url: 'https://raw.githubusercontent.com/axios/axios/master/lib/axios.js'
    },
    {
      path: 'package.json',
      url: 'https://raw.githubusercontent.com/axios/axios/master/package.json',
      // Overrides the 'global' options below, just for this specific file
      options: { language: 'json' }
    }
  ];

  new VanillaTreeViewer(
    'my-viewer',
    files,
    { language: 'javascript' }
  ).render();
</script>
```

For a fully functioning copy-pastable example that you can also run locally, see [`examples/simple.html`](https://github.com/abhchand/vanilla-tree-viewer/blob/master/examples/simple.html)

### <a name="script-tag-placement"></a>`<script>` tag placement

In the above code snippet we placed our `<script>` tag at the end so the script runs _after_ our DOM node `#my-viewer` has rendered.

Alternately you can place the `<script>` tag at the top and have it wait till the DOM content is loaded:

```js
document.addEventListener('DOMContentLoaded', function() {
  // Include script content from above here
}, false);
```

# <a name="syntax-highlighting"></a>Syntax Highlighting

`VanillaTreeViewer` uses the wonderful [highlight.js](https://highlightjs.org/) library for syntax highlighting.

See the [full list of language syntax definitions](https://cdnjs.com/libraries/highlight.js/10.4.1) supported by `highlight.js`.

## <a name="default-language-support"></a>Defalt Language Support

To keep the bundle size small, `VanillaTreeViewer` supports syntax highlighting for only the most common languages by default.

If you're highlighting files in any of these languages, there's no further action required.

* bash
* c
* cpp
* csharp
* css
* diff
* go
* java
* javascript
* json
* makefile
* xml
* markdown
* objectivec
* php
* php-template
* plaintext
* python
* ruby
* rust
* scss
* shell
* sql
* typescript
* yaml

## <a name="highlighting-other-languages"></a>Highlighting Other Languages

If you require syntax highlighting for any language not supported by default, you'll have to manually include the syntax definitions from `Highlight.js`.

See the [available list of language syntax definitions](https://cdnjs.com/libraries/highlight.js/10.4.1) supported by `highlight.js`.

For **example**, highlighting ActionScript:

```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/abhchand/vanilla-tree-viewer@1.0.0/dist/index.min.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.4.1/languages/actionscript.min.js"></script>
```

Be sure to include the syntax highlighting definition(s) _after_ the `VanillaTreeViewer` `<script>`.


# <a name="configuration"></a>Configuration

```js
var viewer = new VanillaTreeViewer(id, files, options);
viewer.render();
```

### <a name="config-id"></a>`id`

A `String` representing the HTML `id` of the DOM node the viewer will be rendered under.

You can render multiple instances of the viewer, but keep in mind -

* Each instance needs to have a unique HTML `id`
* You'll need to instantiate a new `VanillaTreeViewer` object and call `render()` for each instance of the viewer

### <a name="config-files"></a>`files`

`VanillaTreeViewer` expects an **array of objects** (`files = [{}, {}, ...]`) defining the list of files to display.

Each file object can have the following keys:

| Key  | Type | Required? | Description
| ------------- | ------------- | ------------- | ------------- |
| `url`  | `String` | Yes  | The URL to fetch the file contents from (e.g. Github Raw URLs). A simple GET request is performed to fetch file contents |
| `path`  | `String` | Yes  | The path under which the file should be displayed in the viewer tree |
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

# <a name="customization"></a>Customization

### <a name="configuring-width-and-alignment"></a>Configuring Width and Alignment

By default `VanillaTreeViewer` takes the full width of the DOM container element it's mounted on to. It is recommended that you style this DOM element accordingly to set the desired width and alignment.

Here is one approach that handles styling for all mount nodes:

```html
<head>
  <style>
    .vtv-mount-node {
      margin: auto;
      max-width: 980px;
    }
  </style>
</head>
<body>
  <div id='my-viewer' class='vtv-mount-node'></div>
</body>
```

### <a name="customizing-styling"></a>Customizing Styling

The default styling for `VanillaTreeViewer` is based off the look and feel of [Sublime Text](https://www.sublimetext.com/).

`VanillaTreeViewer` does not provide a programmatic way to customize the component itself, however you  are free to customize the look and feel as needed by overriding [the CSS](https://cdn.jsdelivr.net/gh/abhchand/vanilla-tree-viewer@1.0.0/dist/main.min.css) for the `VanillaTreeViewer` component.

* All top-level CSS classes begin with `.vtv*`
* Please be aware that the default styling utilizes [media queries](https://www.w3schools.com/css/css_rwd_mediaqueries.asp) to apply styling at different screen widths.

# <a name="development"></a>Development

If you'd like to edit or develop the component locally, you can run:

```bash
git clone https://github.com/abhchand/vanilla-tree-viewer.git

yarn install
yarn run dev
```

This will open `http://localhost:3035` in a browser window. Any changes made to the `src/` or to the `demo/index.jsx` file will be hot reloaded.

# <a name="building-releases"></a>Building Releases

1. Install `np` globally: `yarn global add np`
2. For non-beta releases, manually update README and other version references to the latest (upcoming) version. Do not update `package.json` - that will be updated by `np` automatically.
3. Build: `yarn run build`
4. Commit the above changes and `git push` to `master`
5. Create new version: `np`

# <a name="issues-contributing"></a>Issues / Contributing

- If you have an issue or feature request, please [open an issue here](https://github.com/abhchand/vanilla-tree-viewer/issues/new).

- Contribution is encouraged! But please open an issue first to suggest a new feature and confirm that it will be accepted before filing a pull request.

You can also help support this project. If you've found this or any other of my projects useful, I would greatly appreciate if you could [buy me a coffee](https://www.buymeacoffee.com/abhchand)!

# <a name="changelog"></a>Changelog

See [release notes](https://github.com/abhchand/vanilla-tree-viewer/releases)

[ci-badge]:
  https://circleci.com/gh/abhchand/vanilla-tree-viewer/tree/master.svg?style=svg
[ci]:
  https://circleci.com/gh/abhchand/vanilla-tree-viewer/tree/master
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
