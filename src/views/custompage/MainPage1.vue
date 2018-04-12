<template>
<div style="width:100%;min-width:1101px;    display: flex;">
    <!-- <div class="moniqi"> -->
        <div class="kongzhitai">
        <h2>页面列表 
        </h2>

<div style="background-color:#f7f7f7;padding:20px;max-width:30%;">
            <span class="el-form-item__label">添加页面</span>    <el-input  style="width:200px;" v-model="newPageModel.pageName">    
 <el-button slot="append" @click="newPageModel.doAddSubmit">保存</el-button></el-input> 
</div>

 
        <!-- <AnalogMobile style="margin:0px auto" :componentList='componentList'></AnalogMobile> -->
          <el-table :data="pageModel.pageList" highlight-current-row >
                        <el-table-column prop="itemImgUrl" label="页面名称" width="100">
                            <template slot-scope="scope">
                            {{scope.row.pageName}}
                            </template>
                        </el-table-column>
                           <el-table-column prop="itemImgUrl" label="状态" width="100">
                            <template slot-scope="scope">
                            {{scope.row.pageStatus?"启用中":"已禁用"}}
                            </template>
                        </el-table-column>
                         <el-table-column label="操作" width="210">
                            <template slot-scope="scope">
                                <el-button size="mini" plain type="info" @click="pageModel.selectPage(scope.row)">编辑</el-button>
                                <el-button size="mini" plain type="danger" @click="newPageModel.doDelete(scope.row)">删除</el-button>
                                
                            </template>
                        </el-table-column>
                    </el-table>
    </div>
     <div class="kongzhitai" v-show="pageModel.pageItem.pageId">
            <span class="el-form-item__label">页面名</span>    <el-input  style="width:200px;" v-model="pageModel.pageItem.pageName">    
              
 <el-button slot="append" @click="updatePage()">保存</el-button></el-input> 

               
                
                <div style="margin:20px 0;display:flex;">
             <div>  <span class="el-form-item__label">状态</span>
             <el-tag :type="pageModel.pageItem.pageStatus?'success':'info'"> {{pageModel.pageItem.pageStatus?"启用中":"已禁用"}}</el-tag>  
                <el-button type="text" @click="updatePage(true)"> {{pageModel.pageItem.pageStatus?'禁用':'启用'}}</el-button>
                </div>
                <div style="margin:0 20px">
<span  class="el-form-item__label">  <el-button size="mini" plain  @click="pageModel.addModel = true" :disabled="pageModel.addModel == true">加组件</el-button></span>
                </div>
                </div>


<div style="width:-webkit-fill-available;   background-color: #f7f7f7;
    padding: 20px;" v-if="pageModel.addModel">

       <el-form label-width="80px" size="small" v-model="pageModel.componentObj">
                    <el-form-item label="组件名称">
                        <el-input v-model="pageModel.componentObj.name"></el-input>
                    </el-form-item>

                    <el-form-item label="组件类型">
                        <el-select v-model="pageModel.componentObj.componentType" @change="pageModel.actionTypeChange">
                            <el-option   label="轮播广告" value="COMPONENT_TYPE_SCROLL_HEADER"></el-option>
                            <el-option   label="快速工具条" value="COMPONENT_TYPE_QUICK_BAR"></el-option>
                            <el-option   label="商品标签列" value="COMPONENT_TYPE_GOODS_TAG"></el-option>
                            <el-option   label="广告栏" value="COMPONENT_TYPE_ADV_BANNER"></el-option>
                        </el-select>
                    </el-form-item>
            

                    <div v-if="pageModel.componentObj.componentType === 'COMPONENT_TYPE_GOODS_TAG'">
                      <el-form-item label="首页商品数量">
                                <el-input v-model="pageModel.componentObj.itemMaxNum"></el-input>
                        </el-form-item>
                        <el-form-item label="商品展现形式">
                                <el-radio v-model="pageModel.componentObj.columnNum" :label="1">单列展示</el-radio>
                                <el-radio v-model="pageModel.componentObj.columnNum" :label="2">双列展示</el-radio>
                        </el-form-item>
                        <el-form-item label="商品来源类型">
                                <el-select v-model="pageModel.componentObj.dataSourceType" placeholder="请选择" @change="dataSourceTypeChange">
                                    <!-- <el-option label="最新商品" value="DATA_SOURCE_TYPE_NEW"></el-option> -->
                                    <el-option label="分类标签" value="DATA_SOURCE_TYPE_TAG"></el-option>
                                </el-select>
                        </el-form-item>
                        <el-form-item label="商品来源" v-if="pageModel.componentObj.dataSourceType=='DATA_SOURCE_TYPE_TAG'">
                                <el-cascader placeholder="请选择" @change="catSelectionChange" v-model="pageModel.componentObj.dataSource" :options="catOptions" filterable></el-cascader>
                        </el-form-item>
</div>

                          <el-button type="info" plain  @click="pageModel.addModel = false">取消</el-button>

                          <el-button type="primary" @click="pageModel.doAddSubmit">确 定</el-button>

                </el-form>
</div>
    <hr/>
 <el-collapse   accordion style="width:550px;"  @change="componentModel.handleChange" v-if="!pageModel.addModel"> 
           <div  v-for="(item,index) in componentModel.componentList" >
            <el-collapse-item :name="index"  v-if="item.componentType === 'COMPONENT_TYPE_SCROLL_HEADER'||item.componentType === 'COMPONENT_TYPE_QUICK_BAR'">
           <div style="margin-top:10px;    display: flex;align-items: center;">
              <span class="el-form-item__label">组件名</span>    
              <el-input  style="width:200px;" v-model="componentModel.componentList[index].componentName">    
 <el-button slot="append" @click="doUpdateModel()">保存</el-button></el-input> 

             <el-button type="danger" size="mini" icon="el-icon-delete" style="margin:15px;" @click="componentModel.deleteComponent(item)"></el-button>
             </div>
                <template slot="title">
                    <div class="collapse-item-title">
                      {{item.name}}</div>
                </template>
                <div class="collapse-item-body">
                    <el-table :data="itemModel.itemList" highlight-current-row v-show="itemModel.itemList">
                       <el-table-column prop="itemImgUrl" label="广告图片" width="100">
                            <template slot-scope="scope">
                                <img :src="scope.row.itemImgUrl" style="width:40px;height:40px;">
                            </template>
                        </el-table-column>
                        <el-table-column prop="itemName" label="图片名称" width="100">

                        </el-table-column>
                        <el-table-column prop="actionType" label="点击跳转" width="100">
                            <template slot-scope="scope">
                                {{formatActionType(scope.row.actionType)}}
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="210">
                            <template slot-scope="scope">
                                <el-button  size="mini" plain @click="dialogModel.doEdit(scope.row)">修改</el-button>
                                <el-button size="mini" plain type="danger" @click="dialogModel.doDelete(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-button  size="small" plain type="primary" icon="el-icon-plus" @click="dialogModel.doEdit()" style="margin-top:20px"> 增加内容 </el-button>
                </div>
            </el-collapse-item>


        <el-collapse-item :name="index"  v-if="item.componentType === 'COMPONENT_TYPE_GOODS_TAG'" >
              
                <div style="margin-top:10px;    display: flex;align-items: center;">
              <span class="el-form-item__label">组件名</span>    
              <el-input  style="width:200px;" v-model="componentModel.componentList[index].componentName">   </el-input> 

             <el-button type="danger" size="mini" icon="el-icon-delete" style="margin:15px;" @click="componentModel.deleteComponent(item)"></el-button>
             </div>
             
               <template slot="title">
                    <div class="collapse-item-title">{{item.name}}</div>
                </template>
                <div class="collapse-item-body">  
                    <el-form label-width="100px"  v-model="componentModel" inline size="small">
                        <el-form-item label="首页商品数量">
                                <el-input v-model="item.itemMaxNum"></el-input>
                        </el-form-item>

                        <el-form-item label="商品展现形式">
                                <el-radio v-model="item.columnNum" :label="1">单列展示</el-radio>
                                <el-radio v-model="item.columnNum" :label="2">双列展示</el-radio>
                        </el-form-item>
                        <el-form-item label="商品来源类型">
                                <el-select v-model="item.dataSourceType" placeholder="请选择" @change="dataSourceTypeChange">
                                    <!-- <el-option label="最新商品" value="DATA_SOURCE_TYPE_NEW"></el-option> -->
                                    <el-option label="分类标签" value="DATA_SOURCE_TYPE_TAG"></el-option>
                                </el-select>
                        </el-form-item>
                        <el-form-item label="商品来源" v-if="item.dataSourceType=='DATA_SOURCE_TYPE_TAG'">
                                <el-cascader placeholder="请选择" @change="catSelectionChange" v-model="catSelection" :options="catOptions" filterable></el-cascader>
                        </el-form-item>
                    </el-form>

                    
                    <el-button type="primary" size="small" :disabled="item.itemMaxNum==componentList[2].itemMaxNum&&item.columnNum==componentList[2].columnNum&&item.dataSource==componentList[2].dataSource" @click="doUpdateModel()">确 定</el-button>
       
                </div>
            </el-collapse-item>


            </div>
        </el-collapse>
       
    </div>


    <el-dialog :visible.sync="dialogModel.show" width="1050px" center size="tiny"  title="修改组件信息" :close-on-click-modal="false" top="40px">
        <div style="width:1010px;height:500px">
            <div style="width:350px;height:500px;float:left">
                <el-form label-width="80px" size="small">
                    <img v-if="dialogModel.itemImgUrl&&activeName=='0'" :src="dialogModel.itemImgUrl" style="width:350px;height:175px;">
                    <img v-else-if="dialogModel.itemImgUrl" :src="dialogModel.itemImgUrl" style="width:175px;height:175px;">
                    <el-upload 
                        :action="fileUploadUrl"
                        :on-success="dialogModel.uploadSuccess"
                        :show-file-list="false">
                        <el-button size="small" type="primary" style="margin-bottom:20px;">上传图片</el-button>
                    </el-upload>

                    <el-form-item label="分栏名称">
                        <el-input v-model="dialogModel.itemName"></el-input>
                    </el-form-item>

                    <el-form-item label="链接类型">
                        <el-select v-model="dialogModel.actionType" @change="actionTypeChange">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="链接内容">
                        <el-input v-model="dialogModel.actionValueTitle" :readonly="dialogModel.actionType!='ACTION_TYPE_URL'"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div style="width:560px;height:500px;margin-left:50px;padding:0px 20px;float:left;overflow-y:auto">
                <goodsListCom @doSelectGoods="doSelectGoods" v-if="dialogModel.actionType=='ACTION_TYPE_GOODSID'"></goodsListCom>
                <categoryCom @doSelectCat='doSelectCat' v-if="dialogModel.actionType=='ACTION_TYPE_TAGID'"></categoryCom>
            </div>
            
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogModel.show = false">取 消</el-button>
            <el-button type="primary" @click="dialogModel.submitEdit(dialogModel)">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
import * as Api from "../../api/api.js";
import * as Config from "../../api/conf.js";
import * as portalApi from "../../api/portalapi.js";
import * as catApi from "../../api/catapi.js";

import categoryCom from "../goods/CategoryComponent.vue";
import goodsListCom from "../goods/GoodsListCom.vue";
import AnalogMobile from "../custompage/AnalogMobile3.vue";

export default {
  data() {
    return {
      newPageModel: {
        pageName: "",
        doAddSubmit: () => {
          portalApi.addPage(this.newPageModel.pageName).then(res => {
            if (res.retCode) {
              this.newPageModel.pageName = "";
              this.getAllPage();
              this.$message("添加成功");
            } else {
              this.$alert("添加页面失败");
            }
          });
        },
        doDelete: row => {
          this.$confirm(
            "此操作将删除该页面和下面的组件元素, 是否继续?",
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }
          )
            .then(() => {
              portalApi.deletePage(row.pageId).then(res => {
                if (res.retCode) {
                  this.getAllPage();
                  this.$message({
                    type: "success",
                    message: "删除成功!"
                  });
                } else {
                  this.$alert("删除页面失败");
                }
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消删除"
              });
            });
        }
      },
      activeName: "0",
      componentId: "",
      componentName: "",
      componentType: "",
      componentList: [{ items: [] }, { items: [] }, { items: [] }],
      items: [],
      options: [
        { value: "ACTION_TYPE_GOODSID", label: "商品详情" },
        { value: "ACTION_TYPE_TAGID", label: "商品分类" },
        { value: "ACTION_TYPE_URL", label: "自定义链接" }
      ],
      catOptions: [],
      catSelection: [],
      componentModel: {
        componentList: [],
        val: 0,
        deleteComponent: row => {
          this.$confirm("此操作将删除该组件, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              portalApi.deleteComponent(row.id).then(res => {
                if (res.retCode) {
                  this.pageModel.getComponentList(this.pageModel.pageId);
                  this.$message({
                    type: "success",
                    message: "删除成功!"
                  });
                } else {
                  this.$alert("删除页面失败");
                }
              });
            })
            .catch(e => {
              console.log(e);
              this.$message({
                type: "info",
                message: "已取消删除"
              });
            });
        },
        handleChange: val => {
          let comfin = val + 1;
          if (typeof comfin != "string") {
            this.componentModel.val = val;
            this.componentModel.getItemList(
              this.componentModel.componentList[val].id
            );

            if (
              this.componentModel.componentList[this.componentModel.val]
                .componentType === "COMPONENT_TYPE_GOODS_TAG" &&
              this.componentModel.componentList.length > 0
            ) {
              this.catSelection = this.componentModel.componentList[
                this.componentModel.val
              ].dataSource.split(",");
            }
          }
        },
        getItemList: compId => {
          portalApi.getItemList(compId).then(res => {
            if (res.retCode) {
              this.itemModel.itemList = res.data;
              this.componentModel.componentList[
                this.componentModel.val
              ].componentName = this.componentModel.componentList[
                this.componentModel.val
              ].name;
            } else {
              this.$alert("获取元素失败");
            }
          });
        },

        itemMaxNum: 0,
        columnNum: 1,
        dataSourceType: "",
        dataSource: ""
      },
      itemModel: {
        itemList: []
      },
      pageModel: {
        pageId: "",
        componentObj: {
          pageId: "",
          name: "",
          columnNum: 1,
          itemMaxNum: 10,
          componentType: "",
          dataSourceType: "", //商品列表才有资源
          dataSource: ""
        },
        actionTypeChange(val) {},
        addModel: false,
        doAddSubmit: () => {
          console.log("加组件");
          this.pageModel.componentObj.pageId = this.pageModel.pageId;
          portalApi.addComponent(this.pageModel.componentObj).then(res => {
            if (res.retCode) {
              this.pageModel.addModel = false;
              this.pageModel.getComponentList(this.pageModel.pageId);
              console.log("添加", res.data);
            } else {
              this.$alert("添加组件失败");
            }
          });
        },
        pageList: [],
        pageItem: {},
        pageName: "",
        model: false,
        updatePage: () => {},
        selectPage: row => {
          this.pageModel.pageItem = row;
          this.pageModel.pageName = row.pageName;
          console.log("把组件查出来", this.pageModel);
          this.pageModel.getComponentList(row.pageId);
        },
        getComponentList: pageId => {
          portalApi.getComponentList(pageId).then(res => {
            if (res.retCode) {
              console.log("通过页面获取组件信息", res.data);
              this.componentModel.componentList = res.data;
              if (this.componentModel.componentList.length > 0) {
                this.componentModel.getItemList(
                  this.componentModel.componentList[this.componentModel.val].id
                );
              }
              this.pageModel.pageId = pageId;
              // for (
              //   var i = 0;
              //   i < this.componentModel.componentList.length;
              //   i++
              // ) {
              //   if (
              //     this.componentModel.componentList[i].componentType ==
              //
              //   ) {
              //     Object.assign(
              //       this.componentModel,
              //       this.componentModel.componentList[i]
              //     );
              //   }

              // }
            } else {
              this.$alert("获取组件失败");
            }
          });
        }
      },

      dialogModel: {
        show: false,
        id: "",
        itemImgUrl: "",
        itemName: "",
        actionType: null,
        actionValue: "",
        actionValueTitle: "",
        uploadSuccess: res => {
          this.dialogModel.itemImgUrl = res.data.filename;
        },
        doEdit: row => {
          this.dialogModel.id = "";
          this.dialogModel.itemImgUrl = "";
          this.dialogModel.itemName = "";
          this.dialogModel.actionType = null;
          this.dialogModel.actionValue = "";
          this.dialogModel.actionValueTitle = "";
          if (row != null) {
            Object.assign(this.dialogModel, row);
          }
          this.dialogModel.show = true;
        },
        doAddSubmit: model => {
          console.log(model);
          model.compId = this.componentModel.componentList[
            this.componentModel.val
          ].id;
          catApi.addComponentItem(model).then(res => {
            if (res.retCode) {
              this.$alert("添加成功");
              this.dialogModel.show = false;
              this.dialogModel.componentId = this.componentId;
              this.componentModel.getItemList(
                this.componentModel.componentList[this.componentModel.val].id
              );
            } else {
              this.$alert("修改失败");
            }
          });
        },
        submitEdit: model => {
          if (this.dialogModel.actionType == "") {
            this.$alert("点击类型为空");
            return;
          }
          if (this.dialogModel.actionType == "ACTION_TYPE_URL") {
            this.dialogModel.actionValue = this.dialogModel.actionValueTitle;
          }
          if (this.dialogModel.actionValue == "") {
            this.$alert("变量值不能为空");
            return;
          }
       
          if (this.dialogModel.itemImgUrl == "") {
            this.$alert("图片不能为空");
            return;
          }
          if (this.dialogModel.id == "") {
            this.dialogModel.doAddSubmit(model);
            return;
          }

          catApi.updateComponentItem(model).then(res => {
            if (res.retCode) {
              this.$message("修改成功");
              this.dialogModel.show = false;

              //   this.loadData();
              //   this.queryItems();
              this.componentModel.getItemList(
                this.componentModel.componentList[this.componentModel.val].id
              );
            } else {
              this.$alert("修改失败");
            }
          });
        },
        doDelete: row => {
          Api.doConfirm(this, "是否需要删除该信息!").then(res => {
            catApi.deleteComponentItem(row.id).then(res => {
              if (res.retCode) {
                this.loadData();
                this.queryItems();
              } else {
                this.$alert("删除出错！");
              }
            });
          });
        }
      },
      value: -1
    };
  },
  methods: {
    updatePage(status) {
      let model = this.pageModel.pageItem;
      if (status) {
        model.pageName = this.pageModel.pageName;
        this.pageModel.pageItem.pageStatus = !this.pageModel.pageItem
          .pageStatus;
      }

      portalApi.updatePage(model).then(res => {
        if (res.retCode) {
          this.$message("更新成功!");

          this.getAllPage();
        } else {
          this.$alert("获取失败");
        }
      });
    },
    getAllPage() {
      portalApi.getAllPage(this.componentModel).then(res => {
        if (res.retCode) {
          console.log(res.data);
          this.pageModel.pageList = res.data;
        } else {
          this.$alert("获取失败");
        }
      });
    },
    doUpdateModel() {
      // console.log('this.componentModel',this.componentModel)
      this.componentModel.componentList[
        this.componentModel.val
      ].dataSource = this.catSelection.join(",");
      this.componentModel.componentList[
        this.componentModel.val
      ].name = this.componentModel.componentList[
        this.componentModel.val
      ].componentName;
      portalApi
        .updateComponent(
          this.componentModel.componentList[this.componentModel.val]
        )
        .then(res => {
          if (res.retCode) {
            this.$message("更新成功!");
            this.componentModel.componentList[
              this.componentModel.val
            ].name = this.componentModel.componentList[
              this.componentModel.val
            ].componentName;
            this.componentModel.getItemList(
              this.componentModel.componentList[this.componentModel.val].id
            );
          } else {
            this.$alert("更新商品组件参数失败");
          }
        });
    },
    formatComponentType(comType) {
      if (comType == "COMPONENT_TYPE_SCROLL_HEADER") {
        return "滚动广告栏";
      }
      if (comType == "COMPONENT_TYPE_QUICK_BAR") {
        return "工具栏";
      }
      if (comType == "COMPONENT_TYPE_GOODS_TAG") {
        return "商品列表设置";
      }
    },
    formatActionType(actionType) {
      if (actionType == "ACTION_TYPE_GOODSID") {
        return "商品详情";
      }
      if (actionType == "ACTION_TYPE_TAGID") {
        return "商品列表";
      }
      if (actionType == "ACTION_TYPE_URL") {
        return "自定义链接";
      }
      return "未定义";
    },
    queryItems() {
      catApi.queryComponentItem(this.componentId).then(res => {
        this.items = res.data;
      });
    },
    loadData() {
      portalApi.queryMainPortal().then(res => {
        console.log("", res);
        if (res.retCode == true) {
          this.componentList = res.data.component;
          for (var i = 0; i < this.componentList.length; i++) {
            if (
              this.componentList[i].componentType == "COMPONENT_TYPE_GOODS_TAG"
            ) {
              Object.assign(this.componentModel, this.componentList[i]);
            }
          }
          if (this.componentModel.dataSource == null)
            this.componentModel.dataSource = "";
          this.catSelection = this.componentModel.dataSource.split(",");
        }
      });
    },
    doSelectCat: function(cat) {
      if (cat != null) {
        this.dialogModel.actionValue = cat.catId;
        this.dialogModel.actionValueTitle = cat.catName;
      }
    },
    doSelectGoods: function(goods) {
      this.dialogModel.actionValue = goods.id;
      this.dialogModel.actionValueTitle = goods.goodsName;
    },
    actionTypeChange: function(val) {
      this.dialogModel.actionValue = "";
      this.dialogModel.actionValueTitle = "";
    },
    doQueryTree() {
      Api.requestQueryTree().then(res => {
        this.catOptions = res.data.children;
      });
    },
    dataSourceTypeChange: function(val) {
      this.componentModel.dataSource = "";
      this.catSelection.splice(0, this.catSelection.length);
    },
    catSelectionChange: function(val) {
      console.log(val.toString());
      this.componentModel.dataSource = val.toString();
    }
  },
  components: {
    AnalogMobile: AnalogMobile,
    categoryCom: categoryCom,
    goodsListCom: goodsListCom
  },
  computed: {
    fileUploadUrl() {
      return Config.g_upload_url;
    }
  },
  mounted() {
    console.log("load page");
    this.getAllPage();
    this.loadData();
    this.doQueryTree();
  }
};
</script>

<style lang="scss" scoped>
.moniqi {
  width: 40%;
  min-width: 450px;
  text-align: center;
  float: left;
}
.kongzhitai {
  flex: 1;
  width: 50%;
  min-width: 600px;
  height: 800px;
  text-align: center;
  float: left;
  font-size: 14px;
  text-align: left;
  padding: 20px;
}
.collapse-item-title {
  font-size: 16px;
  width: 100%;
  padding-left: 20px;
  background: rgb(250, 250, 250);
}
.collapse-item-body {
  padding: 20px 20px 0px;
}
</style>