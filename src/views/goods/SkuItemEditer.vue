<template>
<div>
<el-dialog :visible.sync="skuItemEditerBootData.show" :title="title" @open="openEditer" center width='800px' :close-on-click-modal="false">
    <el-form inline label-width="100px" size="small">
        <el-form-item v-for="(skuKey,index) in skuItemEditerBootData.skuKeyList" :key="skuKey.skuKeyIdName" :label="skuKey.skuKeyIdName">
            <el-select v-model="form.attrs[skuKey.skuKeyIdName]" clearable placeholder="未选择" style="width:100px;" :disabled="disableStatus&&form.attrs[skuKey.skuKeyIdName]!=''">
                <el-option v-for='value in skuKey.valueList' :key='value.skuValueName' :label="value.skuValueName" :value="value.skuValueName"></el-option>
            </el-select>
        </el-form-item>
    </el-form>

    <el-form label-width="100px" size="small">

        <el-form-item label="库存量">
            <el-input v-model="form.storageNum" style="width:200px;"></el-input>
        </el-form-item>

        <el-form-item label="供货价">
            <el-input v-model="form.costPrice" style="width:200px;" :disabled="skuItemEditerBootData.specStatus"></el-input>
        </el-form-item>

        <el-form-item label="标签价">
            <el-input v-model="form.labelPrice" style="width:200px;" :disabled="skuItemEditerBootData.specStatus"></el-input>
        </el-form-item>

        <el-form-item label="市场价">
            <el-input v-model="form.marketPrice" style="width:200px;" :disabled="skuItemEditerBootData.specStatus"></el-input>
        </el-form-item>

        <el-form-item label="条码">
            <el-input v-model="form.barCode" style="width:200px;"></el-input>
        </el-form-item>

        <el-form-item label="备注">
            <el-input v-model="form.remark" style="width:300px;height:30px;"></el-input>
        </el-form-item>

        <upload-image-view @updateImageList="updateImageList" :imageUrlList="form.imageList">

        </upload-image-view>

    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="skuItemEditerBootData.show=false">取 消</el-button>
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
            title:"",
            disableStatus:false,
            form:{
                skuId:'',
                storageNum: 0,
                marketPrice: 0,
                labelPrice: 0,
                costPrice: 0,
                barCode: '',
                remark: '',
                imageList: [],
                fileUploadUrl: '',
                title: '',
                attrs:{},
                attributeItems:[]
            },
        }
    },
    mounted() {

    },
    props: ['skuItemEditerBootData'],
    components: {
        uploadImageView
    },
    methods: {
        updateImageList(imageList) {
            this.form.imageList = imageList;
        },
        reset:function(){
            var form={
                skuId:'',
                storageNum: 0,
                marketPrice: 0,
                labelPrice: 0,
                costPrice: 0,
                barCode: '',
                remark: '',
                imageList: [],
                skuImgUrl:'',
                fileUploadUrl: '',
                title: '',
                attrs:{},
                attributeItems:[]
            }
            for(let i in this.skuItemEditerBootData.skuKeyList){
                let key=this.skuItemEditerBootData.skuKeyList[i].skuKeyIdName;
                form.attrs[key]="";
            }
            if(this.skuItemEditerBootData.specStatus){
                form.labelPrice=this.skuItemEditerBootData.labelPrice;
                form.marketPrice=this.skuItemEditerBootData.marketPrice;
                form.costPrice=this.skuItemEditerBootData.costPrice;
            }
            this.form=form;
        },
        openEditer:function(){
            this.disableStatus=false;
            this.reset();
            if(this.skuItemEditerBootData)
            if(this.skuItemEditerBootData.skuId!=''){
                Api.requestSkuItemDetail(this.skuItemEditerBootData.goodsId,this.skuItemEditerBootData.skuId).then(
                    request=>{
                        var form=request.data;
                        let attrs={};
                        for(let i in form.attrs){
                            attrs[form.attrs[i].skuKeyName]=form.attrs[i].skuValueName;
                        }
                        form.attrs=attrs;
                        form.imageList=form.skuImgUrl.split(',');
                        this.form=form;
                        this.disableStatus=true;
                    }
                );
            }
        },
        doSubmit(){
            this.form.attributeItems=[];
            for(var key in this.form.attrs){
                var value=this.form.attrs[key];
                if(value==''){
                    this.$alert("请选择"+key+"的属性值");
                    return;
                }else{
                    let item={};
                    item.key=key;
                    item.value=value;
                    this.form.attributeItems.push(item);
                }
            }

            this.form.skuImgUrl=this.form.imageList.join(',');

            if (this.skuItemEditerBootData.skuId=='') {
                this.submitAdd();
            } else {
                this.submitUpdate();
            }
        },
        submitAdd(){
            Api.requestAddSkuItem(this.skuItemEditerBootData.goodsId, this.form).then(
                res => {
                    if (res.retCode==true){
                        this.skuItemEditerBootData.show = false;
                        this.$emit('updateSuccess');
                    }else{
                        this.$alert("数据添加失败:"+res.message);
                    }
                }
            );
        },
        submitUpdate(){
            Api.requestUpdateSkuItem(this.form).then(
                res => {
                    console.log(res)
                    if (res.retCode) {
                        this.skuItemEditerBootData.show = false;
                        this.$emit('updateSuccess');
                    } else {
                       this.$alert("数据添加失败:"+res.message);
                    }
                }
            );
        }
    }
}


</script>

<style scoped>

</style>
