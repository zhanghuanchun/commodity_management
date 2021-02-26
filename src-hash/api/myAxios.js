import axios from 'axios'
import qs from 'querystring'
import {
    message
} from 'antd'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '../redux/store'
import {
    USER_IS_LOGOUTED
} from '../redux/action_types';
const instance = axios.create({
    timeout: 10000,
});

instance.interceptors.request.use(config => {
    NProgress.start();
    let {
        token
    } = store.getState().userInfo
    if (token) {
        config.headers.Authorization = 'zhc_' + token
    }
    let {
        method
    } = config;
    if (method.toLowerCase() === 'post') {
        let {
            data
        } = config;
        config.data = qs.stringify(data);
    }
    return config;
});

instance.interceptors.response.use(response => {
    NProgress.done();
    return response.data;
}, function (error) {
    NProgress.done();
    if (error.response) {
        if (error.response.status === 401) {
            store.dispatch({
                type: USER_IS_LOGOUTED
            })
            message.error("用户身份已过期，请重新登录！")
        }else if(error.response.status === 404){
            message.error("访问资源出错,请检查路径！")
        }else if(error.response.status === 500){
            message.error("服务器错误,请检查！")
        }
    } else {
        message.error('其他错误:'+error.message, 1)
    }
    return new Promise(() => {});
});

export default instance;