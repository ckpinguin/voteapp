const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const validate = require('webpack-validator');
//const autoprefixer = require('autoprefixer');
const poststylus = require('poststylus');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
//const fs = require('fs');

const PATHS = {
    src: path.join(__dirname, 'src'),
    dist: path.join(__dirname, 'dist'),
    //appDirectory: fs.realpathSync(process.cwd()) + '/dist/'
    publicPathDev: '/',
    //publicPathProd: 'https://ckpinguin.github.io/react-boilerplate/dist/'
    publicPathProd: './'
};

const common = {
    // Entry accepts a path or an object of entries.
    // We'll be using the latter form given it's
    // convenient with more complex configurations.
    entry: [path.join(PATHS.src, 'index.js')],
    output: {
        path: PATHS.dist,
        filename: 'static/js/bundle.js',
        publicPath: PATHS.publicPathDev
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: path.join(PATHS.src, 'index.pug'),
            filename: 'index.html' // in prod-mode, this file lands in the dist folder
        }),
        new webpack.NoErrorsPlugin()
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
                    /\.html$/, /\.(js|jsx)$/, /\.css$/, /\.json$/, /\.svg$/
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
            }
        ]
    }
};

const dev = {
    devtool: 'source-map',
    plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                '__API_SERVER_URL': JSON.stringify('http://localhost:8080/api')
            }
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    output: {
        publicPath: PATHS.publicPathDev
    },
    entry: [
        'webpack-hot-middleware/client',
        path.join(PATHS.src, 'index.js')
        //require.resolve('react-dev-utils/webpackHotDevClient')
    ],
    module: {
        // preLoaders: [{
        //     test: /\.css$/,
        //     loader: 'stylelint'
        // }],
        loaders: [
            {
                test: /\.css$/,
                exclude: /node_modules/,
                loaders: [
                    'style?sourceMap',
                    'css?sourceMap&modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]',
                    'postcss'
                ]
            }, {
                test: /\.styl$/,
                exclude: /node_modules/,
                loaders: [
                    'style?sourceMap',
                    'css?sourceMap&modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]',
                    'postcss',
                    'stylus'
                ]
            }
        ]
    },
    postcss: [
        require('autoprefixer'),
    ]
};

const prod = {
    output: {
        publicPath: PATHS.publicPathProd
    },
    module: {
        loaders: [
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
    postcss: [
        require('autoprefixer'),
    ],
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production'),
                '__API_SERVER_URL': JSON.stringify('http://localhost:8080/api')
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
        new ExtractTextPlugin('static/css/[name].css')
    ]
};

var config;

// Detect how npm is run and branch based on that
switch (process.env.npm_lifecycle_event) {
case 'build:prod':
    config = merge(common, prod);
    break;
default:
    config = merge(common, dev);
}

/** Extending the webpack-validator schema for special config stuff **/
const Joi = require('webpack-validator').Joi;
// This joi schema will be `Joi.concat`-ed with the internal schema
const validatorSchemaExtension = Joi.object({
    // this would just allow the property and doesn't perform any additional validation
    stylus: Joi.any()
});

module.exports = validate(config, {schemaExtension: validatorSchemaExtension});
