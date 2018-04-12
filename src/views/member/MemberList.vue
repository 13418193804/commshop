<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="searchForm">
				<el-row>

					<el-form-item>
						<el-input v-model="searchForm.orderId" placeholder="用户名称"></el-input>
					</el-form-item>

					<el-form-item>
						<el-input v-model="searchForm.name" placeholder="手机号码"></el-input>
					</el-form-item>

			
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

		<!--列表-->
		<el-table :data="memberList" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 120%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<!-- <el-table-column prop="userId" label="用户ID" width="120" sortable>
			</el-table-column> -->

			<el-table-column prop="iconUrl" label="用户头像" width="160">

				<template slot-scope="scope">
					<img :src="scope.row.iconUrl" style="width:80px;height:80px;">
				</template>

			</el-table-column>

			<el-table-column prop="nickName" label="昵称" width="200">
			</el-table-column>

			<el-table-column prop="sex" label="性别" width="100">
			</el-table-column>

			<el-table-column prop="mobile" label="手机号码" width="150"></el-table-column>

			<el-table-column prop="createTime" label="加入时间" width="180" sortable>
			</el-table-column>

			<!-- <el-table-column prop="openId" label="微信openid" width="100" sortable></el-table-column> -->

			<el-table-column label="操作" width="100">

				<template slot-scope="scope">
					<div v-if="scope.row.orderStatus=='ORDER_WAIT_SENDGOODS'" class="sendgoods-button" @click="doViewDetail">发货</div>
					<div v-if="scope.row.orderStatus=='ORDER_WAIT_PAY'" class="cancel-button" @click="doViewDetail">取消订单</div>
					<div  class="detail-button" @click="doViewDetail">查看详情</div>
				</template>
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

import * as ApiMember from '../../api/memberapi.js'

export default {
	data() {
		return {
			pageSize: 20,
			total: 100,
			currentPage: 0,

			options: [],
			searchForm: {
				name: '',
				code: '',
				catId: '',
				beginDate: '',
				endDate: ''
			},


			catIdList: [],
			memberList: [],
			total: 0,
			page: 1,
			listLoading: false,
			sels: [],//列表选中列

	
		}
	},
	methods: {
		//性别显示转换

		doViewDetail(){

			this.$alert("点击了详情");
		},

		formatOrderStatus(orderStatus) {

			if (orderStatus == 'ORDER_WAIT_SENDGOODS') {
				return "等待发货";
			}
			if (orderStatus == 'ORDER_WAIT_PAY') {
				return "等待支付";
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
			if ((this.searchForm.name || '') != '') {

				params.name = this.searchForm.name


			}

			if ((this.searchForm.code || '') != '') {

				params.code = this.searchForm.code


			}

			if ((this.searchForm.beginDate || '') != '') {

				params.beginDate = this.moment(this.searchForm.beginDate).format("YYYY-MM-DD") + " 00:00:00"



			}




			if ((this.searchForm.endDate || '') != '') {


				params.endDate = this.moment(this.searchForm.endDate).format("YYYY-MM-DD") + " 23:59:59"


			}

			params.page = this.currentPage

			//requestOrderList

			ApiMember.requestMemberList().then(res => {

				//this.total = res.page.total

				this.memberList = res.data;

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
	}
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
	background-color:rgb(91,185,98);
	font-size: 14px;
	color: white;
	margin-top: 3px;
	margin-bottom: 3px;
	border-radius: 4px;

}

.cancel-button {
	font-weight: 800;
	text-align: center;
	background-color:rgb(231,75,56);
	font-size: 14px;
	color: white;
	margin-top: 3px;
	margin-bottom: 3px;
	border-radius: 4px;
}

</style>