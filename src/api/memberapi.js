import axios from 'axios';

import * as Config from './conf.js';


import * as Api from './api.js';

 let base =Config.g_base_url;


export const requestMemberList = () => {

    let data={
        token:sessionStorage.getItem('token'),
        userId:sessionStorage.getItem("userId"),
        merchantUserId:sessionStorage.getItem("userId")
    }

    return Api.requestForm('/member/query' ,data)
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

            console.error("requestMemberList")
            console.error(error)


        });




};

export const requestOrderDetail = (goodsId,orderStatus) => {
    
        let data={
            token:sessionStorage.getItem('token'),
            merchantUserId:sessionStorage.getItem("userId"),
            page:0,
            pageSize:20
        }
    
        return Api.requestForm('/order/manager/queryorder' ,data)
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
        






