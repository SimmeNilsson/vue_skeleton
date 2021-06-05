const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = (env = {}) => ({
    mode: "development",
    devtool: "eval-source-map",
    entry: "./src/main.ts",
    output: {
        path: path.resolve(__dirname, "./dist"),
        publicPath: "/dist/"
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: "vue-loader"
            },
            {
                test: /\.ts$/,
                use: {
                    loader: "ts-loader",
                    options: { appendTsSuffixTo: [/\.vue$/], transpileOnly: true }
                }
            },
            {
                test: /\.css$/,
                use: ["css-loader"]
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new ForkTsCheckerWebpackPlugin({
            typescript: {
                extensions: {
                    vue: {
                        enabled: true,
                        compiler: "@vue/compiler-sfc"
                    }
                },
                diagnosticOptions: {
                    semantic: true,
                    syntactic: false
                }
            }
        })
    ],
    output: {
        devtoolModuleFilenameTemplate: info => {
            if (info.allLoaders === "") {
                // when allLoaders is an empty string the file is the original source
                // file and will be prefixed with src:// to provide separation from
                // modules transpiled via webpack
                const filenameParts = ["src://"];
                if (info.namespace) {
                    filenameParts.push(info.namespace + "/");
                }
                filenameParts.push(info.resourcePath.replace(/^\.\//, ""));
                return filenameParts.join("");
            } else {
                // otherwise we have a webpack module
                const filenameParts = ["webpack://"];
                if (info.namespace) {
                    filenameParts.push(info.namespace + "/");
                }
                filenameParts.push(info.resourcePath.replace(/^\.\//, ""));
                const isVueScript =
                    info.resourcePath.match(/\.vue$/) &&
                    info.query.match(/\btype=script\b/) &&
                    !info.allLoaders.match(/\bts-loader\b/);
                if (!isVueScript) {
                    filenameParts.push("?" + info.hash);
                }
                return filenameParts.join("");
            }
        }
    }
});
