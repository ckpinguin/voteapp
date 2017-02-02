import React from 'react';
import { RoutingContext, match } from 'react-router';
import { renderToString } from 'react-dom/server';
import routes from '../common/routes';
import votesCache from '../common/votesCache';
var dd = require('../common/toolbox');

export default function renderRoute(request, reply, initialData) {
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
            console.log('SSR: populating cache and pre-rendering HTML');
            votesCache.populate(initialData);
            const html = renderToString(<RoutingContext {...renderProps}/>);
            reply(renderFullPage(html, initialData));
        }
    });
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
