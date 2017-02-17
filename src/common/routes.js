import React from 'react';
import { Route, Redirect } from 'react-router';

import Layout from './components/Layout/Layout';
import VotePage from './containers/VotePage';
import SingleVotePage from './containers/SingleVotePage';
import VoteComposerPage from './containers/VoteComposerPage';
import LoginPage from './containers/LoginPage';
import NoMatch from './components/NoMatch/NoMatch';

import store from './store/store';

function requireAuth(nextState, replaceState) {
    const state = store.getState();
    if (!state.login) {
        const redirect = nextState.location.pathname;
        replaceState(null, `/login${redirect}`);
    }
}

const routes = <Route>
        <Redirect from="/" to="/votes" />
        <Route path="/" component={Layout}>
            <Route path="login(/:redirect)" component="{LoginController}"/>
            <Route path="votes" component={VotePage}/>
            <Route path="votes/:id" component={SingleVotePage}/>
            <Route path="login(/:redirect)" component={LoginPage}/>
            <Route path="compose" component={VoteComposerPage}
                onEnter={requireAuth} />
            <Route path="*" component={NoMatch}/>
        </Route>
    </Route>;

export default routes;
