import axios from 'axios';

import * as Config from './conf.js';

let base =Config.g_base_url;

export const post=(url,data)=>{
    var params=new URLSearchParams();
    params.append('token',sessionStorage.getItem('token'));
    params.append('merchantUserId',sessionStorage.getItem('userId'));
    if(data!=null){
        for(var key in data)params.append(key,data[key]);
    }
    return axios.post(`${base}${url}`, params).then(
        res => {
            if(res.data.status==200){
                return {state:true,data:res.data.data};
            }else{
                return {state:false,data:res.data.message};
            }
        }
    ).catch(
        error =>{
            return {state:false,data:error.message}
        }
    );
}

export const getURLParams=key=>{
    var i=location.hash.indexOf('?');
    if(i==-1)return;
    var params='&'+location.hash.substring(i+1)+'&';
    key='&'+key+'=';
    i=params.indexOf(key);
    if(i==-1)return;
    i=params.indexOf("=",i)+1;
    return params.substring(i,params.indexOf('&',i));
}