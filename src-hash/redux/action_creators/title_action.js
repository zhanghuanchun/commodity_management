import {
    SAVE_TITLE,
    CLEAR_TITLE
} from '../action_types'
export function CreatSaveTitleAction(value) {
    return {
        type: SAVE_TITLE,
        data: value
    }
}

export function CreatClearTitleAction() {
    return {
        type: CLEAR_TITLE
    }
}