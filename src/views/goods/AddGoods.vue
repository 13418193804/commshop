<template>
    <el-form ref="form" :model="form" label-width="100px" @submit.prevent="onSubmit" style="margin:20px;width:90%;min-width:600px;">

      
       <div style="display:flex;justify-content:flex-end;">
          <el-button  v-if="!GOODS_EDIT_MODE" type="primary" style="margin-bottom:10px;" @click="switchAddGoods">保存继续</el-button>
          <el-button v-else type="primary" style="margin-bottom:10px;" @click="doSubmitGoods">提交商品</el-button>
       </div>

      
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="商品基本信息" name="tab1">
               <el-row>
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
          </el-row>
                <!-- <el-form-item label="供应商">
                    <el-select v-model="form.supplierId" placeholder="请选择活动区域">
                        <el-option label="公司自营" value="self"></el-option>
                    </el-select>
                </el-form-item> -->

                <el-form-item label="商品标题">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>

                <el-form-item label="商品摘要">
                    <el-input v-model="form.jingle"></el-input>
                </el-form-item>

                <el-form-item label="商品自定编号">
                    <el-input v-model="form.code"></el-input>
                </el-form-item>

                <el-form-item label="商品重量">
                    <el-input v-model="form.weight"></el-input>
                </el-form-item>

                <el-form-item label="开售时间">
                    <el-date-picker v-model="form.beginSaleTime" type="date" placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="是否单品">
                    <el-switch :disabled="GOODS_EDIT_MODE" v-model="form.single_status" ></el-switch>
                </el-form-item>


                <h2>价格库存信息</h2>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="标签价">
                            <el-input v-model="form.labelPrice"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" style="margin-left:50px">
                        <el-form-item label="销售价">
                            <el-input v-model="form.marketPrice"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="8">
                      <el-form-item label="供货价">
                          <el-input v-model="form.costPrice"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8" style="margin-left:50px">
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

            <el-tab-pane label="商品规格" name="tab2" :disabled="!GOODS_EDIT_MODE||form.single_status">

                <el-button @click="doShowSkuAttr">添加规格条目</el-button><br/>

                <el-dialog :visible.sync="showSkuDialog" size="tiny" title="商品规格属性">
                    <el-form-item label="规格属性值">
                        <el-input v-model="skuKeyName"></el-input>
                    </el-form-item>

                    <span slot="footer" class="dialog-footer">
                        <el-button @click="showSkuDialog = false">取 消</el-button>
                        <el-button type="primary" @click="addSkuKeySubmit">确 定</el-button>
                    </span>

                </el-dialog>

                <el-dialog :visible.sync="showAddSkuValueDialog" size="tiny" title="添加规格属性值">
                    <el-form-item label="属性值">
                        <el-input v-model="skuKeyValue"></el-input>
                    </el-form-item>

                    <span slot="footer" class="dialog-footer">
                        <el-button @click="showAddSkuValueDialog = false">取 消</el-button>
                        <el-button type="primary" @click="addSkuKeyValueSubmit(skuKeyValue)">确 定</el-button>
                    </span>
                </el-dialog>

                <div class="sku-tag" v-for="(skuKey, index) in skuKeyList" :key="index">

                    <div>
                        <span>
                            <el-button style="margin-right:20px;" size="small" @click="deleteSkuKey(skuKey,index)">删除</el-button>

                        </span>
                        <span class="sku-key">{{skuKey.key}}</span>

                        <el-tag style="margin-left:10px;" :key="index" v-for="(item,index) in skuKey.value" :closable="true" :close-transition="false" @close="deleteSkuValue(skuKey,index)">
                            {{item.value}}
                        </el-tag>

                        <el-input style="width:100px;" v-if="inputVisible[index]" v-model="inputValue[index]" ref="saveTagInput" size="mini" @keyup.enter.native="handleInputConfirm(skuKey,index)">
                        </el-input>
                        <el-button v-else class="button-new-tag" size="small" @click="addSkuKeyValue(skuKey)">添加新属性</el-button>

                    </div>

                </div>

                <el-button style="margin-top:20px;" @click="showSkuItemDialog('add')">添加规格信息</el-button><br/>

                <el-table :data="skuList" style="width: 100%;margin-top:10px;">

                    <el-table-column label="规格图片" width="160">

                        <template slot-scope="scope">
                            <img :src="scope.row.skuImgUrl" style="width:40px;height:40px;">
                        </template>

                    </el-table-column>

                    <el-table-column prop="barCode" label="条码信息" width="120">
                    </el-table-column>

                    <el-table-column :prop="skuKey.key" :label="skuKey.key" width="120" v-for="(skuKey, index) in skuKeyList" :key="index" sortable>
                    </el-table-column>

                    <el-table-column prop="storageNum" label="库存量" width="120">
                    </el-table-column>

                    <el-table-column prop="costPrice" label="供货价" width="120">
                    </el-table-column>

                    <el-table-column prop="labelPrice" label="标签价" width="120">
                    </el-table-column>

                    <el-table-column prop="marketPrice" label="市场价" width="120">
                    </el-table-column>

                    <el-table-column label="操作" width="150">
                        <template slot-scope="scope">

                            <el-button size="small" type="primary" @click="handleDelete(scope.row.skuId,scope.$index)">删除</el-button>

                            <el-button type="text" size="small" @click="editSkuItem(scope.row.skuId,scope.$index)">编辑</el-button>
                        </template>
                    </el-table-column>

                </el-table>

                <sku-item-edit-view :showDialog='showDialog' @close="onItemEditViewClose" @updateSuccess="onUpdateSuccess" :itemId="skuId" :skuList="skuKeyList" :mode="editMode" :goodsId="goodsId">

                </sku-item-edit-view>

            </el-tab-pane>
            <el-tab-pane label="商品详情" name="tab3" :disabled="!GOODS_EDIT_MODE">

                <quill-editor ref="myEditor" :content="content" :options="editorOption" @change="onEditorChange($event)" style="width:90%;height:800px;margin-top:20px;">
                </quill-editor>
                <div style="display:none;"><input type="file" id="getFile" @change="uploadFunction($event)" /></div>

            </el-tab-pane>

            <el-tab-pane label="分类标签" name="tab4" :disabled="!GOODS_EDIT_MODE" >

                <!-- <category-tabView :catIdOne="form.catId1" :catIdTwo="form.catId2" :catIdThree="form.catId3" @change="doChangeCategory"> </category-tabView> -->
                <category-view :goodsId="goodsId" ></category-view>

            </el-tab-pane>
        </el-tabs>

    </el-form>
</template>

<script>
import * as Api from "../../api/api.js";

import * as Config from "../../api/conf.js";

import { quillEditor } from "vue-quill-editor";

import skuItemEditView from "./SkuItemEditView";
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
        goodsType: "GOODS_TYPE_NORMAL",
        logoUrl: "",
        supplierId: "self",
        name: "",
        code: "",
        jingle: "",
        weight: 0.0,
        supplierId: "",
        labelPrice: 0.0,
        marketPrice: 0.0,
        costPrice: 0.0,
        storageNum: 0,
        beginSaleTime: "",
        single_status:false,
        imageList: "",
        catId1: "",
        catId2: "",
        catId3: ""
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
      }
    };
  },
  mounted() {
    this.fileUploadUrl = Config.g_upload_url;

    let goodsId = this.$route.params.goodsId;
    this.goodsId = goodsId;

    console.log(this.$route.params);

    if ((goodsId || "") != "") {
      this.GOODS_EDIT_MODE = true;

      console.log(goodsId);

      Api.requestGoodsDetail(goodsId).then(res => {
        console.log(res);

        this.form = res.data;

        console.log(this.form.catId1);
        console.log(this.form.catId2);

        console.log(res.data.imageList);

        let imageList = res.data.imageList.split(",");

        for (let f in imageList) {
          console.log(f);

          let dt = { name: "1.png", url: imageList[f] };
          this.fileList.push(dt);
        }
      });

      Api.requestGoodsInfoDetail(goodsId).then(res => {
        this.content = res.data.detail;
      });

      Api.requestSkuDetail(goodsId).then(res => {
        let attrs = res.data.skuAttribute;
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
          this.skuKeyList.push(data);
        }

        let items = res.data.skuItem;

        for (let i in items) {
          // this.skuList

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

      //
    }

    console.log("add goods");
    console.log(goodsId);
  },
  components: {
    quillEditor,
    skuItemEditView,
    categoryTabView,
    categoryView
  },

  computed: {
    editor() {
      return this.$refs.myEditor.quillEditor;
    }
  },

  methods: {
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
      this.content = html;
    },

    uploadFunction(e) {
      //you can get images data in e.target.files
      //an single example for using formData to post to server

      var form = new FormData();
      form.append("file1", e.target.files[0]);

      Api.uploadFile(form).then(res => {
        let imgUrl = res.data.data.urllist[0];
        console.log("file upload url");

        // console.log(this.$refs.myEditor.quill)
        // console.log(this.$refs.myEditor)

        let idx = this.$refs.myEditor.quill.getSelection().index;

        this.$refs.myEditor.quill.insertEmbed(idx, "image", imgUrl);

        // quill.insertEmbed(vm.addRange !== null ? vm.addRange.index : 0, vm.uploadType, value, Quill.sources.USER)   // 调用
        console.log(imgUrl);
      });

      //do your post
    },

    addSkuKeyValue(skuKey) {
      this.currentSkuKey = skuKey;

      this.showAddSkuValueDialog = true;
    },

    addSkuKeyValueSubmit(attrValue) {
      if (this.GOODS_EDIT_MODE == false) {
        this.showAddSkuValueDialog = false;

        let valueData = { id: "", value: attrValue };

        this.currentSkuKey.value.push(valueData);
      } else {
        Api.requestAddSkuValue(this.goodsId, this.currentSkuKey.id, attrValue)
          .then(res => {
            console.log("add sku key value");
            console.log(res);
            console.log("end...");
            this.showAddSkuValueDialog = false;

            for (let i in this.skuKeyList) {
              let attr = this.skuKeyList[i];
              if (this.currentSkuKey.id == attr.id) {
                console.log("find=>xxxxxx");
                let valueData = {
                  id: res.data.skuValueId,
                  value: res.data.skuValueName
                };
                attr.value.push(valueData);
              }
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },

    doShowSkuAttr() {
      this.showSkuDialog = true;

      this.skuKeyName = "";
    },

    handleClick() {
      if (this.activeName == "tab2") {
        if (this.GOODS_EDIT_MODE == false) {
          this.switchAddGoods();
        }
      }
    },

    showInput(attrId) {
      console.log("add value");
      console.log(attrId);
      // console.log("click index:" + index)
      // this.$set(this.inputVisible, index, true)
      // this.$nextTick(_ => {
      // });
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
      this.$confirm("删除整个属性将删除原有的SKU信息，是否继续？", "注意", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      }).then(res => {
        this.skuKeyList.splice(index, 1);

        this.skuList = [];

        Api.requestDeleteSkuKey(this.goodsId, skuKey.id).then(res => {
          console.log(res);
        });
      });
    },

    deleteSkuValue(skuKey, index) {
      if (this.GOODS_EDIT_MODE == true) {
        this.$confirm("删除属性信息也将删除该库存的sku信息，是否继续删除？", "注意", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(res => {
            let valueObj = skuKey.value[index];
            console.log(valueObj);
            console.log(skuKey);

            Api.requestDeleteSkuValue(this.goodsId, skuKey.id, valueObj.id)
              .then(res => {
                skuKey.value.splice(index, 1);
              })
              .catch(e => {});
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
        Api.requestAddSkuKey(this.goodsId, this.skuKeyName)
          .then(res => {
            console.log("add sku key");
            console.log(res);
            console.log("end...");

            let newValue = {
              key: this.skuKeyName,
              id: res.data.skuKeyId,
              value: []
            };
            this.skuKeyList.push(newValue);
          })
          .catch(error => {
            console.log(error);
          });
        this.showSkuDialog = false;
      } else {
        this.showSkuDialog = false;
        let newValue = { key: this.skuKeyName, value: [] };
        this.skuKeyList.push(newValue);
      }
    },

    doAddSku(goodsId) {
      let skuKey = JSON.stringify(this.skuKeyList);

      let skuAttr = JSON.stringify(this.skuList);

      let data = {
        goodsId: goodsId,
        skuAttributes: this.skuKeyList,
        skuItems: this.skuList
      };
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

      this.form.imageList = imageList.join(",");

      if(this.form.imageList.length>0){
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
    onSubmit() {
      console.log("submit!");
    },
    handleRemove(file, fileList) {
      console.log("dddddooooooo RRRMMMOOOOVEEEE");

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
</style>