import React from 'react';
import ChoiceBar from '../ChoiceBar/ChoiceBar';
//import styles from './styles.styl';

// Stateless functional component (SFC) for displaying stuff and calling other
// displaying components is enough
export default function VotingComponent({ vote, onDismissVote, onRegisterChoice }) {
    const totalVotes = vote.choices.reduce((sum, curr) => sum + curr.count, 0);

    return (
        <div className="app-VotingComponent-row app-VotingComponent-votingRow app-VotingComponent-spacer">
            <div className="app-VotingComponent-head" onClick={onDismissVote}>
                <h1 className="app-VotingComponent-title">{vote.title}
                    <div className="app-VotingComponent-badge">{totalVotes} Votes</div>
                </h1>
                <div className="app-VotingComponent-description app-VotingComponent-emphasis">
                    {vote.description}
                </div>
                <div>
                    {vote.choices.map((choice) =>
                        <ChoiceBar key={choice.id}
                        title={choice.choiceTitle}
                        onClickHandler={() => onRegisterChoice(choice)}
                        percent={choice.count * (100 / totalVotes)}
                        {...choice}/>
                    )}
                </div>
                <div className="app-VotingComponent-buttonBar">
                    <div className="app-VotingComponent-button"
                        onClick={onDismissVote}>Vote later</div>
                </div>
            </div>
        </div>
    );

}
VotingComponent.propTypes = {
    vote:               React.PropTypes.object.isRequired,
    onDismissVote:      React.PropTypes.func.isRequired,
    onRegisterChoice:   React.PropTypes.func.isRequired
};
