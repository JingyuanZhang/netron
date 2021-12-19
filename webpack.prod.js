const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const less = require('less');
const fs = require('fs');


// const topLevelDeps = ['dagre', 'base', 'index', 'text', 'json', 'python', 'protobuf',
//     'flatbuffers', 'zip', 'gzip', 'tar', 'view-grapher', 'view-sidebar', 'view', 'index'];

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
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [
                {
                    from: 'build/css/index.less',
                    to: './[name].css',
                    transform() {
                        const src = 'build/css/index.less';
                        // 调用less.render()将Less代码编译为css代码
                        return less.render(fs.readFileSync(src).toString(), {
                            filename: path.resolve(src), // <- here we go
                        }).then(output => {
                            return output.css;
                        });
                    }
                }
            ]
        })
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
