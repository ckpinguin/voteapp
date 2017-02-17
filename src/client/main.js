import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';

import { Router } from 'react-router';
import { Provider } from 'react-redux';

import history from '../common/history';
import store from '../common/store/store';

import routes from '../common/routes';

import '../assets/favicon.ico';
import './index.styl';

const router = <Router history={history}>
 { routes }
</Router>;

const mount = document.getElementById('root');
ReactDOM.render(router, mount);
