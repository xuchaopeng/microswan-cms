<template>
  <div class="facetracks" v-show="viewTrack">
    <div class="popTrack"></div>
    <div class="conTrack">
      <Icon class="closeTrack" custom="icon iconfont icon-close" size="24" @click="closePopup"></Icon>
      <p class="nav">
        共{{ totalCount }}条结果，当前显示1至{{
          totalCount < 8 ? totalCount : 8
        }}条结果<span>轨迹</span>
      </p>
      <div class="list">
        <ul class="trackList">
          <li class="item" v-for="em in dataList" :key="em.id">
            <div class="img">
              <img :src="em.facePicPath" alt="/" />
            </div>
            <div class="dis">
              <p class="score">
                <Icon class="iconfont icon-renxiangcaiji"></Icon>{{ em.score.replace("%", "") }}
              </p>
              <p class="time">
                <Icon class="iconfont icon-shijian"></Icon>
                {{ em.reportTime }}
              </p>
              <p class="address">
                <Icon class="iconfont icon-ai14"></Icon>
                {{ em.address }}H
              </p>
            </div>
          </li>
        </ul>
        <div class="trackPage" v-if="totalCount > 6">
          <Page :total="totalCount" :page-size="8" show-elevator show-total @on-change="changePage" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "./index.less";
import { creatScore, getAddress } from "@/libs/util";
import { getFaceTrack } from "@/api/hitinfo";
import config from "@/config/index.js";
const Imgbase = config.imageBaseUrl;
export default {
  props: {
    itemData: {
      type: Object,
      default: () => ({})
    },
    viewTrack: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      totalCount: 1,
      pageNo: 1,
      dataList: []
    };
  },
  methods: {
    //关闭人像轨迹
    closePopup() {
      this.$emit("closeTrack");
    },
    //数据字段序列化
    filterData(em) {
      let nem = {
        departmentId: em.departmentId,
        backPicPath: Imgbase + em.hitBackgroundPicturePath,
        facePicPath: Imgbase + em.hitFacePicturePath,
        id: em.id,
        lat: em.lat,
        libId: em.libId,
        lng: em.lng,
        passerBackPicPath: Imgbase + em.passerbyBackgroundPicturePath,
        passerFacePicPath: Imgbase + em.passerbyFacePicturePath,
        policeNum: em.policeNum,
        reportTime: em.reportTime.replace(/-/g, "/"),
        score: creatScore(em.score),
        status: em.status
      };
      return nem;
    },
    //展示人像轨迹列表
    renderList() {
      let param = {
        faceId: this.itemData.faceId,
        pageNo: this.pageNo,
        pageSize: 8
      };
      getFaceTrack(param).then(res => {
        let r = res.data ? res.data : {};
        if (r.code == 200 && r.data) {
          const page = r.data.pageContent;
          const len = this.dataList.length;
          if (page) {
            this.dataList.splice(0, len);
            page.forEach(em => {
              this.dataList.push(this.filterData(em));
            });
            //重新处理地理位置
            let idx = 0;
            this.dataList.forEach(item => {
              if (!item.address) {
                getAddress(item, () => {
                  ++idx;
                  if (idx == page.length) {
                    setTimeout(() => {
                      this.dataList.push({});
                      this.dataList.pop();
                    });
                  }
                });
              }
            });
            this.totalCount = r.data.totalCount;
            if (!page.length) this.nohasface = true;
          }
        }
      });
    },
    //切换页数
    changePage(pageNo) {
      this.pageNo = pageNo;
      this.renderList();
    }
  },
  mounted() {},
  watch: {
    viewTrack(view) {
      if (view) this.renderList();
      else {
        this.dataList.splice(0, this.dataList.length);
      }
    }
  }
};
</script>
