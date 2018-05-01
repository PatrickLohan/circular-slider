var path = require('path');

module.exports = {
    entry: ["./lib/CircularSlider.js"],
    output: {
        path: path.resolve(__dirname, 'dist'),
        library: 'CircularSlider',
        libraryExport: 'default',
        libraryTarget: 'umd',
        umdNamedDefine: true
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
    }
};