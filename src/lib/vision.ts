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

import vision from '@google-cloud/vision';

const client = new vision.ImageAnnotatorClient();
await client.initialize();

/**
 * Converts URLs to format ready for the Vision client.
 *
 * Namely, using `pathname` for 'file:', `href` elsewhere.
 *
 * @param url URL to convert
 */
function prepareURLforVisionClient(url: URL): string {
  if (url.protocol === 'file:') {
    return url.pathname;
  }

  return url.href;
}

async function determineImageLabels(url: URL) {
  const href = prepareURLforVisionClient(url);

  const [result] = await client.labelDetection(href);
  const labels = result.labelAnnotations?.sort(
    // sort by score desc
    (a, b) => (b.score || 0) - (a.score || 0)
  );

  return labels || [];
}

async function determineImageColors(url: URL) {
  const href = prepareURLforVisionClient(url);

  const [result] = await client.imageProperties(href);
  const colors = result.imagePropertiesAnnotation?.dominantColors?.colors?.sort(
    // sort by score desc
    (a, b) => (b.score || 0) - (a.score || 0)
  );

  return colors || [];
}

export {determineImageLabels, determineImageColors};
