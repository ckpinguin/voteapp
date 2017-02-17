import { compose, createStore, applyMiddleware } from 'redux';
import rootRecuder from '../reducers';
import thunk from 'redux-thunk';

import history from '../history';
import { syncHistoryWithStore } from 'react-router-redux';

export default function configureStore(initialState) {
    const reduxRouterMiddleware = syncHistoryWithStore(history);
    const store = compose(
        applyMiddleware(
            thunk,
            //reduxRouterMiddleware
            )
        )(createStore)(rootRecuder, initialState);

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducers', () => {
            const nextReducer = require('../reducers/index');
            store.replaceReducer(nextReducer);
        });
    }

    return store;
}
