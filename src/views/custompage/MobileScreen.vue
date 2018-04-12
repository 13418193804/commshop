<template>
<div class="sreen-main">
  <div v-for="(com,index) in componentList" :key="index">

    <div v-if="com.componentType=='COMPONENT_TYPE_SCROLL_HEADER'" style="position:relative;display:flex;flex-direction:row;width:350px;height:175px;"  
      @mouseover="overShow('COMPONENT_TYPE_SCROLL_HEADER',index)" @mouseout="outHide('COMPONENT_TYPE_SCROLL_HEADER',index)" >
      <el-button  v-if="showStatus[index]" style="position:absolute;left:100px;top:90px;"  plain type="primary" @click="doConfig(com)">{{com.name}}设置</el-button>
      <div v-for="(item,idx) in com.items" :key="idx" >
        <img :src="item.itemImgUrl" height="175" width="350">
      </div>
    </div>

    <div v-if="com.componentType=='COMPONENT_TYPE_QUICK_BAR'" style="position:relative;" class="quick-bar" @mouseover="overShow('COMPONENT_TYPE_QUICK_BAR',index)"
      @mouseout="outHide('COMPONENT_TYPE_QUICK_BAR',index)">
      <el-button  v-if="showStatus[index]" style="position:absolute;"  plain type="primary" @click="doConfig(com)" > {{com.name}}设置</el-button>
      <div v-for="(item,idx) in com.items" :key="idx" >
        <img :src="item.itemImgUrl" height="50" width="50">
        <div align="center">{{item.itemName}}</div>
      </div>
    </div>

    <div v-if="com.componentType=='COMPONENT_TYPE_GOODS_TAG'" style="position:relative;" class="goods-list" @mouseover="overShow('COMPONENT_TYPE_GOODS_TAG',index)"
      @mouseout="outHide('COMPONENT_TYPE_GOODS_TAG',index)">
      <el-button style="position:absolute;top:10px;" v-if="showStatus[index]"  plain type="primary" @click="doConfig(com)"> 商品列表设置</el-button>
    <div v-for="(item,idx) in com.items" :key="idx" >
      <img :src="item.logoUrl" height="350" width="350">
      <div style="display:flex;flex-direction:row;justify-content: space-around;">    
        <span align="center">{{item.name}}</span>  <span style="color:red;">{{item.marketPrice}}元</span> </div>
      </div>
    </div>

  </div>
</div>

</template>

<script>
export default {
  data() {
    return {
      showStatus: [false, false, false, false, false],
    };
  },
  methods: {
    overShow(type, index) {
      this.showStatus[index] = true;
      this.$set(this.showStatus, index, true);
    },
    outHide(type, index) {
      this.showStatus[index] = false;
      this.$set(this.showStatus, index, false);
    },

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
	width: 1px;
	background-color: #F5F5F5;
}

.sreen-main::-webkit-scrollbar-thumb
{
	background-color: #000000;
	border: 0px solid #555555;
}


.header-scroll {
  display: flex;
  flex-direction: row;
}

.quick-bar {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  height: 100px;
  align-items: center;
}

.goods-list {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>