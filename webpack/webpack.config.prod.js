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
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                // Useful to reduce the size of client-side libraries, e.g. react
                'NODE_ENV': JSON.stringify('production'),
                '__API_SERVER_URL': JSON.stringify('http://localhost:8080/api'),
                // Mainly used to require CSS files with webpack, which can happen only on browser
                // Used as `if (process.env.BROWSER)...`
                BROWSER: JSON.stringify(true)
            }
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            compress: {
                warnings: false
            }
        }),
        new ExtractTextPlugin('static/css/[name].css'),
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
    stylus: { // postcss-cssnext includes autoprefixer, so it is not needed here
        use: [poststylus(['postcss-short', 'postcss-sorting', 'postcss-cssnext', 'rucksack-css'])]
    },
    module: {
        // First, run the linter.
        // It's important to do this before Babel processes the JS.
        preLoaders: [
            {
                test: /\.(js|jsx)$/,
                loader: 'eslint',
                //include: PATHS.src,
                exclude: /node_modules/
            }
        ],
        loaders: [
            // "file" loader makes sure those assets get served by WebpackDevServer.
            // When you `import` an asset, you get its (virtual) filename.
            // In production, they would get copied to the `build` folder.
            // "url" loader works like "file" loader except that it embeds assets
            // smaller than specified limit in bytes as data URLs to avoid requests.
            // A missing `test` is equivalent to a match.
            {
                test: /\.(jpg|png|ico)$/,
                exclude: [
                    /\.html$/, /\.(js|jsx)$/, /\.css$/, /\.json$/, /\.svg$/,
                    /node_modules/
                ],
                loader: 'url',
                query: {
                    limit: 10000,
                    name: 'static/media/[name].[ext]'
                    //name: 'static/media/[name].[hash:8].[ext]'
                }
            },
            // Process JS with Babel.
            {
                test: /\.(js|jsx)$/,
                //include: path.join(__dirname, '/src/'),
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    //babelrc: false, // ignore .babelrc presets
                    //presets: ['react', 'es2015'],
                    // This is a feature of `babel-loader` for webpack (not Babel itself).
                    // It enables caching results in ./node_modules/.cache/babel-loader/
                    // directory for faster rebuilds.
                    cacheDirectory: true
                }
            }, {
                test: /\.(pug|jade)$/,
                //include: path.join(__dirname, '/src/'),
                exclude: /node_modules/,
                loader: 'pug-html'
            }, {
                test: /\.html$/,
                exclude: /node_modules/,
                loader: 'html'
            },
            // JSON is not enabled by default in Webpack but both Node and Browserify
            // allow it implicitly so we also enable it.
            {
                test: /\.json$/,
                exclude: /node_modules/,
                loader: 'json'
            },
            // "file" loader for svg
            {
                test: /\.svg$/,
                exclude: /node_modules/,
                loader: 'file',
                query: {
                    name: 'static/media/[name].[ext]'
                }
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]!postcss')
            }, {
                test: /\.styl$/,
                loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]!postcss!stylus')
                // Note: this won't work without `new ExtractTextPlugin()` in `plugins`.
            }
        ]
    },
    postcss: [require('autoprefixer')]
};
