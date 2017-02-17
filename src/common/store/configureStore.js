import { compose, createStore, applyMiddleware } from 'redux';
import rootReducer from '../reducers';
import thunk from 'redux-thunk';

import history from '../history';
import { syncHistoryWithStore } from 'react-router-redux';

export default function configureStore(initialState) {
    const reduxRouterMiddleware = syncHistoryWithStore(history);
    const store = createStore(
        rootReducer,
        initialState,
        compose(
            applyMiddleware(
                thunk,
                reduxRouterMiddleware
            )
        )
    );

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducers', () => {
            const nextRootReducer = require('../reducers/index');
            store.replaceReducer(nextRootReducer);
        });
    }

    return store;
}
