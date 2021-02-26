import {
    SAVE_CATEGORY_INFO
} from '../action_types.js';


let initState = [];

export default function SaveCategoryInfoReducer(preState = initState, action) {
    let {
        type,
        data
    } = action
    let newState
    switch (type) {
        case SAVE_CATEGORY_INFO:
            newState = [...data];
            return newState;
        default:
            return preState;
    }
}