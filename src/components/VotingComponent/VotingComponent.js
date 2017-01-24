import React from 'react';
import ChoiceBar from '../ChoiceBar/ChoiceBar';
import styles from './styles.styl';

// Stateless functional component (SFC) for displaying stuff and calling other
// displaying components is enough
export default function VotingComponent({ vote, onDismissVote, onRegisterChoice }) {
    const totalVotes = vote.choices.reduce((prev, curr) => prev + curr.count, 0);

    return (
        <div className={[styles.row, styles.votingRow, styles.spacer].join(' ')}>
            <div className={styles.head} onClick={onDismissVote}>
                <h1 className={styles.title}>{vote.title}
                    <div className={styles.badge}>{totalVotes} Votes</div>
                </h1>
                <div className={[styles.description, styles.emphasis].join(' ')}>
                    {vote.description}
                </div>
                <div>
                    {vote.choices.map(choice =>
                        <ChoiceBar key={choice.id}
                        title={choice.choiceTitle}
                        onClickHandler={() => onRegisterChoice(choice)}
                        percent={choice.count * (100 / totalVotes)}
                        {...choice}/>
                    )}
                </div>
                <div className={styles.buttonBar}>
                    <div className={styles.button}
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
