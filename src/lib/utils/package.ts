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
