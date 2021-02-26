import {
    SAVE_CATEGORY_INFO
} from '../action_types'


export function CreatSaveCategoryInfoAction(value) {
    return {
        type: SAVE_CATEGORY_INFO,
        data: value
    }
}