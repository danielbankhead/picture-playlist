#!/usr/bin/env node

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

import yargs from 'yargs';
import {hideBin} from 'yargs/helpers';

import {generatePlaylist} from './commands/generate-playlist.js';

async function cli(args = process.argv) {
  const results = await yargs(hideBin(args))
    .command(generatePlaylist)
    // TODO: setup `.showCompletionScript()` command
    // TODO: uncomment next line after ESM 'require.main' is resolved
    // .demandCommand()
    .parse();

  return results;
}

// TODO: wrap this under the ESM 'require.main' equivalent
// - perhaps import.meta.url compare || yargs['$0'] === package.json's bin
await cli();

export {cli};
