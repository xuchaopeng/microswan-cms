<template>
  <div class="hitdetails" v-show="viewHitDetails">
    <div class="pop"></div>
    <div class="con">
      <Icon
        class="close"
        custom="icon iconfont icon-close"
        size="24"
        @click="closePopup"
      ></Icon>
      <div class="facepic fl">
        <div class="pic">
          <span class="cirs" @click="viewTrack">
            <Icon class="iconfont icon-icon_huabanfuben"></Icon>
          </span>
          <img :src="item.facePicPath" alt="" />
        </div>
        <div class="dis">
          <p class="seeTrack" @click="seeTrack">
            <Icon class="iconfont icon-ai14"></Icon>查看人像轨迹 >
          </p>
        </div>
      </div>
      <div class="passpic fl">
        <div class="pic">
          <img :src="item.facePicPath" alt="" />
        </div>
        <div class="dis">
          <p>姓名：{{ item.name }}</p>
          <p>别名： {{ item.alias }}</p>
          <p>身份证：{{ item.ethnic }}</p>
          <p>库名：{{ item.name }}</p>
          <p>录入时间：2020/03/22 12:30:00</p>
        </div>
      </div>
      <div class="backpic fl">
        <div class="pic">
          <img :src="item.backPicPath" alt="" />
        </div>
        <div class="dis">
          <p class="score">
            <Icon class="iconfont icon-renxiangcaiji"></Icon>
            98.91%
            <!-- {{ item.score }} -->
          </p>
          <p class="needsure">
            <span class="btns" @click="infoAck(1)">
              <Icon class="iconfont icon-butongyi"></Icon>
              不同
            </span>
            <span class="btns" @click="infoAck(2)">
              <Icon class="iconfont icon-dui"></Icon>
              相同
            </span>
            <span class="btns">
              <Icon class="iconfont icon-yiwen"></Icon>
              待确认
            </span>
          </p>
        </div>
      </div>
    </div>
    <FaceTracks
      :itemData="currentFace"
      :viewTrack="viewFaceTrack"
      @closeTrack="closeTrack"
    ></FaceTracks>
  </div>
</template>

<script>
import "./index.less";
import FaceTracks from "_c/face-tracks";
import { hitInfoAck } from "@/api/hitinfo";
export default {
  name: "HitDetails",
  props: {
    item: {
      type: Object,
      default: () => ({})
    },
    viewHitDetails: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      viewFaceTrack: false,
      closeHit: true,
      currentFace: {}
    };
  },
  mounted() {},
  methods: {
    //查看人像轨迹
    viewTrack() {},
    //关闭人像详情
    closePopup() {
      this.$emit("closeFace");
    },
    //人像比对确认
    infoAck(num) {
      if (typeof this.item.id == "undefined") return;
      let param = {
        id: this.item.id
      };
      param.isSame = num == 1 ? true : false;
      hitInfoAck(param).then(res => {
        const r = res.data;
        if (r.code == 200) {
        }
      });
    },
    //关闭人像轨迹页
    closeTrack() {
      this.viewFaceTrack = false;
    },
    //查看人像轨迹
    seeTrack() {
      this.viewFaceTrack = true;
      this.currentFace = {
        ...this.item
      };
    }
  },
  watch: {
    viewHitDetails(a) {
      console.log(a, "监听组件的变话");
    }
  },
  components: {
    FaceTracks
  }
};
</script>
