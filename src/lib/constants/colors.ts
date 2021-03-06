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
 * A mapping of colors by name to RGB value
 */
const colors = {
  Black: [0, 0, 0],
  White: [255, 255, 255],
  Red: [255, 0, 0],
  Lime: [0, 255, 0],
  Blue: [0, 0, 255],
  Yellow: [255, 255, 0],
  /** alias: Aqua */
  Cyan: [0, 255, 255],
  /** alias: Magenta */
  Fuchsia: [255, 0, 255],
  Silver: [192, 192, 192],
  Gray: [128, 128, 128],
  Maroon: [128, 0, 0],
  Olive: [128, 128, 0],
  Green: [0, 128, 0],
  Purple: [128, 0, 128],
  Teal: [0, 128, 128],
  Navy: [0, 0, 128],
} as const;

export {colors};
