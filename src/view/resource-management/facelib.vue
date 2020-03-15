<template>
  <div class="facelib">
    <Row :gutter="15">
      <Col span="6">
      <Card class="comcss">
        <div class="actions">
          <span class="fl">
            <Icon custom="icon iconfont icon-bumen" size="24" />人像列表库
          </span>
        </div>
        <div class="tbs">
          <Tree :data="dmlist" @on-select-change="selectDepartment"></Tree>
        </div>
      </Card>
      </Col>
      <Col span="18">
      <div class="dmcons comcss">
        <div class="addbtn">
          <Button class="mr20" type="success" size="large" @click="addNewFaceLib">+添加人像库</Button>
          <Select class="mr10" v-model="libType" style="width:200px;" placeholder="请选择库类型">
            <Option v-for="item in faceLibType" :value="item.value">
              {{ item.name }}
            </Option>
          </Select>
          <Button class="ml10" type="primary" icon="ios-search" @click="searchLib">搜索</Button>
        </div>
        <Table :columns="column" :data="tabdata" no-data-text="暂无人像库">
          <template slot-scope="{ row, index }" slot="action">
            <Button class="mr10" type="success" size="small" @click="enterFace(row)">
              查看
            </Button>
            <Button class="mr10" type="primary" size="small" @click="editorFaceLib(row)">
              编辑
            </Button>
            <Button class="mr10" type="error" size="small" @click="removeFaceLib(row)">删除</Button>
            <Button v-if="!row.subscribed" type="success" ghost size="small" @click="changeSubscribe(row)">
              订阅
            </Button>
            <Button v-if="row.subscribed" type="warning" ghost size="small" @click="changeSubscribe(row)">
              取消订阅
            </Button>
          </template>
        </Table>
        <div class="pages" v-if="totalCount > 10">
          <Page :total="totalCount" show-elevator show-total @on-change="changePage" />
        </div>
      </div>
      </Col>
    </Row>
    <div class="subtable" v-if="type">
      <Icon class="close" custom="icon iconfont icon-close" size="24" @click="closeBtn" />
      <template v-if="type == 1">
        <p class="subtitle">添加人像库</p>
        <Form ref="saveFrom" :model="from" :rules="rule" @keydown.enter.native="addSubmit">
          <FormItem prop="libName" label="库名">
            <Input v-model="from.libName"></Input>
          </FormItem>
          <FormItem prop="type" label="类型">
            <Select v-model="from.type" style="width:200px" placeholder="选择人像库类型">
              <Option v-for="item in faceLibType" :value="item.value" :key="item.value">
                {{ item.name }}
              </Option>
            </Select>
          </FormItem>
          <FormItem prop="description" label="备注">
            <Input v-model="from.description"></Input>
          </FormItem>
          <FormItem>
            <Button @click="addSubmit" type="primary" :loading="loading" long>
              <span v-if="!loading">立即保存</span>
              <span v-else>保存中...</span>
            </Button>
          </FormItem>
        </Form>
      </template>

      <template v-else-if="type == 2">
        <div class="delete">
          <p class="subtitle">确认删除人像库吗?</p>
          <p>{{currentLib.libName}}</p>
          <p class="dels">
            <Button class="mr5" @click="delSubmit" type="primary">确认删除</Button>
            <Button @click="closeBtn" type="warning">取消</Button>
          </p>
        </div>
      </template>

      <template v-else-if="type == 3">
        <div class="editorFaceLib">
          <p class="subtitle">修改人像库</p>
          <Form ref="editorFrom" :model="editorFrom" :rules="rule" @keydown.enter.native="updateSubmit">
            <div class="clearfix mrb20">
              <span class="fl alislf">库名：</span><span class="fl alisrg">{{currentLib.libName}}</span>
            </div>
            <div class="clearfix mrb20">
              <span class="fl alislf">备注：</span><span class="fl alisrg">{{currentLib.description}}</span>
            </div>
            <FormItem prop="libName" label="库名">
              <Input v-model="editorFrom.libName"></Input>
            </FormItem>
            <FormItem prop="description" label="备注">
              <Input v-model="editorFrom.description" type="textarea"></Input>
            </FormItem>
            <FormItem>
              <Button @click="updateSubmit" type="primary" :loading="loading" long>
                <span v-if="!loading">立即保存</span>
                <span v-else>保存中...</span>
              </Button>
            </FormItem>
          </Form>
        </div>
      </template>
    </div>
    <FaceLib :item="currentLib" @closeFaceLib="closeFaceLib" v-show="viewFaceDetails"></FaceLib>
  </div>
</template>

<script>
import FaceLib from '_c/face-lib';
import { getDepartmentTree } from '@/api/system';
import { getLibTypes, addFaceLib, getFaceLibList, deleteFaceLib, updateFaceLib, subscribe, unsubscribe } from '@/api/resources';
import { mapMutations, mapGetters } from 'vuex';
export default {
  data() {
    //角色验证
    const setlibtype = (rule, value, callback) => {
      if (typeof value == 'string' && !value) {
        callback(new Error('请选择一个人像库类型'));
      } else {
        callback();
      }
    }
    return {
      loading: false,
      totalCount: 1,
      //当前选中部门
      currentDm: {
        name: '',
        id: ''
      },
      //当前操作人像库
      currentLib: {
        libName: "",
        id: "",
        description: "",
        subscribed: ''
      },
      //左侧部门列表
      dmlist: [{}],
      //右侧分页部门列表
      tabdata: [],
      column: [
        {
          title: '名称',
          key: 'libName'
        },
        {
          title: '描述',
          key: 'description'
        },
        {
          title: '操作',
          slot: 'action',
          key: 'cz'
        }
      ],
      //部门编辑弹窗类别 1 2 3 
      type: '',
      //人像库添加，表单提交
      from: {
        libName: '',
        description: '',
        type: ''
      },
      rule: {
        libName: [{ required: true, message: '人像库名称不能为空', trigger: 'blur' }],
        description: [{ required: false }],
        type: [{ required: true, validator: setlibtype, trigger: 'change' }]
      },
      //人像库编辑
      editorFrom: {
        libName: '',
        description: ''
      },
      rule: {
        libName: [{ required: true, message: '人像库名称不能为空', trigger: 'blur' }],
        description: [{ required: false }],
      },
      //部门可选角色列表
      faceLibType: [],
      libType: '',
      //查看该人像库详情
      viewFaceDetails: false
    }
  },
  mounted() {
    this.getLibList();
    this.getTreeData();
  },
  computed: {
    ...mapGetters(['departmentId', 'departmentList']),
  },
  methods: {
    ...mapMutations(['setDepartmentList']),
    //关闭编辑弹框
    closeBtn() {
      this.type = '';
    },
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
    },
    //展现右侧人像库列表
    renderList(type = '') {
      if (!this.currentDm.name || !this.currentDm.id) return;
      let param = {
        departmentId: this.currentDm.id,
        pageNo: this.pageNo,
        type: type
      }
      getFaceLibList(param).then(res => {
        let r = res.data;
        console.log(r, 'facelist')
        if (r.code == 200) {
          const page = r.data.pageContent;
          const len = this.tabdata.length;
          if (page) {
            this.tabdata.splice(0, len);
            page.forEach(em => {
              this.tabdata.push(em);
            });
            this.totalCount = r.data.totalCount;
          }
        }
      });
    },
    //获取部门树数据
    getTreeData() {
      if (this.departmentList && this.departmentList.length) {
        this.updateDepartmentList(this.departmentList);
        return;
      }
      getDepartmentTree(this.departmentId).then(res => {
        let data = null;
        const r = res.data;
        if (r.code == 200 && r.data) {
          data = r.data;
          let list = [data];
          this.updateDepartmentList(list);
          this.setDepartmentList(list);
        }
      }).catch(res => { })
    },
    //获取人像库列表
    getLibList() {
      if (this.faceLibType.length) return;
      getLibTypes().then(res => {
        let r = res.data;
        if (r.code == 200) {
          const len = this.faceLibType.length;
          this.faceLibType.splice(0, len);
          r.data.forEach(m => {
            this.faceLibType.push(m);
          });
          console.log(this.faceLibType, 'HA')
        } else { }
      }).catch(err => { })
    },
    //切换页面
    changePage(pageNo) {
      this.pageNo = pageNo;
      this.renderList();
    },
    //添加人像库
    addNewFaceLib() {
      if (!this.currentDm.name) {
        this.$Message.success({
          content: '请选择一个部门',
          duration: 1.5,
          closable: true
        });
        return;
      }
      this.type = 1;
      this.getLibList();
    },
    //成功状态提示
    upSuccess(v) {
      this.loading = false;
      this.type = '';
      switch (v) {
        case 1:
          for (var k in this.from) {
            this.from[k] = '';
          }
          this.$Message.success({
            content: '人像库添加成功',
            duration: 1.5,
            closable: true
          });
          break;
        case 2:
          this.$Message.success({
            content: '人像库删除成功',
            duration: 1.5,
            closable: true
          });
          break;
        case 3:
          this.$Message.success({
            content: '人像库修改成功',
            duration: 1.5,
            closable: true
          });
          break;
      }
      this.renderList();
    },
    //失败状态提示
    upError(v) {
      this.loading = false;
      this.type = '';
      switch (v) {
        case 1:
          this.$Message.error({
            content: '人像库添加失败',
            duration: 1.5,
            closable: true
          });
          break;
        case 2:
          this.$Message.error({
            content: '人像库删除失败',
            duration: 1.5,
            closable: true
          });
          break;
        case 3:
          this.$Message.error({
            content: '人像库修改失败',
            duration: 1.5,
            closable: true
          });
          break;
        case 4:
          this.$Message.error({
            content: '人像库订阅失败',
            duration: 1.5,
            closable: true
          });
          break;
      }
    },
    setCurrentLib(row) {
      this.currentLib.id = row.id;
      this.currentLib.subscribed = row.subscribed;
      this.currentLib.libName = row.libName;
      this.currentLib.description = row.description;
    },
    //删除人像库
    removeFaceLib(row) {
      if (!row) return;
      this.setCurrentLib(row);
      //弹框提示操作
      this.type = 2;
    },
    //编辑提交
    editorFaceLib(row) {
      if (!row) return;
      this.setCurrentLib(row);
      //初始化修改框
      this.editorFrom.libName = this.currentLib.libName;
      this.editorFrom.description = this.currentLib.description;
      this.type = 3;
    },
    //订阅与取消订阅
    changeSubscribe(row) {
      if (!row) return;
      this.setCurrentLib(row);
      //订阅发送
      if (!row.subscribed) {
        subscribe(this.currentLib.id).then(res => {
          if (res.data.code == 200) {
            row.subscribed = true;
          } else this.upError(4);
        }).catch(err => { this.upError(4) })
      } else {
        unsubscribe(this.currentLib.id).then(res => {
          if (res.data.code == 200) this.upSuccess(4);
          else this.upError(4);
        }).catch(err => { this.upError(4) })
      }
    },
    //进入人像库详情
    enterFace(row) {
      if (!row) return;
      this.setCurrentLib(row);
      this.viewFaceDetails = true;
    },
    //关闭人像详情页
    closeFaceLib() {
      this.viewFaceDetails = false;
    },
    //添加提交
    addSubmit() {
      this.$refs['saveFrom'].validate(valid => {
        if (valid) {
          this.loading = true;
          let param = {
            "departmentId": this.currentDm.id,
            "description": this.from.description,
            "libName": this.from.libName,
            "type": this.from.type
          }
          addFaceLib(param).then(res => {
            if (res.data.code == 200) this.upSuccess(1);
            else this.upError(1);
          }).catch(err => { this.upError(1) })
        }
      })
    },
    //删除提交
    delSubmit() {
      if (!this.currentLib.id) return;
      deleteFaceLib(this.currentLib.id).then(res => {
        if (res.data.code == 200) this.upSuccess(2);
        else this.upError(2);
      }).catch(err => { this.upError(2); })
    },
    //修改编辑提交
    updateSubmit() {
      console.log('1');
      this.$refs['editorFrom'].validate(valid => {
        console.log('2');
        if (!valid) return;
        console.log('3');
        let param = {
          description: this.editorFrom.description,
          libName: this.editorFrom.libName,
          id: this.currentLib.id
        }
        this.loading = true;
        updateFaceLib(param).then(res => {
          console.log('4');
          console.log(res, 'xcpppp');
          if (res.data.code == 200) this.upSuccess(3);
          else this.upError(3);
        }).catch(err => { this.upError(3); console.log('5'); })
      })
    },
    //按类型刷选库
    searchLib() {
      this.renderList(this.libType);
    }
  },
  components: {
    FaceLib
  }
}
</script>

<style lang="less">
.facelib {
  text-align: center;
  position: relative;
  .subtable {
    position: fixed;
    width: 440px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    margin-left: 180px;
    z-index: 10;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #dcdee2;
    background-color: #fff;

    .subtitle {
      padding: 10px 0;
      position: relative;
      text-align: center;
      font-size: 18px;
    }
    .delete {
      font-size: 16px;
    }
    .editorFaceLib {
      text-align: left;
      padding: 10px;
      font-size: 14px;
      .ivu-form-item {
        margin-bottom: 40px;
      }
      .ivu-form {
        .ivu-btn-primary {
          margin-top: 0;
        }
      }
      .ivu-tree {
        ul {
          font-size: 16px;
          text-align: left;
        }
      }
      .alislf {
        padding: 5px;
        box-sizing: border-box;
        width: 20%;
        text-align: right;
      }
      .alisrg {
        padding: 5px;
        box-sizing: border-box;
        width: 80%;
      }
      .pmist {
        width: 300px;
        height: 220px;
        overflow-y: scroll;
        background: #f4f4f4;
        border: 1px solid #dfdfdfcc;
      }
      .savepms {
        padding: 10px 0 10px 50px;
      }
    }
    .discnt {
      padding: 10px;
      text-align: left;
      .ivu-form .ivu-form-item-label {
        width: auto;
        font-size: 18px;
        padding-right: 5px;
      }
      .ivu-form .ivu-form-item-content {
        float: left;
      }
    }
    .close {
      position: absolute;
      right: 0;
      top: 5px;
      cursor: pointer;
      z-index: 10;
    }
    .dels {
      padding: 20px 0;
      .ivu-btn-warning {
        width: 80px;
      }
    }
  }
  .ivu-form {
    .ivu-form-item-label {
      width: 20%;
      float: left;
      font-size: 14px;
    }
    .ivu-form-item-content {
      width: 80%;
      float: right;
      text-align: left;
    }
    .ivu-btn-primary {
      margin-top: 20px;
      width: 50%;
      float: left;
    }
  }
  .comcss {
    min-height: 300px;
    background-color: #fff;
  }
  .actions {
    font-size: 16px;
    overflow: hidden;
    line-height: 33px;
  }
  .ivu-icon {
    margin-right: 5px;
  }
  .iconfont {
    font-size: 20px !important;
    &.icon-icon_huabanfuben {
      font-size: 24px !important;
    }
  }
  .tbs {
    .ivu-tree {
      ul {
        font-size: 16px;
        text-align: left;
      }
    }
  }
  .iconfont {
    font-size: 20px !important;
    &.icon-icon_huabanfuben {
      font-size: 24px !important;
    }
  }
  .addbtn {
    text-align: left;
    margin-bottom: 15px;
    overflow: hidden;
    .ivu-btn-large {
      font-size: 16px;
    }
    .ivu-select {
      height: 35px;
      width: 160px;
      .ivu-select-selection {
        .ivu-select-selected-value {
          line-height: 35px;
        }
        .ivu-select-placeholder {
          line-height: 35px;
        }
      }
    }
  }
  .dmcons {
    padding: 10px;
  }
  .pages {
    padding: 15px;
    font-size: 14px;
    overflow: hidden;
    background-color: #fff;
    .ivu-page {
      float: right;
    }
  }
  .clearfix {
    overflow: hidden;
  }
  .mr10 {
    margin-right: 10px;
  }
  .mr5 {
    margin-right: 5px;
  }
  .mr20 {
    margin-right: 20px;
  }
  .w20 {
    width: 20%;
  }
  .mrb20 {
    margin-bottom: 20px;
  }
  .fl {
    float: left;
  }
  .fr {
    float: right;
  }
}
</style>
