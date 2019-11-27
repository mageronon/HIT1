const path = require('path');

const MiniCssExtractPlugin = require("mini-css-extract-plugin");


module.exports = {
    entry: {
      main: './src/index.js',
      admin: './src/admin.js'
    },
    output: {
        path: path.resolve(__dirname, 'docs'),
        filename: 'js/[name].js',
    },
    // ...previous Webpack config...
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
            // ...additional rules...
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ],
            },
            // ...additional rules...
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "css/[name].css",
        }),
    ],
};
