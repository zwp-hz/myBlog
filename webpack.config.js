'use strict'

const path = require('path')
const webpack = require('webpack')
const copyWebpackPlugin = require('copy-webpack-plugin')
const htmlWebpackPlugin = require('html-webpack-plugin')
const cleanWebpackPlugin = require('clean-webpack-plugin')
const PrerenderSpaPlugin = require('prerender-spa-plugin')

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '',
        filename: './js/[name].build.[hash].js'
    },
    module: {
        rules: [{
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        'scss': 'vue-style-loader!css-loader!sass-loader',
                        'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
                    }
                }
            }, {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            }, {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }, {
                test: /\.(png|jpg|gif|svg|ico)$/,
                loader: 'url-loader?limit=10240&name=images/[name].[ext]?[hash]'
            },
            {
                test: /\.(eot|woff|svg|ttf|woff2)(\?v=[a-z0-9]\.[a-z0-9]\.[a-z0-9])?$/,
                loader: 'file-loader?name="[name].[ext]"!url-loader'
            }
        ]
    },
    plugins: [
        new copyWebpackPlugin([
            { from: __dirname + '/src/assets', to: __dirname + '/dist/assets' }
        ]),
        new htmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: 'head'
        }),
        new cleanWebpackPlugin(['dist'], {})
    ],
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.common.js'
        }
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true
    },
    performance: {
        hints: false
    },
    devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map'
    module.exports.output = {
        path: path.resolve(__dirname, './dist'),
        publicPath: 'http://www.zhuweipeng.me/',
        filename: 'js/[name].build.[hash].js'
    }
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),
        new PrerenderSpaPlugin(
            path.join(__dirname, './dist'), ['/', '/blog', '/searchResult', '/articleDetail', '/author', '/photoWall', '/photoList', '/error']
        )
    ])
}