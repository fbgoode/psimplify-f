import {combineReducers} from 'redux';
import user from './user-reducer.js';
import modal from './modal-reducer.js';
import message from './message-reducer.js';


const rootReducer = combineReducers({
    user,
    modal,
    message
});

export default rootReducer;