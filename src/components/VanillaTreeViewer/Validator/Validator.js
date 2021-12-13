import {
  hljs,
  HLJS_LANGUAGES,
  HLJS_VERSION
} from 'components/VanillaTreeViewer/hljs';
import { normalizePath } from 'components/VanillaTreeViewer/Tree/Builder/Builder';

function filesIsArray(files) {
  return typeof files === 'object' && files !== null;
}

function hasAtLeasOneFile(files) {
  return files.length > 0;
}

function allFilesHaveRequiredKey(files) {
  let badFileCount = 0;

  files.forEach((file) => {
    if (!file.path || (file.path || '').length === 0) {
      badFileCount += 1;
    }
  });

  return badFileCount === 0;
}

function hasUrlOrContentsPresent(files) {
  let badFileCount = 0;

  files.forEach((file) => {
    if ((file.url || '').length === 0 && (file.contents || '').length === 0) {
      badFileCount += 1;
    }
  });

  return badFileCount === 0;
}

/*
 * Verifies whether all combinations of subpaths are compatible and
 * unambiguous.
 *
 * For example, the following list of paths is NOT valid:
 *
 *  * /alpha/beta/gamma.rb
 *  * /alpha/BETA/delta.rb
 *
 * Since directories are case-sensitive, we have an ambigous definition
 * of `/alpha/beta` vs `/alpha/BETA`.
 */
function allFilesHaveUnambiguousSubPaths(files) {
  let subpaths = new Set();

  /*
   * Build a cumulative list of every subsubpath, case sensitively
   *
   *  INPUT:
   *  '/alpha/BETA/gamma.rb' will result in:
   *
   *  OUTPUT:
   *  [
   *    '/',
   *    '/alpha',
   *    '/alpha/BETA'
   *  ]
   */
  files.forEach((file) => {
    const segments = normalizePath(file.path).split('/');

    // Ignore the filename, which is the last segment
    segments.pop();

    let builder = '';

    segments.forEach((segment) => {
      builder += `/${segment}`;
      subpaths.add(builder);
    });
  });

  /*
   * Check if all values are case sensitively unique. If they
   * are not, at least one subpath exists with multiple cases
   * (e.g. '/foo/bar' vs '/foo/BAR')
   */
  subpaths = Array.from(subpaths).map((p) => p.toLowerCase());
  const uniqueSubpaths = subpaths.filter(
    (value, idx, self) => self.indexOf(value) === idx
  );

  return uniqueSubpaths.length === subpaths.length;
}

/*
 * Verifies that all `path` values are unique, regardless of case.
 * For example, the following is not valid
 *
 *  * /alpha/beta/gamma.rb
 *  * /alpha/beta/GAMMA.rb
 *
 * A previous validation already checks for unambiguous directories,
 * so we don't have to re-check that here. We just need
 * to verify that no two paths differ by only their case.
 */
function allFilesHaveUniquePaths(files) {
  const paths = files.map((file) => file.path.toLowerCase());
  const uniquePaths = paths.filter(
    (value, idx, self) => self.indexOf(value) === idx
  );

  return uniquePaths.length === paths.length;
}

function allLanguagesValid(files) {
  const invalidLanguages = [];

  files.forEach((file) => {
    const lang = file.language;

    if (lang && HLJS_LANGUAGES.indexOf(lang) < 0) {
      invalidLanguages.push(lang);
    }
  });

  return invalidLanguages.length === 0;
}

function anyLanguagesUncommon(files) {
  const uncommonLanguages = [];
  const registeredLanguages = hljs.listLanguages();

  files.forEach((file) => {
    const lang = file.language;

    if (lang && registeredLanguages.indexOf(lang) < 0) {
      uncommonLanguages.push(lang);
    }
  });

  return uncommonLanguages.length === 0;
}

function handleFilesIsNotArray() {
  return {
    isValid: false,
    error: '`files` must be an array'
  };
}

function handleMissingFiles() {
  return {
    isValid: false,
    error: '`files` must contain at least one file'
  };
}

function handleFilesMissingRequiredKeys() {
  return {
    isValid: false,
    error: 'Each `file` must have a non-empty `path`'
  };
}

function handleUrlOrContentsBlank() {
  return {
    isValid: false,
    error:
      'Each `file` must have at least one of the following set: `url`, `contents`'
  };
}

function handleFilesHaveAmbiguousSubpaths() {
  return {
    isValid: false,
    error: `One or more \`path\` values have ambiguous directory names.

For example:

  * /alpha/beta/gamma.txt
  * /alpha/BETA/delta.text

Since directories are case sensitive, this produces an ambiguous definition of '/alpha/beta/' vs '/alpha/BETA'.`
  };
}

function handleFilesHaveDuplicatePaths() {
  return {
    isValid: false,
    error: 'Each `file` must have a unique `path` value (case insensitive)'
  };
}

function handleFilesHaveInvalidLanguage() {
  return {
    isValid: false,
    error: 'Unknown value for option `language`.'
  };
}

function handleUncommonLanguages() {
  return {
    isValid: false,
    error: `Unregistered language detected.

By default, VanillaTreeViewer supports syntax highlighting (through highlight.js) only for commonly used languages.
For less common languages, you will have to register it with \`hljs\` manually

Example for ActionScript:
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/${HLJS_VERSION}/languages/actionscript.min.js"></script>

Ensure that this script loads *after* VanillaTreeViewer

All language scripts can be found here:
https://cdnjs.com/libraries/highlight.js/${HLJS_VERSION}
`
  };
}

function validateFiles(files) {
  if (!filesIsArray(files)) {
    return handleFilesIsNotArray();
  }
  if (!hasAtLeasOneFile(files)) {
    return handleMissingFiles();
  }
  if (!allFilesHaveRequiredKey(files)) {
    return handleFilesMissingRequiredKeys();
  }
  if (!hasUrlOrContentsPresent(files)) {
    return handleUrlOrContentsBlank();
  }
  if (!allFilesHaveUnambiguousSubPaths(files)) {
    return handleFilesHaveAmbiguousSubpaths();
  }
  if (!allFilesHaveUniquePaths(files)) {
    return handleFilesHaveDuplicatePaths();
  }
  if (!allLanguagesValid(files)) {
    return handleFilesHaveInvalidLanguage();
  }
  if (!anyLanguagesUncommon(files)) {
    return handleUncommonLanguages();
  }

  return { isValid: true };
}

export { validateFiles };
