<template>
<div>
  <el-button @click="doAdd">增加分类</el-button>

  <div style="margin-top:20px;" v-for="(item,index) in catList" :key="index">
  <!-- <el-tag type="info" size="mini" v-if="item.editStatus">未保存</el-tag> -->
    <span style="width:100px;"> 分类{{item.name}}：</span>
    <el-cascader style="width:300px;" placeholder="选择分类" v-model="item.option" :options="options" filterable @change="doSelect(item,index)"></el-cascader>

    <el-button style="margin-left:20px;" type="primary" plain @click="doDelete(item,index)">删除</el-button>

    <!-- <el-button style="margin-left:20px;" type="primary" plain @click="doDisplay(item,index)">显示内容</el-button> -->
    <el-button style="margin-left:20px;"  v-if="item.editStatus" type="primary" plain @click="doUpdate(item,index)">确定</el-button>
  </div>
</div>
</template>

<script>
import util from "../../common/js/util";
import Vue from "vue";
import * as Api from "../../api/api.js";
import * as catApi from "../../api/catapi.js";

export default {
  data() {
    return {
      catFormList: [],
      catList: [],
      catItem: {
        name: "1",
        options: [],
        editStatus: false
      },

      catIdList1: [""],
      catIdList2: [""],
      catIdList3: [""],
      options: [
        { value: "111", label: "最新分类" },
        { value: "222", label: "最新分类2" },
        { value: "333", label: "最新分类333" }
      ]
    };
  },

  updated() {},
  activated() {},
  mounted() {
    //
    Api.requestQueryTree().then(res => {
      this.options = res.data.children;
    });
  },
  watch: {
    goodsId(goodsId) {
      //     console.log("xxxxx")
      //     console.log(goodsId)
      //     catApi.queryGoodsRela(goodsId).then(res=>{
      //   if(res.retCode==true){
      //     this.catList = res.data
      //   }else{

      //     console.error(res);
      //   }

      // });

      this.queryLink();
    }
  },
  props: ["goodsId"],
  methods: {
    doSelect(item, index) {
      // let a = true;
      // if (typeof this.catList[index].category == "object") {
      //   a =this.catList[index].option[0] !==
      //       this.catList[index].category.parentId ||
      //     this.catList[index].option[1] !== this.catList[index].category.catId;
      // }
      // item.editStatus = a;
      item.editStatus =true
    },

    doUpdate(item, index) {
      if (item.option.length < 1) {
        this.$alert("选择数据错误");
        return;
      }

      let catId = item.option[item.option.length - 1];
      if (!item.linkId) {
        catApi.addCatGoodsRela(this.goodsId, catId).then(res => {
          console.log(res);
          if (res.retCode == true) {
            this.queryLink();
            // console.log(res);

            // let len = this.catList.length;
            // len = len+1

            // let item = {
            //   name: len.toString(),
            //   id: res.data.id,
            //   catId:'',
            //   goodsId:this.goodsId,
            //   option:[],
            //   options: this.options,
            //   editStatus:false,
            // };

            // this.catList.push(item);
          } else {
            console.error("信息错误");
            console.error(res);
          }
        });
        return;
      }

      catApi.updateCatGoodsRela(item.linkId, this.goodsId, catId).then(res => {
        if (res.retCode == true) {
          this.$alert("修改成功！");
          item.editStatus = false;
        } else {
          this.$alert("修改失败");
        }
      });
    },

    doDisplay(item, index) {
      this.$alert(JSON.stringify(item.option));
    },

    doDelete(item, index) {
      Api.doConfirm(this, "是否删除该分类信息").then(res => {
        if (res == true) {
          catApi.deleteCatGoodsRela(this.goodsId, item.catId).then(res => {
            if (res.retCode) {
              this.catList.splice(index, 1);
            } else {
              this.$alert("删除出错");
            }
          });
        }
      });
    },
    queryLink() {
      catApi.queryGoodsRela(this.goodsId).then(res => {
        if (res.retCode == true) {
          this.catList = res.data;
          this.catList.forEach((item, index) => {
            item.option = [item.category.parentId, item.category.catId];
          });
        } else {
          console.error(res);
        }
      });
    },
    doAdd() {
      // let len = this.catList.length;
      // len = len + 1;

      // catApi.addCatGoodsRela(this.goodsId).then(res => {
      //   console.log(res)
      //   if (res.retCode == true) {
      //     console.log(res);

      //     let len = this.catList.length;
      //     len = len+1

      //     let item = {
      //       name: len.toString(),
      //       id: res.data.id,
      //       catId:'',
      //       goodsId:this.goodsId,
      //       option:[],
      //       options: this.options,
      //       editStatus:false,

      //     };

      //     this.catList.push(item);

      //   } else {
      //     console.error("信息错误");
      //     console.error(res);
      //   }
      // });
      this.catList.push(this.catItem);
      console.log(this.catList);
    }

    //   doSelect(index) {
    //     let catId = "";
    //     if (index == 1) {
    //       console.log(this.catIdList1);

    //       catId = this.catIdList1[this.catIdList1.length - 1];
    //     }

    //     if (index == 2) {
    //       catId = this.catIdList2[this.catIdList2.length - 1];
    //     }

    //     if (index == 3) {
    //       catId = this.catIdList3[this.catIdList3.length - 1];
    //     }

    //     this.$emit("change", index, catId);
    //   }
  }
};
</script>

<style scoped>
.sku-attr-layout {
  display: flex;
  width: 90%;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin-left: 40px;
  align-items: center;
}
</style>
