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
import {resolvePathOrURLStringToURL} from './utils/path.js';

import {determineImageLabels, determineImageColors} from './vision.js';
import {searchYoutubeMusic} from './youtube.js';

async function generatePlaylistFromImage(url: string | URL) {
  if (!(url instanceof URL)) {
    url = resolvePathOrURLStringToURL(url);
  }

  const [labels, colors] = await Promise.all([
    determineImageLabels(url),
    determineImageColors(url),
  ]);

  const keywords: string[] = [];

  for (const label of labels) {
    if (label.description) keywords.push(label.description);
  }

  // TODO: get 'theme', 'mood', etc. by color
  // import ... from './constants/colors.js'
  // TODO: consider treating as vector when calculating mood/theme
  // for (const color of colors) {
  //   if (color.color) keywords.push(color.color);
  // }

  const ytResults = await searchYoutubeMusic(keywords);

  return {ytResults, labels, colors};
}

export {generatePlaylistFromImage};
