import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';

import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from '../../webpack/webpack.config.dev';

import React from 'react';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import configureStore from '../common/store/configureStore';
import { fetchJson } from '../common/backend/Backend';

import Layout from '../common/components/Layout/Layout';
import VotePage from '../common/containers/VotePage';

//import renderRoute from './renderRoute';
//import dd from '../common/toolbox';

const PORT = process.env.PORT || 8080;

const app = express();
app.use(compression());

// Use this middleware to set up hot module reloading via webpack.
const compiler = webpack(webpackConfig);
app.use(webpackDevMiddleware(compiler, {noInfo: true, publicPath: webpackConfig.output.publicPath }));
app.use(webpackHotMiddleware(compiler));

// This is fired every time the server side receives a request
app.use(handleRender);

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//app.use(express.static(path.join(__dirname, '../../../dist')));

// Allow CORS
/*
app.use(cors());
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});*/



function handleRender(req, res) {
    fetchJson('/api/votes')
        .then((allVotes) => {
            const preloadedState = {
                votes: allVotes,
                currentVote: {},
                login: false,
                routing: {}
            };

            // Create a new Redux store instance with a predifined state
            const store = configureStore(preloadedState);

            // Render the component to a string
            const html = renderToString(
                <Provider store={store}>
                    <Layout>
                        <VotePage />
                    </Layout>
                </Provider>);

            // Grab the initial state from our Redux store
            const finalState = store.getState();

            // Send the rendered page back to the client
            res.send(renderFullPage(html, finalState));
        });
}

function renderFullPage(html, preloadedState) {
    return `
        <!doctype html>
        <html>
            <head>
                <title>Vote as a Service (VaaS) (serverside)</title>
            </head>
            <body>
                <div id="root">${html}</div>
                <script>
                    window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState)
                        .replace(/</g, '\\x3c')}
                </script>
                <script src="/dist/static/js/bundle.js"></script>
            </body>
        </html>
    `;
}
app.listen(PORT, (error) => {
    if (error) {
        console.error(error);
    } else {
        console.info('==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.', PORT, PORT);
    }
});
