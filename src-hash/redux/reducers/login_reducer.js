import {
    USER_IS_LOGINED,
    USER_IS_LOGOUTED
} from '../action_types.js';

let user = JSON.parse(localStorage.getItem('user'));
let token = localStorage.getItem('token');

let initState = {
    user: user || {},
    token: token || '',
    isLogin: user && token ? true : false
};

export default function LoginAndLogoutReducer(preState = initState, action) {
    let {
        type,
        data
    } = action
    let newState
    switch (type) {
        case USER_IS_LOGINED:
            let {
                user, token
            } = data;
            newState = {
                user,
                token,
                isLogin: true
            }
            return newState;
        case USER_IS_LOGOUTED:
            newState = {
                user: {},
                token: '',
                isLogin: false
            }
            return newState;
        default:
            return preState;
    }
}