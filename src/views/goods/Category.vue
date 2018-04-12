<template>
    <div>

    
        <el-col :span="8" style="border:1px teal solid;">

         <div>   

        <div style="position:fixed;margin-left:10px;margin-top:20px;margin-bottom:20px;">
            <el-button type="primary" plain size="mini" @click="doAddCategory">增加分类</el-button>
            <el-button  plain size="mini" @click="editCategory">修改分类</el-button>

            <el-button type="danger" plain size="mini" @click="doDeleteCategory">删除分类</el-button>
          
        </div>
  
        <div style="margin-top:20px;">
            <el-tree style="padding-top:60px;width:280px;"   :data="treeData"  default-expand-all :props="defaultProps" :expand-on-click-node="false" 
            node-key="catId" ref="tree" highlight-current @node-click="doNodeClick" >
            </el-tree>

     

        </div>
        </div>
        </el-col>

        <el-col :offset="1" :span="15" >

        <el-table :data="goodsList" highlight-current-row v-loading="listLoading" style="width: 90%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column prop="logoUrl" label="商品图片" width="100">

				<template scope="scope">
					<img :src="scope.row.logoUrl" style="width:40px;height:40px;">
				</template>

			</el-table-column>

			<el-table-column prop="name" label="商品名" width="160" sortable>
			</el-table-column>
			<el-table-column prop="marketPrice" label="市场价" min-width="100" sortable>
			</el-table-column>

            <el-table-column prop="storageNum" label="库存" min-width="100" sortable>
			</el-table-column>
        
        </el-table>

        </el-col>



        <el-dialog :visible.sync="showDialog" title="添加分类名称">

            根
            <el-input v-model="categoryName"></el-input>

            <span slot="footer" class="dialog-footer">
                <el-button @click="showDialog=false">取 消</el-button>
                <el-button type="primary" @click="updateCategory">确 定</el-button>
            </span>

        </el-dialog>

    </div>
</template>

<script>
import util from "../../common/js/util";
import * as Api from "../../api/api.js";

export default {
  data() {
    return {
      total:0,
      goodsList:[],
      showDialog: false,
      currentObject: {},
      dialogType: "add",
      categoryName: "",
      currentId: "",
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
      showDialogModel: false,
      storageNum: 0,
      marketPrice: 0,
      labelPrice: 0,
      costPrice: 0,
      barCode: "",
      remark: ""
    };
  },

  mounted() {
    this.loadAll();
    this.loadAllProduct();

    // /category/querytree
  },
  methods: {
    loadAll() {
      Api.requestQueryTree().then(res => {
        this.treeData[0].children = res.data.children;

        console.log(this.treeData);
      });
    },

    loadAllProduct(){

        let params={}

        Api.requestQueryGoods(params).then(res => {

        this.total = res.page.total

        this.goodsList = res.data;

    })



    },
    updateCategory() {
      this.showDialog = false;

      let catId = this.currentObject.catId;
      let catName = this.currentObject.catName;

      if (this.dialogType == "add") {
        if (catId == "0") {
          catId = "";
        }

        console.log(this.categoryName);
        console.log(catId);
        Api.requestAddCat(this.categoryName, "", catId).then(res => {
          console.log(res);

          if (res.retCode == false) {
            this.$alert("添加分类错误");
            return;
          }

          let b = this.currentObject.hasOwnProperty("children");

          if (b == true) {
            console.log("in");
            if (!Array.isArray(this.currentObject.children)) {
              this.currentObject.children = [];
            }
            this.currentObject.children.push({
              catId: res.data.catId,
              catName: this.categoryName,
              children: []
            });
          } else {
            console.log("not in");
            this.currentObject.children = [];
            this.currentObject.children.push({
              catId: res.data.catId,
              catName: this.categoryName,
              children: []
            });
          }
        });
      }

      if (this.dialogType == "edit") {
        Api.requestEditCat(catId, this.categoryName, "").then(res => {
          console.log(res);

          if (res.retCode == false) {
            this.$alert("修改分类错误");
            return;
          }

          this.currentObject.catName = this.categoryName;
        });
      }
    },

    doAddCategory() {
      if ((this.currentObject.catId || "") == "") {
        this.$alert("请选择一个分类");
        return;
      }
      this.dialogType = "add";
      this.showDialog = true;
    },

    doNodeClick(object, node, control) {
      this.currentObject = object;
      console.log(object)
      let catId = object.catId

      if(catId=="0"){

          this.loadAllProduct()
          return 

      }else{

      	Api.requestQueryGoodsByCat(catId).then(res => {
                this.goodsList = res.data;
                console.log("========")
                console.log(this.goodsList)

        })
      }



    },

    doDeleteCategory() {
      Api.doConfirm(this, "是否删除该分类？").then(ret => {
        if (ret == false) {
          console.log("选择了NO");
          return;
        }

        console.log("选择了YES");

        let catId = this.currentObject.catId;

        Api.requestDeleteCat(catId).then(res => {
          console.log(res);
          this.loadAll();
        });
        return;
      });
    },
    editCategory() {
      if ((this.currentObject.catId || "") == "") {
        this.$alert("请选择一个分类");
        return;
      }
      this.dialogType = "edit";
      this.showDialog = true;

      this.categoryName = this.currentObject.catName;
    }
  }
};
</script>

<style scoped>

</style>
