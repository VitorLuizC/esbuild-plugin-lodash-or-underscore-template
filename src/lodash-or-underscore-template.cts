import type { Plugin } from 'esbuild';
import type Lodash from 'lodash';
import type Underscore from 'underscore';
import * as fs from 'node:fs/promises';

export interface BaseOptions {
  /** @default /\.ejs$/i */
  filter?: RegExp;

  /**
   * Library that will provide the template function. It's commonly `"lodash"`
   * or `"underscore"`, but you can define a custom one (only works with
   * CommonJS modules).
   *
   * @default "lodash"
   */
  library?: string;

  settings?: unknown;
}

export interface OptionsForLodash extends BaseOptions {
  library?: 'lodash';
  settings?: Lodash.TemplateOptions;
}

export interface OptionsForUnderscore extends BaseOptions {
  library: 'underscore';
  settings?: Underscore.TemplateSettings;
}

export interface OptionsForCustomLibrary extends BaseOptions {
  library: string;

  // 'any' was used to avoid mismatching with specific settings definitions.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  settings?: any;
}

export type Options =
  | OptionsForLodash
  | OptionsForUnderscore
  | OptionsForCustomLibrary;

function lodashOrUnderscoreTemplate(options: Options): Plugin {
  const { filter = /\.ejs$/i, library = 'lodash', settings } = options;

  return {
    name: 'lodash-or-underscore-template',
    setup(build) {
      build.onResolve({ filter }, async (args) => {
        try {
          // 'require' was used to ensure library implements CommonJS.
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const _ = require(library);

          try {
            const contents = await fs.readFile(args.path, 'utf-8');

            try {
              const { source } = _.template(contents, settings);

              const lines = [
                `const _ = require('${library}');`,
                `module.exports = ${source};`,
              ];

              return {
                loader: 'js',
                contents: lines.join('\n'),
              };
            } catch (error) {
              return {
                errors: [
                  {
                    text: `Can't execute ${library}'s template on "${args.path}"`,
                    detail: error,
                    pluginName: 'lodash-or-underscore-template',
                  },
                ],
              };
            }
          } catch (error) {
            return {
              errors: [
                {
                  text: `Can't read contents of file "${args.path}"`,
                  detail: error,
                  pluginName: 'lodash-or-underscore-template',
                },
              ],
            };
          }
        } catch (error) {
          return {
            errors: [
              {
                text: `Can't import library "${library}"`,
                detail: error,
                pluginName: 'lodash-or-underscore-template',
              },
            ],
          };
        }
      });
    },
  };
}

lodashOrUnderscoreTemplate({
  library: 'lodash',
  settings: {
    variable: 'data',
  },
});

export default lodashOrUnderscoreTemplate;
