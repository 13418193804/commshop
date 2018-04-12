<template>
<div class="device-android">
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
.device-android {

  width: 360px;

  height: 640px;

  position: relative;

  background: #111;

  padding: 60px 20px;

  box-shadow: 0px 0px 0px 2px #aaa;

  border-radius: 20px;

}

.device-android:before {

  content: '';

  width: 14px;

  height: 14px;

  border-radius: 50%;

  position: absolute;

  left: 50%;

  margin-left: -7px;

  background: #666;

  top: 25px;

}

.device-android:after {

  content: '';

  width: 8px;

  height: 8px;

  border-radius: 50%;

  position: absolute;

  left: 50px;

  background: #444;

  top: 30px;

}

.device-inner {

  background-color: #FFF;

  height: 100%;

}
</style>