<template>
<div>
	<el-card class="card-user">
		<i class="fa fa-user-circle" style="font-size:60px;float:left"></i>
		<span style="line-height:60px;font-size:20px;margin-left:20px;font-weight:600">{{merchantName}}</span>
	</el-card>

	<el-card class="new-data">
		<div slot="header" class="header">
			最新数据
		</div>
		<el-col :span="6">
			<span class="data-title">今日交易额</span><br>
			<span class="data-value">￥0.00</span>
		</el-col>
		<el-col :span="6">
			<span class="data-title">今日订单数</span><br>
			<span class="data-value">0</span>
		</el-col>
		<el-col :span="6">
			<span class="data-title">今日流量</span><br>
			<span class="data-value">0</span>
		</el-col>
		<el-col :span="6">
			<span class="data-title">今日新增用户数</span><br>
			<span class="data-value">0</span>
		</el-col>
	</el-card>

	<el-col :span="12" style="padding-right:10px">
		<el-card class="new-data">
			<div slot="header" class="header">资产收益</div>
				<el-col :span="12">
				<span class="data-title">总交易额</span><br>
				<span class="data-value">￥0.00</span>
			</el-col>
			<el-col :span="12">
				<span class="data-title">30日交易额</span><br>
				<span class="data-value">￥0.00</span>
			</el-col>
		</el-card>
	</el-col>
	<el-col :span="12" style="padding-left:10px">
		<el-card class="new-data">
			<div slot="header" class="header">事务管理</div>
				<el-col :span="12">
				<span class="data-title">代发货订单</span><br>
				<span class="data-value">0</span>
			</el-col>
			<el-col :span="12">
				<span class="data-title">退款申请</span><br>
				<span class="data-value">0</span>
			</el-col>
		</el-card>
	</el-col>

	<el-card class="new-data">
		<div slot="header" class="header">
			24小时数据分时图
		</div>
		
	</el-card>

</div>
</template>

<script>
export default {
	data(){
		return {
			merchantName:sessionStorage.getItem("merchantName"),
		}
	},
	computed:{

	},
	methods:{

	},
	created(){

	}
}

</script>

<style lang="scss" scoped>
.el-card{
	width:100%;
	margin-bottom:20px;
}
.card-user{
	height:100px;
}
.el-card .header{
	font-size:16px
}

.new-data{
	.el-col{
		text-align:center;
		.data-title{
			font-size:15px;
		};
		.data-value{
			font-size:30px;
			line-height:80px
		};
	}
}


</style>