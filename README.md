# Picture Playlist

## Prerequisties

env `GOOGLE_APPLICATION_CREDENTIALS`

- Required for Vision. See:
  - https://cloud.google.com/vision/docs/libraries#setting_up_authentication
  - https://cloud.google.com/docs/authentication/getting-started

env `YOUTUBE_API_KEY`

- Required for YouTube (OAuth isn't currently supported). See:
  - https://developers.google.com/youtube/registering_an_application
  - https://support.google.com/googleapi/answer/6158862

https://cloud.google.com/functions/docs/configuring/secrets#before_you_begin

## Setup and use

`npm ci`

`npm build`

`npm link`

`picture-playlist --help`
