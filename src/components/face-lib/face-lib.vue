<template>
  <div class="facelibitem">
    <div class="pop"></div>
    <div class="cons">
      <p class="title">
        <Button class="addface" ghost @click="addNewFace">
          <Icon class="iconfont icon-icon-test"></Icon>添加人像
        </Button>
        {{ item.libName }}
        <Icon class="close" custom="icon iconfont icon-close" size="24" @click="closeBtn" />
      </p>
      <p class="loading" v-if="isloading">
        <Loading color="#D9DCDE"></Loading>
      </p>
      <p class="nohasface" v-show="nohasface">暂无人像</p>
      <ul class="facelist">
        <li class="item" v-for="em in dataList" @click="renderDetails(em)">
          <div class="img">
            <img :src="em.facePicPath" alt="/" />
          </div>
          <div class="dis">{{ em.name }}</div>
        </li>
      </ul>
      <div class="pages1" v-if="totalCount > 10">
        <Page :total="totalCount" show-elevator show-total @on-change="changePage" />
      </div>
    </div>
    <div class="popup" v-show="ispop">
      <div class="pop"></div>
      <div class="popcons">
        <Icon class="close" custom="icon iconfont icon-close" size="24" @click="closePopup"></Icon>
        <div class="xcp">
          <p class="facepic">
            <span class="cirs" @click="deleteFace">
              <Icon class="iconfont icon-icon_huabanfuben"></Icon>
            </span>
            <img :src="currentFace.facePicPath" alt />
          </p>
          <p class="backpic">
            <img :src="currentFace.backPicPath" alt />
          </p>
        </div>
        <div class="dis">
          <p>姓名：{{ currentFace.name }}</p>
          <p>民族：{{ currentFace.ethnic }}</p>
          <p>别名： {{ currentFace.alias }}</p>
          <p>库名：{{ item.libName }}</p>
        </div>
      </div>
    </div>
    <div class="sub" v-show="!closesub">
      <div class="subpop"></div>
      <div class="submiddle">
        <Icon class="close" custom="icon iconfont icon-close" size="24" @click="closeSub"></Icon>
        <template v-if="type == 1">
          <div class="addFaceitem">
            <p class="subtitle">添加人像</p>
            <Form ref="saveFrom" :model="from" :rules="rule" @keydown.enter.native="addSubmit">
              <FormItem prop="name" label="姓名">
                <Input v-model="from.name"></Input>
              </FormItem>
              <FormItem prop="alias" label="别名">
                <Input v-model="from.alias"></Input>
              </FormItem>
              <FormItem prop="ethnic" label="民族">
                <Input v-model="from.ethnic"></Input>
              </FormItem>
              <FormItem prop="idcard" label="身份证号">
                <Input v-model="from.idcard"></Input>
              </FormItem>
              <div class="faceimg">
                <span class="txt">人像背景图</span>
                <div class="files">
                  <span class="pic" v-show="picsrc.src1">
                    <img :src="picsrc.src1" alt />
                  </span>
                  <span class="img">
                    <Icon custom="icon iconfont icon-mn_shangchuantupian_fill"></Icon>
                    <input type="file" ref="BJfile" size="40" @change="xcp01" />
                  </span>
                </div>
              </div>
              <div class="faceimg">
                <span class="txt">身份证照片</span>
                <div class="files">
                  <span class="pic" v-show="picsrc.src2">
                    <img :src="picsrc.src2" alt />
                  </span>
                  <span class="img">
                    <Icon custom="icon iconfont icon-mn_shangchuantupian_fill"></Icon>
                    <input class="img" type="file" ref="IDfile" size="40" @change="xcp02" />
                  </span>
                </div>
              </div>
              <FormItem>
                <Button @click="addSubmit" type="primary" :loading="loading" long>
                  <span v-if="!loading">保存</span>
                  <span v-else>保存中...</span>
                </Button>
              </FormItem>
            </Form>
          </div>
        </template>
        <template v-else-if="type == 2">
          <div class="delete">
            <p class="subtitle">是否删除所选人像?</p>
            <p>{{ currentFace.name }}</p>
            <p class="dels">
              <Button class="mr10" @click="delSubmit" type="primary">确认</Button>
              <Button @click="closeSub" type="warning">取消</Button>
            </p>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import "./index.less";
import Loading from "_c/loading";
import { getFaceList, addFace, delFace } from "@/api/resources";
import config from "@/config/index.js";
const Imgbase = config.imageBaseUrl;
export default {
  name: "Facelibitem",
  props: {
    item: {
      type: Object,
      default: () => ({})
    },
    libId: {
      type: Number,
      default: 0
    },
    ischange: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      picsrc: {
        src1: "",
        src2: ""
      },
      isloading: false,
      totalCount: 1,
      closesub: true,
      pageNo: 1,
      type: "",
      loading: false,
      nohasface: false,
      dataList: [],
      ispop: false,
      currentFace: {},
      from: {
        name: "",
        alias: "",
        ethnic: "",
        idcard: "",
        file: ""
      },
      rule: {
        name: [{ required: true, message: "姓名不能为空", trigger: "blur" }]
      }
    };
  },
  mounted() {
    this.closesub = true;
    this.renderList();
  },
  methods: {
    xcp02() {
      let fil = this.$refs.IDfile.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(fil);
      reader.onload = () => {
        this.picsrc.src2 = reader.result;
      };
    },
    xcp01(e) {
      let fil = this.$refs.BJfile.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(fil);
      reader.onload = () => {
        this.picsrc.src1 = reader.result;
      };
    },
    closeBtn() {
      this.cacheLidId = this.libId; //缓存库id
      this.dataList = [];
      this.$emit("closeFaceLib");
      this.nohasface = false;
    },
    closeSub() {
      this.closesub = true;
      this.$refs.BJfile.value = "";
      this.$refs.IDfile.value = "";
      this.picsrc.src1 = "";
      this.picsrc.src2 = "";
    },
    closePopup() {
      this.ispop = false;
    },
    filterData(em) {
      return {
        IDAddress: Imgbase + em.IDAddress,
        alias: "ss" + em.alias,
        backPicPath: Imgbase + em.backPicPath,
        ethnic: em.ethnic,
        facePicPath: Imgbase + em.facePicPath,
        id: em.id,
        libId: em.libId,
        name: em.name
      };
    },
    changePage(pageNo) {
      const len = this.dataList.length;
      this.dataList.splice(0, len);
      this.pageNo = pageNo;
      this.renderList();
    },
    renderDetails(em) {
      this.currentFace = {
        ...em
      };
      this.ispop = true;
    },
    renderList() {
      let param = {
        libId: this.item.id,
        pageNo: this.pageNo,
        pageSize: 10
      };
      this.isloading = true;
      getFaceList(param).then(res => {
        let r = res.data;
        this.isloading = false;
        if (r.code == 200) {
          const page = r.data.pageContent;
          const len = this.dataList.length;
          if (page) {
            this.dataList.splice(0, len);
            page.forEach(em => {
              this.dataList.push(this.filterData(em));
            });
            this.totalCount = r.data.totalCount;
            if (!page.length) this.nohasface = true;
          }
        }
      });
    },
    addNewFace() {
      this.closesub = false;
      for (var k in this.from) {
        this.from[k] = "";
      }
      this.type = 1;
    },
    deleteFace() {
      this.closesub = false;
      this.type = 2;
    },
    upSuccess(v) {
      this.loading = false;
      this.closesub = true;
      this.type = "";
      switch (v) {
        case 1:
          for (var k in this.from) {
            this.from[k] = "";
          }
          this.$refs.BJfile.value = "";
          this.$refs.IDfile.value = "";
          this.$Message.success({
            content: "人像添加成功",
            duration: 1.5,
            closable: true
          });
          break;
        case 2:
          this.ispop = false;
          this.$Message.success({
            content: "人像删除成功",
            duration: 1.5,
            closable: true
          });
          break;
      }
      this.renderList();
    },
    upError(v, text) {
      this.loading = false;
      this.closesub = true;
      this.type = "";
      switch (v) {
        case 1:
          for (var k in this.from) {
            this.from[k] = "";
          }
          this.$refs.BJfile.value = "";
          this.$refs.IDfile.value = "";
          this.$Message.error({
            content: text || "人像添加失败",
            duration: 1.5,
            closable: true
          });
          break;
        case 2:
          this.$Message.error({
            content: text || "人像添加失败",
            duration: 1.5,
            closable: true
          });
          break;
      }
    },
    addSubmit() {
      this.$refs["saveFrom"].validate(valid => {
        if (valid) {
          if (typeof this.item.id == "undefined") return;
          this.loading = true;
          let file1 = this.$refs.BJfile;
          let file2 = this.$refs.IDfile;
          const formData = new window.FormData();
          const v = {
            name: this.from.name,
            alias: this.from.alias,
            ethnic: this.from.ethnic,
            idcard: this.from.idcard,
            libId: this.item.id
          };
          var blod = new Blob([JSON.stringify(v)], {
            type: "application/json"
          });
          formData.append("addVO", blod);
          // formData.append('addVO', JSON.stringify(v));
          formData.append("file", file1.files[0]);
          formData.append("idFile", file2.files[0]);
          addFace(formData)
            .then(res => {
              if (res.data.code == 200) this.upSuccess(1);
              else this.upError(1, res.data.msg);
            })
            .catch(err => {
              this.upError(1);
            });
        }
      });
    },
    delSubmit() {
      if (!this.currentFace.id) return;
      delFace(this.currentFace.id)
        .then(res => {
          if (res.data.code == 200) this.upSuccess(2);
          else this.upError(2, res.data.msg);
        })
        .catch(err => {
          this.upError(2);
        });
    }
  },
  watch: {
    ischange(c) {
      if (c) this.renderList();
    }
  },
  components: {
    Loading
  }
};
</script>
