<template>
    <div>
      <div class="toolbar">
        <el-button type="primary" size="small" @click="tempSubmit">提交运费模板</el-button>
      </div>
      <div style="width:100%;min-width:1050px;height:auto">
        <div style="width:35%;min-width:350px;height:auto;float:left">
            <el-form :model="model" label-width="100px" style="width:350px">
                <el-form-item label="模板名称">
                    <el-input v-model="model.templateName" ></el-input>
                </el-form-item>
                <el-form-item label="首重设定(kg)">
                    <el-input v-model="model.ykg"></el-input>
                </el-form-item>
                <el-form-item label="首重运费(元)">
                    <el-input v-model="model.ykgFreight"></el-input>
                </el-form-item>
                <el-form-item label="续重(元/kg)">
                    <el-input v-model="model.addedFreight"></el-input>
                </el-form-item>
                <el-button type="primary"  plain @click="toOtherEditer" size="small" v-if="model.id==''" :disabled="model.templateName==''||model.ykg==''||model.ykgFreight==''||model.addedFreight==''">添加除外地区</el-button>
                <el-button type="primary"  plain @click="toOtherEditer" size="small" v-else>添加除外地区</el-button>
            </el-form>
        </div>

        <div style="width:55%;min-width:650px;height:auto;background:blue;float:left">
            <el-table :data="model.others" style="width: 100%">
                <el-table-column prop="provinceId" label="地区" min-width="100">
                    <template slot-scope="scope">
                        {{getProvinceName(scope.row.provinceId)}}
                    </template>
                </el-table-column>
                <el-table-column prop="ykg" label="首重(kg)" min-width="80"></el-table-column>
                <el-table-column prop="ykgFreight" label="首重运费(元)" min-width="100">
                    <template slot-scope="scope">
                        {{'￥'+scope.row.ykgFreight}}
                    </template>
                </el-table-column>
                <el-table-column  label="续重(元/kg)" min-width="100">
                    <template slot-scope="scope">
                        {{'￥'+scope.row.addedFreight}}
                    </template>
                </el-table-column>
                <el-table-column  label="是否发货" min-width="80">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.sendStatus" @change="sendStatusChange(scope.$index,scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="150">
                <template slot-scope="scope">
                    <el-button @click="toOtherEditer(scope.$index,scope.row)" size="small">编辑</el-button>
                    <el-button plain type="danger" size="small" @click="otherDelete(scope.$index,scope.row)">删除</el-button>
                </template>
                </el-table-column>
            </el-table>
        </div>
      </div>
      
        <el-dialog title="地区编辑" :visible.sync="otherEditer.show" width="500px" :close-on-click-modal="false">
            <el-form :model="otherEditer.other" label-width="120px">
                <el-form-item label="地区">
                    <el-select v-model="otherEditer.other.provinceId" placeholder="请选择" class="other-form">
                        <el-option v-for="item in otherEditer.options" :key="item.id" :label="item.name" :value="item.id" :disabled="item.disabled"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="首重设定(kg)">
                    <el-input v-model="otherEditer.other.ykg" class="other-form"></el-input>
                </el-form-item>
                <el-form-item label="首重运费(元)">
                    <el-input v-model="otherEditer.other.ykgFreight" class="other-form"></el-input>
                </el-form-item>
                <el-form-item label="续重(元/kg)">
                    <el-input v-model="otherEditer.other.addedFreight" class="other-form"></el-input>
                </el-form-item>
                <el-form-item label="是否发货">
                    <el-switch v-model="otherEditer.other.sendStatus" class="other-form"></el-switch>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="otherEditer.show = false" size="small">取 消</el-button>
                <el-button type="primary" @click="otherSubmit" size="small">确 定</el-button>
            </span>
        </el-dialog>
  
    </div>
</template>

<script>
import * as w from "../../api/wapi.js";
import * as Address from "../../api/addressapi.js";

export default {
  data() {
    return {
        model:{
            id:'',
            templateName:'',
            ykg:'',
            ykgFreight:'',
            addedFreight:'',
            validStatus:true,
            isDefault:false,
            others:[]
        },
        otherEditer:{
            show:false,
            options:[],
            other:{
                id:"",
                tempId:'',
                provinceId:null,
                ykg:null,
                ykgFreight:'',
                addedFreight:'',
                sendStatus:true,
            }
        }
    };
  },
  methods:{
    //进入除外地区编辑器的初始化过程
    toOtherEditer:function(index,row){
        if(this.model.id==''){
            this.model.validStatus=false;
            this.tempAdd();
            return;
        }
        this.otherEditer.other={
            id:"",
            tempId:this.model.id,
            provinceId:null,
            ykg:null,
            ykgFreight:'',
            addedFreight:'',
            sendStatus:true,
        };

        var provinceIds=[];
        for(var j in this.otherEditer.options)this.otherEditer.options[j].disabled=false;
        for(var i in this.model.others)provinceIds.push(this.model.others[i].provinceId);
        for(var i in provinceIds){
            for(var j in this.otherEditer.options){
                if(this.otherEditer.options[j].id==provinceIds[i]){
                    this.otherEditer.options[j].disabled=true;
                    break;
                }
            }
        }
        if(row==null){
            this.otherEditer.show=true;
            return;
        }
        w.post('/other/template/query',{otherTempId:row.id}).then(
            res=>{
                if(res.state){
                    this.otherEditer.other=res.data;
                    for(var j in this.otherEditer.options){
                        if(this.otherEditer.options[j].id==this.otherEditer.other.provinceId){
                            this.otherEditer.options[j].disabled=false;
                            break;
                        }
                    }
                    this.otherEditer.show=true;
                }else{
                    this.$alter(res.data);
                }
            }
        );
    },
    //运费模板编辑页初始化
    initPage(tempId){
        let model={
            id:"",
            templateName:'',
            ykg:'',
            ykgFreight:'',
            addedFreight:'',
            validStatus:true,
            isDefault:false,
            others:[]
        }
        this.model=model;
        if(tempId!=null){
            w.post('/freight/template/query',{tempId:tempId}).then(
                res=>{
                    if(res.state){
                        res.data.others=[]
                        this.model=res.data;
                        this.getOtherList()
                    }else{
                        this.$alert(res.data);
                    }
                }
            );
        }
    },
    //运费模板表单提交
    tempSubmit(){
        if(this.model.templateName==''||this.model.ykg==''||this.model.ykgFreight==''||this.model.addedFreight==''){
            this.$alert("请完整填写表单");
            return;
        }
       if(this.model.id==''){
           this.tempAdd();
       }else{
           this.tempUpdate();
       }
    },
    //新增运费模板
    tempAdd(){
        w.post('/freight/template/add',this.model).then(
            res=>{
                if(res.state){
                    this.model=res.data;
                    if(this.model.validStatus){
                        this.$router.replace("/logisticsmodel");
                    }else{
                        this.model.validStatus=true;
                        this.toOtherEditer();
                    }
                }else{
                    this.$alert(res.data);
                }
            }
        );
    },
    //修改运费模板
    tempUpdate(){
        w.post('/freight/template/update',this.model).then(
            res=>{
                if(res.state){
                    this.$router.replace("/logisticsmodel");
                }else{
                    this.$alert(res.data);
                }
            }
        );
    },
    //获取运费模板的除外地区列表
    getOtherList(){
        w.post('/other/template/list',{tempId:this.model.id}).then(
            res=>{
                if(res.state){
                    this.model.others=res.data;
                }else{
                    this.$alert(res.data);
                }
            }
        );
    },
    //除外地区表单提交
    otherSubmit(){
        if(this.otherEditer.other.id==''){
            this.otherAdd();
        }else{
            this.otherUpdate();
        }
    },
    //添加除外地区
    otherAdd(){
        w.post('/other/template/add',this.otherEditer.other).then(
            res=>{
                if(res.state){
                    this.getOtherList();
                    this.otherEditer.show=false;
                }else{
                    this.$alert(res.data);
                }
            }
        );
    },
    //修改除外地区
    otherUpdate(){
        w.post('/other/template/update',this.otherEditer.other).then(
            res=>{
                if(res.state){
                    this.getOtherList();
                    this.otherEditer.show=false;
                }else{
                    this.$alert(res.data);
                }
            }
        );
    },
    //在列表中设置除外地区是否发货
    sendStatusChange(index,row){
        this.otherEditer.other=row;
        this.otherUpdate();
    },
    otherDelete(index,row){
        this.$confirm('此操作将删除该条地区配置, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(
            ()=>{
                w.post('/other/template/delete',{otherTempId:row.id}).then(
                    res=>{
                        if(res.state){
                            this.getOtherList();
                            this.$message({type: 'success',message: '删除成功'}); 
                        }else{
                            this.$alert(res.data);
                        }
                    }
                );
            }
        ).catch(
            ()=>{
                this.$message({type: 'info',message: '已取消删除'}); 
            }
        );
        
    },
    getProvinceName(provinceId){
        for(var i in  this.otherEditer.options){
            if(this.otherEditer.options[i].id==provinceId){
                return this.otherEditer.options[i].name;
            }
        }
    }
  },
  created() {
    var tempId=w.getURLParams("tempId");
    this.initPage(tempId);
    Address.requestProvince().then(
        res=>{
            var options=res.data.data.region;
            for(var i in options)options[i].disabled=false;
            this.otherEditer.options=options;
        }
    )
   }
};
</script>

<style scoped>
.other-form{
    width:300px
}
.toolbar{
    margin:0px 0px 20px
}
</style>
