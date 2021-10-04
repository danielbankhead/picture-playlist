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

import {Arguments, Argv, CommandModule} from 'yargs';

import {generatePlaylistFromImage, logger} from '../../lib/index.js';
import {prettyPrintImagePlaylist} from '../../lib/utils/pretty-print-playlist.js';

interface Args {
  url: string;
}

async function builder(argv: Argv) {
  return argv.positional('url', {
    description:
      'the image url to check. E.g.: `gs://danielbankhead.com/original.jpg`',
    type: 'string',
    demandOption: true,
  });
}

async function handler(args: Arguments<Args>) {
  logger.debug({'cli.args': args});

  const results = await generatePlaylistFromImage(args.url);

  logger.debug({'cli.results': results});

  prettyPrintImagePlaylist(results);
}

const generatePlaylist: CommandModule<{}, Args> = {
  command: 'generate <path|url>',
  describe: 'generate a playlist given an image',
  builder,
  handler,
};

export {generatePlaylist};
