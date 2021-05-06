import {OPEN_MENU, CLOSE_MENU} from '../types';

const initialState = {
    visible: false
};

const menuReducer = (state = initialState, action) => {
    switch(action.type){
        case OPEN_MENU :
            return {visible:true};
        
        case CLOSE_MENU : 
            return {visible:false};

        default : 
            return state
    }
}

export default menuReducer;