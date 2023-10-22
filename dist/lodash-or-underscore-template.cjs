"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("node:fs/promises"));
function lodashOrUnderscoreTemplate(options) {
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
                        }
                        catch (error) {
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
                    }
                    catch (error) {
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
                }
                catch (error) {
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
exports.default = lodashOrUnderscoreTemplate;
//# sourceMappingURL=lodash-or-underscore-template.cjs.map