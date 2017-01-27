import React from 'react';
import VoteList from '../VoteList/VoteList';
import VoteComposer from '../VoteComposer/VoteComposer';
import { fetchJson } from '../../backend/Backend';
import { dd } from '../shared/toolbox';

export default class VoteController extends React.Component {
    /**
    * @constructs VoteController
    */
    constructor(props) {
        super(props);

        this.state = {
            allVotes: [],
        };
        this.activateVoteComposer = this.activateVoteComposer.bind(this);
    }

    /**
    * Lifecycle hook for the first rendering
    * Loading all votes from the database
    */
    componentDidMount() {
        document.title = 'Overview - Vote as a Service';
        fetchJson('/api/votes').then(allVotes => {
            this.setState({allVotes});
        });
    }

    /**
    * Change to new path by history state
    * @param {string} path - The target path
    */
    transitionTo(path) {
        this.context.router.push(path);
    }

    /**
    * Event handler, activates the vote composer component
    */
    activateVoteComposer() {
        dd(null, null, 'activateComposer()');
        this.transitionTo('/compose');
    }

    /**
    */
    render() {
        const {allVotes} = this.state;
        return (
            <div>
                <VoteList allVotes={allVotes} />
                <VoteComposer
                    active={false}
                    onActivate={this.activateVoteComposer}
                />
            </div>
        );
    }
}

VoteController.contextTypes = {
    router: React.PropTypes.object
};
