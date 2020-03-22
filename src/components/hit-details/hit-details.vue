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
          <!-- <span class="cirs" @click="viewTrack">
            <Icon class="iconfont icon-icon_huabanfuben"></Icon>
          </span> -->
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
          <img :src="currentFace.facePicPath" alt="" />
        </div>
        <div class="dis">
          <p>姓名：{{ currentFace.name }}</p>
          <p>别名： {{ currentFace.alias }}</p>
          <p>身份证：{{ currentFace.IDCard }}</p>
          <p>库名：{{ currentFace.libId }}</p>
          <p>录入时间：{{ item.reportTime }}</p>
        </div>
      </div>
      <div class="backpic fl">
        <div class="pic">
          <img :src="item.backPicPath" alt="" />
        </div>
        <div class="dis">
          <p class="score">
            <Icon class="iconfont icon-renxiangcaiji"></Icon>
            {{ item.score }}
          </p>
          <p class="needsure" v-if="item.status == 0">
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
import { hitInfoAck, getFaceDetails } from "@/api/hitinfo";
const Imgbase = "https://118.24.53.165/";
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
      currentFace: {
        name: "",
        alias: "",
        ethnic: "",
        IDCard: "",
        libId: "",
        facePicPath: ""
      }
    };
  },
  mounted() {},
  methods: {
    //查看人像轨迹
    viewTrack() {},
    //关闭人像详情
    closePopup(needUpdateList) {
      this.$emit("closeFace", needUpdateList);
    },
    //人像比对确认
    infoAck(num) {
      if (typeof this.item.id == "undefined") return;
      let param = {
        id: this.item.id,
        status: num
      };
      hitInfoAck(param).then(res => {
        const r = res.data;
        if (r.code == 200) {
          this.closePopup(true);
          this.$Message.success({
            content: "人像库推送消息确认成功",
            duration: 1.5,
            closable: true
          });
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
    viewHitDetails(view) {
      console.log("SFFSFSFSFSFFSFSF", this.item);
      if (view) {
        getFaceDetails(this.item.id).then(res => {
          let r = res.data ? res.data : {};
          if (r.code == 200 && r.data) {
            this.currentFace.name = r.data.name;
            this.currentFace.alias = r.data.alias;
            this.currentFace.ethnic = r.data.ethnic;
            this.currentFace.IDCard = r.data.IDCard;
            this.currentFace.libId = r.data.libId;
            this.currentFace.facePicPath = Imgbase + r.data.facePicPath;
          }
        });
      } else {
        for (var k in this.currentFace) {
          this.currentFace[k] = "";
        }
      }
    }
  },
  components: {
    FaceTracks
  }
};
</script>
