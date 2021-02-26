import {
    USER_IS_LOGINED,
    USER_IS_LOGOUTED
} from '../action_types'



export function CreateUserInfoToStateAction(value) {
    let {
        data,
        remember
    } = value;
    if (remember) {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
    }
    return {
        type: USER_IS_LOGINED,
        data: data
    }
}

export function CreateDelUserInfoFromStateAction() {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    return {
        type: USER_IS_LOGOUTED
    }
}