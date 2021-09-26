import {
  hljs,
  HLJS_LANGUAGES,
  HLJS_VERSION
} from 'components/VanillaTreeViewer/hljs';

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
    if (!file.url || (file.url || '').length === 0) {
      badFileCount += 1;
    }
  });

  return badFileCount === 0;
}

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
    if (!file.options) {
      return;
    }

    const lang = file.options.language;

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
    if (!file.options) {
      return;
    }

    const lang = file.options.language;

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
    error: 'Each `file` must have a non-empty `path` and `url`'
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
