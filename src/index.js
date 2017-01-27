import React from 'react';
import ReactDOM from 'react-dom';
import Layout from './components/Layout/Layout';
import { Router, Route, Redirect, hashHistory, browserHistory } from 'react-router';
import VoteController from './components/Controller/VoteController';
import SingleVoteController from './components/Controller/SingleVoteController';
import VoteComposerController from './components/VoteComposer/VoteComposerController';
import NoMatch from './components/NoMatch/NoMatch';
import './assets/favicon.ico';
import './index.styl';

const router = <Router history={browserHistory}>
        <Redirect from="/" to="/votes" />
        <Route path="/" component={Layout}>
            <Route path="login(/:redirect)" component="{LoginController}"/>
            <Route path="votes" component={VoteController}/>
            <Route path="votes/:id" component={SingleVoteController}/>
            <Route path="compose" component={VoteComposerController}/>
            <Route path="*" component={NoMatch}/>
        </Route>
    </Router>;

const mount = document.getElementById('root');
ReactDOM.render(router, mount);
