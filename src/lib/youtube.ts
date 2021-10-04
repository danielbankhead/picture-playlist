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

import {youtube, youtube_v3} from '@googleapis/youtube';
import {config} from './config.js';

import {logger} from './logger.js';

type YTOptions = Partial<{
  popular: boolean;
  safeSearch: youtube_v3.Params$Resource$Search$List['safeSearch'];
}>;

/**
 * Get search results from YouTube
 * @link https://developers.google.com/youtube/v3/docs/search/list
 */
async function searchYoutubeMusic(keywords: string[], options: YTOptions = {}) {
  const searchClient = youtube('v3').search;

  const order = options.popular ? 'viewCount' : 'relevance';
  const safeSearch = options.safeSearch || 'strict';
  const searchParams: youtube_v3.Params$Resource$Search$List = {
    part: ['snippet'],
    type: ['video'],
    videoCategoryId: '10', // category 10 = music
    maxResults: 3,
    key: config.api.youtube.key,
    order,
    safeSearch,
  };

  const results: youtube_v3.Schema$SearchListResponse['items'] = [];

  for (const q of keywords) {
    const res = await searchClient.list({...searchParams, q}, {retry: true});

    for (const item of res.data.items || []) {
      results.push(item);

      logger.debug({'searchYoutubeMusic.keywords.q': {q, item}});
    }
  }

  logger.debug({'searchYoutubeMusic.results': results});

  return results;
}

export {searchYoutubeMusic};
