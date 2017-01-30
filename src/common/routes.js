import React from 'react';
import { Router, Route, Redirect } from 'react-router';
import Layout from './components/Layout/Layout';
import VoteController from './components/Controller/VoteController';
import SingleVoteController from './components/Controller/SingleVoteController';
import VoteComposerController from './components/VoteComposer/VoteComposerController';
import LoginController from './components/LoginController';
import NoMatch from './components/NoMatch/NoMatch';
import './index.styl';

const routes = <Router>
        <Redirect from="/" to="/votes" />
        <Route path="/" component={Layout}>
            <Route path="login(/:redirect)" component="{LoginController}"/>
            <Route path="votes" component={VoteController}/>
            <Route path="votes/:id" component={SingleVoteController}/>
            <Route path="compose" component={VoteComposerController}
                onEnter={LoginController.requireAuth} />
            <Route path="*" component={NoMatch}/>
        </Route>
    </Router>;

export default routes;
