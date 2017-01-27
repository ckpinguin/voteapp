import React from 'react';
import VoteComposer from '../VoteComposer/VoteComposer';
import { sendJson} from '../../backend/Backend';
import { dd} from '../shared/toolbox';

class VoteComposerController extends React.Component {
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
        this.context.history.pushState(null, path);
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

VoteComposerController.contextTypes = {
    history: React.PropTypes.object.isRequired
};
