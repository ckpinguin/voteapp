import React from 'react';
import styles from './styles.styl';

// Stateless functional component (SFC) is enough for just displaying stuff
export default function ChoiceBar({title, count, percent, onClickHandler}) {
    return(
        <div className={styles.choiceBar} onClick={onClickHandler}>
            <div className={styles.progress} style={{'width': percent + '%'}}>
                <div className={styles.choiceBarTitle}>{title}</div>
            </div>
            <div className={styles.choiceBarBadge}>{count}</div>
        </div>
    );
}
ChoiceBar.propTypes = {
    title:      React.PropTypes.string.isRequired,
    count:      React.PropTypes.number.isRequired,
    percent:    React.PropTypes.number.isRequired,
    onClickHandler: React.PropTypes.func.isRequired
};
