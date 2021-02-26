import {
    SAVE_PRODUCT_LIST
} from '../action_types.js';


let initState = [];

export default function SaveProductListReducer(preState = initState, action) {
    let {
        type,
        data
    } = action
    let newState
    switch (type) {
        case SAVE_PRODUCT_LIST:
            newState = [...data];
            return newState;
        default:
            return preState;
    }
}