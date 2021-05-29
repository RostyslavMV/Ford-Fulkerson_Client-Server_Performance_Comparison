const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: path.resolve(__dirname, 'index.js'),
    externals: {
        fs: 'empty',
    },
    mode: 'development',
    module: {
        rules: [
            {
                include: [path.join(__dirname)],
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-react'],
                },
            },
            {
                test: /\.(wasm)$/,
                loader: 'file-loader',
                type: 'javascript/auto',
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    plugins: [new HtmlWebpackPlugin({ template: path.resolve(__dirname, 'index.html') })],
};