import React from 'react';
import { Link } from 'react-router';
//import styles from './styles.styl';

export default function VoteSummary({ vote }) {
    const totalVotes = vote.choices.reduce((sum, curr) => sum + curr.count, 0);

    return (
        <div className="app-VoteSummary-row app-VoteSummary-votesRow app-VoteSummary-selectable">
            <Link to={`/votes/${vote.id}`}>
                <h1 className="app-VoteSummary-title">{vote.title}
                    <div className="app-VoteSummary-badge">{totalVotes} Votes</div>
                </h1>
                <p className="app-VoteSummary-emphasis">{vote.description}</p>
            </Link>
        </div>
    );
}
VoteSummary.propTypes = {
    vote:       React.PropTypes.object.isRequired
};
