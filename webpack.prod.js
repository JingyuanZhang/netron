const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

const topLevelDeps = ['dagre', 'base', 'index', 'text', 'json', 'python', 'protobuf',
    'flatbuffers', 'zip', 'gzip', 'tar', 'view-grapher', 'view-sidebar', 'view', 'index'];

module.exports = {
    mode: 'production',
    entry: {
        index: [path.resolve(__dirname, `/build/index`)],
        modelFactory: [path.resolve(__dirname, `/build/modelFactory`)]
    },
    resolve: {
        // Add ".ts" and ".tsx" as resolvable extensions.
        extensions: ['.js', '.json', 'css'],
        fallback: { "zlib": false }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.js$/,
                loader: './wrapperLoader',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: "source/**/*",
                    to: "./[name][ext]",
                    filter: async resourcePath => {
                        const pathArr = resourcePath.split('/');
                        const filename = pathArr[pathArr.length - 1];
                        if (filename.endsWith('.js') || filename.endsWith('.py') || filename.endsWith('.json')) {
                            return false;
                        }
                        return [...topLevelDeps.map(dep => `${dep}.js`), 'index.html']
                            .filter(name => name === filename).length === 0;
                    }
                }
            ],
        }),
    ],
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'lib'),
        globalObject: 'this',
        libraryTarget: 'umd',
        library: '[name]',
        publicPath: './'
    }
};
