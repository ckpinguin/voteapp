import React from 'react';
import VotingComponent from '../VotingComponent/VotingComponent';
import { fetchJson, sendJson } from '../../backend/Backend';
import { dd } from '../shared/toolbox';

export default class SingleVoteController extends React.Component {
    /**
    * Sets vote to null
    * @constructs SingleVoteController
    */
    constructor() {
        super();
        this.state = {
            vote: null
        };
        // TODO: maybe bind rest of funcs too?
        this.registerVote = this.registerVote.bind(this);
        this.routeToMain = this.routeToMain.bind(this);
    }

    /**
    * Lifecycle hook for a props-change. Loads the next vote
    */
    componentWillReceiveProps(nextProps) {
        this.loadVote(nextProps);
    }

    /**
    * Lifecycle hook for the first rendering
    * Load one vote and change the title
    */
    componentDidMount() {
        this.loadVote(this.props);
        document.title = `Vote ${this.props.params.id} - Vote as a Service`;
    }

    /**
    * Fetch one vote from backend. Use props.params.id from the URL to
    * identify it.
    * @param {Object} props
    */
    loadVote(props) {
        dd(props.params.id, 'vote.id (from props)','SingleVoteController.loadVote()');
        const requestedVoteId = props.params.id;
        if (!requestedVoteId ||
            (this.state.vote && this.state.vote.id === requestedVoteId)) {
            return;
        }
        fetchJson(`/api/votes/${requestedVoteId}`)
            .then(vote => {
                document.title = `${vote.title} - Vote as a Service`;
                this.setState({
                    vote
                });
            });
    }

    /**
    * Registering a voting for a choice on a vote object
    * This just commands the backend to increment the choice count.
    * @param {Object} vote - The vote with the choice
    * @param {Object} choice - The choice to be incremented by backend
    */
    registerVote(vote, choice) {
        sendJson('put', `/api/votes/${vote.id}/choices/${choice.id}/vote`, {})
            .then( () => this.routeToMain());
    }

    /**
    * Pushing '/' to history
    */
    routeToMain() {
        this.context.history.pushState(null, '/');
    }

    render() {
        const { vote } = this.state;
        if (vote) {
            return <VotingComponent vote={vote}
                onDismissVote={this.routeToMain}
                onRegisterChoice={(choice) => this.RegisterVote(vote, choice)}
            />;
        } else {
            return null;
        }
    }
}


SingleVoteController.contextTypes = {
    history: React.PropTypes.object.isRequired
};
