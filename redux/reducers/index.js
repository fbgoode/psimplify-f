import {combineReducers} from 'redux';
import user from './user-reducer.js';
import menu from './menu-reducer.js';
import message from './message-reducer.js';


const rootReducer = combineReducers({
    user,
    menu,
    message
});

export default rootReducer;