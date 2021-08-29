const path = require('path')

module.exports = () => ({
    target: 'electron-main',
    entry: { 
        main: './src/main.js',
        preload: './src/preload.js'
    },
    output: {
        path: path.resolve('./build'),
        filename: '[name].js'
    },
    node: {
        __dirname: true
    },
    externals: [ {
        'electron-reload': 'require(\'electron-reload\')'
    } ],
    resolve: {
      modules: [path.resolve(__dirname, "node_modules"), "node_modules"]
    },
    watch: process.env.NODE_ENV === "development",
    watchOptions: {
        poll: 1000, // Check for changes every second
    },
})