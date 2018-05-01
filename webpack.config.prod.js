const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.config.common.js');

module.exports = merge(common, {
    mode: 'production',
    output: {
        filename: 'circular-slider.min.js',
    },
    plugins: [
        new UglifyJSPlugin({
            sourceMap: true
        })
    ]
});