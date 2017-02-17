import React from 'react';
import VotingComponent from '../components/VotingComponent/VotingComponent';
import { dd } from '../toolbox';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class SingleVotePage extends React.Component {
    /**
    * Lifecycle hook for a props-change. Loads the next vote
    */
    componentWillReceiveProps(nextProps) {
        if (nextProps.params.id !== this.props.params.id) {
            this.props.loadVote(nextProps.params.id);
        }
    }

    /**
    * Lifecycle hook for the first rendering
    * Load one vote and change the title
    */
    componentDidMount() {
        this.props.loadVote(this.props.params.id);
    }

    render() {
        const { currentVote, setTitle, routeToMain, registerVote } = this.props;
        if (currentVote) {
            setTitle(`${currentVote.title} - Vote as a Service (VaaS)`);
            return <VotingComponent vote={currentVote}
                onDismissVote={routeToMain}
                onRegisterChoice={(choice) => {registerVote(currentVote, choice);}}
            />;
        } else {
            setTitle(`Vote ${this.props.params.id} - Vote as a Service (VaaS)`);
            return null;
        }
    }
}

SingleVotePage.propTypes = {
    currentVote:    React.PropTypes.object,
    setTitle:       React.PropTypes.func.isRequired,
    routeToMain:    React.PropTypes.func.isRequired,
    registerVote:   React.PropTypes.func.isRequired,
    loadVode:       React.PropTypes.func.isRequired,
    params:         React.PropTypes.object.isRequired
};

import * as Actions from '../actions';

function mapStateToProps(state) {
    return {
        currentVote: state.currentVote
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
}

const wrappedComponent = connect(mapStateToProps, mapDispatchToProps)(SingleVotePage);
wrappedComponent.preRender = (renderProps) => Actions.loadVote(renderProps.params.id);
export default wrappedComponent;
