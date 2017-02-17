import React from 'react';
import VoteComposer from '../components/VoteComposer/VoteComposer';

function VoteComposerPage({setTitle, routeToMain, addVote}) {
    setTitle('Compose - Vote as a Service (VaaS)');
    return (
        <VoteComposer
            active={true}
            onDeactivate={routeToMain}
            onSave={addVote}
        />
    );
}

VoteComposerPage.propTypes = {
    setTitle:       React.PropTypes.func.isRequired,
    routeToMain:    React.PropTypes.func.isRequired,
    addVote:        React.PropTypes.func.isRequired
};

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions';

function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
}

export default connect(null, mapDispatchToProps)(VoteComposerPage);
