<template>
	<div v-loading="listLoading">
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="margin-top:0px;padding-bottom:0px">
			<el-form :inline="true" :model="searchForm" size="small">
				<el-row>
					<el-form-item>
						<el-input v-model="searchForm.name" placeholder="商品名称或编码"></el-input>
					</el-form-item>

					<!-- <el-form-item>
						<el-cascader style="width:200px;" placeholder="分类" v-model="searchForm.catIdList" :options="options"
						 filterable  @change="doQueryByCat"></el-cascader>
					</el-form-item> -->

					<el-form-item>
						<el-select style="width:200px;" v-model="searchForm.goodsStatus" placeholder="商品状态">
							<el-option
							v-for="item in searchForm.goodsStatusOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
							</el-option>
						</el-select>
					</el-form-item>

					<!-- <el-form-item>
						<el-date-picker style="width:200px;" v-model="searchForm.beginDate" type="date" placeholder="开始日期">
						</el-date-picker>
					</el-form-item>
					<el-form-item>
						<el-date-picker style="width:200px;" v-model="searchForm.endDate" type="date" placeholder="结束日期">
						</el-date-picker>
					</el-form-item> -->

					<el-form-item>
						<el-date-picker v-model="searchForm.code"
							type="daterange"
							align="right"
							unlink-panels
							range-separator="-"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							:picker-options="pickerOptions2"
							@change="searchForm.changeDate">
						</el-date-picker>
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item>
						<el-button type="primary" plain @click="doQuery">查询</el-button>
					</el-form-item>

					<el-form-item>
						<el-button type="reset" plain @click="doResetQuery">重置</el-button>
					</el-form-item>

					<el-form-item>
						<el-button  type="success" @click="handleAdd">新增商品</el-button>
					</el-form-item>

					<el-form-item v-if="sels.length>0">
						<el-button  type="primary" plain @click="bacthOnline">批量上架</el-button>
						<el-button  type="primary" plain @click="bacthOffline">批量下架</el-button>
						<el-button  type="primary" plain @click="openBacthGoodsCat">加入分类</el-button>
					</el-form-item>
				</el-row>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :height="tableHeight" :data="goodsData" highlight-current-row @selection-change="selectionChange" size="small">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<!-- <el-table-column prop="id" label="商品ID" width="120" sortable></el-table-column> -->

			<el-table-column prop="logo_url" label="商品图片" width="120">

				<template slot-scope="scope">
					<img :src="scope.row.goodsImg ?scope.row.goodsImg.split(',')[0]:''" style="width:80px;height:80px;">
				</template>

			</el-table-column>

			<el-table-column prop="goodsName" label="商品名" min-width="160">
			</el-table-column>
			<el-table-column prop="code" label="商品编码" width="110" sortable>
			</el-table-column>
			<!-- <el-table-column prop="storageNum" label="库存" width="100" sortable>
			</el-table-column> -->
			<el-table-column prop="saleNum" label="销量" width="100" sortable>
			</el-table-column>
			<!-- <el-table-column prop="labelPrice" label="标签价" width="100" sortable>
			</el-table-column> -->
			<el-table-column prop="marketPrice" label="销售价" width="100" sortable>
			</el-table-column>
			<el-table-column prop="costPrice" label="供货价" width="100" sortable>
			</el-table-column>
			<el-table-column label="操作" width="300">
				<template slot-scope="scope">

					<el-button v-if="scope.row.onlineStatus==true" size="mini" plain  @click="handleOffline(scope.$index, scope.row)">下架</el-button>
					<el-button v-if="scope.row.onlineStatus==false" size="mini" type="primary" plain @click="handleOnline(scope.$index, scope.row)">上架</el-button>
					<el-button size="mini" @click="handleEdit(scope.$index, scope.row)">库存</el-button>
					<el-button size="mini" @click="handleEdit(scope.$index, scope.row)" type="info" plain>编辑</el-button>
					<el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)" plain>删除</el-button>

				</template>
			</el-table-column>
		</el-table>

		<!--分页条-->
		<el-pagination style="margin:10px 0px -10px" layout="prev, pager, next" :page-size="pageSize" :total="total" @current-change="onPageChange">
		</el-pagination>

		<!--批量加入分类-->
		<el-dialog :visible.sync="joinTag.show" title="批量加入分类" center :close-on-click-modal="false" width="500px" top="50px">
			<span>已选择 {{sels.length}} 个商品，请选择关联分类</span>
			<div :style='"width:100%;overflow-y:auto;height:"+(tableHeight-100)+"px"'>
				<categoryCom @doSelectCat='doSelectCat'></categoryCom>
			</div>
			
			<span slot='footer'>
				<el-button @click="joinTag.show=false" size="small">关闭</el-button>
				<el-button @click="bacthSetCat" type="primary" size="small" :disabled="joinTag.cat==null">提交</el-button>
			</span>
		</el-dialog>

	</div>
</template>

<script>
import util from '../../common/js/util'
import * as Api from '../../api/api.js'
import * as catApi from "../../api/catapi.js";
import categoryCom from "../goods/CategoryComponent.vue"


export default {
	data() {
		return {
			pageSize: 20,
			total: 100,
			currentPage:0,
			tableHeight:500,
			options: [],
			searchForm: {
				name: '',
				beginDate: '',
				endDate: '',
				goodsStatus:0,
				code: '',
				catId: '',
				catIdList: [],
				goodsStatusOptions:[
					{label:'全部',value:0},
					{label:'上架',value:1},
					{label:'下架',value:2},
					{label:'缺货',value:3},
				],
				changeDate:val=>{
					//alert(val[0]);
					this.searchForm.beginDate=val[0];
					this.searchForm.endDate=val[1];
				}
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
			pickerOptions2: {
				shortcuts: [{
					text: '最近一周',
					onClick(picker) {
					const end = new Date();
					const start = new Date();
					start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
					picker.$emit('pick', [start, end]);
					}
				}, {
					text: '最近一个月',
					onClick(picker) {
					const end = new Date();
					const start = new Date();
					start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
					picker.$emit('pick', [start, end]);
					}
				}, {
					text: '最近三个月',
					onClick(picker) {
					const end = new Date();
					const start = new Date();
					start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
					picker.$emit('pick', [start, end]);
					}
				}]
			},
			joinTag:{
				show:false,
				cat:null
			}
		}
	},
	methods: {
		doQueryByCat(){
			let pos = this.searchForm.catIdList.length;
			if(pos>0){
				let catId = this.searchForm.catIdList[pos-1];
				Api.requestQueryGoodsByCat(catId).then(res => {
					this.total = 100
					this.goodsData = res.data;
				})
			}
		},
		onChangeCatId(){
			this.doQueryByCat();
		},
		onPageChange(page){
			console.log(page);
			this.currentPage = page-1;
			this.doQuery()
		},
		//获取分类树
		doQueryTree() {
			Api.requestQueryTree().then(res => {
				this.options = res.data.children
			})
		},
		doResetQuery() {
			this.searchForm.name = ""
			this.searchForm.code = ""
			this.searchForm.beginDate = ""
			this.searchForm.endDate = ""
			this.searchForm.goodsStatus=0;
			this.doQuery()
		},
		//商品查询筛选
		doQuery() {
			let params = {};
			if ((this.searchForm.name || '') != '') {
				params.nameOrCode = this.searchForm.name;
			}
			if ((this.searchForm.goodsStatus || '') != '') {
				params.goodsStatus = this.searchForm.goodsStatus;
			}
			if ((this.searchForm.beginDate || '') != '') {
				params.beginDate = this.moment(this.searchForm.beginDate).format("YYYY-MM-DD") + " 00:00:00";
			}
			console.log(this.searchForm.endDate)
			if ((this.searchForm.endDate || '') != '') {
				params.endDate = this.moment(this.searchForm.endDate).format("YYYY-MM-DD") + " 23:59:59";
			}
			params.page=this.currentPage
			Api.requestQueryGoods(params).then(res => {
				console.log('res.data',res.data)
				this.total = res.page.total
				this.goodsData = res.data;
			})
		},
		//商品下线
		handleOffline(index,row){
			Api.doConfirm(this,"是否要将该商品下架！").then(res=>{
				if(!res)return;
				Api.requestOnlineGoods(row.id,false).then(ret=>{
					if(ret.retCode){
						this.doQuery();
						this.$message("商品下架成功")
					}else{
						this.$message.error("商品下架失败，"+ret.message)
					}
				})
			});
		},
		//商品上线
		handleOnline(index, row) {
			console.log(row.id)
			Api.doConfirm(this,"是否要将该商品上架！").then(res=>{
				if(!res)return;
				Api.requestOnlineGoods(row.id,true).then(ret=>{
					if(ret.retCode){
						this.doQuery();
						this.$message("商品上架成功")
					}else{
						this.$message.error("商品上架失败，"+ret.message)
					}
				})
			})
		},
		//修改
		handleEdit(index, row) {
			this.$router.push({ name: "添加商品", params: row })
		},
		handleDelete(index, row) {
			console.log(row.id)
			Api.doConfirm(this,"是否需要删除该信息!").then(res=>{
				if(res){
					Api.requestDeleteGoods(row.goodsId).then(res=>{
						this.doQuery();
					})
				}
			});
		},
		//显示新增界面
		handleAdd() {
			this.$router.push("/addgoods");
		},
		selectionChange(val){
			this.sels=val;
		},
		//批量上架商品
		bacthOnline(){
			Api.doConfirm(this,"是否要将这"+this.sels.length+"个商品上架！").then(res=>{
				if(!res)return;
				var goodsIds="";
				for(var i in this.sels)goodsIds+=(this.sels[i].id+",");
				Api.requestOnlineGoods(goodsIds,true).then(ret=>{
					if(ret.retCode){
						this.doQuery();
						this.$message("商品上架成功")
					}else{
						this.$message.error("商品上架失败，"+ret.message)
					}
				})
			});
		},
		//批量下架商品
		bacthOffline(){
			Api.doConfirm(this,"是否要将这"+this.sels.length+"个商品下架！").then(res=>{
				if(!res)return;
				var goodsIds="";
				for(var i in this.sels)goodsIds+=(this.sels[i].id+",");
				Api.requestOnlineGoods(goodsIds,false).then(ret=>{
					if(ret.retCode){
						this.doQuery();
						this.$message("商品下架成功");
					}else{
						this.$message.error("商品下架失败，"+ret.message);
					}
				})
			});
		},
		//批量设置分类
		openBacthGoodsCat(){
			this.joinTag.cat=null;
			this.joinTag.show=true;
		},
		bacthSetCat(){
			var goodsIds="";
			for(var i in this.sels)goodsIds+=(this.sels[i].id+",");
			catApi.addCatGoodsRelaBatch(goodsIds,this.joinTag.cat.catId).then(
				res=>{
					if(res.retCode){
						this.joinTag.show=false;
						this.$message("加入成功");
					}else{
						this.$message.error("加入失败"+ret.message);
					}
				}
			);
		},
		doSelectCat:function(cat){
            this.joinTag.cat=cat;
        },
	},
	components:{
		categoryCom:categoryCom,
	},
	mounted() {
		this.doQuery();
		this.doQueryTree();
	}
}

</script>

<style scoped>
.toolbar{
	display: flex;
	flex-direction: row;
	justify-content: space-between;
}
</style>