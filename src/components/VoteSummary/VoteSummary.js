import React from 'react';
import styles from './styles.styl';
import { Link } from 'react-router';

export default function VoteSummary({ vote }) {
    const totalVotes = vote.choices.reduce((sum, curr) => sum + curr.count, 0);

    return (
        <div className="{[styles.row, styles.votesRow, styles.selectable].join(' ')}">
            <Link to={`/votes/${vote.id}`}>
                <h1 className={styles.title}>{vote.title}
                    <div className={styles.badge}>{totalVotes} Votes</div>
                </h1>
                <p className={styles.emphasis}>{vote.description}</p>
            </Link>
        </div>
    );
}
VoteSummary.propTypes = {
    vote:       React.PropTypes.object.isRequired
};
