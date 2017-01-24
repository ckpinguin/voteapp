import React from 'react';
import VoteList from '../VoteList/VoteList';
import VoteComposer from '../VoteComposer/VoteComposer';
import {fetchJson, sendJson} from '../../backend/Backend';
import {dd} from '../shared/toolbox';

export default class VoteController extends React.Component {
    /**
    * @constructs VoteController
    */
    constructor(props) {
        super(props);

        this.state = {
            allVotes: [],
            currentVote: null
        };

        this.setCurrentVote = this.setCurrentVote.bind(this);
        this.registerVote = this.registerVote.bind(this);
        this.addVote = this.addVote.bind(this);
        this.activateVoteComposer = this.activateVoteComposer.bind(this);
        this.deactivateVoteComposer = this.deactivateVoteComposer.bind(this);
    }

    /**
    * Loading all votes from the database
    */
    componentDidMount() {
        fetchJson('/api/votes').then(allVotes => {
            this.setState({allVotes});
        });
    }

    /**
    * Event handler, setting the state variable 'currentVoteId'. Respects the fact that
    * the VoteComposer component is active, so nothing
    * happens then to the list, vote should not be empty and the composer
    * should not be active
    * @param {Object} vote - the new currentVote
    */
    setCurrentVote(vote) {
        dd(vote, 'vote', 'VoteController.setCurrentVote()');
        this.setState({
            currentVoteId: vote && !this.state.composerActive ? vote.id : null
        });
    }

    /**
    * Event handler, replaces state object 'allVotes',
    * calls @see registerChoice(vote, choice)
    * to get a new vote object back with incremented choice.count
    * for the corresponding 'vote' object.
    @see VotingComponent
    @param {Object} vote - The vote whose state will be updated
    @param {Object} choice - The choice that was chosen on the vote
    */
    registerVote(vote, choice) {
        dd(vote.id, 'vote.id', 'registerVote()');
        sendJson('put', `/api/votes/${vote.id}/choices/${choice.id}/vote`)
        .then(updatedVote => {
            // excchange old with updated vote
            const newAllVotes = this.state.allVotes.map(vote => vote.id === updatedVote.id
                ? updatedVote
                : vote);
            this.setState({allVotes: newAllVotes});
            this.setCurrentVote(updatedVote);
        }).catch((err) => console.error(err));
    }

    /**
    * Event handler, adds a new vote object to the state 'allVotes'
    * @param {Object} vote - The newly created vote
    */
    addVote(vote) {
        dd(vote.id, 'vote.id', 'addVote()');
        sendJson('post', '/api/votes', vote)
        .then(receivedVote => {
            this.setState({
                allVotes: [...this.state.allVotes, receivedVote]
            });
        });
    }

    /**
    * Event handler, activates the vote composer component
    */
    activateVoteComposer() {
        dd(null, null, 'activateComposer()');
        this.setState({currentVoteId: null, composerActive: true});
    }

    /**
    * Event handler, deactivates the vote composer component
    */
    deactivateVoteComposer() {
        this.setState({composerActive: false});
    }

    /**
    */
    render() {
        const {allVotes, currentVoteId, composerActive} = this.state;
        return (
            <div>
                <VoteList allVotes={allVotes} currentVoteId={currentVoteId} // select vote
                    onSelectVote={this.setCurrentVote} // Collapse the opened vote and render the list sagain from here
                    onDismissVote={() => {
                        this.setCurrentVote(null);
                    }}
                    onRegisterVote={this.registerVote}/>
                <VoteComposer active={composerActive} onDeactivate={this.deactivateVoteComposer} onActivate={this.activateVoteComposer} onSave={this.addVote}/>
            </div>
        );
    }
}
