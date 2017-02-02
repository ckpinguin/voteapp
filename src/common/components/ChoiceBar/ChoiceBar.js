import React from 'react';
//import styles from './styles.styl';


// Stateless functional component (SFC) is enough for just displaying stuff
export default function ChoiceBar({title, count, percent, onClickHandler}) {
    return(
        <div className="app-ChoiceBar" onClick={onClickHandler}>
            <div className="app-ChoiceBar-progress" style={{'width': percent + '%'}}>
                <div className="app-ChoiceBar-title">{title}</div>
            </div>
            <div className="app-ChoiceBar-badge">{count}</div>
        </div>
    );
}
ChoiceBar.propTypes = {
    title:      React.PropTypes.string.isRequired,
    count:      React.PropTypes.number.isRequired,
    percent:    React.PropTypes.number.isRequired,
    onClickHandler: React.PropTypes.func.isRequired
};
