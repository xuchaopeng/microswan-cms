<template>
  <div class="infopush">
    <Row :gutter="15">
      <Col span="6">
        <Card class="comcss">
          <div class="actions">
            <span class="fl">
              <Icon custom="icon iconfont icon-bumen" size="24" />消息列表
            </span>
          </div>
          <div class="tbs">
            <Loading color="#504C4C" :size="25" v-if="isloading2"></Loading>
            <Tree :data="dmlist" @on-select-change="selectDepartment"></Tree>
          </div>
        </Card>
      </Col>
      <Col span="18">
        <div class="dmcons comcss">
          <Loading v-if="isloading"></Loading>
          <div class="nohasHitInfo" v-show="nohasHitInfo">
            该部门暂无推送消息
          </div>
          <ul class="hitInfoList">
            <li class="item" v-for="em in dataList" @click="renderDetails(em)">
              <div class="img">
                <img :src="em.facePicPath" alt="/" />
              </div>
              <div class="dis">
                <p class="hassure">
                  {{
                    em.status == 0
                      ? "等待确认"
                      : em.status == 1
                      ? "已确认：同一人"
                      : "已确认：非同一人"
                  }}
                </p>
                <p class="score">
                  <Icon class="iconfont icon-renxiangcaiji"></Icon>
                  {{ em.score }}
                </p>
                <p class="time">
                  <Icon class="iconfont icon-shijian"></Icon>
                  {{ em.reportTime }}
                </p>
              </div>
            </li>
          </ul>
          <div class="pages" v-if="totalCount > 10">
            <Page
              :total="totalCount"
              show-elevator
              show-total
              @on-change="changePage"
            />
          </div>
        </div>
      </Col>
    </Row>
    <HitDetails
      :item="currentFace"
      :viewHitDetails="viewHitDetails"
      @closeFace="closeFaceDetails"
    ></HitDetails>
  </div>
</template>

<script>
import "./infopush.less";
import HitDetails from "_c/hit-details";
import Loading from "_c/loading";
import { creatScore, getAddress } from "@/libs/util";
import { getDepartmentTree } from "@/api/system";
import { getListHitInfo } from "@/api/hitinfo";
import { mapMutations, mapGetters } from "vuex";
import config from "@/config/index.js";
const Imgbase = config.imageBaseUrl;
export default {
  data() {
    return {
      isloading: true,
      isloading2: true,
      viewHitDetails: false,
      totalCount: 1,
      //当前人像
      currentFace: {},
      //当前选中部门
      currentDm: {
        name: "",
        id: ""
      },
      //左侧部门列表
      dmlist: [{}],
      //右侧列表数据
      dataList: [],
      //是否有推送消息
      nohasHitInfo: false
    };
  },
  mounted() {
    this.nohasHitInfo = false;
    this.getTreeData();
    this.renderList();
  },
  computed: {
    ...mapGetters(["departmentId", "departmentList"])
  },
  methods: {
    ...mapMutations(["setDepartmentList"]),
    //当前部门被选择
    selectDepartment(item) {
      if (!item || !item[0]) return;
      this.currentDm.id = item[0].id;
      this.currentDm.name = item[0].title;
      this.renderList();
    },
    //更新部门树数据
    updateDepartmentList(a) {
      //如果用户当前未选中任何部门，这里默认为最高级部门
      if (!this.currentDm.id) this.currentDm.id = a.id;
      let index = 1;
      function getTree(tree = []) {
        let arr = [];
        if (!!tree && tree.length !== 0) {
          tree.forEach(item => {
            let obj = {};
            obj.title = item.name;
            obj.expand = index < 2 ? true : false;
            obj.id = item.id;
            obj.parentId = item.parentId;
            obj.children = getTree(item.children);
            arr.push(obj);
          });
          ++index;
        }
        return arr;
      }
      const b = getTree(a);
      this.dmlist.pop();
      this.dmlist.push(b[0]);
      this.isloading2 = false;
    },
    //获取部门树数据
    getTreeData() {
      if (this.departmentList && this.departmentList.length) {
        this.updateDepartmentList(this.departmentList);
        return;
      }
      getDepartmentTree(this.departmentId)
        .then(res => {
          let data = null;
          const r = res.data;
          if (r.code == 200 && r.data) {
            data = r.data;
            let list = [data];
            this.updateDepartmentList(list);
            this.setDepartmentList(list);
          }
        })
        .catch(res => {});
    },
    //数据字段序列化
    filterData(em) {
      let nem = {
        name: em.name,
        alias: em.alias,
        departmentId: em.departmentId,
        departmentName: em.departmentName,
        ethnic: em.ethnic,
        faceId: em.faceId,
        backPicPath: Imgbase + em.hitBackgroundPicturePath,
        facePicPath: Imgbase + em.hitFacePicturePath,
        idcard: em.idcard,
        id: em.id,
        lat: em.lat,
        libId: em.libId,
        libName: em.libName,
        lng: em.lng,
        passerBackPicPath: Imgbase + em.passerbyBackgroundPicturePath,
        passerFacePicPath: Imgbase + em.passerbyFacePicturePath,
        policeNum: em.policeNum,
        reportTime: em.reportTime.replace(/-/g, "/"),
        score: creatScore(em.score),
        status: em.status
      };
      getAddress(nem);
      return nem;
    },
    //展现部门消息列表
    renderList() {
      let param = {
        departmentId: this.currentDm.id || "",
        pageNo: this.pageNo
      };
      this.nohasHitInfo = false;
      this.isloading = true;
      getListHitInfo(param)
        .then(res => {
          this.isloading = false;
          let r = res.data;
          if (r.code == 200) {
            const page = r.data.pageContent;
            const len = this.dataList.length;
            if (page) {
              this.dataList.splice(0, len);
              page.forEach(em => {
                this.dataList.push(this.filterData(em));
              });
              this.totalCount = r.data.totalCount;
              if (!page.length) this.nohasHitInfo = true;
            }
          }
        })
        .catch(err => {
          this.isloading = false;
        });
    },
    //切换页数
    changePage(pageNo) {
      this.pageNo = pageNo;
      this.renderList();
    },
    //展示人像详情页
    renderDetails(em) {
      this.currentFace = {
        ...em
      };
      this.viewHitDetails = true;
    },
    //关闭人像详情页
    closeFaceDetails(needUpdateList) {
      this.currentFace = {};
      this.viewHitDetails = false;
      if (needUpdateList) this.renderList();
    }
  },
  components: {
    HitDetails,
    Loading
  }
};
</script>
