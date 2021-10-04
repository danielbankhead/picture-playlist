/**
 * Utility for extracting data from 'package.json'
 */

import {readFile} from 'fs/promises';
import {URL} from 'url';

/**
 * Import `package.json`
 * @link https://nodejs.org/api/esm.html#esm_no_json_module_loading
 */
const data = await readFile(
  new URL('../../../../package.json', import.meta.url)
);

export const packageJson = JSON.parse(data.toString());
