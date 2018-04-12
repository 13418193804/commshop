<template>
<div class="iphone">  
    <div class="iphone-top">  
        <span class="camera"></span>  
        <span class="sensor"></span>  
        <span class="speaker"></span>  
    </div>  
    <div class="top-bar"></div>  
    <div class="iphone-screen">
        <div style="width:100%;height:24px;text-align:left;line-height:24px;font-weight:600">
            <span style="margin-left:10px">●●●●○</span>
            <span style="margin-left:5px">AIShop</span>
            <span style="margin-left:5px">✈</span>
            <span style="margin-left:25px">16:26</span>
            <span style="float:right;margin-right:6px">
                <img style="width:30px;height:24px;" src="static/battery.png" />
            </span>
            <span style="float:right;margin-right:5px">55%</span>
        </div>
        <div style="width:100%;height:38px;line-height:38px;font-weight:600">
            <span style="margin-left:20px;font-size:17px">首页</span>
        </div>

        <div style="width:100%;height:560px;">
            <MobileScreen :componentList='componentList'></MobileScreen>
        </div>
        <div style="width:100%;height:51px;border-top:1px solid #d9dbdc">
            <div style="width:25%;float:left;margin-top:4px">
                <img style="width:26px;height:26px;" src="static/home.png" /><br>
                <span style="font-size:10px;color:red">首页</span>
            </div>
            <div style="width:25%;float:left;margin-top:4px">
                <img style="width:26px;height:26px;" src="static/cate.png" /><br>
                <span style="font-size:10px;color:gray">分类</span>
            </div>
            <div style="width:25%;float:left;margin-top:4px">
                <img style="width:26px;height:26px;" src="static/cart.png" /><br>
                <span style="font-size:10px;color:gray">购物车</span>
            </div>
            <div style="width:25%;float:left;margin-top:4px">
                <img style="width:26px;height:26px;" src="static/my.png" /><br>
                <span style="font-size:10px;color:gray">我的</span>
            </div>
            
            <!-- <img style="width:30px;" src="/static/分类.png" />
            <img style="width:30px;" src="/static/购物车.png" />
            <img style="width:30px;" src="/static/我的2.png" /> -->
        </div>
    </div>  
    <div class="buttons">  
        <span class="on-off"></span>  
        <span class="sleep"></span>  
        <span class="up"></span>  
        <span class="down"></span>  
    </div>  
    <div class="bottom-bar"></div>  
    <div class="iphone-bottom">  
        <span></span>  
    </div>  
</div> 
</template>

<script>
import MobileScreen from "../custompage/MobileScreen1.vue"

export default {
  data() {
    return {
      
    };
  },
  methods: {
   

  },
  components:{MobileScreen},
  props:['componentList']
};
</script>

<style lang="scss" scoped>
*,*:after,*:before{
  box-sizing: border-box;
}

.iphone {  
    box-shadow: inset 0 0 3px 0 rgba(0, 0, 0, 0.2), 0 0 0 1px #999, 0 0 10px 0px rgba(0, 0, 0, 0.7);  
    border: 5px solid #d9dbdc;  
    background: #f8f8f8;  
    padding: 15px;  
    border-radius: 50px;  
    height: 877px;  
    width: 423px;  
    position: relative;  
    -webkit-transform: scale(1);  
    transform: scale(1);  
}  
.iphone-top {  
    padding: 5px 110px 40px;  
    position: relative;  
}  
.iphone-top .speaker {  
    display: block;  
    width: 70px;  
    height: 6px;  
    margin: 0 auto;  
    border-radius: 6px;  
    background: #292728;  
}  
.iphone-top .camera {  
    display: block;  
    margin: 0 auto;  
    height: 10px;  
    width: 10px;  
    border-radius: 50%;  
    margin-bottom: 13px;  
    background: #333;  
}  
.iphone-top .sensor {  
    display: block;  
    width: 15px;  
    height: 15px;  
    float: left;  
    background: #333;  
    margin-top: -5px;  
    border-radius: 50%;  
}  
.iphone .top-bar, .iphone .bottom-bar {  
    display: block;  
    width: 423px;  
    height: 15px;  
    border-left: 5px solid #BBB;  
    border-right: 5px solid #BBB;  
    position: absolute;  
    left: -5px;  
}  
.iphone .top-bar {  
    top: 65px;  
}  
.iphone .bottom-bar {  
    bottom: 65px;  
}  
.iphone-screen {  
    background: #eee;  
    border: 1px solid #fff;  
    height: 677px;  
    width: 375px;  
    margin: 0 auto;  
    border: 2px solid rgba(0, 0, 0, 0.9);  
    border-radius: 3px;  
    overflow: hidden;
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
}  
.iphone-screen img {  
    width: 100%;  
}  
.iphone .buttons .on-off, .iphone .buttons .up, .iphone .buttons .down, .iphone .buttons .sleep {  
    display: block;  
    background: #CCC;  
    position: absolute;  
    border-radius: 2px 0px 0px 2px;  
}  
.iphone .buttons .on-off {  
    height: 40px;  
    width: 3px;  
    top: 100px;  
    left: -8px;  
}  
.iphone .buttons .up, .iphone .buttons .down, .iphone .buttons .sleep {  
    height: 60px;  
    width: 5px;  
    left: -10px;  
}  
.iphone .buttons .up {  
    top: 170px;  
}  
.iphone .buttons .down {  
    top: 250px;  
}  
.iphone .buttons .sleep {  
    left: auto;  
    right: -10px;  
    top: 170px;  
    border-radius: 0px 2px 2px 0px;  
}  
.iphone-bottom {  
    padding: 10px 0 0;  
}  
.iphone-bottom span {  
    display: block;  
    margin: 0 auto;  
    width: 68px;  
    height: 68px;  
    background: #ccc;  
    border-radius: 50%;  
    background: -webkit-linear-gradient(315deg, #303233 0%, #b5b7b9 50%, #f0f2f2 69%, #303233 100%);  
    background: linear-gradient(135deg, #303233 0%, #b5b7b9 50%, #f0f2f2 69%, #303233 100%);  
    position: relative;  
}  
.iphone-bottom span:after {  
    content: "";  
    display: block;  
    width: 60px;  
    height: 60px;  
    background: #fff;  
    border-radius: 50%;  
    position: absolute;  
    left: 4px;  
    top: 4px;  
}  
</style>