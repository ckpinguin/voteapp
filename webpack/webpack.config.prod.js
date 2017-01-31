const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const StatsWriterPlugin = require('webpack-stats-plugin').StatsWriterPlugin;
const poststylus = require('poststylus');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');

const PATHS = {
    src: path.resolve(__dirname, '../src'),
    dist: path.resolve(__dirname, '../dist'),
    //appDirectory: fs.realpathSync(process.cwd()) + '/dist/'
    publicPathDev: '/',
    //publicPathProd: 'https://ckpinguin.github.io/react-boilerplate/dist/'
    publicPathProd: './' // maybe '/dist/' ?
};

module.exports = {
    // Entry accepts a path or an object of entries.
    // We'll be using the latter form given it's
    // convenient with more complex configurations.
    externals: [
        {
            'isomorphic-fetch': {
                root: 'isomorphic-fetch',
                commonjs2: 'isomorphic-fetch',
                commonjs: 'isomorphic-fetch',
                amd: 'isomorphic-fetch'
            }
        }
    ],
    entry: [path.join(PATHS.src, 'client/main.js')],
    output: {
        path: PATHS.dist,
        filename: 'static/js/bundle.js',
        //publicPath: PATHS.publicPathDev,
        publicPath: PATHS.publicPathProd
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: path.join(PATHS.src, 'index.pug'),
            filename: 'index.html' // in prod-mode, this file lands in the dist folder
        }),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                // Useful to reduce the size of client-side libraries, e.g. react
                'NODE_ENV': JSON.stringify('production'),
                //'__API_SERVER_URL': JSON.stringify('http://localhost:8080/api'),
                // Mainly used to require CSS files with webpack, which can happen only on browser
                // Used as `if (process.env.BROWSER)...`
                BROWSER: JSON.stringify(true)
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            compress: {
                warnings: false
            }
        }),
        new ExtractTextPlugin({filename: 'static/css/[name].css', disable: false, allChunks: true}),
        // Write out stats.json file to build directory.


/*
new StatsWriterPlugin({
            transform: function(data) {
                return {
                    main: data.assetsByChunkName.main[0],
                    css: data.assetsByChunkName.main[1]
                };
            }
        })*/



    ],
    stats: { // webpack 2 option
        colors: true,
        reasons: true
    },
    module: {
        rules: [
            // First, run the linter.
            // It's important to do this before Babel processes the JS.
            {
                test: /\.(js|jsx)$/,
                use: 'eslint-loader',
                enforce: 'pre',
                exclude: /node_modules/
            },
            // "file" loader makes sure those assets get served by WebpackDevServer.
            // When you `import` an asset, you get its (virtual) filename.
            // In production, they would get copied to the `build` folder.
            // "url" loader works like "file" loader except that it embeds assets
            // smaller than specified limit in bytes as data URLs to avoid requests.
            // A missing `test` is equivalent to a match.
            {
                test: /\.(jpg|png|ico)$/,
                exclude: [
                    /\.html$/,
                    /\.(js|jsx)$/,
                    /\.css$/,
                    /\.json$/,
                    /\.svg$/,
                    /node_modules/
                ],
                // use and query not allowed together, so we have to use a sub
                // object
                use: {
                    loader: 'url-loader',
                    query: {
                        limit: 10000,
                        name: 'static/media/[name].[ext]'
                        //name: 'static/media/[name].[hash:8].[ext]'
                    }
                }
            },
            // Process JS with Babel.
            {
                test: /\.(js|jsx)$/,
                //include: path.join(__dirname, '/src/'),
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    query: {
                        //babelrc: false, // ignore .babelrc presets
                        //presets: ['react', 'es2015'],
                        // This is a feature of `babel-loader` for webpack (not Babel itself).
                        // It enables caching results in ./node_modules/.cache/babel-loader/
                        // directory for faster rebuilds.
                        cacheDirectory: true
                    }
                }
            }, {
                test: /\.(pug|jade)$/,
                //include: path.join(__dirname, '/src/'),
                exclude: /node_modules/,
                use: 'pug-html-loader'
            }, {
                test: /\.html$/,
                exclude: /node_modules/,
                use: 'html-loader'
            },
            // JSON is not enabled by default in Webpack but both Node and Browserify
            // allow it implicitly so we also enable it.
            {
                test: /\.json$/,
                exclude: /node_modules/,
                use: 'json-loader'
            },
            // "file" loader for svg
            {
                test: /\.svg$/,
                exclude: /node_modules/,
                use: {
                    loader: 'file-loader',
                    query: {
                        name: 'static/media/[name].[ext]'
                    }
                }
            }, {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallbackLoader: {
                        loader: 'style-loader',
                        options: {
                            require: 'autoprefixer'
                        }
                    },
                    loader: [
                        'css-loader?sourceMap&modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]',
                        'postcss-loader',
                        'stylus-loader'
                    ],
                })
            }, {
                test: /\.styl$/,
                use: ExtractTextPlugin.extract({
                    fallbackLoader: {
                        loader: 'style-loader',
                        options: {
                            require: 'autoprefixer'
                        }
                    },
                    loader: [
                        'css-loader?sourceMap&modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]',
                        'postcss-loader',
                        'stylus-loader'
                    ]
        /*
                            options: {
                                stylus: {
                                    use: [poststylus(['postcss-short', 'postcss-sorting', 'postcss-cssnext', 'rucksack-css'])]
                                }
                            }            */
                })
            }
        ]
    }
};
