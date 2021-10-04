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

import {CloudFunctionsContext} from '@google-cloud/functions-framework/build/src/functions';
import {Storage} from '@google-cloud/storage';

import {generatePlaylistFromImage, logger} from '../lib/index.js';
import {packageJson} from '../lib/utils/package.js';

// TODO: Create PR in `@google-cloud/functions-framework` for this block
// - See https://cloud.google.com/functions/docs/calling/storage#functions-calling-storage-go
export interface GCSFile {
  /** @example 'my-bucket' */
  bucket: string;
  /** @example 'en' */
  contentLanguage?: string;
  /** @example 'text/plain' */
  contentType: string;
  /** @example '9g/jMw==' */
  crc32c: string;
  /** @example 'CNvJmejJ9+0CEAE=' */
  etag: string;
  /** @example '1609395599729883' */
  generation: string;
  /** @example 'my-bucket/test/gcf-test.txt/1609395599729883' */
  id: string;
  /** @example 'storage#object' */
  kind: string;
  /** @example 'lXjvoF0IqXJ2Xpjrm9jGeg==' */
  md5Hash: string;
  /** @example 'https://www.googleapis.com/download/storage/v1/b/my-bucket/o/test%2Fgcf-test.txt?generation=1609395599729883&alt=media' */
  mediaLink: string;
  /** @example '1' */
  metageneration: string;
  /** @example 'test/gcf-test.txt' */
  name: string;
  /** @example 'https://www.googleapis.com/storage/v1/b/my-bucket/o/test%2Fgcf-test.txt' */
  selfLink: string;
  /** @example '17' */
  size: string;
  /** @example 'STANDARD' */
  storageClass: string;
  /** @example '2020-12-31T06:19:59.729Z' */
  timeCreated: string;
  /** @example '2020-12-31T06:19:59.729Z' */
  timeStorageClassUpdated: string;
  /** @example '2020-12-31T06:19:59.729Z' */
  updated: string;
}

const storage = new Storage();

const imageContentTypeRegex = /^image\//;

async function gcsPicturePlaylist(
  file: GCSFile,
  context: CloudFunctionsContext
) {
  const start = new Date();
  logger.debug({'gcsPicturePlaylist.start': {file, context, start}});

  if (!imageContentTypeRegex.test(file.contentType)) {
    logger.info(`Ignoring \`${file.id}\` - not an image.`);
  } else {
    const source = storage.bucket(file.bucket).file(file.name);
    // TODO: Create PR in `@google-cloud/storage` for 'gsutil URI'
    // - storage.bucket('').file(''); <- should have gsutil URI
    const sourceURI = `gs://${source.bucket.name}/${source.name}`;

    const results = await generatePlaylistFromImage(sourceURI);
    logger.debug({'gcsPicturePlaylist.results': results});

    const destination = storage
      .bucket(source.bucket.name)
      .file(`${source.name}.${packageJson.name}.json`);

    await destination.save(JSON.stringify(results), {
      contentType: 'application/json',
      gzip: true,
      metadata: {
        cacheControl: 'public, max-age=31536000', // 1 year
      },
    });

    logger.info('Saved results', {destination});
  }

  const finish = new Date();
  logger.debug({
    'gcsPicturePlaylist.finish': {
      finish,
      duration: {
        ms: finish.valueOf() - start.valueOf(),
      },
    },
  });
}

export {gcsPicturePlaylist};
