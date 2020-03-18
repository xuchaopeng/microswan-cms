<template>
  <div class="facelibitem">
    <Card>
      <p class="" slot="title">
        <Button class="addface" ghost @click="addNewFace">
          <Icon class="iconfont icon-icon-test"></Icon>
          添加人像
        </Button>
        {{item.libName}}
        <Icon class="close" custom="icon iconfont icon-close" size="24" @click="closeBtn" />
      </p>
      <p class="nohasface" v-show="nohasface">暂无人像</p>
      <ul class="facelist">
        <li class="item" v-for="em in dataList" @click="renderDetails(em)">
          <div class="img">
            <img :src="em.facePicPath" alt="/">
          </div>
          <div class="dis">
            {{em.name}}
          </div>
        </li>
      </ul>
    </Card>
    <div class="popup" v-show="ispop">
      <div class="pop"></div>
      <div class="cons">
        <Icon class="close" custom="icon iconfont icon-close" size="24" @click="closePopup"></Icon>
        <p class="facepic">
          <img :src="currentFace.facePicPath" alt="">
        </p>
        <p class="backpic">
          <img :src="currentFace.backPicPath" alt="">
        </p>
        <div class="dis">
          <p>姓名：{{currentFace.name}}</p>
          <p>民族：{{currentFace.ethnic}}</p>
          <p>别名： {{currentFace.alias}}</p>
          <p>库名：{{currentFace.name}}</p>
        </div>
      </div>
    </div>
    <div class="sub" v-show="!closesub">
      <Icon class="close" custom="icon iconfont icon-close" size="24" @click="closeSub">
      </Icon>
      <template v-if="type == 1">
        <p class="subtitle">添加人像HAHA</p>
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
          <div class="pic">
            人像背景图<input type="file" ref="BJfile" size="40" />
          </div>
          <div class="pic">
            身份证照片<input type="file" ref="IDfile" size="40" />
          </div>
          <FormItem>
            <Button @click="addSubmit" type="primary" :loading="loading" long>
              <span v-if="!loading">保存</span>
              <span v-else>保存中...</span>
            </Button>
          </FormItem>
        </Form>
      </template>
    </div>
  </div>
</template>

<script>
import './index.less';
import imgsrc from '@/assets/images/1.jpg';
import { getFaceList, addFace } from '@/api/resources';
const Imgbase = 'https://118.24.53.165/';
export default {
  name: 'Facelibitem',
  props: {
    item: {
      type: Object,
      default: () => ({})
    },
    libId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      imgsrc,
      totalCount: 1,
      closesub: true,
      pageNo: 1,
      type: '',
      loading: false,
      nohasface: false,
      dataList: [],
      ispop: false,
      currentFace: {},
      from: {
        name: '',
        alias: '',
        ethnic: '',
        idcard: '',
        file: ''
      },
      rule: {
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
      }
    }
  },
  mounted() {
    this.closesub = true;
    this.renderList();
  },
  methods: {
    closeBtn() {
      // console.log('libId', this.libId);
      // console.log('cacheLidId', this.cacheLidId);
      // if (this.cacheLidId !== this.libId) {
      //   this.cacheLidId = this.libId //缓存库id
      //   this.dataList = [];
      // }
      this.cacheLidId = this.libId //缓存库id
      this.dataList = [];
      this.$emit('closeFaceLib');
      this.nohasface = false;
    },
    closeSub() {
      this.closesub = true;
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
      }
    },
    renderDetails(em) {
      this.currentFace = {
        ...em
      }
      this.ispop = true;
    },
    renderList() {
      let param = {
        libId: this.item.id,
        pageNo: this.pageNo,
        pageSize: 20
      };
      getFaceList(param).then(res => {
        let r = res.data;
        console.log(res.data, '库图片列表');
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
      this.type = 1;
    },
    upSuccess(v) {
      this.loading = false;
      this.closesub = true;
      this.type = '';
      switch (v) {
        case 1:
          for (var k in this.from) {
            this.from[k] = '';
          }
          this.$Message.success({
            content: '人像添加成功',
            duration: 1.5,
            closable: true
          });
          break;
      }
      this.renderList();
    },
    upError() {
      this.loading = false;
      this.closesub = true;
      this.type = '';
      switch (v) {
        case 1:
          this.$Message.error({
            content: '人像添加失败',
            duration: 1.5,
            closable: true
          });
          break;
      }
    },
    addSubmit() {
      this.$refs['saveFrom'].validate(valid => {
        if (valid) {
          if (typeof this.item.id == 'undefined') return;
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
          var blod = new Blob([JSON.stringify(v)], { type: "application/json" });
          formData.append('addVO', blod);
          formData.append('file', file1.files[0]);
          formData.append('idFile', file2.files[0]);
          addFace(formData).then(res => {
            if (res.data.code == 200) this.upSuccess(1);
            else this.upError(4);
          }).catch(err => { this.upError(1); })
        }
      })
    }
  },
  watch: {
    item(a) {
      console.log(a, '变化了item');
    },
    libId(b) {
      this.renderList();
      console.log(b, '变化了xcp');
    }
  }
}
</script>