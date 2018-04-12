import axios from 'axios';

import * as Config from './conf.js';


import * as Api from './api.js';

let base = Config.g_base_url;






export const addCatGoodsRela = (goodsId,catId) => {

    let data = {
        token: sessionStorage.getItem('token'),
        merchantUserId: sessionStorage.getItem("userId"),
        goodsId: goodsId,
        catIds:catId
    }

    return Api.requestForm('/cat/goods/linkadd', data)
        .then(res => {
            if (res.status == 200 && res.data.status == 200) {

                return {
                    retCode: true,
                    message: '',
                    data: res.data.data
                }
            } else {
                return {
                    retCode: false,
                    message: res.data.message,
                    data: res.data.data
                };

            }

        })
        .catch(error => {

            console.error("addCatGoodsRela")
            console.error(error)


        });
};

export const updateCatGoodsRela = (linkId, goodsId, catId) => {

    let data = {
        token:sessionStorage.getItem('token'),
        merchantUserId: sessionStorage.getItem("userId"),
        goodsId: goodsId,
        linkId: linkId,
        catId: catId
    }
    return Api.requestForm2('/cat/goods/linkupdate', data)
        .then(res => res);
};

export const addCatGoodsRelaBatch = (goodsIds,catId) => {
    let data = {
        token: sessionStorage.getItem('token'),
        merchantUserId: sessionStorage.getItem("userId"),
        goodsIds: goodsIds,
        catId:catId
    }
    return Api.requestForm('/goods/cat/add', data).then(
        res => {
            if (res.status == 200 && res.data.status == 200) {
                return {
                    retCode: true,
                    message: '',
                    data: res.data.data
                }
            } else {
                return {
                    retCode: false,
                    message: res.data.message,
                    data: res.data.data
                };
            }
        }
    );
};

export const deleteCatGoodsRela = (goodsId,catIds) => {

    let data = {
        token:sessionStorage.getItem('token'),
        merchantUserId: sessionStorage.getItem("userId"),
        goodsId: goodsId,
        catIds:catIds
    }

    return Api.requestForm2('/cat/goods/linkdelete', data)
        .then(res => res);

};



export const queryGoodsRela = (goodsId) => {

    let data = {
        token: sessionStorage.getItem('token'),
        merchantUserId: sessionStorage.getItem("userId"),
        goodsId: goodsId
    }

    return Api.requestForm2('/cat/goods/linkquery', data)
        .then(res => res);


};



export const queryComponentItem = (componentId) => {

    let data = {
        token:sessionStorage.getItem('token'),
        userId:sessionStorage.getItem("userId"),
        merchantUserId: sessionStorage.getItem("userId"),
        componentId: componentId
    }
    return Api.requestForm2('/componentitem/query', data)
        .then(res => res);

};


export const updateComponentItem = (model) => {

    model.token = sessionStorage.getItem('token');
    model.userId=sessionStorage.getItem("userId");
    model.merchantUserId = sessionStorage.getItem("userId");


    return Api.requestForm2('/component/item/update', model)
        .then(res => res);


};

export const addComponentItem = (model) => {
    
        model.token = sessionStorage.getItem('token');
        model.merchantUserId = sessionStorage.getItem("userId");
        model.userId=sessionStorage.getItem("userId");

        console.log("addComponentItem")
        console.log(model);
    
    
        return Api.requestForm2('/component/item/add', model)
            .then(res => res);
    
    
    };


    export const deleteComponentItem = (itemId) => {
        
        let data = {
            token: sessionStorage.getItem("token"),
            userId:sessionStorage.getItem("userId"),
            merchantUserId: sessionStorage.getItem("userId"),
            itemId: itemId
        }
     
         
        
            return Api.requestForm2('/component/item/delete', data)
                .then(res => res);
        
        
        };   

    
     export const createDefaultPage = () => {
            
            let data = {
                appid: sessionStorage.getItem("appId")
            }
            
            return Api.requestForm2('/page/newpage', data)
                    .then(res => res);
            
            
            };   