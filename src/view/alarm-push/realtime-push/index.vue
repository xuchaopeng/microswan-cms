<template>
  <div class="realtime">
    <div class="container">
      <div class="hitBackPic">
        <p class="sub">抓拍模式</p>
        <p class="pic">
          <img
            src="https://118.24.53.165/facelib/hit/origin/background/8b/8bcbd163-56bd-4f54-977e-a5a0b54e0b3a.jpg"
            alt=""
          />
        </p>
      </div>
      <div class="hitFacePic">
        <p class="sub">
          <span>抓拍模式</span>
          <span class="seeAll" @click="seeAll">
            查看全部<Icon custom="icon iconfont icon-youce" size="16" />
          </span>
        </p>
        <div class="listContainer">
          <span class="lfBtn comBtn">
            <Icon custom="icon iconfont icon-zuoce" size="30" />
          </span>
          <span class="rgBtn comBtn">
            <Icon custom="icon iconfont icon-youce" size="30" />
          </span>
          <ul class="faceListPic">
            <li>
              <div class="pic">
                <img
                  src="https://118.24.53.165/facelib/hit/origin/face/58/5808b819-e3b9-4bc1-81af-0f63ce540cc7.jpg"
                  alt=""
                />
              </div>
              <p class="dis">12/12 12:12:00</p>
            </li>
            <li>
              <div class="pic">
                <img
                  src="https://118.24.53.165/facelib/hit/origin/face/58/5808b819-e3b9-4bc1-81af-0f63ce540cc7.jpg"
                  alt=""
                />
              </div>
              <p class="dis">12/12 12:12:00</p>
            </li>
            <li>
              <div class="pic">
                <img
                  src="https://118.24.53.165/facelib/hit/origin/face/58/5808b819-e3b9-4bc1-81af-0f63ce540cc7.jpg"
                  alt=""
                />
              </div>
              <p class="dis">12/12 12:12:00</p>
            </li>
            <li>
              <div class="pic">
                <img
                  src="https://118.24.53.165/facelib/hit/origin/face/58/5808b819-e3b9-4bc1-81af-0f63ce540cc7.jpg"
                  alt=""
                />
              </div>
              <p class="dis">12/12 12:12:00</p>
            </li>
            <li>
              <div class="pic">
                <img
                  src="https://118.24.53.165/facelib/hit/origin/face/58/5808b819-e3b9-4bc1-81af-0f63ce540cc7.jpg"
                  alt=""
                />
              </div>
              <p class="dis">12/12 12:12:00</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "./realtime.less";
import SockJs from "sockjs-client";
import Stomp from "stompjs";
import { getNewestHitInfo, getListHitInfo } from "@/api/hitinfo";
export default {
  data() {
    return {
      dataList: []
    };
  },
  mounted() {
    getListHitInfo({ departmentId: 1 })
      .then(res => {
        console.log(res, "getListHitInfo");
      })
      .catch(err => {
        console.log(err);
      });
  },
  beforeDestroy() {},
  methods: {
    initwebsocket() {
      this.connection();
    },
    connection() {
      var scope = this;
      this.socket = new SockJs("http://118.24.53.165:8080/ws");
      this.stompclient = Stomp.over(this.socket);
      this.stompclient.connect(
        {
          "Content-Type": "text/plain"
        },
        frame => {
          console.log("connect" + frame, "HAHAHA");
          this.stompclient.subscribe("/user/queue/hitInfo", msg => {
            console.log(msg, "连接成功");
          });
        },
        err => {
          console.log(err, "连接失败");
        }
      );
    },
    disconnect() {
      if (this.stompclient) {
        this.stompclient.disconnect();
      }
    },
    seeAll() {
      this.$router.push({
        name: "infopush"
      });
    }
  }
};
</script>
