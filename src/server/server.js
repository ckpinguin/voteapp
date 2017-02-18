import path from 'path';
import express from 'express';

import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import routes from '../common/routes';

import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import configureStore from '../common/store/configureStore';

import { renderToString } from 'react-dom/server';
import { fetchJson } from '../common/backend/Backend';

const PORT = process.env.PORT || 8080;

const app = express();

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
            const history = syncHistoryWithStore(browserHistory, store);
            //const history = browserHistory;
            const router = <Router history={history}>
                    { routes }
                </Router>;
            const provider = <Provider store={store}>
                    {router}
                </Provider>;
            // Render the component to a string
            const html = renderToString(provider);

            // Grab the initial state from our Redux store
            const finalState = store.getState();

            // Send the rendered page back to the client
            res.send(renderFullPage(html, finalState));
        })
        .catch((error) => console.error(error));
}

function renderFullPage(html, preloadedState) {
    return `
        <!doctype html>
        <html>
            <head>
                <title>Vote as a Service (VaaS) (serverside)</title>
                <ilnk rel="stylesheet" type="text/css" href="/static/css/main.css">
            </head>
            <body>
                <div id="root">${html}</div>
                <script>
                    window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState)
                        .replace(/</g, '\\x3c')}
                </script>
                <script src="/static/js/bundle.js"></script>
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
