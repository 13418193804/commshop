<template>
	<section>
		<!--工具条-->
		<div class="step-panel">
			<el-steps :space="200" :active="step.activeStep">
				<el-step title="用户下单" :description="step.steps[0]"></el-step>
				<el-step title="用户付款" :description="step.steps[1]"></el-step>
				<el-step title="平台发货" description=""></el-step>
				<el-step title="物流运送" description=""></el-step>
				<el-step title="确认收货" description=""></el-step>
			</el-steps>
		</div>

	
		<div class="step-panel">
			<h3>客户信息</h3>

			<div style="height:30px;">
				<span style="width:100px;">联系人：</span>
				<span>{{orderDetail.contactName}}</span>
			
			</div>
			<div style="height:30px;">
				<span style="width:100px;">联系电话：</span>
				<span>{{orderDetail.contactPhone}}</span>
			</div>
			<div style="height:30px;">
				<span style="width:100px;"> 地址：</span>
				<span>{{orderDetail.provinceName}}{{orderDetail.cityName}}{{orderDetail.countryName}}{{orderDetail.address}}</span>
			</div>

			<div style="height:30px;">
				<span style="width:100px;">客户留言：</span>
				<span></span>
			</div>

			<div style="height:30px;">
				<span style="width:100px;"> 物流信息：</span>
				<span>{{orderDetail.transportName}} {{orderDetail.transportNo}} {{orderDetail.transportPrice}}</span>
			</div>

		</div>

			<div class="step-panel">

			<h3>订单信息</h3>

			<div style="height:30px;">
				<span>订单号：</span>
				<span>{{orderDetail.orderId}}</span>
			</div>
			<div style="height:30px;">
				<span>订单状态：</span>
				<span>{{formatOrderStatus(orderDetail.orderStatus)}}</span>
			</div>
			<div style="height:30px;">
				<span>订单创建时间：</span>
				<span>{{orderDetail.createTime}}</span>
			</div>

		</div>

		


		<div class="step-panel">

			<h3>商品信息</h3>

			<el-table :data="orderDetail.list" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 120%;">

				<el-table-column prop="goodsIcon" label="商品图片" width="160">

					<template slot-scope="scope">
						<img :src="scope.row.goodsIcon" style="width:80px;height:80px;">
					</template>

				</el-table-column>

				<el-table-column prop="goodsTitle" label="商品名字" width="180" sortable>
				</el-table-column>

				<el-table-column prop="goodsIcon" label="商品sku信息" width="160">

					<template slot-scope="scope">
						<div v-html='formatSkuContent(scope.row.skuContent)'> </div>
						
					</template>

				</el-table-column>

				<el-table-column prop="num" label="数量" width="100" sortable >
				</el-table-column>

				<el-table-column prop="price" label="商品价格" width="120" sortable />
				</el-table-column>

				<el-table-column  label="小计" width="120" >
					<template slot-scope="scope">

						<div v-html='formatRowPrice(scope.row)'> </div>
					
						
					</template>

				</el-table-column>
		
			</el-table>

			<div style="margin-top:20px;"><span style="font-size:18px;color:black;">订单总金额：</span>
			<span style="font-size:18px;color:red;">{{orderDetail.orderTotalPrice}}元</span>
			</div>
			<div style="width:90%;height:100px;">
			</div>

		</div>

	</section>
</template>

<script>
import util from '../../common/js/util'
//import NProgress from 'nprogress'
import * as Api from '../../api/api.js'


import * as ApiOrder from '../../api/orderapi.js'

export default {
	data() {
		return {

			step: {
				activeStep: 2,
				steps: ['步骤1', '步骤2', '步骤3', '步骤4'
				]
			},
			orderDetail: {

			},
			orderId: '',


			editFormRules: {
				name: [
					{ required: true, message: '请输入姓名', trigger: 'blur' }
				]
			},

		}
	},
	mounted() {

		this.orderId = this.$route.params.orderId
		this.loadOrderDetail(this.orderId);
	},
	methods: {
		//性别显示转换


	

		formatRowPrice(data){
			console.log("row data")
		
			return "<font color='red'>"+data.num*data.price+"元</font>"
	
		},



		formatSkuContent(data){
			let content=""	
			for(let i in data){
				let o = data[i]
				content =content+o["key"]+':'+o["value"]+"<br/>";

			}
			return content;



		},



		loadOrderDetail(orderId) {

			ApiOrder.requestOrderDetail(orderId).then(res => {

				if (res.retCode) {
					this.orderDetail = res.data;
					console.log("this detail")
					console.log(this.orderDetail)

				}

			})




		},


		doSendGoods(row) {

			this.rowObject = Object.assign({}, row);

			this.showSendDialog = true;

		},

		doViewDetail() {

			this.$alert("点击了详情");
		},

			formatOrderStatus(orderStatus) {

			if (orderStatus == 'ORDER_WAIT_SENDGOODS') {
				return "等待发货";
			}
			if (orderStatus == 'ORDER_WAIT_PAY') {
				return "等待支付";
			}

			if (orderStatus == 'ORDER_WAIT_PAY') {
				return "等待支付";
			}

			if (orderStatus == 'ORDER_WAIT_RECVGOODS') {
				return "等待收货";
			}


			if (orderStatus == 'ORDER_CONFIRM_RECVGOODS') {
				return "已经确认收货";
			}
		
			if (orderStatus == 'ORDER_END_GOODS') {
				return "购物流程结束";
			}

			if (orderStatus == 'ORDER_CANCEL_PAY') {
				return "订单已经被取消";
			}
	
	
			return "其他";
		},

		onPageChange(page) {

			console.log(page);

			this.currentPage = page - 1;

			this.doQuery()
		},



		doResetQuery() {
			this.searchForm.name = ""
			this.searchForm.code = ""
			this.searchForm.beginDate = ""
			this.searchForm.endDate = ""

			this.doQuery()


		},

		//修改



		//批量删除
	},

}

</script>

<style scoped>
.step-panel {
	border: 1px solid #eee;
	padding: 10px;
}

.detail-button {
	font-weight: 800;
	text-align: center;
	background-color: rgb(86, 186, 225);
	font-size: 14px;
	color: white;
	margin-top: 3px;
	margin-bottom: 3px;
	border-radius: 4px;
}

.sendgoods-button {
	font-weight: 800;
	text-align: center;
	background-color: rgb(91, 185, 98);
	font-size: 14px;
	color: white;
	margin-top: 3px;
	margin-bottom: 3px;
	border-radius: 4px;
}

.cancel-button {
	font-weight: 800;
	text-align: center;
	background-color: rgb(231, 75, 56);
	font-size: 14px;
	color: white;
	margin-top: 3px;
	margin-bottom: 3px;
	border-radius: 4px;
}

.confirm-button {
	font-weight: 800;
	text-align: center;
	background-color: rgb(231, 175, 56);
	font-size: 14px;
	color: white;
	margin-top: 3px;
	margin-bottom: 3px;
	border-radius: 4px;
}
</style>