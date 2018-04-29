var path = require('path');

module.exports = {
    entry: ["./lib/CircularSlider.js"],
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'circular-slider.js',
        library: 'circularSlider',
        libraryTarget: 'umd',
        umdNamedDefine: true
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
        rules: [
            {
                test: /\.js$/,
                use: [{loader: 'babel-loader', query: {presets: ['env', 'stage-2'],}}]
            }
        ]
    },
    stats: {
        colors: true
    },
    devtool: 'source-map'
};