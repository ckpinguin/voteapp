import { combineReducers } from 'redux';

import votes from './votes';
import currentVote from './currentVote';
import login from './login';

import { routerReducer as routing } from 'react-router-redux';

const rootReducer = combineReducers({
    votes,
    currentVote,
    login,
    routing
});

export default rootReducer;
