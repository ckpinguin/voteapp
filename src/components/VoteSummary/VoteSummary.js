import React from 'react';
import styles from './styles.styl';

export default function VoteSummary({ vote, onActivate }) {
    const totalVotes = vote.choices.reduce((prev, curr) => prev + curr.count, 0);

    return (
        <div onClick={onActivate} className="{[styles.row, styles.votesRow, styles.selectable].join(' ')}">
            <h1 className={styles.title}>{vote.title}
                <div className={styles.badge}>{totalVotes} Votes</div>
            </h1>
            <p className={styles.emphasis}>{vote.description}</p>
        </div>
    );
}
VoteSummary.propTypes = {
    vote:       React.PropTypes.object.isRequired,
    onActivate: React.PropTypes.func.isRequired
};
