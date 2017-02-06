import React from 'react';
import { dd } from '../../toolbox';

let loggedIn = false;

export default class LoginController extends React.Component {
    /**
    * For the onEnter-Hook of Route path (see index.js)
    * @param {object} nextState - the next state
    * @param {function} replaceState - Function to navigate elsewhere
    */
    static requireAuth(nextState, replaceState) {
        if (!loggedIn) {
            const redirect = nextState.location.pathname;
            // Replace history, so user does not get back to
            // login screen by pressing "back" button
            //this.context.router.replaceState(`login${redirect}`);
            replaceState(`login${redirect}`);
        }
    }

    /**
    * @constructs LoginController
    */
    constructor(props) {
        super(props);
        // Do the lexical binding dance
        this.onChange = this.onChange.bind(this);
        this.login = this.login.bind(this);
        this.routeToMain = this.routeToMain.bind(this);
        this.isValidEmail = this.isValidEmail.bind(this);
        this.state = {
            email: null
        };

    }

    /**
    * Lifecycle function for first rendering
    * How and where to set title when routing to a component
    * https://github.com/rackt/react-router/issues/49#issuecomment-47164264
    * there are more fancy ways of doing this, but this is the most
    * straight forward way
    */
    componentDidMount() {
        document.title = 'Login - Vote as a Service';
    }

    /**
    * The login function
    * @TODO: Implement a token or so...
    */
    login() {
        dd(null, '', 'LoginController.login()');
        loggedIn = true;
        this.redirect();
    }

    /**
    * Redirection, handles the direct call of "/login" (no redirect set)
    * @TODO: Bit of code duplication of 'requireAuth()'
    */
    redirect() {
        //
        const destination = `/${this.props.params.redirect
            ? this.props.params.redirect
            : ''}`;
        // we do not want login in our history
        this.context.router.replaceState(destination);
    }

    /**
    * Event handler, that sets email in state
    * @param {Object} event
    */
    onChange(event) {
        const email = event.target.value;
        this.setState({
            email
        });
    }

    /**
    * Pushing '/' to history
    */
    routeToMain() {
        this.context.router.push('/');
    }

    /**
    * Validates email currently in state
    */
    isValidEmail() {
      // to validate email we could use joi (only put this in an info box)
        return this.state.email;
    }

    /**
    * @TODO: Use own classes, maybe redesign whole rendering. Maybe pull it out
    * because it is a DOM-rendered component, not a compontent renderer.
    * OR just let the controller render a LoginForm Component, which seems to
    * be cleaner
    */
    render() {
        return <div className="app-LoginController">
          <div className="app-LoginController-head">
            <h1 className="app-LoginController-title">You need to login to perform that action</h1>
          </div>

          <div className="app-LoginController-loginForm">
            <input type="text"
                   placeholder="Enter your email address here"
                   value={this.state.email}
                   onChange={this.onChange}/>
            <div className="app-LoginController-buttonBar">
              <a className={this.isValidEmail()
                    ? 'app-LoginController-button'
                    : 'app-LoginController-button-disabled'}
                 onClick={this.isValidEmail() ? this.login : null}>Login</a>
              <a className="app-LoginController-button" onClick={this.routeToMain}>Cancel</a>
            </div>
          </div>
        </div>;
    }
}
LoginController.contextTypes = {
    router: React.PropTypes.object
};
