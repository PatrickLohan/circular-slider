var path = require('path');

module.exports = {
    entry: './public/js/app.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'app.js'
    },
    devServer: {
        contentBase: ".",
        inline: true,
        historyApiFallback: true,
        hot: true,
        port: 3000,
        progress: true
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['env', 'stage-2'],
                }
            }
        ]
    },
    stats: {
        colors: true
    },
    devtool: 'source-map'
};