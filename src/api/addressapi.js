import axios from 'axios';

import * as Config from './conf.js';

import * as Api from './api.js';

let base =Config.g_base_url;

export const requestProvince = () => {
    return axios.post(base+'/address/queryprovince').then(res =>res);
};