<template>
	<section>
		<el-col :span="11" class="moniqi">

            <div align="left" style="display:flex;flex-direction:row;justify-content:space-around;">
                <el-button  plain type="primary" size="small" @click="templateModel.show=true" style="margin-bottom:20px;"> 创建新页面 </el-button>    
                <el-button  plain type="primary" size="small" @click="dialogModel.doAdd()" style="margin-bottom:20px;"> 查看模板 </el-button>    
            </div>
           

            <div style="align:center;width:350px;border:1px red solid;overflow-y:auto;overflow-x:hidden;height:500px;">

                <div v-for="(com,index) in componentList" :key="index"> 
                    

                    <div v-if="com.componentType=='COMPONENT_TYPE_SCROLL_HEADER'" style="position:relative;display:flex;flex-direction:row;width:350px;height:175px;"  
                     @mouseover="overShow('COMPONENT_TYPE_SCROLL_HEADER',index)" @mouseout="outHide('COMPONENT_TYPE_SCROLL_HEADER',index)" >

                    

                        <el-button  v-if="showStatus[index]" style="position:absolute;left:100px;top:90px;"  plain type="primary" @click="doConfig(com)">{{com.name}}设置</el-button>
                   
                        <div v-for="(item,idx) in com.items" :key="idx" >
                          
                            <img :src="item.itemImgUrl" height="175" width="350">
                        </div>
                    </div>


                    <div v-if="com.componentType=='COMPONENT_TYPE_QUICK_BAR'" style="position:relative;" class="quick-bar" @mouseover="overShow('COMPONENT_TYPE_QUICK_BAR',index)"
                     @mouseout="outHide('COMPONENT_TYPE_QUICK_BAR',index)">
                       
                    <el-button  v-if="showStatus[index]" style="position:absolute;"  plain type="primary" @click="doConfig(com)" > {{com.name}}设置</el-button>
                   
                        <div v-for="(item,idx) in com.items" :key="idx" >
                            <img :src="item.itemImgUrl" height="50" width="50">
                            <div align="center">{{item.itemName}}</div>
                        </div>
                    </div>


                    <div v-if="com.componentType=='COMPONENT_TYPE_GOODS_TAG'" style="position:relative;" class="goods-list" @mouseover="overShow('COMPONENT_TYPE_GOODS_TAG',index)"
                     @mouseout="outHide('COMPONENT_TYPE_GOODS_TAG',index)">
                       
                           <el-button style="position:absolute;top:10px;" v-if="showStatus[index]"  plain type="primary" @click="doConfig(com)"> 商品列表设置</el-button>
                   
                        <div v-for="(item,idx) in com.items" :key="idx" >
                            <img :src="item.logoUrl" height="350" width="350">
                           <div style="display:flex;flex-direction:row;justify-content: space-around;">
                                <span align="center">{{item.name}}</span>  <span style="color:red;">{{item.marketPrice}}元</span> </div>
                        </div>
                    </div>



                </div>
                



            </div>


		</el-col>

        <el-col :offset="1" :span="12"  >

         <h3 align="center">{{formatComponentType(componentType)}}</h3>   

       <div v-show="componentType=='COMPONENT_TYPE_SCROLL_HEADER'">  
        <el-button  size="small" plain type="primary" @click="dialogModel.doAdd()"> 增加内容 </el-button>    

        <el-table :data="items" highlight-current-row >
		
			<el-table-column prop="itemImgUrl" label="商品图片" width="80">

				<template scope="scope">
					<img :src="scope.row.itemImgUrl" style="width:40px;height:40px;">
				</template>

			</el-table-column>


            <el-table-column prop="actionType" label="点击跳转" width="80">

				<template scope="scope">
                        {{formatActionType(scope.row.actionType)}}
				</template>

			</el-table-column>


            <el-table-column label="操作" width="350">
				<template scope="scope">
			
            		<el-button  size="mini" plain @click="dialogModel.doEdit(scope.row)" >修改</el-button>

            	<el-button size="mini" type="danger" @click="dialogModel.doDelete(scope.row)" plain>删除</el-button>

				</template>
			</el-table-column>

            
        </el-table>

       </div> 



    <div v-show="componentType=='COMPONENT_TYPE_QUICK_BAR'">  
        <el-button  plain type="primary" @click="dialogModel.doAdd()"> 增加内容 </el-button>    
        <el-table :data="items" highlight-current-row >
		
			<el-table-column prop="itemImgUrl" label="商品图片" width="80">

				<template scope="scope">
					<img :src="scope.row.itemImgUrl" style="width:40px;height:40px;">
				</template>

			</el-table-column>


            <el-table-column prop="itemName" label="名称" width="80">

			</el-table-column>



            <el-table-column prop="actionType" label="点击跳转" width="80">

				<template scope="scope">
                        {{formatActionType(scope.row.actionType)}}
				</template>

			</el-table-column>


            <el-table-column label="操作" width="350">
				<template scope="scope">
					<el-button  size="mini" plain @click="dialogModel.doEdit(scope.row)" >修改</el-button>
					<el-button size="mini" type="danger" @click="dialogModel.doDelete(scope.row)" lain>删除</el-button>

				</template>
			</el-table-column>
        </el-table>

       </div> 

        <div v-show="componentType=='COMPONENT_TYPE_GOODS_TAG'">  
            <el-form label-width="150px"  v-model="componentModel">

                 <el-form-item label="商品列表数量">
                        <el-input v-model="componentModel.itemMaxNum"></el-input>
                </el-form-item>

                <el-form-item label="栏目数量">
                        <el-input v-model="componentModel.columnNum"></el-input>
                </el-form-item>

                <el-form-item label="分类来源">
                        <el-input v-model="componentModel.dataSource"></el-input>
                </el-form-item>

                   <el-col :offset="4" :span="6">
                        <el-button type="primary" @click="doUpdateModel()">确 定</el-button>
                    </el-col>

                   <el-col :offset="4" :span="6">
                        <el-button @click="templateModel.show = false">取 消</el-button>
           
                </el-col>
               
                
                      



            </el-form>
            

 
        </div>     

		</el-col>


            <el-dialog :visible.sync="dialogModel.show" size="tiny"  title="修改组件信息">

                <el-form label-width="80px">
              
                    <img v-if="dialogModel.itemImgUrl" :src="dialogModel.itemImgUrl" style="width:100px;height:100px;">
                  

                    <el-upload
                        :action="fileUploadUrl"
                         :on-success="dialogModel.uploadSuccess"
                            :show-file-list="false">

                              <el-button size="small" type="primary" style="margin-bottom:20px;">点击上传</el-button>


                         
                    </el-upload>

                    <el-form-item label="标题名称">
                        <el-input v-model="dialogModel.itemName"></el-input>
                    </el-form-item>


                    <el-form-item label="点击类型">
                        <el-select v-model="dialogModel.actionType">
                            <el-option
                                v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                >
                            </el-option>
                        </el-select>    

                                </el-form-item>

                    <el-form-item label="变量值">
                        <el-col :span="10">
                        <el-input v-model="dialogModel.actionValueTitle" :readonly="true"></el-input>
                        </el-col>

                        <el-col :offset="1" :span="8">
                            <el-button type="primary" plain="" size="small" @click="doSelectItem">选择</el-button>
                        </el-col>
               
                    </el-form-item>
                   </el-form>
             


                    <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogModel.show = false">取 消</el-button>
                        <el-button type="primary" @click="dialogModel.submitEdit(dialogModel)">确 定</el-button>
                    </span>
                </el-dialog>


            <el-dialog :visible.sync="templateModel.show" size="tiny"  title="创建新页面">

                  <el-form label-width="80px">

                     <el-form-item label="选择模板">

                        <el-select v-model="templateModel.templateId">
                            <el-option
                                    label="默认模板"
                                    value="DEFAULT">
                            </el-option>
                        </el-select>    
    
                    </el-form-item>

             
                  </el-form>

                    <span slot="footer" class="dialog-footer">
                        <el-button @click="templateModel.show = false">取 消</el-button>
                        <el-button type="primary" @click="templateModel.doSubmit(templateModel)">确 定</el-button>
                    </span>

                  
            </el-dialog>

            <el-dialog :visible.sync="categoryModel.show"  size="small" title="选择分类">

                    <category-com ref="categoryCom" style="width:400px;height:200px;">  </category-com>

                     <span slot="footer" class="dialog-footer">
                        <el-button @click="categoryModel.show = false">取 消</el-button>
                        <el-button type="primary" @click="categoryModel.doSelectCat()">确 定</el-button>
                    </span>

            </el-dialog> 


            <el-dialog :visible.sync="goodsListDialogModel.show"  width="80%" title="选择商品">

                    <goodsList-com ref="goodsListCom" style="width:80%;height:400px;">  </goodsList-com>

                     <span slot="footer" class="dialog-footer">
                        <el-button @click="goodsListDialogModel.show = false">取 消</el-button>
                        <el-button type="primary" @click="goodsListDialogModel.doSelect()">确 定</el-button>
                    </span>

            </el-dialog> 



            
       



            
	</section>
</template>

<script>
import * as Api from "../../api/api.js";

import * as Config from '../../api/conf.js';

import * as portalApi from "../../api/portalapi.js";

import * as catApi from "../../api/catapi.js";


import categoryCom from "../goods/CategoryComponent.vue"

import goodsListCom from "../goods/GoodsListCom.vue"

import AnalogMobile from "../custompage/AnalogMobile3.vue"




export default {
  data() {
    return {

        options:[
            {
                value:'ACTION_TYPE_GOODSID',
                label:'点击选择商品ID'

            },
            {
                value:'ACTION_TYPE_TAGID',
                label:'点击选择分类或标签'
            },
            {
                value:'ACTION_TYPE_URL',
                label:'点击打开连接'

            }

        ],
      componentId:'',
      templateModel:{
          show:false,

          doSubmit:model=>{


              catApi.createDefaultPage().then(res=>{

                  if(res.retCode==true){
                          this.loadData();
                          model.show=false;
                
                  }else{

                      this.$alert("页面创建失败");
                  }

              })

              

          }
          

      },
      componentModel:{
          },
     
     categoryModel:{
         show:false,
         doSelectCat:()=>{

             let catId = this.$refs.categoryCom.getCatId();
             let catName = this.$refs.categoryCom.getCatName();
             this.dialogModel.actionValue=catId
             this.dialogModel.actionValueTitle=catName
             this.categoryModel.show=false

         

         }
     },

     goodsListDialogModel:{
             show:false,
            doSelect:()=>{

                let goodsId = this.$refs.goodsListCom.getCurrentGoodsId();
                let goodsName = this.$refs.goodsListCom.getCurrentGoodsName();
                this.dialogModel.actionValue=goodsId
                this.dialogModel.actionValueTitle=goodsName
                this.goodsListDialogModel.show=false

         }



     },
      dialogModel: {
        mode:'EDIT',
        show: false,
        itemImgUrl:"",
        actionType:"ACTION_TYPE_GOODSID",
        actionValue:"",
        actionValueTitle:"",
        uploadSuccess:res=>{
            this.dialogModel.itemImgUrl=res.data.filename
        },  


        doAddSubmit:model=>{

        model.componentId = this.componentId

          catApi.addComponentItem(model).then(res=>{


                if(res.retCode){

                    this.$alert("添加成功")

                    this.dialogModel.show=false;
                    this.dialogModel.componentId=this.componentId

                    this.loadData();
                    this.queryItems();



                    
                }else{

                    this.$alert("修改失败")

                }


            })



        },

        doAdd: () => {

          this.dialogModel.model='ADD'
          this.dialogModel.actionType=''
          this.dialogModel.actionValue=''
     
          this.dialogModel.show = true
        },
   

        doEdit: (row) => {
          
   
          Object.assign(this.dialogModel, row);

          this.dialogModel.show = true;
          this.dialogModel.model='EDIT'
        },

        doDelete:row=>{
			console.log(row.id)

			Api.doConfirm(this,"是否需要删除该信息!").then(res=>{

                catApi.deleteComponentItem(row.id).then(res=>{

                    if(res.retCode){

                        this.loadData();
                        this.queryItems();



                    }else{

                        this.$alert("删除出错！");
                    }


                })



			
			});


	
		},
	

        submitEdit:model=>{


            if(this.dialogModel.actionType==''){

                this.$alert("点击类型为空");
                return;

            }

            if(this.dialogModel.actionValue==''){

                this.$alert("变量值不能为空");
                return;

            }

            if(this.dialogModel.actionValueTitle==''){

                this.$alert("变量值不标题不能为空");
                return;

            }


            if(this.dialogModel.itemImgUrl==''){

                this.$alert("图片不能为空");
                return ;

            }


            

            if(this.dialogModel.model=='ADD'){

                this.dialogModel.doAddSubmit(model);

                return;

            }


            catApi.updateComponentItem(model).then(res=>{
                if(res.retCode){

                    this.$message("修改成功")
                    this.dialogModel.show=false;

                    this.loadData();
                    this.queryItems();

                    
                }else{

                    this.$alert("修改失败")

                }


            })


        }


      },
      componentType: "",
      componentName:"",

      items: [],
      showStatus: [false, false, false, false, false],
      componentList: []
    };
  },

  computed:{
      fileUploadUrl(){
          return Config.g_upload_url
      }

  },
  methods: {

     

    doSelectItem(){

        if(this.dialogModel.actionType=='ACTION_TYPE_GOODSID'){

            this.goodsListDialogModel.show=true;


            return;


        }

        if(this.dialogModel.actionType=='ACTION_TYPE_TAGID'){
            this.categoryModel.show=true;

            return;

            
        }



        



    },  

    doUpdateModel(){

        portalApi.updateComponent(this.componentModel).then(res=>{

            if(res.retCode){

                this.$message("更新成功!");

                this.loadData();


            }else{

                    this.$alert("更新商品组件参数失败")

            }



        })



    },  

    formatComponentType(comType){
        if(comType=='COMPONENT_TYPE_SCROLL_HEADER'){

            return "滚动广告栏";

        }

        if(comType=='COMPONENT_TYPE_QUICK_BAR'){

            return "工具栏";

        }

        if(comType=='COMPONENT_TYPE_GOODS_TAG'){

            return "商品列表设置";

        }



    },


    queryItems(){

            catApi.queryComponentItem(this.componentId).then(res=>{

                this.items = res.data;
            })

    },

    formatActionType(actionType) {
      if (actionType == "ACTION_TYPE_GOODSID") {
        return "跳转商品详情";
      }
      return "其他";
    },

    doConfig(com) {
    
      this.componentType = com.componentType;
      this.items = com.items;

      this.componentId = com.id
      this.componentName = com.componentName

        Object.assign(this.componentModel,com)

        console.log(this.componentModel)
 
  
    },

    overShow(type, index) {
      this.showStatus[index] = true;

      this.$set(this.showStatus, index, true);
    },

    outHide(type, index) {
      this.showStatus[index] = false;

      this.$set(this.showStatus, index, false);
    },

    loadData() {


     let appId = sessionStorage.getItem("appId");

     console.log(appId)
        
      portalApi.queryMainPortal(appId).then(res => {
        console.log(res);

        if (res.retCode == true) {
          this.componentList = res.data.component;
        }
      });
    }
  },

  components:{
      AnalogMobile:AnalogMobile,
      categoryCom,goodsListCom

  },
  mounted() {
    console.log("load page");
    this.loadData();
  }
};
</script>

<style lang="scss" scoped>
.moniqi {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.header-scroll {
  display: flex;
  flex-direction: row;
}

.quick-bar {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  height: 100px;
  align-items: center;
}

.goods-list {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>