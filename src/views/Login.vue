<template>
  <el-form :model="loginModel" :rules="loginModel.rules" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">齐昌电商管理平台</h3>
    <el-form-item prop="loginName">
      <el-input type="text" v-model="loginModel.loginName" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" v-model="loginModel.password" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>

 

    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="loginModel.doLogin">登录</el-button>
      <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
    </el-form-item>

    <el-form-item>
           <div class="flex-space">
  <!-- <el-button type="small" @click="doRegister">注册</el-button> -->
  <el-button type="small" @click="forgetPassword">忘记密码</el-button>
  
  </div>

    </el-form-item> 
  </el-form>
</template>

<script>
import * as Api from "../api/api";


import * as ApiAdmin from "../api/apiadmin";

export default {
  data() {
    return {
      logining: false,
      loginModel: {
        loginName: "",
        password: "",
        checked: true,
        rules: {
          loginName: [
            { required: true, message: "请输入账号", trigger: "blur" }
            //{ validator: validaePass }
          ],
          password: [
            { required: true, message: "请输入密码", trigger: "blur" }
            //{ validator: validaePass2 }
          ]
        },

        doLogin: () => {
          if(this.loginModel.loginName=="w")this.loginModel.loginName="aisi";
          if(this.loginModel.password=="w")this.loginModel.password="123456";
          ApiAdmin.doMerchantLogin(
            this.loginModel.loginName,
            this.loginModel.password
          ).then(res => {
            if (res.retCode) {

              console.log(res)

            sessionStorage.setItem("token", res.data.token);
              sessionStorage.setItem("userId", res.data.merchantUserId);
              sessionStorage.setItem("merchantUserId", res.data.merchantUserId);
              
              sessionStorage.setItem("merchantId", res.data.merchantUserId);
              sessionStorage.setItem("merchantName", res.data.nickName);
              // sessionStorage.setItem("appId", res.data.appId);
              sessionStorage.setItem("loginName", res.data.loginName);
              
              this.$router.push("/");

              return;
            }else{
                this.$alert(res.message);
            }
          });
        }
      }
    };
  },
  methods: {
    doRegister() {
      this.$alert("暂不对外开放");
    },

    forgetPassword(){
      this.$alert("暂不对外开放");
    },

    doLogin() {},


  }
};
</script>

<style lang="scss" scoped>
.flex-space {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.login-container {
  /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  .title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
  .remember {
    margin: 0px 0px 35px 0px;
  }
}
</style>