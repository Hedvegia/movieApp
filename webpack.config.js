const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require('path');

module.exports = {
    entry: './src/index.tsx',
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'bundle.js'
    },
    mode: "development",
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".scss", ".css"]
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-react',
                            '@babel/preset-typescript'
                        ],
                        "plugins": [
                            [
                                "@babel/plugin-proposal-class-properties",
                                {
                                    "loose": true
                                }
                            ]
                        ]
                    }
                }
            },
            {
                test: /\.(ts|tsx)?$/,
                loader: "ts-loader",
                options: {
                    configFile: "tsconfig.json"
                }
            },
            {
                test: /\.(ts|tsx)?$/,
                enforce: "pre",
                use: [
                    {
                        loader: "tslint-loader",
                        options: {
                            configFile: __dirname + "/tslint.json",
                            emitErrors: true,
                            failOnHint: true
                        }
                    }
                ]
            },
            {
                test: /\.(svg|png|jpg)$/,
                loader: "url-loader"
            },
            {
                test: /\.(scss|css)$/,
                use: [
                    {loader: "style-loader"},
                    {loader: "css-loader"},
                    {loader: "sass-loader"},
                ]
            }
        ]
    },
    devServer: {
        index: path.join(__dirname, 'public', 'index.html'),
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 3000,
        liveReload: true,
        open: true,
        writeToDisk: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "src", "index.html")
        })
    ]
};
