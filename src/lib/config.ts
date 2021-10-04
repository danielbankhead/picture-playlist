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

import {SecretManagerServiceClient} from '@google-cloud/secret-manager';
const client = new SecretManagerServiceClient();

/**
 * A universal configuration class.
 *
 * Uses the environment to calculate the appropriate configuration.
 */
class Config {
  api = {
    youtube: {
      key: '',
    },
  };
  gcp = {
    projectId: '',
  };
  logging = {
    /** Enabled verbose (debug) logging */
    verbose: process.env.LOGGING_VERBOSE?.toLocaleLowerCase().trim() === 'true',
  };

  async determineGCPProjectId() {
    this.gcp.projectId = await client.getProjectId();
  }

  async determineYouTubeAPIKey() {
    // See if the `YOUTUBE_API_KEY` is available locally
    if (process.env.YOUTUBE_API_KEY) {
      this.api.youtube.key = process.env.YOUTUBE_API_KEY;
      return;
    }

    // TODO: provide method for accessing API key via API Key manager before attempting secret manager

    // See if the youtube api key is available in Secret Manager
    const secretName = `projects/${this.gcp.projectId}/secrets/youtube-api-key/versions/latest`;
    const [youtubeAPIKey] = await client.accessSecretVersion({
      name: secretName,
    });

    const youtubeAPIKeyFromSecret = youtubeAPIKey.payload?.data?.toString();

    if (youtubeAPIKeyFromSecret) {
      this.api.youtube.key = youtubeAPIKeyFromSecret;
      return;
    }

    if (!this.api.youtube.key) {
      throw new Error(
        `Cannot determine the YouTube API Key. Set the \`YOUTUBE_API_KEY\` env variable or \`${secretName}\` in secrets`
      );
    }
  }

  async prepare() {
    await this.determineGCPProjectId();
    await this.determineYouTubeAPIKey();
  }
}

const config = new Config();

await config.prepare();

export {config};
