<template>
<div>
  <el-tree style="width:380px;"   :data="treeData"  default-expand-all :props="defaultProps" :expand-on-click-node="false" 
  node-key="catId" ref="tree" highlight-current @node-click="doNodeClick" >
  </el-tree>
</div>
</template>

<script>
import util from "../../common/js/util";
import * as Api from "../../api/api.js";

export default {
  data() {
    return {
      currentCatId: "",
      currentCatName: "",
      treeData: [
        {
          catId: "0",
          catName: "分类",
          children: []
        }
      ],
      defaultProps: {
        children: "children",
        label: "catName"
      },
      attrs: [],
    };
  },

  mounted() {
    this.loadAll();
    // /category/querytree
  },
  methods: {
    getCatId(){

      return this.currentCatId;

    },
    getCatName(){

          return this.currentCatName;


    },
    loadAll() {
      Api.requestQueryTree().then(res => {
        this.treeData[0].children = res.data.children;

      });
    },

    doNodeClick(object, node, control) {
      console.log(object)
      if(object.levelNum===2)this.$emit("doSelectCat",object);
      else{
        this.$emit("doSelectCat",null);
        this.$message({message: '请点击选择最末级分类',type: 'warning'});
      } 
    },

  }
};
</script>

<style scoped>

</style>
