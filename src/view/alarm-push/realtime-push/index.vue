<template>
  <div class="realtime">
    <div class="container">
      <Loading v-if="!dataList.length"></Loading>
      <div class="hitBackPic" v-if="dataList.length">
        <Carousel v-model="value" :autoplay="setting.autoplay" :dots="setting.dots" :height="setting.height">
          <CarouselItem v-for="item in dataList">
            <div style="width:678px;height:507px;">
              <p class="sub">
                <span class="ms" @click="renderDetails(item)">
                  <Icon class="iconfont icon-ai14"></Icon> 查看详情
                </span>
                <span class="pos">定位：{{ item.address }}</span>
              </p>
              <div class="demo-carousel">
                <p class="pic">
                  <img :src="item.backPicPath" width="678" height="507" />
                </p>
              </div>
            </div>
          </CarouselItem>
        </Carousel>
      </div>
      <div class="hitFacePic" v-show="dataList.length">
        <p class="sub">
          <span>抓拍模式</span>
          <span class="seeAll" @click="seeAll">
            查看全部
            <Icon custom="icon iconfont icon-youce" size="16" />
          </span>
        </p>
        <div class="listContainer">
          <span class="lfBtn comBtn" @click="clickButton(1)">
            <Icon custom="icon iconfont icon-zuoce" size="30" />
          </span>
          <span class="rgBtn comBtn" @click="clickButton(-1)">
            <Icon custom="icon iconfont icon-youce" size="30" />
          </span>
          <ul class="faceListPic">
            <li v-for="(item, i) in dataList" :class="value == i ? 'cur' : ''" @click="renderDetails(item)">
              <div class="pic">
                <img :src="item.facePicPath" alt="" />
              </div>
              <p class="dis">{{ item.reportTime }}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <HitDetails :item="currentFace" :viewHitDetails="viewHitDetails" @closeFace="closeFaceDetails"></HitDetails>
  </div>
</template>

<script>
import "./realtime.less";
import HitDetails from "_c/hit-details";
import Loading from "_c/loading";
import SockJs from "sockjs-client";
import Stomp from "stompjs";
import { creatScore, getAddress } from "@/libs/util";
import { getNewestHitInfo, getListHitInfo } from "@/api/hitinfo";
const Imgbase = "https://118.24.53.165/";
export default {
  data() {
    return {
      value: 0,
      setting: {
        autoplay: false,
        autoplaySpeed: 5000,
        dots: "none",
        radiusDot: false,
        trigger: "hover",
        arrow: "hover",
        height: 537
      },
      xcp: [{ a: 1 }, { b: 2 }],
      viewHitDetails: false,
      currentFace: {},
      dataList: []
    };
  },
  mounted() {
    this.initwebsocket();
  },
  beforeDestroy() {
    this.disconnect();
  },
  methods: {
    //开启长链
    initwebsocket() {
      this.connection();
    },
    //连接长链
    connection() {
      var scope = this;
      this.socket = new SockJs("http://118.24.53.165:8080/ws");
      this.stompclient = Stomp.over(this.socket);
      this.stompclient.connect(
        {},
        frame => {
          this.stompclient.subscribe("/user/queue/hitInfo", msg => {
            let data = JSON.parse(msg.body);
            this.resetData(data);
          });
        },
        err => {
          console.log(err, "连接失败");
        }
      );
    },
    //自动断开长链
    disconnect() {
      if (this.stompclient) {
        console.log("断开了");
        this.stompclient.disconnect();
      }
    },
    //重新序列话数据
    filterData(data) {
      data.forEach(em => {
        em.backPicPath = Imgbase + em.hitBackgroundPicturePath;
        em.facePicPath = Imgbase + em.hitFacePicturePath;
        em.passerBackPicPath = Imgbase + em.passerbyBackgroundPicturePath;
        em.passerFacePicPath = Imgbase + em.passerbyFacePicturePath;
        em.reportTime = em.reportTime.replace(/-/g, "/");
        em.score = creatScore(em.score);
        getAddress(em);
      });
    },
    //重新处理长链数据
    resetData(data) {
      if (!data || !data.length) return;
      const len = this.dataList.length;
      const n = data.length;
      this.filterData(data); //序列化data
      if (!len) {
        data.forEach(em => {
          this.dataList.push(em);
        });
      } else {
        if (len >= 5) {
          //直接替换旧的数据
          this.dataList.splice(0, n);
          data.forEach(em => {
            this.dataList.unshift(em);
          });
        } else {
          //先替补满足5条，在替换旧的数据
          for (var i = 0; i < 5 - len; i++) {
            this.dataList.push(data.shift());
          }
          const n2 = data.length;
          this.dataList.splice(0, n2);
          data.forEach(em => {
            this.dataList.unshift(em);
          });
        }
      }
    },
    //查看全部推送消息
    seeAll() {
      this.$router.push({
        name: "infopush"
      });
    },
    //刷新实时人像列表
    renderList() { },
    //展示人像详情页
    renderDetails(em) {
      this.currentFace = {
        ...em
      };
      this.viewHitDetails = true;
    },
    //关闭人像详情
    closeFaceDetails(needUpdateList) {
      this.currentFace = {};
      this.viewHitDetails = false;
      if (needUpdateList) this.renderList();
    },
    //轮播点击切换
    clickButton(action) {
      if (action == 1) {
        if (this.value >= 1) this.value -= 1;
        else this.value = 0;
      } else {
        if (this.value >= 4) this.value = 4;
        else this.value += 1;
      }
    }
  },
  components: {
    HitDetails,
    Loading
  }
};
</script>
