import express from 'express';

import React from 'react';
import { Provider } from 'react-redux';
import { Router, match, RouterContext, createMemoryHistory } from 'react-router';
import routes from '../common/routes';

import { syncHistoryWithStore } from 'react-router-redux';

import configureStore from '../common/store/configureStore';

import { renderToString } from 'react-dom/server';
import { fetchJson } from '../common/backend/Backend';

import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackConfig from '../../webpack/webpack.config.prod.js';

const PORT = process.env.PORT || 8080;

const app = express();

/*
app.use(webpackDevMiddleware(webpack(webpackConfig), {
    //publicPath: '/__build__/',
    stats: {
        colors: true
    }
}));*/



app.use(handleRender);

function handleRender(req, res) {
    console.log('SSR: handleRender');
    fetchJson('/api/votes')
        .then((allVotes) => {
            const preloadedState = {
                votes: allVotes,
                currentVote: {},
            };

            // Create a new Redux store instance with a predifined state
            const store = configureStore(preloadedState);
            const memoryHistory = createMemoryHistory(req.url);
            const history = syncHistoryWithStore(memoryHistory, store);
            //const history = createMemoryHistory(); // For SSR
            const router = <Router history={history}>
                    { routes }
                </Router>;
            const provider = <Provider store={store}>
                    {router}
                </Provider>;

            match({ history, routes, location: req.url },
                (error, redirectLocation, renderProps) => {
                    if (error) {
                        res.status(500).send(error.message);
                    //} else if (redirectLocation) {
                    //    res.redirect(302, redirectLocation.pathName + redirectLocation.search);
                    //} else if (renderProps) {
                    } else {
                        const content = renderToString(provider);
                        // Grab the initial state from our Redux store
                        const finalState = store.getState();
                        // Send the rendered page back to the client
                        res.send(renderFullPage(content, finalState));
                    }
                }
            );
        })
        .catch((error) => console.error(error));
}

function renderFullPage(content, preloadedState) {
    return `
        <!doctype html>
        <html>
            <head>
                <title>Vote as a Service (VaaS) (serverside)</title>
                <link rel="stylesheet" type="text/css" href="/static/css/main.css">
            </head>
            <body>
                <div id="root">${content}</div>
                <script>
                    window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState)
                        .replace(/</g, '\\x3c')}
                </script>
                <script src="/bundle.js"></script>
            </body>
        </html>
    `;
}
app.listen(PORT, (error) => {
    if (error) {
        console.error(error);
    } else {
        console.info('==> 🌎  Listening on port %s. Open http://localhost:%s/ in your browser.', PORT, PORT);
    }
});
