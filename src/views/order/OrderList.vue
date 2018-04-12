<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="searchForm">
				<el-row>

					<el-form-item>
						<el-input v-model="searchForm.orderId" placeholder="订单编号"></el-input>
					</el-form-item>

					<el-form-item>
						<el-input v-model="searchForm.contactName" placeholder="收货人"></el-input>
					</el-form-item>

					<el-form-item>
						<el-input v-model="searchForm.contactPhone" placeholder="联系电话"></el-input>
					</el-form-item>


					 <el-select v-model="searchForm.orderStatus" placeholder="订单类型">
    					<el-option
      						v-for="(item,index) in searchForm.orderStatusOptions"
      						:key="index"
      						:label="item.label"
      						:value="item.value">
    					</el-option>
  					</el-select>


			

					<el-form-item>

						<el-date-picker v-model="searchForm.beginDate" type="date" placeholder="开始日期">
						</el-date-picker>
					</el-form-item>
					<el-form-item>
						<el-date-picker v-model="searchForm.endDate" type="date" placeholder="结束日期">
						</el-date-picker>

					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item>
						<el-button type="primary" @click="doQuery">查询</el-button>
					</el-form-item>

					<el-form-item>
						<el-button type="reset" @click="doResetQuery">重置</el-button>
					</el-form-item>
				</el-row>
			</el-form>
		</el-col>

		<el-dialog :visible.sync="showSendDialog" size="small" title="发货地址">

			 <el-form label-width="120px">
          

				<el-form-item label="订单号" >
					<el-input v-model="rowObject.orderId" disabled></el-input>
				</el-form-item>

				<el-form-item label="联系人名称">
					<el-input v-model="rowObject.contactName" disabled></el-input>
				</el-form-item>

				<el-form-item label="收货地址">
					<el-input v-model="rowObject.address" disabled></el-input>
				</el-form-item>

				<el-form-item label="物流公司名">
					<el-input v-model="rowObject.transportName"></el-input>
				</el-form-item>

				<el-form-item label="快递订单号">
					<el-input v-model="rowObject.transportNo"></el-input>
				</el-form-item>

			</el-form>

			<span slot="footer" class="dialog-footer">
				<el-button @click="showSendDialog = false">取 消</el-button>
				<el-button type="primary" @click="updateSendGoodsStatus">确 定</el-button>
			</span>

		</el-dialog>

		<!--列表-->
		<el-table :data="orderDataList" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 120%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column prop="orderId" label="订单ID" width="120" sortable>
			</el-table-column>

			<el-table-column prop="orderIcon" label="商品图片" width="160">

				<template slot-scope="scope">
					<img :src="scope.row.orderIcon" style="width:80px;height:80px;">
				</template>

			</el-table-column>

			<el-table-column prop="orderTitle" label="商品名" width="160" sortable>
			</el-table-column>

			<el-table-column prop="orderTotalPrice" label="订单金额" width="80" sortable>
			</el-table-column>

			<el-table-column prop="orderGoodsNum" label="商品件数" width="80" sortable>
			</el-table-column>

			<el-table-column prop="orderStatus" label="状态" width="100" sortable>

				<template slot-scope="scope">
					{{ formatOrderStatus(scope.row.orderStatus)}}
				</template>

			</el-table-column>

			<el-table-column label="操作" width="100">

				<template slot-scope="scope">

					<div class="detail-button" @click="doViewDetail(scope.row)">查看详情</div>
					<div v-if="scope.row.orderStatus=='ORDER_WAIT_SENDGOODS'" class="sendgoods-button" @click="doSendGoods(scope.row)">发货</div>
					<div v-if="scope.row.orderStatus=='ORDER_WAIT_PAY'" class="cancel-button" @click="doCancelOrder(scope.row)">取消订单</div>
					<div v-if="scope.row.orderStatus=='ORDER_WAIT_RECVGOODS'" class="confirm-button" @click="doConfirmOrder(scope.row)">完成收货</div>


				</template>
			</el-table-column>

			<el-table-column prop="createTime" label="订单时间" width="120" sortable>
			</el-table-column>

			<el-table-column prop="contactName" label="联系人" width="110" sortable>
			</el-table-column>

			<el-table-column prop="contactPhone" label="联系电话" width="110" sortable>
			</el-table-column>

		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">

			<el-pagination layout="prev, pager, next" :page-size="pageSize" :total="total" @current-change="onPageChange">
			</el-pagination>
		</el-col>

		<!--编辑界面-->

		<!--新增界面-->

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

			rowObject: {

			},

			showSendDialog: false,
			pageSize: 20,
			total: 100,
			currentPage: 0,

			options: [],
			searchForm: {
				orderStatusOptions:[
					{label:'全部订单',value:''},
					{label:'未支付订单',value:'ORDER_WAIT_PAY'},
					{label:'待发货订单',value:'ORDER_WAIT_SENDGOODS'},
					{label:'待收货订单',value:'ORDER_WAIT_RECVGOODS'},
					{label:'确认收货订单',value:'ORDER_CONFIRM_RECVGOODS'},
					{label:'已取消订单',value:'ORDER_CANCEL_PAY'},
					{label:'已完成订单',value:'ORDER_END_GOODS'}
	
				]
	
			},


			catIdList: [],
			orderDataList: [],
			total: 0,
			page: 1,
			listLoading: false,
			sels: [],//列表选中列

			editFormVisible: false,//编辑界面是否显示
			editLoading: false,
			editFormRules: {
				name: [
					{ required: true, message: '请输入姓名', trigger: 'blur' }
				]
			},

		}
	},
	methods: {
		//性别显示转换


		reloadPage(){
			console.log("reload....");
			let orderStatus = this.$route.query.orderStatus
			orderStatus = orderStatus||''
			console.log(orderStatus)

			this.searchForm.orderStatus = orderStatus
			this.doQuery()

		},

		selsChange() {


		},

		updateSendGoodsStatus() {

			if ((this.rowObject.transportName || '') == '') {
				this.$alert("物流公司名字为空");
				return;
			}

			if ((this.rowObject.transportNo || '') == '') {

				this.$alert("订单号为空");
				return;
			}

			Api.doConfirm(this, "是否确认发货？").then(res => {

				ApiOrder.requestSendGoods(this.rowObject.orderId, this.rowObject.transportName, this.rowObject.transportNo).then(ret => {

					if(ret.retCode==false){
						this.$alert("发送货物操作错误，请检查数据！")
						return;		

					}

					this.doQuery();

					this.showSendDialog = true;

					this.$message("商品发送成功")


				})

			})

		},

		doSendGoods(row) {

			this.rowObject = Object.assign({}, row);

			this.showSendDialog = true;

		},

		doCancelOrder(row){

			this.rowObject = Object.assign({}, row);
			Api.doConfirm(this,"是否确认取消该订单").then(res=>{
				if(res==true){

						ApiOrder.requestCancelOrder(this.rowObject.orderId).then(res=>{

							if(res.retCode==true){
								this.$message("取消成功")
								this.doQuery();

		
							}else{
								this.$alert("取消订单失败");
							}
						})

					
				};


			})




		},

		doViewDetail(row) {
			let orderId = row.orderId
			this.$router.push({name:"订单详情",params:{orderId:orderId}})
		},

		formatOrderStatus(orderStatus) {

			if (orderStatus == 'ORDER_WAIT_SENDGOODS') {
				return "等待发货";
			}
			if (orderStatus == 'ORDER_WAIT_PAY') {
				return "等待支付";
			}

			if (orderStatus == 'ORDER_WAIT_RECVGOODS') {
				return "等待收货";
			}


			if (orderStatus == 'ORDER_WAIT_PAY') {
				return "等待支付";
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
		doQuery() {
			let params = {

			}
			if ((this.searchForm.orderId || '') != '') {

				params.orderId = this.searchForm.orderId


			}

			if ((this.searchForm.orderStatus || '') != '') {

				params.orderStatus = this.searchForm.orderStatus


			}

			if ((this.searchForm.beginDate || '') != '') {

				params.beginDate = this.moment(this.searchForm.beginDate).format("YYYY-MM-DD") + " 00:00:00"



			}




			if ((this.searchForm.endDate || '') != '') {

				params.endDate = this.moment(this.searchForm.endDate).format("YYYY-MM-DD") + " 23:59:59"

			}

			params.page = this.currentPage

			//requestOrderList

			ApiOrder.requestOrderList(params).then(res => {

				//this.total = res.page.total
console.log("订单",res.data)
				this.orderDataList = res.data.orderList;

			})





		},

		handleOffline(index, row) {

			Api.doConfirm(this, "是否要将该商品下架！").then(res => {

				Api.requestOnlineGoods(row.id, false).then(ret => {

					this.doQuery();

					this.$message("商品下架成功")


				})

			})




		},

		//修改
		handleOnline(index, row) {
			console.log(row.id)
			Api.doConfirm(this, "是否要将该商品上架！").then(res => {

				Api.requestOnlineGoods(row.id, true).then(ret => {

					this.doQuery();
					this.$message("商品上架成功")

				})

			})

		},


		//修改
		handleEdit(index, row) {
			console.log(row.id)
			this.$router.push({ name: "添加商品", params: { goodsId: row.id } })

		},

		handleDelete(index, row) {
			console.log(row.id)

			Api.doConfirm(this, "是否需要删除该信息!").then(res => {
				if (res) {

					Api.requestDeleteGoods(row.id).then(res => {
						this.doQuery();

					})
				}
			});

		},

		//显示新增界面
		handleAdd() {
			this.$router.push("/addgoods")
		},

		//批量删除
	},
	mounted() {
		this.doQuery();
	},
	 watch: {
      '$route': "reloadPage"
    },
}

</script>

<style scoped>
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