import React from 'react';
import VoteList from '../components/VoteList/VoteList';
import VoteComposer from '../components/VoteComposer/VoteComposer';
import { dd } from '../toolbox';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class VotePage extends React.Component {
       /**
    * Lifecycle hook for the first rendering
    * Loading all votes from the database
    */
    componentDidMount() {
        this.props.loadVotes();
    }

    render() {
        this.props.setTitle('Overview - Vote as a Service (VaaS)');
        const {votes} = this.props;
        return (
            <div>
                <VoteList allVotes={votes} />
                <VoteComposer
                    active={false}
                    onActivate={ () => this.props.pushPath('/compose') }
                />
            </div>
        );
    }
}

VotePage.propTypes = {
    votes:      React.PropTypes.array.isRequired,
    setTitle:   React.PropTypes.func.isRequired,
    pushPath:   React.PropTypes.func.isRequired,
    loadVotes:  React.PropTypes.func.isRequired
};

import * as Actions from '../actions';

function mapStateToProps(state) {
    return {
        votes: state.votes
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
}

const wrappedComponent = connect(mapStateToProps, mapDispatchToProps)(VotePage);
wrappedComponent.preRender = () => Actions.loadVotes();
export default wrappedComponent;
