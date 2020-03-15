<template>
  <div class="facelibitem">
    <Card>
      <p class="" slot="title">
        <Button class="addface" ghost @click="addFace">
          <Icon class="iconfont icon-icon-test"></Icon>
          添加人像
        </Button>
        {{item.libName}}
        <Icon class="close" custom="icon iconfont icon-close" size="24" @click="closeBtn" />
      </p>
      <ul class="facelist">
        <li class="item">
          <div class="img">
            <img :src="imgsrc" alt="/">
          </div>
          <div class="dis">
            HAHAHAH
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
          <!-- <FormItem prop="idaddress" label="地址">
            <Input v-model="from.idaddress"></Input>
          </FormItem> -->
          <FormItem prop="idcard" label="身份证号">
            <Input v-model="from.idcard"></Input>
          </FormItem>
          <div class="pic">
            人像背景图<input type="file" id="imgfile" size="40" @change="viewmypic" />
          </div>
          <div class="pic">
            身份证照片<input type="file" id="imgfile" size="40" @change="viewmypic" />
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
import imgsrc from '@/assets/images/1.jpg';
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
      type: '',
      loading: false,
      from: {
        name: '',
        alias: '',
        ethnic: '',
        idaddress: '',
        idcard: '',
        file: ''
      },
      rule: {
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
      }
    }
  },
  methods: {
    closeBtn() {
      this.$emit('closeFaceLib');
    },
    closeSub() {
      this.closesub = true;
    },
    addFace() {
      this.closesub = false;
      this.type = 1;
      console.log('HAHHAHHAHA');
    },
    viewmypic(showimg, imgfile) { console.log(showimg, 'xcpppv') },
    addSubmit() { }
  }
}
</script>

<style lang="less">
.facelibitem {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background-color: #064667;
  z-index: 11;
  .sub {
    position: absolute;
    width: 410px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
    padding: 15px;
    border-radius: 5px;
    border: 1px solid #dcdee2;
    background-color: #fff;
    .subtitle {
      margin-bottom: 20px;
      font-size: 16px;
    }
    .ivu-form {
      .ivu-form-item-content {
        width: 85%;
      }
      .ivu-form-item-label {
        width: 15%;
      }
      .ivu-btn-primary {
        margin-top: 0;
      }
    }
  }
  .ivu-card-head {
    background-color: #1183bf;
    p {
      color: #fff;
    }
  }
  .ivu-card-bordered {
    border-color: #389cc8;
  }
  .ivu-card-body {
    background-color: #064667;
  }
  .ivu-card-bordered {
    height: 100%;
    background-color: #064667;
  }
  .addface {
    position: absolute;
    top: 16px;
    left: 15px;
    color: #fff;
    opacity: 0.7;
    &:hover {
      color: #fff;
      border-color: #fff;
      opacity: 1;
    }
    .icon-icon-test {
      font-size: 14px !important;
    }
  }
  .close {
    position: absolute;
    right: 0;
    top: 5px;
    cursor: pointer;
    z-index: 10;
  }
  .facelist {
    overflow: hidden;
    .item {
      float: left;
      margin-right: 20px;
      margin-bottom: 20px;
      width: 225px;
      height: 150px;
      background-color: #fff;
      box-sizing: border-box;
      padding: 20px 10px;
      border-radius: 5px;
      .img {
        width: 110px;
        width: 110px;
        float: left;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .dis {
        float: right;
        width: 80px;
        height: 110px;
      }
    }
  }
}
</style>