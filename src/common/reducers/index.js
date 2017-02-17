import { combineReducers } from 'redux';

import votes from './votes';
import currentVote from './currentVote';
import login from './login';

export default combineReducers({
    votes,
    currentVote,
    login
});
