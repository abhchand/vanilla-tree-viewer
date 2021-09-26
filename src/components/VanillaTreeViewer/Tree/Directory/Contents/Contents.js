import './Contents.scss';

import * as File from './File/File';
import Directory from '../Directory';
import { renderComponent } from 'components/VanillaTreeViewer/Helpers/renderComponent';

class Contents {
  constructor(props) {
    this.props = props;

    this.children = this.children.bind(this);
    this.directories = this.directories.bind(this);
    this.files = this.files.bind(this);
    this.renderDirectory = this.renderDirectory.bind(this);
    this.renderFile = this.renderFile.bind(this);
    this.render = this.render.bind(this);
  }

  children() {
    const { parentPath, tree } = this.props;

    return tree[parentPath].childPaths.map((childPath) => tree[childPath]);
  }

  directories() {
    return this.children()
      .filter((child) => child.type === 'directory')
      .sort((dir) => dir.name);
  }

  files() {
    return this.children()
      .filter((child) => child.type === 'file')
      .sort((file) => file.name);
  }

  renderDirectory(directory) {
    const {
      indent,
      tree,
      updateSelectedPath,
      selectedFileId,
      toggleDirectory
    } = this.props;

    return renderComponent(Directory, {
      tree: tree,
      path: directory.path,
      indent: indent,
      toggleDirectory: toggleDirectory,
      updateSelectedPath: updateSelectedPath,
      selectedFileId: selectedFileId
    });
  }

  renderFile(file) {
    const { selectedFileId, updateSelectedPath, indent } = this.props;

    return renderComponent(File, {
      file: file,
      updateSelectedPath: updateSelectedPath,
      isSelected: selectedFileId === file.id,
      indent: indent
    });
  }

  render() {
    let items = [];

    this.directories().forEach((directory) => {
      items = items.concat(this.renderDirectory(directory));
    });

    this.files().forEach((file) => {
      items.push(this.renderFile(file));
    });

    return items;
  }
}

export default Contents;
