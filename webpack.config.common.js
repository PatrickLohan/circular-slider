var path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: ["./lib/CircularSlider.js"],
    plugins: [
        // new HtmlWebpackPlugin({
        //     title: 'Production'
        // })
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        library: 'circularSlider',
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