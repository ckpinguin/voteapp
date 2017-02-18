import React from 'react';
import { RoutingContext, match } from 'react-router';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import routes from '../common/routes';
import configureStore from '../common/store/configureStore';
//var dd = require('../common/toolbox');

export default function renderRoute(request, reply, store = configureStore()) {
    const location = request.path;
    match({
        routes,
        location
    }, (error, redirectLocation, renderProps) => {
        if (redirectLocation) {
            reply.redirect(redirectLocation.pathname + redirectLocation.search);
        } else if (error) {
            reply(error.message).code(500);
        } else if (renderProps == null) {
            reply('Not found').code(404);
        } else {
            preRender(renderProps.components, renderProps, store)
                .then(() => {
                    const html = renderToString(
                        <Provider store={store}>
                            <RoutingContext {...renderProps} />
                        </Provider>
                    );
                    const initialData = store.getState();
                    reply(renderFullPage(html, initialData));
                }).catch((error) => reply(error).code(500));
            console.log('SSR: populating cache and pre-rendering HTML');
        }
    });
}

function preRender(components, renderProps, store) {
    const preRenderComponents = components.filter(
        (component) => component && component.preRender);
    const preRenderPromises = preRenderComponents.map(
        ((component) => store.dispatch(component.preRender(renderProps)))
    );
    return Promise.all(preRenderPromises);
}

function renderFullPage(html, initialData) {
    return `<!DOCTYPE html>
<html>
  <head lang="en">
    <meta charset="UTF-8">
      <title>Votes as a Service</title>
      <link rel="stylesheet" href="/dist/static/css/main.css">
<script>
  window.__INITIAL_STATE__  = ${JSON.stringify(initialData)};
</script>
  </head>

  <body>
    <div id="root">${html}</div>
  </body>

  <script type="text/javascript"
          src="/dist/static/js/bundle.js">
  </script>
</html>`;
}
