<template>
  <div class="common-layer">
    <div class="common-pop"></div>
    <div class="common-middle">
      <slot></slot>
    </div>
  </div>
</template>


<style lang="less">
.common-layer {
  position: fixed;
  top:0;
  left:0;
  width:100%;
  height:100%;
  z-index:20;
  .common-pop {
    position: absolute;
    top:0;
    left:0;
    width:100%;
    height:100%;
    background-color: #000;
    opacity: 0.5;
    z-index:13;
  }
  .common-middle {
    position: absolute;
    top:50%;
    left:50%;
    transform: translate(-50%,-50%);
    width:auto;
    height:auto;
    z-index:15;
    .subtitle {
      background-color: #084868;
      line-height: 35px;
      text-align: center;
      color: #fff;
      font-size: 16px;
      margin-bottom: 20px;
    }
  }
}

</style>
