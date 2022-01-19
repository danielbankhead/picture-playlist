/**
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
 * @param urlOrFilePath A string representing a URL or relative file path
 */
function resolvePathOrURLStringToURL(urlOrFilePath: string): URL {
  try {
    // determine if already URL-compatible
    return new URL(urlOrFilePath);
  } catch {
    // resolve a potentially relative path to a URL
    return new URL(path.resolve(urlOrFilePath), 'file:');
  }
}

// TODO: test: http:, https:, file:, gs: (no protocol = file)
// TODO: test: works for both full path and relative

export {resolvePathOrURLStringToURL};
