import axios from 'axios';

import * as Config from './conf.js';


import * as Api from './api.js';

let base = Config.g_base_url;




export const getItemList = (compId) => {

    let data = {
        merchantUserId: sessionStorage.getItem("userId"),
        token: sessionStorage.getItem('token'),
        compId: compId
    }

    return Api.requestForm2('/component/item/list', data)
        .then(res => res);


};
export const getComponentList = (pageId) => {

    let data = {
        merchantUserId: sessionStorage.getItem("userId"),
        token: sessionStorage.getItem('token'),
        pageId: pageId
    }

    return Api.requestForm2('/component/query', data)
        .then(res => res);


};
export const getAllPage = () => {

    let data = {
        merchantUserId: sessionStorage.getItem("userId"),
        token: sessionStorage.getItem('token')
    }

    return Api.requestForm2('/page/query', data)
        .then(res => res);


};

export const queryMainPortal = () => {

    let data = {
        entranceType: "PLATFORM",
        entranceId: sessionStorage.getItem("merchantId"),
        token: sessionStorage.getItem('token')
    }

    return Api.requestForm2('/page/mainpage', data)
        .then(res => res);


};

//修改组件信息
export const updateComponent = (params) => {

    let data = {};
    Object.assign(data, params);
    data.merchantUserId = sessionStorage.getItem("userId");
    data.token = sessionStorage.getItem('token');

    return Api.requestForm2('/component/update', data)
        .then(res => res);


};


export const addComponent = (model) => {
    model.token = sessionStorage.getItem('token');
    model.merchantUserId = sessionStorage.getItem("userId");
    return Api.requestForm2('/component/add', model)
        .then(res => res);
};

export const addPage = (pageName) => {
    let model = {}
    model.token = sessionStorage.getItem('token');
    model.merchantUserId = sessionStorage.getItem("userId");
    model.pageName = pageName;
    return Api.requestForm2('/page/add', model)
        .then(res => res);
};

export const deletePage = (pageId) => {
    let model = {}
    model.token = sessionStorage.getItem('token');
    model.merchantUserId = sessionStorage.getItem("userId");
    model.pageId = pageId;
    return Api.requestForm2('/page/delete', model)
        .then(res => res);
};

export const deleteComponent = (compId) => {
    let model = {}
    model.token = sessionStorage.getItem('token');
    model.merchantUserId = sessionStorage.getItem("userId");
    model.compId = compId;
    return Api.requestForm2('/component/delete', model)
        .then(res => res);
};

 


export const updatePage = (model) => {
    model.token = sessionStorage.getItem('token');
    model.merchantUserId = sessionStorage.getItem("userId");
    return Api.requestForm2('/page/update', model)
        .then(res => res);
};