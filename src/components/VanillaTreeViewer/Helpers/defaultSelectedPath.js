function defaultSelectedPath(files) {
  const defaultFile = files.filter((f) => f.selected)[0];

  return (defaultFile || files[0]).path;
}

export default defaultSelectedPath;
