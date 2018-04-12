<template>
    <div>
      <div class="toolbar">
        <el-button type="primary" size="small" @click="toEditer">添加运费模板</el-button>
      </div>
      <el-table :data="modelList" style="width: 100%">
        <el-table-column prop="templateName" label="模板名称" min-width="200"></el-table-column>
        <el-table-column prop="ykg" label="首重(kg)" min-width="100"></el-table-column>
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
        <el-table-column  label="默认模板" min-width="100">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.isDefault" @change="setDefault(scope.$index,scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="250">
          <template slot-scope="scope">
            <el-button @click="toEditer(scope.$index,scope.row)" size="small">编辑</el-button>
            <el-button plain type="danger" size="small" @click="tempDelete(scope.$index,scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
  
    </div>
</template>

<script>
import * as w from "../../api/wapi.js";

export default {
  data() {
    return {
      modelList:[],
      model:{
        tempId:'',
        templateName:'',
        ykg:0.00,
        ykgFreight:0.00,
        addedFreight:0.00,
        validStatus:true,
        isDefault:false
      }
    };
  },
  methods:{
    getList(){
      w.post("/freight/template/list").then(
        res=>{
          if(res.state){
            this.modelList=res.data;
          }else{
            this.$alert(res.data);
          }
        }
      );
    },
    toEditer(index,row){
      if(row==null){
        this.$router.push("/modelediter");
      }else{
        this.$router.push("/modelediter?tempId="+row.id);
      }
    },
    tempDelete(index,row){
      this.$confirm('此操作将删除该运费模板, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(
        ()=>{
          w.post('/freight/template/delete',{tempId:row.id}).then(
            res=>{
              if(res.state){
                  this.getList();
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
    setDefault(index,row){
      w.post('/freight/template/update',row).then(
        res=>{
          if(res.state){
              this.getList();
          }else{
              this.$alert(res.data);
          }
        }
      );
    }
  },
  mounted(){
    this.getList();
    
  }
};
</script>

<style scoped>
.toolbar{
  margin-top:0px
}
</style>
