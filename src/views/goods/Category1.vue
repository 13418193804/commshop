<template>
<div v-loading="listLoading">
  <el-row>
    <el-col :span="8">
        <el-button type="primary" plain size="mini" @click="doAddCategory" :disabled="disableAdd">增加分类</el-button>
        <el-button  plain size="mini" @click="editCategory">修改分类</el-button>
        <el-button type="danger" plain size="mini" @click="doDeleteCategory">删除分类</el-button>
        <el-col :style='"margin-top:20px;border:1px teal solid;overflow-y:auto;padding:10px;height:"+height+"px"'>
            <el-tree :data="treeData"  default-expand-all :props="defaultProps" :expand-on-click-node="false" 
            node-key="catId" ref="tree" highlight-current @node-click="doNodeClick" >
            </el-tree>
        </el-col>
    </el-col>
    
    

    <el-col :span="16" style="padding-left:20px">
      <el-table :data="goodsList" highlight-current-row>
        <!-- <el-table-column type="selection" width="50"></el-table-column> -->
        <el-table-column prop="logoUrl" label="商品图片" width="100">
          <template slot-scope="scope">
            <img :src="scope.row.goodsImg ?scope.row.goodsImg.split(',')[0]:''" style="width:40px;height:40px;">
          </template>
        </el-table-column>

        <el-table-column prop="goodsName" label="商品名" min-width="200">
        </el-table-column>
        <el-table-column prop="marketPrice" label="销售价" min-width="100" sortable>
        </el-table-column>
              <el-table-column prop="saleNum" label="销量" min-width="100" sortable>
        </el-table-column>
              <el-table-column prop="storageNum" label="库存" min-width="100" sortable>
        </el-table-column>
        
      </el-table>
    </el-col>
  </el-row>


  <el-dialog :visible.sync="showDialog" :title="dialogType=='add'?'添加分类名称':'修改分类名称'">
    <el-form label-width="100px">
      <el-form-item label="分类名称">
        <el-input v-model="categoryName" style="width:80%"></el-input>
      </el-form-item>
        <el-form-item label="分类类型" v-if="!haveType">
        <el-select v-model="catType">
          <el-option label="首页" value="MAIN"></el-option>
          <el-option label="分类" value="CAT"></el-option>
          <el-option label="通用" value="COMMON"></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <div v-if="!haveIcon">
    <div class="el-form-item__label" style="width: 100px;">分类图片</div>  
           <el-upload :action="fileUploadUrl"   class="avatar-uploader" list-type="picture-card" :show-file-list="false"  :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="handleSuccess1" :file-list="fileList">
                  <img v-if="fileList[fileList.length-1]" :src="fileList[fileList.length-1]?fileList[fileList.length-1].url:''" class="avatar"/>
                  <i v-else class="el-icon-plus"></i>
                </el-upload>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="showDialog=false">取 消</el-button>
      <el-button type="primary" @click="updateCategory">确 定</el-button>
    </span>
  </el-dialog>
  <el-dialog  :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
</div>
</template>

<script>
import util from "../../common/js/util";
import * as Api from "../../api/api.js";
import * as Config from "../../api/conf.js";

export default {
  data() {
    return {
            fileUploadUrl: "",
                  fileList: [],
 dialogImageUrl: "",
 dialogVisible:false,
 handleRemove(file, fileList) {
      for (let i in this.fileList) {
        let url = this.fileList[i].url;
        if (url == file.url) {
          console.log("find ...");
          this.fileList.splice(i, 1);
          break;
        }
      }
    },
    beforeUpload(file) {
      console.log("before upload ...");
      console.log("fileList = " + this.$refs.logoUrlUpload.fileList.length);
      if (this.$refs.logoUrlUpload.fileList.length > 0) {
        this.$refs.logoUrlUpload.clearFiles();
      }
    },

    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    handleSuccess1(response, file, fileList) {
      let dt = {
        name: "1.png",
        url: response.data.filename
      };
      this.fileList.push(dt);
      console.log(this.fileList);
    },

    handleSuccess2(response, file, fileList) {
      this.fileList.push(response.data.filename);
      console.log(this.fileList);
    },
      total: 0,
      height: 700,
      goodsList: [],
      listLoading:false,
      showDialog: false,
      currentObject: {},
      dialogType: "add",
      categoryName: "",
      catType:"CAT",
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
        this.fileUploadUrl = Config.g_upload_url;

    this.listLoading=true;
    this.height = window.innerHeight - 150;
    window.onresize = () => {
      this.height = window.innerHeight - 150;
    };
    this.loadAll();
    this.loadAllProduct();
  },
  methods: {
    loadAll() {
      Api.requestQueryTree().then(res => {
        this.treeData[0].children = res.data.children;
        console.log(this.treeData);
      });
    },

    loadAllProduct() {
      let params = {};
      Api.requestQueryGoods(params).then(res => {
        this.total = res.page.total;
        this.goodsList = res.data;
        this.listLoading=false;
      });
    },
    updateCategory() {
      this.showDialog = false;

      let catId = this.currentObject.catId;
      let catName = this.currentObject.catName;
        let catIcon =this.fileList[this.fileList.length-1]?this.fileList[this.fileList.length-1].url:''
console.log(this.dialogType)
      if (this.dialogType == "add") {
        if (catId == "0") {
          catId = "";
        }

        console.log(this.categoryName);
        console.log(catId);
        Api.requestAddCat(this.categoryName, "",catIcon, catId,this.catType).then(res => {
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
                               this.loadAll();

          } else {
                               this.loadAll();




          }
        });
      }

      if (this.dialogType == "edit") {
        Api.requestEditCat(catId, this.categoryName,catIcon,this.catType).then(res => {
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
      this.fileList = []
      this.dialogType = "add";
      this.showDialog = true;
    },

    doNodeClick(object, node, control) {
      this.listLoading=true;
      this.currentObject = object;
      let catId = object.catId;
      if (catId == "0") {
        this.loadAllProduct();
        return;
      } else {
        Api.requestQueryGoodsByCat(catId).then(res => {
          this.goodsList = res.data.goodsList;
          this.listLoading=false;
        });
      }
    },

    doDeleteCategory() {
      Api.doConfirm(this, "是否删除该分类？").then(ret => {
        if (ret == false)return;

        let catId = this.currentObject.catId;
        Api.requestDeleteCat(catId).then(res => {
          this.loadAll();
        });
      });
    },
    editCategory() {
      if ((this.currentObject.catId || "") == "") {
        this.$alert("请选择一个分类");
        return;
      }
      this.fileList = []
      
      this.dialogType = "edit";
      this.showDialog = true;
      this.categoryName = this.currentObject.catName;
      
if((this.currentObject.catIcon || "") !== ""){
  this.fileList[this.fileList.length-1] = {
        name: "1.png",
        url: this.currentObject.catIcon
  }
}

    }
  },
  computed:{
    disableAdd(){
      let cate=this.currentObject;
      if(cate.catId=="0")return false;
      if(cate.levelNum==2)return true;
      else if(this.goodsList.length>0)return true;
      return false;
    },
     haveIcon(){
      let cate=this.currentObject;
      if(cate.catId=="0")return true;
 
      if(cate.levelNum==2)return false;
      else if(cate.levelNum == 1 &&this.dialogType=='edit')return true;
      return false;
    },
      haveType(){
      let cate=this.currentObject;
      if(cate.catId=="0"&&this.dialogType=='edit')return true;
 
      if(cate.levelNum==2)return true;
      else if(cate.levelNum == 1 &&this.dialogType=='add')return true;
      return false;
    }
  }
};
</script>

<style >
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 100%;
    height: 100%;
    display: block;
  }
</style>
