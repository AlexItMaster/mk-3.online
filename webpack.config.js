const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

let mode = 'development';

if (process.env.NODE_ENV === 'production') {
    mode = 'production';
}

console.log(mode + ' mode');

module.exports = {
    mode: mode,
    entry: {
        main: './src/js/main.js',
        kombat: './src/js/kombat.js',
        players_animations: './src/js/players-animations.js',
    },
    output: {
        filename: 'js/[name].[contenthash].min.js',
        assetModuleFilename: 'assets/[hash][ext][query]',
        clean: true,
    },
    performance: { // Збільшує максимально допустимий розмір файлів (картинок).
        hints: 'error',
        maxAssetSize: 5512000,
        maxEntrypointSize: 5512000,
    },
    devtool: 'source-map',
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash].css',
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html', // Підключає окремо html файли.
            chunks: ['main'], // Розділяє js файли і підключає свій кожному html файлу.
        }),
        new HtmlWebpackPlugin({
            filename: 'kombat.html',
            template: './src/kombat.html', // Підключає окремо html файли.
            chunks: ['kombat'], // Розділяє js файли і підключає свій кожному html файлу.
        }),
        new HtmlWebpackPlugin({
            filename: 'players-animations.html',
            template: './src/players-animations.html', // Підключає окремо html файли.
            chunks: ['players_animations'], // Розділяє js файли і підключає свій кожному html файлу.
        }),
        new FaviconsWebpackPlugin({
            logo: './src/images/favicon.png',
            //outputPath: '../assets/img/favicons',
            favicons: {
                icons: {
                    coast: false,
                    yandex: false,
                    android: false,
                    appleStartup: false,
                    appleIcon: false,
                    windows: false,
                }
            },
        }),
    ],
    module: {
        rules: [
            {
                test: /\.html$/i,
                loader: 'html-loader',
            },
            {
                test: /\.(sa|s?c)ss$/i,
                use: [
                    (mode === 'development') ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    [
                                        'postcss-preset-env',
                                        {
                                            // Options
                                        },
                                    ],
                                ],
                            },
                        },
                    },
                    'sass-loader',
                ],
            },
            {
                test: /\.(png|svg|gif|jpe?g|webp)$/i,
                type: 'asset/resource',
                use: [
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            mozjpeg: {
                                progressive: true,
                            },
                            // optipng.enabled: false will disable optipng
                            optipng: {
                                enabled: false,
                            },
                            pngquant: {
                                quality: [0.65, 0.90],
                                speed: 4
                            },
                            gifsicle: {
                                interlaced: false,
                            },
                            // the webp option will enable WEBP
                            webp: {
                                quality: 75
                            }
                        },
                    }
                ],
                generator: { // Вказує куди конкретно класти згенерований файл.
                    filename: 'assets/img/[name][hash][ext][query]',
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)$/i,
                type: 'asset/resource',
                generator: { // Вказує куди конкретно класти згенерований файл.
                    filename: 'assets/fonts/[hash][ext][query]',
                }
            },
            {
                test: /\.(mp3|ogg|webm)$/i,
                type: 'asset/resource',
                generator: { // Вказує куди конкретно класти згенерований файл.
                    filename: 'assets/sounds/[hash][ext][query]',
                }
            },
            {
                test: /\.m?js$/i,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },
}