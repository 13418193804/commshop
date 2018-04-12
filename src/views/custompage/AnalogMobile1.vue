<template>
<div class="device-ios">
    <div class="device-inner"></div>
</div>
</template>

<script>
export default {
  data() {
    return {
      
    };
  },
  methods: {
   

  }
};
</script>

<style scoped>
.device-ios {

  width: 320px;

  height: 548px;

  background: #111;

  border-radius: 55px;

  box-shadow: 0px 0px 0px 2px #aaa;

  padding: 105px 20px;

  position: relative;

  margin-right: 80px;

}

.device-ios:before {

  content: '';

  width: 60px;

  height: 10px;

  border-radius: 10px;

  position: absolute;

  left: 50%;

  margin-left: -30px;

  background: #333;

  top: 50px;

}

.device-ios:after {

  content: '';

  position: absolute;

  width: 60px;

  height: 60px;

  left: 50%;

  margin-left: -30px;

  bottom: 20px;

  border-radius: 100%;

  box-sizing: border-box;

  border: 5px solid #333;

}

.device-inner {

  background-color: #FFF;

  height: 100%;

}
</style>