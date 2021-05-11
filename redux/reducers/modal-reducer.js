import {SET_MODAL, RESET_MODAL} from '../types';

const initialState = {};

const menuReducer = (state = initialState, action) => {
    switch(action.type){
        case SET_MODAL:
            return action.payload;
        
        case RESET_MODAL : 
            return initialState;

        default : 
            return state
    }
}

export default menuReducer;