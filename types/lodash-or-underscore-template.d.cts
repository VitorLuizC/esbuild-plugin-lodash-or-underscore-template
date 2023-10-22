import type { Plugin } from 'esbuild';
import type Lodash from 'lodash';
import type Underscore from 'underscore';
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
    settings?: any;
}
export type Options = OptionsForLodash | OptionsForUnderscore | OptionsForCustomLibrary;
declare function lodashOrUnderscoreTemplate(options: Options): Plugin;
export default lodashOrUnderscoreTemplate;
//# sourceMappingURL=lodash-or-underscore-template.d.cts.map