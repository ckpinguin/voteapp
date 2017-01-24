import 'isomorphic-fetch';
import 'babel-polyfill'; // for Promises in older browsers

//const BACKEND_URL = __API_SERVER_URL__;
const BACKEND_URL = 'http://mdbserver:3000';

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
