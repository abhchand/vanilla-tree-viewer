// See: jestjs.io/docs/configuration.html
module.exports = {
  "rootDir": "../",
  "roots": [
    "src"
  ],
  "moduleFileExtensions": [
    "js"
  ],
  "moduleDirectories": [
    "node_modules",
    "src"
  ],
  "moduleNameMapper":{
    "\\.(css|scss)$": "<rootDir>/test/__mocks__/styleMock.js"
  },
  "setupFilesAfterEnv": [
    "<rootDir>/test/jest.setup.js"
  ],
  "testEnvironment": "jsdom",
  "transform": {
    "\\.js$": "babel-jest"
  },
  "verbose": false
};
