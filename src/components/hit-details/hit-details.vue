<template>
  <div class="hitdetails" v-show="viewHitDetails">
    <div class="pop"></div>
    <div class="con">
      <Icon
        class="close"
        custom="icon iconfont icon-close"
        size="24"
        @click="closePopup(false)"
      ></Icon>
      <div class="hitfacepic fl">
        <p class="title">推送人像图</p>
        <div class="pic">
          <img :src="item.facePicPath" alt />
        </div>
        <div class="dis"></div>
      </div>
      <div class="hitbackpic fl">
        <p class="title">推送人像背景图</p>
        <div class="pic">
          <img :src="item.backPicPath" alt />
        </div>
        <div class="dis">
          <p class="seeTrack" @click="seeTrack">
            查看人像轨迹
            <Icon class="iconfont icon-youce"></Icon>
          </p>
          <p>
            <Icon class="iconfont icon-ai14"></Icon>
            {{ item.address }}
          </p>
        </div>
      </div>
      <div class="passfacepic fl">
        <p class="title">路人人像图</p>
        <div class="pic">
          <img :src="item.passerFacePicPath" alt />
        </div>
        <div class="dis">
          <p>姓名：{{ item.name }}</p>
          <p>别名： {{ item.alias }}</p>
          <p>身份证：{{ item.idcard }}</p>
          <p>库名：{{ item.libName }}</p>
          <p>录入时间：{{ item.reportTime }}</p>
        </div>
      </div>
      <div class="passbackpic fl">
        <p class="title">路人人像背景图</p>
        <div class="pic">
          <img :src="item.passerBackPicPath" alt />
        </div>
        <div class="dis">
          <p class="score">
            <Icon class="iconfont icon-renxiangcaiji"></Icon>
            {{ item.score }}
          </p>
          <p class="needsure" v-if="item.status == 0">
            <span class="btns" @click="infoAck(2)">
              <Icon class="iconfont icon-butongyi"></Icon>不同
            </span>
            <span class="btns" @click="infoAck(1)">
              <Icon class="iconfont icon-dui"></Icon>相同
            </span>
            <span class="btns">
              <Icon class="iconfont icon-yiwen"></Icon>待确认
            </span>
          </p>
          <p class="needsure" v-if="item.status !== 0">
            <span class="hassure">
              {{ item.status == 1 ? "已确认：同一人" : "已确认：非同一人" }}
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
import config from "@/config/index.js";
const Imgbase = config.resourceBaseUrl;
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
    closePopup(needUpdateList, status) {
      if (!status) this.$emit("closeFace", needUpdateList, this.item.id);
      else this.$emit("closeFace", needUpdateList, status);
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
          this.item.status = num;
          this.closePopup(true, { status: this.item.status, id: this.item.id });
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
      if (view) {
        // console.log(JSON.parse(JSON.stringify(this.item)), "XCPpp");
        //基本废弃，暂时保留，接口变化，也许可用
        if (!this.item.name) {
          getFaceDetails(this.item.faceId).then(res => {
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
        }
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
