<template>
  <div class="demo-spin-col">
    <Spin fix>
      <Icon
        type="ios-loading"
        :size="size"
        class="demo-spin-icon-load"
        :style="{ color: color }"
      ></Icon>
      <div class="demo-spin-icon-text" :style="{ color: color }">加载中...</div>
    </Spin>
  </div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: "#2d8cf0"
    },
    size: {
      type: Number,
      default: 40
    }
  },
  data() {
    return {
      spinShow: true
    };
  }
};
</script>

<style>
.demo-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.demo-spin-col {
  height: 100px;
  position: absolute;
  width: 100%;
}
.demo-spin-icon-text {
  line-height: 60px;
}
.ivu-spin-fix {
  background-color: transparent;
}
</style>
