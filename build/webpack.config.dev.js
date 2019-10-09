//webpack开发环境配置
//引入相关变量
const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')
const express = require('express')
const axios = require('axios')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
var app = express()
var apiRouters = express.Router()
app.use('/api', apiRouters)


const config = {
    mode:'development',
    target:'web',
    entry:{
        path:path.join(__dirname, '../src/main.js')
    },
    output:{
        filename:'index.js',
        path:path.join(__dirname, 'dist')
    },
    devtool:'#cheap-module-eval-source-map',
    resolve:{
        // extensions:['js', '.vue', '.json'],
        alias:{
            '@':path.resolve(__dirname, '../src'),
            'commons':path.resolve(__dirname, '../src/commons'),
            'components':path.resolve(__dirname, '../src/components'),
            'base':path.resolve(__dirname, '../src/baseComponents')
        }
    },
    devServer:{
        port:8080,
        host:'0.0.0.0',
        overlay:{
            errors:true
        },
        open:true,
        hot:true,
        useLocalIp:true, 
        stats:{
            all:false,
            assets:true,
            assetsSort:"field",
            builtAt:true,
            errors:true,
            warnings:true
        },
        before(app) {
            app.get('/api/getLyric', function (req, res) {
                let url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
                axios.get(url, {
                    headers: {
                        origin: 'https://y.qq.com',
                        referer: 'https://y.qq.com/portal/player.html'
                    },
                    params: req.query
                }).then((response) => {
                    res.json(response.data)
                })
            })
        }
    },
    module:{
        rules:[
            {
                test:/\.vue$/,
                exclude:/node_modules/,
                use:['vue-loader', 'eslint-loader'],
            },
            {
                test:/\.(jsx|js)$/,
                exclude:/node_modules/,
                use:['babel-loader', 'eslint-loader'],
            },
            {
                test:/\.css$/,
                use:[
                    {
                        loader:MiniCssExtractPlugin.loader
                    },
                    'css-loader',
                ]
            },
            {
                test:/\.scss$/,
                use:[
                    {
                        loader:MiniCssExtractPlugin.loader
                    },
                    'css-loader',
                    {
                        loader:'postcss-loader',
                        options:{
                            sourceMap:true
                        }
                    },
                    'sass-loader'
                ]
            },
            {
                test:/\.(gif|jpg|jpeg|png|svg)$/,
                use:[
                    {
                        loader:'url-loader',
                        options:{
                            limit:10000,
                            name:'font/[name].[hash:8].[ext]'
                        },
                    }
                ]
            },
            {
                test:/\.((woff2?|eot|ttf|otf)(\?.*)?$)/,
                use:[{
                    loader:'url-loader',
                    options:{
                        limit:10000,
                        name:'font/[name].[hash:8].[ext]'
                    }
                }]
            },
        ]
    },
    plugins:[
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.ProgressPlugin(),
        new HtmlWebpackPlugin({
            filename:'index.html',
            template:'./index.html',
            inject:true
        }),
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename:'[name].css'
        }),
        new FriendlyErrorsWebpackPlugin({
            compilationSuccessInfo: {
                messages: [`App Running At `],
                notes: ['if you want build a bundle,please use npm run build'],
            },
        })
    ]
}

module.exports = config;