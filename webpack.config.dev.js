const merge = require('webpack-merge');
const common = require('./webpack.config.common.js');

module.exports = merge(common, {
    mode: 'development',
    output: {
        filename: 'circular-slider.js',
    },
    devServer: {
        contentBase: ".",
        inline: true,
        historyApiFallback: true,
        hot: true,
        port: 3000,
        progress: true
    },
    devtool: 'inline-source-map'
});
