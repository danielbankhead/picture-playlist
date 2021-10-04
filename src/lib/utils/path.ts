import {URL} from 'url';

import path from 'path';

/**
 * Converts paths and url-like strings to URL objects.
 *
 * If string is already a valid URL (e.g. `https://example.com`), it will
 * simply be converted to a URL object
 *
 * If the string is not a valid URL, it will be treated as a 'file:' path
 *
 * @param filePath A string re
 */
function resolvePathOrURLStringToURL(filePath: string): URL {
  try {
    // determine if already URL-compatible
    return new URL(filePath);
  } catch {
    // resolve a potentially relative path to a URL
    return new URL(path.resolve(filePath), 'file:');
  }
}

// TODO: test: http:, https:, file:, gs: (no protocol = file)
// TODO: test: works for both full path and relative

export {resolvePathOrURLStringToURL};
