import axios from 'axios';

import * as Config from './conf.js';

let base = Config.g_base_url;

//let base = 'http://127.0.0.1:9090';


// let base ='http://127.0.0.1:9090/';

export const requestLogin = params => {
    return axios.post(`/login`, params).then(res => res.data);
};


export const requestCommon = (sql) => {

    var querystring = require('querystring');


    return axios.post(`${base}/dict/commsql`,
            querystring.stringify({
                sql: sql
            }), {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            })
        .then(res => res)
        .catch(error => error);

};

export const requestBody = (url, body) => {



    return axios.post(`${base}${url}`, body)
        .then(res => {

            if (res.status != 200) {
                return {
                    retCode: false,
                    message: "网络数据异常,错误代码是" + res.status,
                    data: {}
                }

            }

            if (res.data.status != 200) {
                return {
                    retCode: false,
                    message: res.data.message,
                    data: {}
                }

            }

            return {
                retCode: true,
                message: '',
                data: res.data.data
            }

        })
        .catch(error => {

            return {
                retCode: false,
                message: `网络请求异常 请求路径 ${urlPath},错误信息 ${error}`,
                data: {}
            }


        });

};


export const requestForm = (urlPath, params) => {
    var querystring = require('querystring');
    console.log(`${base}${urlPath}`)

    return axios.post(`${base}${urlPath}`,
            querystring.stringify(params), {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            })
        .then(res => {

            if (res.status != 200) {
                return {
                    retCode: false,
                    message: "网络数据异常,错误代码是" + res.status,
                    data: {}
                }

            }

            if (res.data.status != 200) {
                return {
                    retCode: false,
                    message: res.data.message,
                    data: {}
                }

            }

            return {
                retCode: true,
                message: '',
                data: res.data.data
            }

        })
        .catch(error => {

            return {
                retCode: false,
                message: `网络请求异常 请求路径 ${urlPath},错误信息 ${error}`,
                data: {}
            }


        });

};

export const requestGet = (urlPath) => {

    var querystring = require('querystring');

    console.log("enter get ")
    return axios.get(`${base}${urlPath}`)
        .then(res => {

            if (res.status != 200) {
                return {
                    retCode: false,
                    message: "网络数据异常,错误代码是" + res.status,
                    data: {}
                }

            }

            if (res.data.status != 200) {
                return {
                    retCode: false,
                    message: res.data.message,
                    data: {}
                }

            }

            return {
                retCode: true,
                message: '',
                data: res.data.data
            }

        })
        .catch(error => {

            return {
                retCode: false,
                message: `网络请求异常 请求路径 ${urlPath},错误信息 ${error}`,
                data: {}
            }


        });

};

export const doMerchantLogin = (loginName,password) => {


    let data={
        loginName:loginName,
        password:password
    }

    return requestForm('/merchant/user/login', data)
    .then(res=>res)





}
    





