- [Versioning](#versioning)
  * [Contributing to a `MAJOR` or `MINOR` release](#contributing-to-a--major--or--minor--release)
  * [Contributing to a `PATCH` release](#contributing-to-a--patch--release)
- [Releasing a new Version](#releasing-a-new-version)
  * [Prepare and Build](#prepare-and-build)
  * [Merge](#merge)
  * [Release](#release)

This document describes the process for contributing and releasing features to `vanilla-tree-viewer`.

# Versioning

This project uses [semantic versioning](https://semver.org/).
Example:

```
v1.2.5
```

Larger releases may also be released as a `beta` release (also called "pre-release") to preview changes before they are committed to `master`. `beta` releases are numbered sequentially for a specific version.
Example:

```
v1.2.5-beta.1
v1.2.5-beta.2
v1.2.5-beta.3
...
```

## Contributing to a `MAJOR` or `MINOR` release

All `MAJOR` and `MINOR` versions use a *version development branch*.

E.g.

```
dev-v2.0.0
dev-v2.1.0
```

If one does not exist, you may create a new one branched from `master`, and then further branch your feature from that.

```bash
git checkout master
git pull

git checkout -b dev-v2.1.1
git push origin dev-v2.1.1

git checkout -b my-feature-branch
```

Any new feature you add should

  1. branch from the `dev-*` branch and
  2. target the `dev-*` as the merge target for Pull Requests

## Contributing to a `PATCH` release

Features containing `PATCH` releases can be branched directly from `master` and can be merged directly into `master`.

```bash
git checkout master
git pull

git checkout -b my-feature-branch
```

# Releasing a new Version

This project uses [`np`](https://www.npmjs.com/package/np) to `publish` to `npm`.
Install `np` globally:

```bash
yarn global add np
```

## Prepare and Build

On the `dev-*` branch:

  1. Search the project for all references to the current version. Manually update `README.md` and other files to the new version (e.g. `2.1.2`, `2.1.3-beta.3`)
  2. Ignore the `dist/*`, `docs/*`, and `yarn.lock` files/directories. This will be regenerated.
  3. Ignore `package.json` as well. That will be updated by `np` itself when it publishes to `npm`
  4. Run `yarn run build` to update the build
  5. Commit all the above changes with the message "Preparing to update to `X.Y.Z`". ([example commit](https://github.com/abhchand/vanilla-tree-viewer/commit/02281f6eb89866e99c462ca587509761fe768233))


## Merge

Merge the `dev-*` to `master` if you are NOT deploying a `beta-*` version.

```
git checkout master
git merge dev-v2.1.0

git push origin master
```

## Release

Prepare release notes for this version, following the guide of [previous notes on the Changelog](https://github.com/abhchand/vanilla-tree-viewer/releases). You can ignore non-code related changes like updates to the `README` or other documentation.

Create a new version by running:

```bash
np
```

At the end it will open up a window to compose a new release. Use the release notes generated above to create a new release.
