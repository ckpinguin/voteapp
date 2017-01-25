import React from 'react';
import VoteSummary from '../VoteSummary/VoteSummary';
import VotingComponent from '../VotingComponent/VotingComponent';
import { dd } from '../shared/toolbox';

export default function VoteList({ allVotes, currentVoteId, onSelectVote, onRegisterVote, onDismissVote }) {
    dd(allVotes, 'allVotes', 'VoteList()');
    dd(currentVoteId, 'currentVoteId', 'VoteList()');
    return (
    <div>
        {allVotes.map((vote) => {
            // Full vote view only for the clicked voting
            if (vote.id === currentVoteId) {
                return <VotingComponent key={vote.id}
                                        vote={vote}
                                        onDismissVote={()=>{onDismissVote(vote);}}
                                        onRegisterChoice={(choice)=>{onRegisterVote(vote, choice);}}
                />;
            }
            // else just the summary
            return <VoteSummary key={vote.id} vote={vote} onActivate={()=>{onSelectVote(vote);}}/>;
        })}
    </div>
    );
}

VoteList.propTypes = {
    allVotes:       React.PropTypes.array.isRequired,
    currentVoteId:  React.PropTypes.string,
    onSelectVote:   React.PropTypes.func.isRequired,
    onRegisterVote: React.PropTypes.func.isRequired,
    onDismissVote:  React.PropTypes.func.isRequired
};
