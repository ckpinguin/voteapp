import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';

import { Router } from 'react-router';
import { Provider } from 'react-redux';

//import history from '../common/history';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import configureStore from '../common/store/configureStore';

import routes from '../common/routes';

import '../assets/favicon.ico';
import './index.styl';

const preloadedState = window.__PRELOADED_STATE__;
const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

const router = <Router history={history}>
     { routes }
    </Router>;

const mount = document.getElementById('root');
const provider = <Provider store={store}>
        {router}
    </Provider>;
ReactDOM.render(provider, mount);
