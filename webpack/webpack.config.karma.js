const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const poststylus = require('poststylus');
const webpack = require('webpack');

const PATHS = {
    src: path.resolve(__dirname, '../src'),
    dist: path.resolve(__dirname, '../dist'),
    publicPathDev: '/',
    publicPathProd: './'
};

exports.webpackConfig = webPackConfig;
const webPackConfig = {
    devtool: 'source-map',
    externals: [
        {
            'isomorphic-fetch': {
                root: 'isomorphic-fetch',
                commonjs2: 'isomorphic-fetch',
                commonjs: 'isomorphic-fetch',
                amd: 'isomorphic-fetch'
            },
            // Needed for karma-webpack to load correctly
            'react/addons': 'react/addons',
            'react/lib/ExecutionEnvironment': 'react/lib/ExecutionEnvironment',
            'react/lib/ReactContext': 'react/lib/ReactContext',
        }
    ],
    // Entry accepts a path or an object of entries.
    // We'll be using the latter form given it's
    // convenient with more complex configurations.
    entry: [
        path.join(PATHS.src, 'client/main.js')
    ],
    output: {
        path: PATHS.dist, // ignored in dev-mode
        filename: 'static/js/bundle.js',
        publicPath: PATHS.publicPathDev
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: path.join(PATHS.src, 'index.pug'),
            filename: 'index.html' // in prod-mode, this file lands in the dist folder
        }),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.HotModuleReplacementPlugin()
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
                include: [
                    path.join(__dirname, 'src'),
                    path.join(__dirname, 'test')
                ],
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
                loaders: [
                    {
                        loader: 'style-loader?sourceMap',
                        options: {
                            sourceMap: true
                        }
                    }, {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            modules: true,
                            importLoaders: 1,
                            localIdentName: '[path]___[name]__[local]___[hash:base64:5]'
                        }
                    }, {
                        loader: 'postcss-loader'
                    }
                ]
            }, {
                test: /\.styl$/,
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            sourceMap: true,
                            require: 'autoprefixer'
                        }
                    }, {
                        loader: 'css-loader',
                        // No CSS Modules for the moment, it does not play
                        // well with SSR
                        options: {
                            sourceMap: true,
                            //modules: true,
                            importLoaders: 1,
                            //localIdentName: '[path]___[name]__[local]___[hash:base64:5]'
                        }
                    }, {
                        loader: 'postcss-loader'
                    }, {
                        loader: 'stylus-loader',
                        options: {
                            stylus: {
                                use: [poststylus([ 'postcss-short', 'postcss-sorting', 'postcss-cssnext', 'rucksack-css' ])]
                            }
                        }
                    }
                ]
            }
        ]
    }
},
