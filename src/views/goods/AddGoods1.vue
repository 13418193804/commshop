<template>


    <el-form ref="form" :model="form" label-width="100px" @submit.prevent="onSubmit" style="width:100%;min-width:600px;" size="small">

      
       <div style="display:flex;justify-content:flex-end;">
          <el-button  v-if="!GOODS_EDIT_MODE" type="primary" style="margin-bottom:10px;" @click="switchAddGoods">保存继续</el-button>
          <el-button v-else type="primary" style="margin-bottom:10px;" @click="doSubmitGoods">提交商品</el-button>
       </div>

        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="商品基本信息" name="tab1">
               <!-- <el-row>
                <el-col :span="16">
                <div>
                  <el-form-item label="商品类型">
                    <el-select v-model="form.goodsType" placeholder="商品类型">
                        <el-option label="普通商品" value="GOODS_TYPE_NORMAL"></el-option>
                        <el-option label="O2O商品" value="GOODS_TYPE_O2O"></el-option>
                        <el-option label="虚拟商品" value="GOODS_TYPE_VIRTUAL"></el-option>
                    </el-select>
                </el-form-item>
              </div>
            </el-col>
          </el-row> -->
                <!-- <el-form-item label="供应商">
                    <el-select v-model="form.supplierId" placeholder="请选择活动区域">
                        <el-option label="公司自营" value="self"></el-option>
                    </el-select>
                </el-form-item> -->

                <el-form-item label="商品标题">
                    <el-input v-model="form.goodsName"></el-input>
                </el-form-item>

                <el-form-item label="商品摘要">
                    <el-input v-model="form.jingle"></el-input>
                </el-form-item>

                <el-form-item label="商品自定编号">
                    <el-input v-model="form.code" style="width:220px"></el-input>
                </el-form-item>

                <el-form-item label="商品重量">
                    <el-input v-model="form.weight" style="width:220px"></el-input>
                    <span>kg</span>
                </el-form-item>

                <el-form-item label="开售时间">
                    <el-date-picker v-model="form.beginSaleTime" type="date" placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="是否单品">
                    <el-switch :disabled="GOODS_EDIT_MODE" v-model="form.singleStatus" ></el-switch>
                </el-form-item>
                <el-row v-if="form.singleStatus">
                    <el-col>
                        <h2>价格&库存</h2>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="标签价">
                            <el-input v-model="form.labelPrice"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :offset="1" :span="8" style="margin-left:50px">
                        <el-form-item label="销售价">
                            <el-input v-model="form.marketPrice"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="供货价">
                          <el-input v-model="form.costPrice"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :offset="1" :span="8" style="margin-left:50px">
                      <el-form-item label="上架库存数量">
                          <el-input v-model="form.storageNum"></el-input>
                      </el-form-item>
                    </el-col>
                </el-row>

                <h2>封面轮播图片</h2>
                <h3>第一张默认列表图标 </h3>

                <el-upload :action="fileUploadUrl" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="handleSuccess1" :file-list="fileList">
                  <i class="el-icon-plus"></i>
                </el-upload>

            </el-tab-pane>

            <el-dialog  :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>

            <el-tab-pane label="商品规格" name="tab2" :disabled="!GOODS_EDIT_MODE||form.singleStatus">
            <!-- <el-tab-pane label="商品规格" name="tab2"> -->
              
              <el-dialog :visible.sync="showSkuDialog" :close-on-click-modal="false" title="商品规格" width="600px" center>
                  <el-form-item label="规格名称">
                    <el-input v-model="skuKeyName"></el-input>
                  </el-form-item>
                  <el-form-item label="属性值">
                      <el-input v-model="skuKeyValue"></el-input>
                  </el-form-item>

                  <span slot="footer" class="dialog-footer">
                      <el-button @click="showSkuDialog = false">取 消</el-button>
                      <el-button type="primary" @click="addSkuKeySubmit">确 定</el-button>
                  </span>

              </el-dialog>

              <el-dialog :visible.sync="showAddSkuValueDialog" :close-on-click-modal="false" title="添加规格属性值" width="600px" center>
                  <el-form-item label="属性值">
                      <el-input v-model="skuKeyValue"></el-input>
                  </el-form-item>

                  <span slot="footer" class="dialog-footer">
                      <el-button @click="showAddSkuValueDialog = false">取 消</el-button>
                      <el-button type="primary" @click="addSkuKeyValueSubmit(skuKeyValue)">确 定</el-button>
                  </span>
              </el-dialog>

              <div style="width:100%;min-width:1010px">
                <el-row>
                  <el-col>
                      <h3>价格&库存</h3>
                  </el-col>
                  <el-col :span="8">
                      <el-form-item label="标签价">
                          <el-input v-model="form.labelPrice"></el-input>
                      </el-form-item>
                  </el-col>
                  <el-col :offset="1" :span="8" style="margin-left:50px">
                      <el-form-item label="销售价">
                          <el-input v-model="form.marketPrice"></el-input>
                      </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="供货价">
                        <el-input v-model="form.costPrice"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :offset="1" :span="8" style="margin-left:50px">
                    <el-form-item label="上架库存数量">
                        <el-input v-model="form.storageNum"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col>
                    <el-form-item label="规格价格">
                      <el-radio-group v-model="form.specStatus">
                        <el-radio :label="false">单独设定</el-radio>
                        <el-radio :label="true">全规格统一</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                </el-row>
                <div style="width:35%;min-width:350px;float:left">
                  
                  <el-button @click="doShowSkuAttr" size="small" type="success" plain>添加规格</el-button>
                  
                  <div style="width:100%;height:auto;border:1px solid rgb(240, 240, 240);margin:10px 0px" v-for='(skuKey,index) in skuKeyList' :key="skuKey.skuKeyId">
                    <div class="sku-header">
                      <span>{{skuKey.skuKeyIdName}}</span>
                      <el-button-group>
                        <el-button size="small" type="success" plain icon="el-icon-plus" @click="addSkuKeyValue(skuKey)"></el-button>
                        <el-button size="small" type="danger" plain icon="el-icon-delete" @click="deleteSkuKey(skuKey,index)"></el-button>
                      </el-button-group>
                      
                    </div>
                    <div class="sku-body">
                      <el-tag style="margin-left:10px;" :key="index" v-for="(item,index) in skuKey.valueList" :closable="true" :close-transition="false" @close="deleteSkuValue(skuKey,index)">
                        {{item.skuValueName}}
                      </el-tag>
                    </div>
                  </div>

                </div>

                <div style="margin-left:30px;width:60%;min-width:600px;float:left">
                  <el-button size="small" type="success" plain @click="skuItemEditerBootData.toEditer(null)">添加规格详情</el-button>
                  <el-table :data="skuList" size="small" style="margin-top:10px">
                    <el-table-column v-for="skuKey in skuKeyList" :key="skuKey.skuKeyIdName" :prop="skuKey.skuKeyIdName" :label="skuKey.skuKeyIdName"></el-table-column>
                    <el-table-column prop="skuImgUrl" label="规格图片" width="70">
                      <template slot-scope="scope">
                        <img :src="scope.row.skuImgUrl" style="width:30px;height:30px"/>
                      </template>
                    </el-table-column>
                    <el-table-column prop="barCode" label="条码信息"></el-table-column>
                    <el-table-column prop="storageNum" label="库存量"></el-table-column>
                    <el-table-column prop="costPrice" label="供货价"></el-table-column>
                    <el-table-column prop="labelPrice" label="标签价"></el-table-column>
                    <el-table-column prop="marketPrice" label="销售价"></el-table-column>
                    <el-table-column prop="" label="操作" width="130">
                      <template slot-scope="scope">
                        <el-button size="small" type="primary" plain icon="el-icon-edit" @click="skuItemEditerBootData.toEditer(scope.row)"></el-button>
                        <el-button size="small" type="danger" plain icon="el-icon-delete" @click="handleDelete(scope.row.skuId,scope.$index)"></el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>

              <SkuItemEditer :skuItemEditerBootData='skuItemEditerBootData' @updateSuccess="onUpdateSuccess"></SkuItemEditer>

            </el-tab-pane>
            <el-tab-pane label="商品详情" name="tab3" :disabled="!GOODS_EDIT_MODE">

                <!-- <quill-editor ref="myEditor" :content="content" :options="editorOption" @change="onEditorChange($event)" style="width:90%;height:800px;margin-top:20px;">
                </quill-editor> -->
   <vue-editor v-model="content" style="width:90%;height:800px;margin-top:20px;" useCustomImageHandler @imageAdded="uploadFunction"></vue-editor>  
                <!-- <div style="display:none;"><input type="file" id="getFile" @change="uploadFunction($event)" /></div> -->
            </el-tab-pane>

            <el-tab-pane label="分类标签" name="tab4" :disabled="!GOODS_EDIT_MODE" >

                <!-- <category-tabView :catIdOne="form.catId1" :catIdTwo="form.catId2" :catIdThree="form.catId3" @change="doChangeCategory"> </category-tabView> -->
                <category-view :goodsId="goodsId"></category-view>

            </el-tab-pane>
        </el-tabs>

    </el-form>
</template>

<script>
import * as Api from "../../api/api.js";

import * as Config from "../../api/conf.js";

  import { VueEditor } from 'vue2-editor'  

import SkuItemEditer from "./SkuItemEditer";
import categoryTabView from "./CategoryTabView";

import categoryView from "./CategoryView";

import uploadImageView from "../../common/UploadImageView";

export default {
  data() {
    return {
      editMode: "edit",
      fileUploadUrl: "",

      skuId: "", //skuxian 项目的id
      showDialog: false,
      GOODS_EDIT_MODE: false, //商品修改模式
      content: "",
      showSkuDialog: false,
      showAddSkuDialog: false,
      showAddSkuValueDialog: false,
      storageNum: 0,
      costPrice: 0,
      labelPrice: 0,
      marketPrice: 0,
      barCode: "",
      skuKeyName: "",
      activeName: "tab1",
      dialogImageUrl: "",
      fileList: [],
      detailList: "",
      dialogVisible: false,
      goodsId: "",
      remark: "",

      currentSkuKeyId: "",
      currentSkuKey: {},
      skuKeyValue: "",
      skuKeyList: [],
      skuKeyListId: [],
      inputVisible: [],
      skuList: [],
      skuListId: [],

      inputValue: [],

      inputValueSku: [],

      form: {
        goodsId:'',
        goodsType: "GOODS_TYPE_NORMAL",
        logoUrl: "",
        supplierId: "self",
        goodsName: "",
        code: "",
        jingle: "",
        weight: 0.0,
        supplierId: "",
        labelPrice: 0.0,
        marketPrice: 0.0,
        costPrice: 0.0,
        storageNum: 0,
        beginSaleTime: "",
        singleStatus:false,
        specStatus:false,
        goodsImg: "",
        catId1: "",
        catId2: "",
        catId3: "",
       
      },
      skuItemEditerBootData:{
        show:false,
        skuId:"",
        goodsId:'',
        specStatus:false,
        labelPrice: 0.0,
        marketPrice: 0.0,
        costPrice: 0.0,
        skuKeyList:[],
        toEditer:(row)=>{
          if(row==null)this.skuItemEditerBootData.skuId='';
          else this.skuItemEditerBootData.skuId=row.skuId;
          this.skuItemEditerBootData.goodsId=this.goodsId;
          this.skuItemEditerBootData.skuKeyList=this.skuKeyList;
          this.skuItemEditerBootData.specStatus=this.form.specStatus;
          if(this.skuItemEditerBootData.specStatus){
            this.skuItemEditerBootData.labelPrice=this.form.labelPrice;
            this.skuItemEditerBootData.marketPrice=this.form.marketPrice;
            this.skuItemEditerBootData.costPrice=this.form.costPrice;
          }
          this.skuItemEditerBootData.show=true;
        }
      },
      editorOption: {
        modules: {
          toolbar: {
            container: [
              ["bold", "italic", "underline", "strike"],
              [{ list: "ordered" }, { list: "bullet" }],
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              [{ color: [] }, { background: [] }],
              [{ font: [] }],
              [{ align: [] }],
              ["link", "image"],
              ["clean"]
            ],

            handlers: {
              image: function() {
                document.getElementById("getFile").click();
              }
            }
          }
        }
      },
      rules:{

      }
    };
  },
  mounted() {
    this.fileUploadUrl = Config.g_upload_url;

    let goodsId = this.$route.params.goodsId;
    this.goodsId = goodsId;

    console.log(this.$route.params);
// Object.assign(this.form,this.$route.params)
    if ((goodsId || "") != "") {
      this.GOODS_EDIT_MODE = true;

      console.log(goodsId);

      Api.requestGoodsDetail(goodsId).then(res => {
        console.log('商品详情',res);
      
        this.form = res.data;

        console.log(this.form.catId1);
        console.log(this.form.catId2);

        console.log(res.data.imageList);

        let imageList = res.data.goodsImg.split(",");

        for (let f in imageList) {
          console.log(f);

          let dt = { name: "1.png", url: imageList[f] };
          this.fileList.push(dt);
        }
      });

      Api.requestGoodsInfoDetail(goodsId).then(res => {
        console.log('商品图文详情',res.data)
        this.content = res.data.detail;
      });

      Api.requestSkuDetail(goodsId).then(res => {
        console.log('商品SKU',res.data)
       
        this.skuKeyList= res.data.skuAttribute;
        let items = res.data.skuItem;
        for (let i in items) {
          let data = items[i];
          let attrs = items[i].attrs;
          for (let j in attrs) {
            let key = attrs[j].key;
            let value = attrs[j].value;
            data[key] = value;
          }
          this.skuList.push(data);
        }
      });
    }

    console.log("add goods");
    console.log(goodsId);
  },
  components: {
    VueEditor ,
    SkuItemEditer,
    categoryTabView,
    categoryView
  },

  computed: {
    // editor() {
    //   return this.$refs.myEditor.quillEditor;
    // }
  },

  methods: {
    handleImageAdded(){
        console.log()
    },
    showSkuItemDialog(mode) {
      this.editMode = mode;
      this.showDialog = true;
    },

    doChangeCategory(index, value) {
      console.log("index=" + index + " value=" + value);

      if (index == 1) {
        this.form.catId1 = value;
      }

      if (index == 2) {
        this.form.catId2 = value;
      }

      if (index == 3) {
        this.form.catId3 = value;
      }
    },

    reloadSkuItem() {
      this.skuList = [];

      Api.requestSkuDetail(this.goodsId).then(res => {
        let attrs = res.data.skuAttribute;
        this.skuKeyList= res.data.skuAttribute;

        for (let i in attrs) {
          let keyName = attrs[i].skuKeyIdName;
          let id = attrs[i].skuKeyId;
          let values = attrs[i].values;
          let data = { key: keyName, id: id, value: [] };

          for (let j in values) {
            let valueData = {
              id: values[j].skuValueId,
              value: values[j].skuValueName
            };
            data.value.push(valueData);
          }
        }

        let items = res.data.skuItem;

        for (let i in items) {
          let data = items[i];
          let attrs = items[i].attrs;
          for (let j in attrs) {
            let key = attrs[j].key;
            let value = attrs[j].value;
            data[key] = value;
          }

          this.skuList.push(data);
        }
      });
    },

    onUpdateSuccess() {
      this.reloadSkuItem();
    },

    onItemEditViewClose() {
      console.log("edit dialog close");
      this.showDialog = false;
    },

    editSkuItem(skuId, index) {
      this.skuId = skuId;

      this.showSkuItemDialog("edit");
    },

    onEditorChange({ editor, html, text }) {
      console.log({ editor, html, text })
      this.content = html;
    },

    uploadFunction(file, Editor, cursorLocation,resetUploader) {
      console.log(111)
      //you can get images data in e.target.files
      //an single example for using formData to post to server

      var form = new FormData();
      form.append("file1",file);

      Api.uploadFile(form).then(res => {
        let imgUrl = res.data.data.urllist[0];
        console.log("file upload url");

        // console.log(this.$refs.myEditor.quill)
        // console.log(this.$refs.myEditor)

        // let idx = this.$refs.myEditor.quill.getSelection().index;
 Editor.insertEmbed(cursorLocation, 'image', imgUrl);
        // this.$refs.myEditor.quill.insertEmbed(idx, "image", imgUrl);
  resetUploader();
        // quill.insertEmbed(vm.addRange !== null ? vm.addRange.index : 0, vm.uploadType, value, Quill.sources.USER)   // 调用
        console.log(imgUrl);
      });

      //do your post
    },

    addSkuKeyValue(skuKey) {
      this.currentSkuKey = skuKey;
      this.skuKeyValue="";
      this.showAddSkuValueDialog = true;
    },

    addSkuKeyValueSubmit(attrValue) {
      if (this.GOODS_EDIT_MODE == false) {
        this.showAddSkuValueDialog = false;

        let valueData = { id: "", value: attrValue };

        this.currentSkuKey.value.push(valueData);
      } else {
        var skuKey=this.currentSkuKey;
        Api.requestAddSkuValue(this.goodsId, this.currentSkuKey.skuKeyId, attrValue).then(
          res => {
            skuKey.valueList.push(res.data);
            this.showAddSkuValueDialog = false;
          }
        ).catch(
          error => {
            console.log(error);
          }
        );
      }
    },

    doShowSkuAttr() {
      this.skuKeyName = "";
      this.skuKeyValue = "";
      this.showSkuDialog = true;
    },

    handleClick() {
      if (this.activeName == "tab2") {
        if (this.GOODS_EDIT_MODE == false) {
          this.switchAddGoods();
        }
      }
    },

    handleDelete(skuId, index) {
      console.log(skuId);

      this.$confirm("是发要删除该sku条目？", "注意", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(res => {
          console.log("enter delete");

          if (this.GOODS_EDIT_MODE == true) {
            console.log("enter delete2");

            Api.requestDeleteSkuItem(this.goodsId, skuId).then(res => {
              console.log(res);

              this.skuList.splice(index, 1);
            });
          } else {
            this.skuList.splice(index, 1);
          }
        })
        .catch(() => {});
    },
    deleteSkuKey(skuKey, index) {
      this.$confirm("删除规格将删除所有的规格详情信息，是否继续？", "注意", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      }).then(res => {
        Api.requestDeleteSkuKey(this.goodsId, skuKey.skuKeyId).then(
          res => {
            if(res.retCode){
              this.skuKeyList.splice(index, 1);
              this.skuList = [];
            }
          }
        );
      });
    },

    deleteSkuValue(skuKey, index) {
      if (this.GOODS_EDIT_MODE == true) {
        this.$confirm("删除规格项也将删除该库存的规格详情信息，是否继续删除？", "注意", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(res => {
            let value = skuKey.valueList[index];
            Api.requestDeleteSkuValue(this.goodsId, value.skuKeyId, value.skuValueId).then(
              res => {
                if (res.retCode==true){
                  this.skuList=[];
                  let items = res.data;
                  for (let i in items) {
                    let data = items[i];
                    let attrs = items[i].attrs;
                    for (let j in attrs) {
                      let key = attrs[j].key;
                      let value = attrs[j].value;
                      data[key] = value;
                    }
                    this.skuList.push(data);
                  }
                  skuKey.valueList.splice(index, 1);
                }else{
                  this.$alert("数据删除失败:"+res.message);
                }
              }
            ).catch(e => {});
          })
          .catch(() => {});
      } else {
        skuKey.value.splice(index, 1);
      }
    },

    handleInputConfirm(skuKey, index) {
      let inputValue = this.inputValue[index];
      if (inputValue) {
        let data = { id: "", value: inputValue };
        skuKey.value.push(data);
      }
      this.inputVisible[index] = false;
      this.inputValue[index] = "";
    },

    addSkuItemSubmit() {
      this.showAddSkuDialog = false;
      let data = {
        costPrice: this.costPrice,
        storageNum: this.storageNum,
        labelPrice: this.labelPrice,
        marketPrice: this.marketPrice,
        remark: this.remark,
        barCode: this.barCode,
        attributeItems: []
      };

      let ct = 0;
      console.log(this.inputValueSku);
      for (let value in this.inputValueSku) {
        let skuKey = this.skuKeyList[ct];

        data[skuKey.key] = this.inputValueSku[ct];
        data.attributeItems.push({
          key: skuKey.key,
          value: this.inputValueSku[ct]
        });
        ct++;
      }

      console.log(data);

      if (this.GOODS_EDIT_MODE == true) {
        Api.requestAddSkuItem(this.goodsId, data).then(res => {
    
          this.skuList.push(data);
        });

        return;
      }

      this.skuList.push(data);
    },

    addSkuKeySubmit() {
      if ((this.skuKeyName || "") == "") {
        this.$alert("属性名不能为空");
        return;
      }

      if (this.GOODS_EDIT_MODE == true) {
        Api.requestAddSkuKey(this.goodsId, this.skuKeyName,this.skuKeyValue).then(
          res => {
            if(res.retCode)this.reloadSkuItem();
            else this.$alert(res.message);
          }
        ).catch(
          error => {
            console.log(error);
          }
        );
        this.showSkuDialog = false;
      } else {
        this.showSkuDialog = false;
        let newValue = { key: this.skuKeyName, value: [] };
        this.skuKeyList.push(newValue);
      }
    },

    doSubmitGoods() {
      if (this.GOODS_EDIT_MODE == true) {
        this.eidtGoods();
      } else {
        this.addGoods();
      }
    },

    eidtGoods() {
      console.log("edit goods");

      let imageList = [];
      for (let f in this.fileList) {
        let url = this.fileList[f].url;
        imageList.push(url);
      }

      this.form.goodsImg = imageList.join(",");

      if(this.form.goodsImg.length>0){
        this.form.logoUrl = imageList[0];
      }

      console.log("SUBMI");

      Api.requestUpdateGoods(this.form)
        .then(res => {})
        .catch(error => {
          console.log(error);
        })
        .then(res => {
          console.log("update detail");
          console.log(this.content);

          Api.requestUpdateGoodsDetail(this.goodsId, this.content).then(res => {
            console.log("detail response");
            console.log(res);

            this.$router.replace("/goodslist");
          });
        });
    },

    switchAddGoods() {
      console.log("add goods");
      console.log()
      if(this.form.goodsName.trim()==''){
        this.$alert('商品标题不能为空');
        return;
      }

      let imageList = [];
      for (let f in this.fileList) {
        let url = this.fileList[f].url;
        imageList.push(url);
      }

      if(imageList.length==0){
        this.$alert('请至少上传一张商品图片');
        return;
      }

      this.form.goodsImg = imageList.join(",");

      if(imageList.length>0){
        this.form.logoUrl = imageList[0];
      }

      Api.requestAddGoods(this.form)
        .then(res => {

          return res.data.id;
        })
        .catch(error => {
          console.log(error);
        })
        .then(goodsId => {
          this.goodsId = goodsId;

 
          this.GOODS_EDIT_MODE = true;

          Api.requestGoodsDetail(goodsId).then(res => {

            this.form = res.data;

            this.fileList = []

            let imageList = res.data.imageList.split(",");

            for (let f in imageList) {

              let dt = { name: "1.png", url: imageList[f] };
              this.fileList.push(dt);
            }
          });
        });
    },

    addGoods() {
      console.log("add goods");

      let imageList = [];
      for (let f in this.fileList) {
        let url = this.fileList[f].url;
        imageList.push(url);
      }

      this.form.imageList = imageList.join(",");

      if(imageList.length>0){
        this.form.logoUrl = imageList[0];
      }

      Api.requestAddGoods(this.form)
        .then(res => {
          console.log("add goods");
          console.log("res");
          console.log(res);
          console.log("========");

          console.log(res.data.id);

          console.log("xxxxxxxxx");

          return res.data.id;
        })
        .catch(error => {
          console.log(error);
        })
        .then(goodsId => {
          console.log(goodsId);

          let skuData = {
            goodsId: goodsId,
            skuAttributes: this.skuKeyList,
            skuItems: this.skuList
          };

          console.log(skuData);

          Api.requestAddSku(skuData).then(res => {
            console.log("sku response");
            console.log(res);

            this.$router.replace("/goodslist");
          });

          Api.requestUpdateGoodsDetail(goodsId, this.content).then(res => {
            console.log("detail response");
            console.log(res);

            this.$router.replace("/goodslist");
          });
        });
    },
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
    }
  }
};
</script>

<style scoped>
.sku-tag {
  margin-left: 20px;
  margin-top: 30px;
  height: 60px;
  border-bottom: 1px solid #ddd;
}

.sku-key {
  font-size: 16px;
  font-weight: 600;
  margin-right: 40px;
}

.sku-attr-layout {
  display: flex;
  width: 90%;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin-left: 40px;
  align-items: center;
}

.sku-value-layout {
  height: 120px;
  width: 250px;
  padding-right: 100px;
}

.sku-header{
  width:100%;
  height:40px;
  font-size:16px;
  line-height: 40px;
  display: -webkit-flex;
  display: flex;
  background: rgb(242, 242, 242);
  justify-content:space-between;
}

.sku-header .el-button-group{
  display: flex;
  justify-content:space-between;
}


.sku-body{
  width:100%;
  line-height:50px;

}
</style>