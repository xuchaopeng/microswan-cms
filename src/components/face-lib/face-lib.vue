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
      <ul class="facelist">
        <li class="item" v-for="em in dataList">
          <div class="img">
            <img src="" alt="/">
          </div>
          <div class="dis">
            {{em.name}}
          </div>
        </li>
      </ul>
    </Card>
    <div class="sub" v-if="!closesub">
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
export default {
  name: 'Facelibitem',
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      imgsrc,
      closesub: false,
      pageNo: 1,
      type: '',
      loading: false,
      dataList: [],
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
    this.renderList();
  },
  methods: {
    closeBtn() {
      this.$emit('closeFaceLib');
    },
    closeSub() {
      this.closesub = true;
    },
    renderList() {
      let param = {
        libId: this.item.id,
        pageNo: this.pageNo,
        pageSize: 20
      };
      console.log(param, '111')
      getFaceList(param).then(res => {
        if (res.data.code == 200) {
          console.log(res.data, '库图片列表');
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
  }
}
</script>