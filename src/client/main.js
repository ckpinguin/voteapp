import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import routes from '../common/routes';
import votesCache from '../common/votesCache';
import '../assets/favicon.ico';
import './index.styl';
const isBrowser = typeof window !== 'undefined';
if (isBrowser) votesCache.populate(window.__INITIAL_STATE__);

const history = browserHistory;
const router = <Router history={history}>
 { routes }
</Router>;

const mount = document.getElementById('root');
ReactDOM.render(router, mount);
