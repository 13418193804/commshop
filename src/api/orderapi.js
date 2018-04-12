import axios from 'axios';

import * as Config from './conf.js';


import * as Api from './api.js';

 let base =Config.g_base_url;


export const requestOrderList = (params) => {

    params.token = sessionStorage.getItem("token")
    params.merchantUserId=sessionStorage.getItem("userId")
    params.page=0
    params.pageSize=20

  
    return Api.requestForm2('/order/manager/queryorder' ,params)
        .then(res =>res);
     
};

export const requestOrderDetail = (orderId) => {
    
        let data={
            token:sessionStorage.getItem("token"),
            merchantUserId:sessionStorage.getItem("userId"),
            orderId:orderId
        }
    
        return Api.requestForm('/order/manager/queryorderdetail' ,data)
            .then(res => {
                if (res.status == 200 && res.data.status == 200) {
    
                    return { retCode: true, message: '', data: res.data.data }
                } else {
    
                    console.log(res.data)
    
                    console.log(res.data.message)
                    return {
                        retCode: false,
                        message: res.data.message,
                        data: res.data.data
                    }
                        ;
    
                }
    
            })
            .catch(error => {
    
                console.error("requestOrderList")
                console.error(error)
    
    
            });
    
    
    };

    export const requestSendGoods = (orderId,transName,transNo) => {
        
            let data={
                token:sessionStorage.getItem("token"),
                merchantUserId:sessionStorage.getItem("userId"),
                orderId:orderId,
                transName:transName,
                transNo:transNo
            }
        
            return Api.requestForm2('/order/manager/sendgoods' ,data)
                .then(res =>res)
        
        };
        
        export const requestCancelOrder = (orderId) => {
        
            let data={
                token:sessionStorage.getItem("token"),
                merchantUserId:sessionStorage.getItem("userId"),
                orderId:orderId
            }
        
            return Api.requestForm2('/order/manager/cancel' ,data)
                .then(res =>res)
        
        };
        
  





