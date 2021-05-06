import {LOGIN, LOGOUT, UPDATE_USER} from '../types';

const initialState = {};

const userReducer = (state = initialState, action) => {
    switch(action.type){
        case LOGIN :
            return action.payload;
        
        case LOGOUT : 
            return initialState;
            
        case UPDATE_USER :
            return {...state , ...action.payload};

        default : 
            return state;
    }
}

export default userReducer;