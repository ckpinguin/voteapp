import React from 'react';
import VoteComposer from '../VoteComposer/VoteComposer';
import { sendJson} from '../../backend/Backend';
import { dd} from '../shared/toolbox';
// Since react-router v2 this is a Singleton instead of using react.context
import { browserHistory } from 'react-router';
const history = browserHistory;

export default class VoteComposerController extends React.Component {
    constructor() {
        super();
        this.routeToMain = this.routeToMain.bind(this);
        this.addVote = this.addVote.bind(this);
    }
    componentDidMount() {
        document.title = 'Compose - Vote as a Service';
    }

    addVote(newVote) {
        dd(newVote, 'newVote','VoteComposerController.addVote()');
        sendJson('post', '/api/votes', newVote).then(() => this.routeToMain());
    }

    transitionTo(path) {
        history.push(path);
    }

    routeToMain() {
        this.transitionTo('/');
    }

    render() {
        return (<VoteComposer
            active={true}
            onDeactivate={this.routeToMain}
            onSave={this.addVote}
        />);
    }
}
