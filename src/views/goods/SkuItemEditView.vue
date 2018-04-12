<template>
    <div>
        <el-dialog size="large" :visible.sync="showDialogModel" :title="title" @close="onClose">

            <div>

                <div class="sku-attr-layout">

                    <div v-if="mode=='edit'">
                        <span v-for="(sku, index) in attrs" :key="index" style="height:60px;width:200px;padding-right:60px;">

                            {{sku.skuValueName}}
                            <el-select v-model="sku.skuValueId" clearable placeholder="未选择" style="width:150px;" :disabled="disableStatus">
                                <el-option :label="sku.skuValueName" :value="sku.skuValueId"></el-option>
                            </el-select>
                        </span>
                    </div>

                    <div v-if="mode=='add'">

                        <span v-for="(skuKey, index) in attrs" :key="index" style="height:60px;width:200px;padding-right:60px;">

                            {{skuKey.skuValueName}}
                            <el-select v-model="inputValueSku[index]" clearable placeholder="未选择" style="width:150px;">
                                <el-option v-for="(tag,index) in skuKey.value" :key="index" :label="tag.value" :value="tag.value">
                                </el-option>
                            </el-select>
                        </span>
                    </div>

                </div>

            </div>

            <div>
                <div style="height:10px;border-bottom: 1px solid #ddd;"> </div>

            

                <el-form-item label="库存量">
                    <el-input v-model="storageNum" style="width:200px;"></el-input>
                </el-form-item>

                <el-form-item label="供货价">
                    <el-input v-model="costPrice" style="width:200px;"></el-input>
                </el-form-item>

                <el-form-item label="标签价">
                    <el-input v-model="labelPrice" style="width:200px;"></el-input>
                </el-form-item>

                <el-form-item label="市场价">
                    <el-input v-model="marketPrice" style="width:200px;"></el-input>
                </el-form-item>

                <el-form-item label="条码">
                    <el-input v-model="barCode" style="width:200px;"></el-input>
                </el-form-item>

                <el-form-item label="备注">
                    <el-input v-model="remark" style="width:300px;height:30px;"></el-input>
                </el-form-item>

                <upload-image-view @updateImageList="updateImageList" :imageUrlList="imageList">

                </upload-image-view>

            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="doClose">取 消</el-button>
                <el-button type="primary" @click="doSubmit">确 定</el-button>
            </span>

        </el-dialog>

    </div>
</template>

<script>
import util from '../../common/js/util'
import * as Api from '../../api/api.js'

import uploadImageView from '../../common/UploadImageView'

import * as Config from '../../api/conf.js'


export default {
    data() {
        return {
            inputValueSku: [],
            attrs: [],
            showDialogModel: false,
            storageNum: 0,
            marketPrice: 0,
            labelPrice: 0,
            costPrice: 0,
            barCode: '',
            remark: '',
            disableStatus: true,
            imageList: [],
            fileUploadUrl: '',
            title: '',
            skuList:[]
        }
    },

    updated() {

    },
    activated() {

    },
    mounted() {

    },
    watch: {
        showDialog(data) {
            this.showDialogModel = data;
            this.fileUploadUrl = Config.g_upload_url;
            if (this.mode == 'add') {
                this.title = "添加sku值";
                this.restForm();
                
            } else {
                this.title = "修改sku值";
            }
            if (data == true && this.mode == 'add') {

            }
            if (data == true && this.mode == 'edit') {
                this.title = "修改sku信息";
                console.log("load Data ...");
                this.loadSkuItem();
            }
        }
    },
    props: ['itemId', 'showDialog', 'mode', 'skuList','goodsId','submitMode'],
    components: {
        uploadImageView
    },

    methods: {
        addSkuItemSubmit() {
            let data = {
                costPrice: this.costPrice,
                storageNum: this.storageNum,
                labelPrice: this.labelPrice,
                marketPrice: this.marketPrice,
                remark: this.remark,
                barCode: this.barCode,
                attributeItems: []
            }
            let ct = 0
            for (let value in this.inputValueSku) {
                let skuKey = this.skuKeyList[ct]
                data[skuKey.key] = this.inputValueSku[ct]
                data.attributeItems.push({ key: skuKey.key, value: this.inputValueSku[ct] })
                ct++
            }
            this.skuList.push(data);
        },
        doSubmit() {
            if (this.mode == 'edit') {
                this.submitUpdate()
            } else {
                this.submitAdd()
            }

        },
        submitAdd() {
            if (this.skuList.length!=this.inputValueSku.length){
                this.$alert("请选择完整属性值");
                return;
            }

            let data = {
                costPrice: this.costPrice,
                storageNum: this.storageNum,
                labelPrice: this.labelPrice,
                marketPrice: this.marketPrice,
                remark: this.remark,
                barCode: this.barCode,
                skuImgUrl:this.imageList.join(','),
                attributeItems: []
            }

            let ct = 0
            console.log(this.inputValueSku)

            for (let value in this.inputValueSku) {
                let skuKey = this.skuList[ct]

                data[skuKey.key] = this.inputValueSku[ct]
                data.attributeItems.push({ key: skuKey.key, value: this.inputValueSku[ct] })
                ct++
            }
            Api.requestAddSkuItem(this.goodsId, data)
                .then(res => {
                    if (res.retCode==true){
                        this.showDialogModel = false
                        this.$emit('updateSuccess')
                    }else{
                        this.$alert("数据修改失败:"+res.message);
                    }
                });
        },
        restForm() {
            this.inputValueSku = []
            this.attrs = []
            this.storageNum = 0
            this.marketPrice = 0
            this.labelPrice = 0
            this.costPrice = 0
            this.barCode = ''
            this.remark = ''
            this.imageList = []
            this.fileUploadUrl = []

        },
        updateImageList(imageList) {
            this.imageList = imageList
            console.log(imageList);
        },
        loadSkuKeyValue() {

        },
        //在添加状态增加sku
        addSkuItemSubmit() {
            let data = {
                costPrice: this.costPrice,
                storageNum: this.storageNum,
                labelPrice: this.labelPrice,
                marketPrice: this.marketPrice,
                remark: this.remark,
                barCode: this.barCode,
                attributeItems: [],
                imgUrl: this.imageList.join(',')

            }
            let ct = 0
            console.log(this.inputValueSku)
            for (let value in this.inputValueSku) {
                let skuKey = this.skuKeyList[ct]

                data[skuKey.key] = this.inputValueSku[ct]
                data.attributeItems.push({ key: skuKey.key, value: this.inputValueSku[ct] })
                ct++

            }
            console.log(data)
            this.skuList.push(data);
        },
        loadSkuItem() {

            this.imageList = []

            Api.requestSkuItemDetail('', this.itemId).then(res => {

                if (res.retCode == false) {
                    console.log("错误");
                    return;
                }

                this.storageNum = res.data.storageNum;
                this.marketPrice = res.data.marketPrice;
                this.labelPrice = res.data.labelPrice;
                this.costPrice = res.data.costPrice;
                this.attrs = res.data.attrs;
                this.barCode = res.data.barCode;
                this.remark = res.data.remark;
                this.imageList = res.data.skuImgUrl.split(",");

                console.log("load item image....")
                console.log(this.imageList)
            })
        },
        updateSkuItem() {
            Api.requestSkuItemDetail('', this.itemId).then(res => {
                if (res.retCode == false) {
                    console.log("错误");
                    return;
                }
                this.storageNum = res.data.storageNum;
                this.marketPrice = res.data.marketPrice;
                this.labelPrice = res.data.labelPrice;
                this.costPrice = res.data.costPrice;
                this.attrs = res.data.attrs;
            })
        },
        submitUpdate() {

            let data = {
                skuId: this.itemId,
                storageNum: this.storageNum,
                marketPrice: this.marketPrice,
                labelPrice: this.labelPrice,
                costPrice: this.costPrice,
                barCode: this.barCode,
                remark: this.remark,
                imgUrl: this.imageList.join(',')

            }
            return Api.requestUpdateSkuItem(data)
                .then(res => {
                    console.log(res)
                    if (res.retCode) {
                        this.showDialogModel = false
                        this.$emit('updateSuccess')
                        return true;
                    } else {
                        this.$alert("数据修改错误")
                        return false;
                    }
                }).catch(e => {
                    return false;
                })
        },
        doClose() {
            this.showDialogModel = false
        },
        onClose() {
            this.$emit('close')
        }
    }
}


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
