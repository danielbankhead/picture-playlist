import {URL} from 'url';

import chalk from 'chalk';
import terminalLink from 'terminal-link';

import {generatePlaylistFromImage} from '../image-playlist-generator';
import {Awaited} from './types.js';

/**
 * Prints results in a nice format, varying by output source.
 *
 * @param results Results from processing the image
 * @param log A function for pass output. This is called per-line.
 */
function prettyPrintImagePlaylist(
  results: Awaited<ReturnType<typeof generatePlaylistFromImage>>,
  log: (s: string) => unknown = s => process.stdout.write(s + '\n')
) {
  // Print image contents
  log(chalk.bold('Contents:'));
  for (const label of results.labels) {
    log(`- ${label.description}`);
  }
  log('');

  // Print image colors
  log(chalk.bold('Colors:'));
  for (const {color} of results.colors) {
    const red = color?.red;
    const green = color?.green;
    const blue = color?.blue;
    const alpha = color?.alpha?.value || 1;

    const line = `• rgba(${red}, ${green}, ${blue}, ${alpha})`;
    const chalked = chalk`{bold.rgb(${red},${green},${blue}) ${line}}`;

    log(chalked);
  }
  log('');

  // Print playlist recommendations
  log(chalk.bold('Playlist Recommendation:'));
  for (const item of results.ytResults) {
    const u = new URL('https://youtube.com/watch');
    u.searchParams.set('v', item.id?.videoId || '');

    const title = chalk.underline(item.snippet?.title);
    const channel = chalk(item.snippet?.channelTitle);
    const description = chalk.italic(item.snippet?.description);
    const publishedAt = chalk.dim(item.snippet?.publishedAt);
    const link = terminalLink('link', u.href);

    log(`- ${title}`);
    log(`\t- channel: ${channel}`);
    log(`\t- description: ${description}`);
    log(`\t- published: ${publishedAt}`);
    log(`\t- ${link}`);
  }
  log('');
}

export {prettyPrintImagePlaylist};
