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

import {Logging, SeverityNames, Entry} from '@google-cloud/logging';

import {config} from './config.js';
import {packageJson} from './utils/package.js';

const logging = new Logging();
await logging.setProjectId();
await logging.setDetectedResource();

const log = logging.logSync(packageJson.name);

// TODO: create PR for this (enum and `ReportedErrorEvent`) in @google-cloud/logging
enum LoggingTypes {
  /**
   * @link https://cloud.google.com/error-reporting/docs/formatting-error-messages
   */
  ReportedErrorEvent = 'type.googleapis.com/google.devtools.clouderrorreporting.v1beta1.ReportedErrorEvent',
}

type Meta = Entry['metadata'];
type Data = Entry['data'];

type SeverityFunctions = {
  [_ in SeverityNames]: (message: unknown, data?: Data, meta?: Meta) => void;
};

class Logger implements SeverityFunctions {
  /**
   * Internal method for logging for each severity
   */
  #log(s: SeverityNames, message: unknown, data?: Data, meta?: Meta) {
    const payload: {message: unknown; data?: Data; '@type'?: string} = {
      message,
      data,
    };

    if (message instanceof Error && message.stack) {
      // Allows error to be pick up by Error Reporting
      // https://cloud.google.com/error-reporting/docs/formatting-error-messages
      payload.message = message.stack;
      payload['@type'] = LoggingTypes.ReportedErrorEvent;
    }

    const entry = log.entry(meta, payload);

    log[s](entry);
  }

  info(message: unknown, data?: Data, meta?: Meta) {
    return this.#log('info', message, data, meta);
  }

  emergency(message: unknown, data?: Data, meta?: Meta) {
    return this.#log('emergency', message, data, meta);
  }

  alert(message: unknown, data?: Data, meta?: Meta) {
    return this.#log('alert', message, data, meta);
  }

  critical(message: unknown, data?: Data, meta?: Meta) {
    return this.#log('critical', message, data, meta);
  }

  error(message: unknown, data?: Data, meta?: Meta) {
    return this.#log('error', message, data, meta);
  }

  warning(message: unknown, data?: Data, meta?: Meta) {
    return this.#log('warning', message, data, meta);
  }

  notice(message: unknown, data?: Data, meta?: Meta) {
    return this.#log('notice', message, data, meta);
  }

  debug(message: unknown, data?: Data, meta?: Meta) {
    if (config.logging.verbose) {
      this.#log('debug', message, data, meta);
    }
  }
}

export const logger = new Logger();
