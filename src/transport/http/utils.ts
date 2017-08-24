export const joinPaths = (paths: string[]) => {
  let trailingSlash =
    paths[paths.length - 1].lastIndexOf('/') ===
    paths[paths.length - 1].length - 1;
  let joinedPath = paths.map(path => path.replace(/(^\/|\/$)/g, '')).join('/');
  return trailingSlash
    ? joinedPath.lastIndexOf('/') === joinedPath.length - 1
      ? joinedPath
      : joinedPath + '/'
    : joinedPath;
};

export const isURL = (s: string) => /^(http|https|ftp):\/\//.test(s);

export const queryString = (data: any) => {
  return Object.keys(data)
    .map(key => [key, data[key]].map(encodeURIComponent).join('='))
    .join('&');
};
