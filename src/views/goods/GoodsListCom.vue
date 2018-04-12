<template>
	<section>
		<!--工具条-->
		<el-form :inline="true" :model="searchForm" size="mini">
			<el-form-item>
				<el-input v-model="searchForm.name" placeholder="商品名称"></el-input>
			</el-form-item>
			<!-- <el-form-item>
				<el-cascader style="width:150px;" placeholder="分类" v-model="searchForm.catIdList" :options="options"
					filterable  @change="doQueryByCat"></el-cascader>
			</el-form-item> -->
			<el-form-item>
				<el-button type="primary" size="small" plain @click="doQuery">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button type="reset" size="small" plain @click="doResetQuery">重置</el-button>
			</el-form-item>
		</el-form>

		<!--列表-->
		<el-table :data="goodsData" highlight-current-row v-loading="listLoading" size="mini" width="100%" max-height="410" @current-change="doSelectRow">

			<!-- <el-table-column prop="id" label="商品ID" width="120" sortable></el-table-column> -->

			<el-table-column prop="logo_url" label="商品图片" width="80">
				<template slot-scope="scope">
					<img :src="scope.row.goodsImg.split(',')[0]" style="width:40px;height:40px;">
				</template>
			</el-table-column>

			<el-table-column prop="goodsName" label="商品名" width="200" sortable>
			</el-table-column>
			<el-table-column prop="code" label="商品编码" width="100" sortable>
			</el-table-column>
			<el-table-column prop="storageNum" label="库存" width="70" sortable>
			</el-table-column>
			<el-table-column prop="labelPrice" label="标签价" width="80" sortable>
			</el-table-column>
		
		</el-table>

		<!--工具条-->
			<el-pagination layout="prev, pager, next" 
			:page-size="pageSize" :total="total"
			@current-change="onPageChange">
			</el-pagination>

		<!--编辑界面-->

		<!--新增界面-->

	</section>
</template>

<script>
import util from '../../common/js/util'
//import NProgress from 'nprogress'
import * as Api from '../../api/api.js'


export default {
	data() {
		return {
			pageSize: 20,
			total: 100,
			currentPage:0,

			options: [],
			searchForm: {
				name: '',
				goodsStatus:1,
			},

			goodsData: [],
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
		doSelectRow(row){
			this.$emit("doSelectGoods",row);
		},
		doQueryTree() {
			Api.requestQueryTree().then(res => {
				this.options = res.data.children
			});
		},
		onChangeCatId(){
			this.doQueryByCat();
		},
		doQueryByCat(){
			let pos = this.searchForm.catIdList.length;
			if(pos>0){
				let catId = this.searchForm.catIdList[pos-1];
				Api.requestQueryGoodsByCat(catId).then(res => {
					this.total = 100
					this.goodsData = res.data;
				});
			}
		},
		onPageChange(page){
			this.currentPage = page-1;
			this.doQuery()
		},
		doResetQuery() {
			this.searchForm.name = "";
			//this.searchForm.catIdList=["",""]
			this.doQuery()
		},
		doQuery() {
			let params = {}
			if ((this.searchForm.name || '') != '') {
				params.nameOrCode = this.searchForm.name
			}
			params.page=this.currentPage
			Api.requestQueryGoods(params).then(res => {
				console.log("商品列表",res.data)
				this.total = res.page.total;
				this.goodsData = res.data;
			});
		},
	},
	mounted() {
		this.doQuery();
		this.doQueryTree();
	}
}

</script>

<style scoped>

</style>