<template>
<el-container>
    <el-aside width="200px">
        <el-menu  ref="menuExpand" :default-active="$route.path" unique-opened router>
            <div class="menu-header">
                <span>中宜电商</span>
            </div>

            <el-menu-item index="/">
                <template slot="title"><i class="fa fa-home fa-fw" aria-hidden="true"></i>首页</template>
            </el-menu-item>
            <template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
                <el-submenu :index="index+''" v-if="!item.leaf" :key="item.name">
                    <template slot="title"><i :class="item.iconCls" aria-hidden="true"></i>{{item.name}}</template>
                    <el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-if="!child.hidden">{{child.name}}</el-menu-item>
                </el-submenu>
                <el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path" :key="item.name">
                    <i :class="item.iconCls"></i>
                    {{item.children[0].name}}
                </el-menu-item>
            </template>
        </el-menu>
        <!--导航菜单-折叠后-->
        <!-- <ul class="el-menu  collapsed" v-if="collapsed" ref="menuCollapsed">
            <li>
                <div class="el-submenu__title" style="padding-left: 20px;" @click="$router.push('/')"><i class="fa fa-home fa-fw" aria-hidden="true"></i></div>
            </li>
            <li v-for="(item,index) in $router.options.routes" v-if="!item.hidden" class="el-submenu item" :key="item.name">
                <template v-if="!item.leaf">
                    <div class="el-submenu__title" style="padding-left: 20px;" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)"><i :class="item.iconCls" aria-hidden="true"></i></div>
                    <ul class="el-menu submenu" :class="'submenu-hook-'+index" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)"> 
                        <li v-for="child in item.children" v-if="!child.hidden" :key="child.path" class="el-menu-item" style="padding-left: 40px;" :class="$route.path==child.path?'is-active':''" @click="$router.push(child.path)">{{child.name}}</li>
                    </ul>
                </template>
                <template v-else>
                    <li class="el-submenu">
                        <div class="el-submenu__title el-menu-item" style="padding-left: 20px;height: 56px;line-height: 56px;padding: 0 20px;" :class="$route.path==item.children[0].path?'is-active':''" @click="$router.push(item.children[0].path)"><i :class="item.iconCls" aria-hidden="true"></i></div>
                    </li>
                </template>
            </li>
        </ul> -->
    </el-aside>
    <el-main>
        <el-row :span="24" class="navbar">
            
            <el-col :span="14">
                {{currentMenu}}
            </el-col>
            
            <el-col :span="10" style="text-align:right;padding-right:20px">
                <el-dropdown trigger="hover">
                    <el-button type="text" style="font-size:16px"><i class="fa fa-user-circle" style="margin-right:10px"></i>{{sysUserName}}</el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>修改密码</el-dropdown-item>
                        <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-col>

        </el-row>

        <div style="padding:20px">
            <transition name="fade" mode="out-in">
                <router-view></router-view>
            </transition>
        </div>
        
    </el-main>
</el-container>
</template>

<script>
export default {
	data() {
		return {
            currentMenu:'',
            user:null
		}
	},
	computed:{
		sysUserName(){
            let merchantName = sessionStorage.getItem("merchantName");
            //let loginName = sessionStorage.getItem("loginName");
            return merchantName;
		}
	},
	methods: {
		//退出登录
		logout: function () {
			var _this = this;
			this.$confirm('确认退出吗?', '提示', {
				//type: 'warning'
			}).then(() => {
				sessionStorage.removeItem('user');
				_this.$router.push('/login');
			});
        },
        handleselect(val){
            let menu=this.$router.options.routes
            for(let i in menu){
                let children=menu[i].children;
                if(children==null)continue;
                for(let j in children){
                    if(children[j].path==val){
                        this.currentMenu=menu[i].name?menu[i].name+" / "+children[j].name:children[j].name;
                        return;
                    }
                }
            }
        },
    },
    watch:{
        $route() {
            let url=this.$route.path;
            this.handleselect(url);
        }
    },
	mounted() {
        this.user= sessionStorage.getItem('merchantName');
        let url=this.$route.path;
        this.handleselect(url);
        //this.$notify({message:"欢迎使用爱斯电商平台"});
	}
}
</script>

<style scoped lang="scss">
@import '~scss_vars';
.el-container{
    width:100%;
    height:100%;
}
.el-aside,.el-main,.el-menu{
    height:100%
}
.el-aside{
    overflow:hidden
}
.el-menu{
    background:rgb(245, 245, 245)
}
.el-submenu .el-menu-item{
    background:rgb(252, 252, 252)
}
.el-submenu .el-menu-item:hover{
    background:#E6F2F2
}


.menu-header{
    height:50px;
    background:$color-primary;
    color:#fff;
    padding-left:20px
}
.menu-header span{
    line-height:50px;
    font-size:22px;

}
.el-main{
    padding:0px
}
.navbar{
    height:50px;
    border-bottom: 1px solid rgb(233, 233, 233)
}
.navbar .el-col{
    font-size:16px;
    line-height:50px;
    padding-left:20px;
}
</style>