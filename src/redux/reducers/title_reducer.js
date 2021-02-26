import {
    SAVE_TITLE,
    CLEAR_TITLE
} from '../action_types.js';


let initState = '';

export default function SaveAndClearTitleReducer(preState = initState, action) {
    let {
        type,
        data
    } = action
    let newState
    switch (type) {
        case SAVE_TITLE:
            newState = data;
            return newState;
        case CLEAR_TITLE:
            newState = '';
            return newState;
        default:
            return preState;
    }
}