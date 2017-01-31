import 'isomorphic-fetch';
import 'babel-polyfill'; // for Promises in older browsers
import { Promise } from 'bluebird';

// Configure
Promise.config({
    cancellation: true,
    longStackTraces: true,
    warnings: true // note, run node with --trace-warnings to see full stack traces for warnings
});

//const BACKEND_URL = __API_SERVER_URL__;
// TODO: What to do to distinguish local or remote rest server (dev and prod)?
// WORKAROUND: "npm run build:prod" with remote server active and only push that change
const BACKEND_URL = 'http://mdbserver:3000';
console.info('Using BACKEND_URL: ' + BACKEND_URL);

export function fetchJson(path) {
    const url = `${BACKEND_URL}${path}`;

    console.info('Backend: fetchJson ' + path);
    return fetch(url) // Returns a Promise
    .then(response => response.json())
    .catch(ex => { console.error('parsing failed', ex); });
}

export function sendJson(method, path, payload={}) {
    const url = `${BACKEND_URL}${path}`;

    console.info('Backend: sendJson ' + method + ' ' + path);
    console.debug('Backend: sendJson got payload ' + JSON.stringify(payload));
    return fetch(url, { // Returns a Promise
        method:  method,
        body:    JSON.stringify(payload, null, 4),
        headers: {
            'Accept':       'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .catch(ex => { console.error('parsing failed', ex); });
}
