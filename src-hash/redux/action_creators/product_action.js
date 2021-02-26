import {
    SAVE_PRODUCT_LIST
} from '../action_types'


export function CreatSaveProductListAction(value) {
    return {
        type: SAVE_PRODUCT_LIST,
        data: value
    }
}