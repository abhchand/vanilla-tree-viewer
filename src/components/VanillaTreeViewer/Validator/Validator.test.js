import { expect } from 'chai';
import { validateFiles } from './Validator';

let files;

beforeEach(() => {
  files = [
    {
      path: 'app/controllers/application_controller.rb',
      url: 'https://example.co/app/controllers/application_controller.rb',
      selected: true
    },
    {
      path: 'src/main.js',
      url: 'https://example.co/src/main.js',
      options: {
        language: 'javascript'
      }
    }
  ];
});

describe('Validator.validateFiles', () => {
  it('marks the files as valid', () => {
    const result = validateFiles(files);
    expect(result.isValid).to.be.true;
  });

  const testForInvalid = () => {
    const result = validateFiles(files);

    expect(result.isValid).to.be.false;
    expect(result.error.length).to.be.above(0);
  };

  describe('files object is undefined', () => {
    // eslint-disable-next-line
    beforeEach(() => { files = undefined; });

    it('marks the files as invalid', testForInvalid);
  });

  describe('files object is null', () => {
    beforeEach(() => { files = null; });

    it('marks the files as invalid', testForInvalid);
  });

  describe('files object is an empty object', () => {
    beforeEach(() => { files = {}; });

    it('marks the files as invalid', testForInvalid);
  });

  describe('files object is empty', () => {
    beforeEach(() => { files = []; });

    it('marks the files as invalid', testForInvalid);
  });

  describe('one ore more files is missing `path`', () => {
    beforeEach(() => { delete files[1].path; });

    it('marks the files as invalid', testForInvalid);
  });

  describe('one ore more files is missing `url`', () => {
    beforeEach(() => { delete files[1].url; });

    it('marks the files as invalid', testForInvalid);
  });

  describe('one ore more files has null `path`', () => {
    beforeEach(() => { files[1].path = null; });

    it('marks the files as invalid', testForInvalid);
  });

  describe('one ore more files has null `url`', () => {
    beforeEach(() => { files[1].url = null; });

    it('marks the files as invalid', testForInvalid);
  });

  describe('files object is duplicate paths', () => {
    beforeEach(() => { files[1].path = files[0].path; });

    it('marks the files as invalid', testForInvalid);
  });

  describe('files object is duplicate paths of different case', () => {
    beforeEach(() => { files[1].path = files[0].path.toUpperCase(); });

    it('marks the files as invalid', testForInvalid);
  });

  describe('language is invalid', () => {
    beforeEach(() => { files[1].options.language = 'foo'; });

    it('marks the files as invalid', testForInvalid);
  });

  describe('language is valid, but uncommon', () => {
    beforeEach(() => { files[1].options.language = 'actionscript'; });

    it('marks the files as invalid', testForInvalid);
  });
});
