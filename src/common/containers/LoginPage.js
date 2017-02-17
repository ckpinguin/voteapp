import React from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.onChangee = this.onChange.bind(this);
        this.login = this.login.bind(this);
        this.isValidEmail = this.isValidEmail.bind(this);
        this.state = {
            email: null
        };
    }

    login() {
        this.props.login(this.state.email);
        this.redirect();
    }

    redirect() {
        const destination = `/${this.props.params.redirect
           ? this.props.params.redirect : ''}`;
        // We don't want login page in history
        this.props.replacePath(destination);
    }

    onChange(event) {
        const email = event.target.value;
        this.setState({
            email
        });
    }

    isValidEmail() {
        return this.state.email;
    }

    render() {
        this.props.setTitle('Login - Vote as a Service (VaaS)');
        return <div className="app-LoginPage-row">
            <div className="app-LoginPage-head">
                <h1 className="app-LoginPage-title">You must login to perform this action</h1>
            </div>

            <div className="app-LoginPage-loginForm">
                <input type="text"
                    placeholder="Enter your email address"
                    value={this.state.email}
                    onChange={this.onChange}/>
                 <div className="app-LoginPage-buttonBar">
                    <a className={this.isValidEmail() ? 'app-LoginPage-button' : 'app-LoginPage-button-disabled'}
                       onClick={this.isValidEmail() ? this.login : null}>Login</a>
                    <a className="app-LoginPage-buttonBar"
                       onClick={this.props.routeToMain}>Cancel</a>
                </div>
            </div>
        </div>;
    }
}
LoginPage.propTypes = {
    setTitle:       React.PropTypes.func.isRequired,
    routeToMain:    React.PropTypes.func.isRequired,
    login:          React.PropTypes.func.isRequired,
    replacePath:    React.PropTypes.func.isRequired,
    params:         React.PropTypes.object.isRequired
};

// Since we use index.js in the actions folder, we can import it like this:
import * as Actions from '../actions';

function mapStateToProps(state) {
    return {
        login: state.login
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
}

// IIFE exported
export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
