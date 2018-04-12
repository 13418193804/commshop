<template>
<div class="sreen-main">
    <!-- 滚动广告 -->
    <div style="width:371px;height:186px">
        <el-carousel height="186px" arrow="never">
        <el-carousel-item v-for="item in componentList[0].items" :key="item.id">
            <img :src="item.itemImgUrl" style="width:371px;height:186px"/>
        </el-carousel-item>
        </el-carousel>
    </div>
    <!-- 工具条 -->
    <div style="width:371px;height:100px;margin-top:10px;padding-top:10px;background:white">
        <div :style='"height:90px;float:left;width:"+100/componentList[1].items.length+"%"' v-for="item in componentList[1].items" :key="item.id">
            <img :src="item.itemImgUrl" style="width:55px;height:55px"/><br>
            <span style="font-family:Microsoft YaHei;font-size:15px;line-height:30px">{{item.itemName}}</span>
        </div>
    </div>
    <!-- 商品列表 -->
    <div style="width:371px;height:auto;margin-top:10px;" v-if="componentList[2].columnNum==1">
        <div  style="width:371px;height:auto;text-align:left;margin-bottom:8px;background:white" v-for="item in componentList[2].items" :key="item.id">
            <img :src="item.logoUrl" style="width:371px;height:371px"/>
            <div style="width:371px;height:auto;padding:5px 5px 0px">
                <span style="font-size:16px;line-height:30px">{{item.name}}</span><br>
                <del style="font-size:14px;color:gray;line-height:25px">{{'原价￥'+item.marketPrice}}</del><br>
                <span style="width:33%;font-size:16px;line-height:50px;color:red;display:inline-block">{{'￥'+item.labelPrice}}</span>
                <span style="font-size:14px;color:gray;line-height:50px;">{{'已售'+item.saleNum+' | 库存'+item.storageNum}}</span>
            </div>
        </div>
    </div>

    <div style="width:371px;height:auto;margin-top:10px;" v-else>
        <div style="width:178px;height:260px;float:left;text-align:left;margin:0px 0px 5px 5px;background:white;white-space:nowrap;text-overflow:ellipsis;-o-text-overflow:ellipsis;overflow: hidden;" v-for="item in componentList[2].items" :key="item.id">
            <img :src="item.logoUrl" style="width:178px;height:178px"/><br>
            <span style="font-size:14px;line-height:25px">{{item.name}}</span><br>
            <span style="font-size:14px;line-height:25px;color:red">{{'￥ '+item.labelPrice}}</span><br>
            <span style="font-size:12px;line-height:25px;color:gray">{{'已售'+item.saleNum+' | 库存'+item.storageNum}}</span>
        </div>
    </div>

</div>
</template>

<script>
export default {
  data() {
    return {
      
    };
  },
  methods: {

  },
  props:['componentList']
};
</script>

<style lang="scss" scoped>
.sreen-main{
  align:center;
  width:371px;
  overflow-y:auto;
  overflow-x:hidden;
  height:560px;
}

.sreen-main::-webkit-scrollbar-track
{
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
	background-color: #F5F5F5;
}

.sreen-main::-webkit-scrollbar
{
	width: 0px;
	background-color: #F5F5F5;
}

.sreen-main::-webkit-scrollbar-thumb
{
	background-color: #000000;
	border: 0px solid #555555;
}

</style>