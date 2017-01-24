import React from 'react';
import ReactDOM from 'react-dom';
import Layout from './components/Layout/Layout';
import VoteController from './components/VoteController/VoteController';
import './assets/favicon.ico';
import './index.styl';

const mainComponent = <VoteController/>;
ReactDOM.render(
    <Layout>{mainComponent}</Layout>,
        document.getElementById('root'));
