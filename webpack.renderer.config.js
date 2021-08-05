const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const path = require('path')

module.exports = (env={}, argv={}) => ({
    target: 'web',
    entry: { app: './renderer/index.js'},
    output: {
        path: path.resolve('./build'),
        filename: '[name].js'
    },
    module: {
        rules: require('./module.rules')(env, argv)
    },
    plugins: [
        env.analyse ? new BundleAnalyzerPlugin() : null,  
        new HtmlWebpackPlugin({
            template: './public/index.html',
          }),
        process.env.NODE_ENV === "production"
            ? new MiniCssExtractPlugin({
                filename: "[name].css",
                chunkFilename: "[id].css"
            }) : null,
    ].filter(
        plugin => {
            return plugin !== null
        }
    ),
    resolve: {
        modules: [
            path.resolve('./node_modules')
        ],
        extensions: [".wasm", ".mjs", ".js", ".json", ".jsx"]
    },
    devtool: 'source-map',
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    },
    node: {
        __dirname: true
    },
		watch: process.env.NODE_ENV === "development",
    watchOptions: {
        poll: 1000, // Check for changes every second
    },
})