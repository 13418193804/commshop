import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home1.vue'
import Main from './views/Main.vue'
import Table from './views/nav1/Table.vue'
import Form from './views/nav1/Form.vue'
import user from './views/nav1/user.vue'
import Page4 from './views/nav2/Page4.vue'
import Page5 from './views/nav2/Page5.vue'
import Page6 from './views/nav3/Page6.vue'

import echarts from './views/charts/echarts.vue'
import SaleCharts from './views/charts/SaleCharts.vue'


import GoodsList from './views/goods/GoodsList.vue'
import AddGoods from './views/goods/AddGoods1.vue'
import Category from './views/goods/Category1.vue'


import OrderList from './views/order/OrderList.vue'

import MemberList from './views/member/MemberList.vue'

import OrderDetail from './views/order/OrderDetail.vue'

import MainPage1 from './views/custompage/MainPage1.vue'

import LogisticsModel from './views/logistics/LogisticsModel.vue'
import ModelEditer from './views/logistics/ModelEditer.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: 'login',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: 'notfound',
        hidden: true
    },
    {
        path: '/',
        component: Home,
        //name: '首页',
        iconCls: 'fa fa-home fa-fw',//图标样式class
        hidden:true,
        children: [
            { path: '/', component: Main,name: '首页'},
        ]
    },
    {
        path: '/',
        component: Home,
        name: '商城配置',
        iconCls: 'fa fa-desktop fa-fw',//图标样式class
        children: [
            /*{ path: '/table', component: Table, name: '商城信息' },
            { path: '/form', component: Form, name: '重要通知' },*/
            { path: '/mainpage1', component: MainPage1, name: '商城布局' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '商品服务',
        iconCls: 'fa fa-shopping-bag fa-fw',//图标样式class
        children: [
            { path: '/goodslist', component: GoodsList, name: '商品列表' },
            { path: '/addgoods', component: AddGoods, name: '添加商品',hidden:true},
            { path: '/category', component: Category, name: '商品分类' },
            // { path: '/logisticsmodel', component: LogisticsModel, name: '运费模板' },
            { path: '/modelediter', component: ModelEditer, name: '运费模板编辑' ,hidden: true},
          ]
    },
    {
        path: '/',
        component: Home,
        name: '订单服务',
        iconCls: 'fa fa-id-card-o fa-fw',
        children: [
            { path: '/orderlist', component: OrderList, name: '订单管理' },
            { path: '/orderDetail', component: OrderDetail, name: '订单详情',hidden: true },
            { path: '/orderlist?orderStatus=ORDER_WAIT_PAY', component: OrderDetail, name: '未支付订单',hidden: true },
            { path: '/orderlist?orderStatus=ORDER_WAIT_SENDGOODS', component: OrderDetail, name: '待发货订单' ,hidden: true},
            { path: '/orderlist?orderStatus=ORDER_WAIT_RECVGOODS', component: OrderDetail, name: '待收货订单' ,hidden: true},
            { path: '/orderlist?orderStatus=ORDER_END_GOODS', component: OrderDetail, name: '已完成订单' ,hidden: true},
            { path: '/orderlist?orderStatus=ORDER_CANCEL_PAY', component: OrderDetail, name: '已取消订单' ,hidden: true},
        ]
    },
    // {
    //     path: '/',
    //     component: Home,
    //     name: '会员服务',
    //     iconCls: 'fa fa-users fa-fw',
    //     children: [
    //         { path: '/memberlist', component: MemberList, name: '会员管理' },
      
    //     ]
    // },
    // {
    //     path: '/',
    //     component: Home,
    //     name: '报表服务',
    //     iconCls: 'fa fa-line-chart fa-fw',
    //     children: [
    //         { path: '/salecharts', component: SaleCharts, name: '销售报表' },
    //         { path: '/echarts8', component: echarts, name: '资金报表',hidden:true},
    //         { path: '/echarts9', component: echarts, name: '商户报表',hidden:true}
    //     ]
    // },
    {
        path: '/',
        component: Home,
        name: '营销服务',
        iconCls: 'fa fa-tags fa-fw',
        hidden:true,
        children: []
    },
    {
        path: '/',
        component: Home,
        name: '设置',
        iconCls: 'fa fa-cog fa-fw',
        hidden:true,
        children: [
            { path: '/table11', component: Page6, name: '权限分配' },
            { path: '/table12', component: Page6, name: '用户查询' },
            { path: '/password', component: Page6, name: '修改密码' }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;