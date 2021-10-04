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
