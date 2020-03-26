<template>
  <div class="department">
    <Row :gutter="15">
      <Col span="6">
        <Card class="comcss">
          <div class="actions">
            <span class="fl">
              <Icon custom="icon iconfont icon-bumen" size="24" />部门列表
            </span>
            <span class="fr">
              <!-- <Icon class="p5" custom="icon iconfont icon-bianji" @click="editorDm" size="24" /> -->
              <Icon class="p5" custom="icon iconfont icon-xinzengliebiao" @click="addDm" size="24" />
              <Icon
                class="p5"
                custom="icon iconfont icon-icon_huabanfuben"
                @click="deleteDm"
                size="24"
              />
            </span>
          </div>
          <div class="tbs">
            <Tree :data="dmlist" @on-select-change="selectDepartment"></Tree>
          </div>
        </Card>
      </Col>
      <Col span="18">
        <div class="dmcons comcss">
          <Table :columns="column" :data="tabdata" no-data-text="该部门下暂无数据"></Table>
          <div class="pages" v-if="totalCount > 10">
            <Page :total="totalCount" show-elevator show-total @on-change="changePage" />
          </div>
        </div>
      </Col>
    </Row>
    <Layer v-if="tk.sv">
      <div class="subtable">
        <Icon class="close" custom="icon iconfont icon-close" size="24" @click="closeBtn" />
        <div class="add-department" v-show="tk.add">
          <p class="subtitle">添加部门</p>
          <Form ref="saveFrom" :model="from" :rules="rule" @keydown.enter.native="saveSubmit">
            <FormItem prop="name" label="部门名称">
              <Input v-model="from.name"></Input>
            </FormItem>
            <FormItem>
              <Button @click="saveSubmit" type="primary" :loading="tk.loading" long>
                <span v-if="!tk.loading">立即保存</span>
                <span v-else>保存中...</span>
              </Button>
            </FormItem>
          </Form>
        </div>
        <div class="del-department" v-show="tk.del">
          <p class="subtitle">确认删除该部门吗?</p>
          <p>{{ currentDm.name }}</p>
          <p class="dels">
            <Button class="mr10" @click="delSubmit" type="primary">确认</Button>
            <Button @click="closeBtn" type="warning">取消</Button>
          </p>
        </div>
      </div>
    </Layer>
  </div>
</template>

<script>
import {
  getDepartmentTree,
  addDepartment,
  delDepartment,
  getDepartmentList
} from "@/api/system";
import { mapMutations, mapGetters } from "vuex";
import Layer from '_c/layer';
//树形节点 设置disabled
export default {
  data() {
    return {
      //弹框显示、关闭
      tk: {
        sv: "",
        add: "",
        editor: "",
        del: "",
        loading: false
      },
      //当前选中部门
      currentDm: {
        name: "",
        id: ""
      },
      //左侧部门列表
      dmlist: [{}],
      //右侧分页部门列表
      tabdata: [],
      column: [
        {
          title: "部门名称",
          key: "name"
        },
        {
          title: "创建时间",
          key: "createTime"
        },
        {
          title: "更新时间",
          key: "updateTime"
        }
      ],
      totalCount: 1, //部门列表数据总数量
      //表单提交
      from: {
        name: ""
      },
      rule: {
        name: { required: true, message: "部门名称不能为空", trigger: "blur" }
      }
    };
  },
  mounted() {
    this.getTreeData();
  },
  computed: {
    ...mapGetters(["departmentId", "departmentList"])
  },
  methods: {
    ...mapMutations(["setDepartmentList"]),
    //关闭小编辑弹窗
    closeBtn() {
      this.tk.sv = false;
    },
    //更新部门树数据
    upDmList(a) {
      //如果用户当前未选中任何部门，这里默认为最高级部门
      if (!this.currentDm.id) this.currentDm.id = a.id;
      let index = 1;
      //渲染部门树数据
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
    //获取部门树数据
    getTreeData() {
      getDepartmentTree(this.departmentId)
        .then(res => {
          let data = null;
          const r = res.data;
          if (r.code == 200 && r.data) {
            data = r.data;
            let list = [data];
            this.upDmList(list);
            this.setDepartmentList(list);
          }
        })
        .catch(res => {});
    },
    /**
     * v  1为部门更新成功  2为删除成功 3为编辑成功
     */
    upSuccess(v) {
      if (v == 1) {
        this.tk.loading = false;
        this.tk.sv = false;
        this.tk.add = false;
        this.from.name = "";
        this.$Message.success({
          content: "部门保存成功",
          duration: 1.5,
          closable: true
        });
      }
      if (v == 2) {
        this.tk.sv = false;
        this.tk.del = false;
        this.$Message.success({
          content: "部门删除成功",
          duration: 1.5,
          closable: true
        });
      }
      this.getTreeData(); //更新数据
    },
    /**
     * v  1为部门更新失败  2为删除失败 3为编辑失败
     */
    upError(v) {
      if (v == 1) {
        this.tk.loading = false;
        this.tk.sv = false;
        this.tk.add = false;
        this.from.name = "";
        this.$Message.error({
          content: "部门保存失败",
          duration: 1.5,
          closable: true
        });
      }

      if (v == 2) {
        this.tk.sv = false;
        this.tk.del = false;
        this.$Message.error({
          content: "部门删除失败",
          duration: 1.5,
          closable: true
        });
      }
    },
    //切换页面
    changePage(pageNo) {
      this.pageNo = pageNo;
      this.renderList();
    },
    //展现右侧部门列表
    renderList() {
      if (!this.currentDm.name || !this.currentDm.id) return;
      let param = {
        name: this.currentDm.name,
        departmentId: this.currentDm.id,
        pageNo: this.pageNo
      };
      getDepartmentList(param).then(res => {
        let r = res.data;
        if (r.code == 200) {
          const page = r.data.pageContent;
          const len = this.tabdata.length;
          if (page && page.length) {
            this.tabdata.splice(0, len);
            page.forEach(em => {
              this.tabdata.push(em);
            });
            this.totalCount = r.data.totalCount;
          }
        }
      });
    },
    //当前部门被选择
    selectDepartment(item) {
      if (!item || !item[0]) return;
      this.currentDm.id = item[0].id;
      this.currentDm.name = item[0].title;
      this.renderList();
    },
    //编辑部门
    editorDm() {
      console.log("编辑部门");
    },
    //添加部门
    addDm() {
      if (!this.currentDm.name) {
        this.$Message.success({
          content: "请选择一个部门",
          duration: 1.5,
          closable: true
        });
        return;
      }
      this.tk.sv = true;
      this.tk.del = false;
      this.tk.add = true;
    },
    //删除部门
    deleteDm() {
      if (!this.currentDm.name) {
        this.$Message.success({
          content: "请选择一个部门",
          duration: 1.5,
          closable: true
        });
        return;
      }
      this.tk.sv = true;
      this.tk.add = false;
      this.tk.del = true;
    },
    //删除提交
    delSubmit() {
      if (!this.currentDm.id) return;
      delDepartment(this.currentDm.id)
        .then(res => {
          if (res.data.code == 200) this.upSuccess(2);
          else this.upError(2);
        })
        .catch(err => {
          this.upError(2);
        });
    },
    //保存提交
    saveSubmit() {
      this.$refs["saveFrom"].validate(valid => {
        if (valid) {
          this.tk.loading = true;
          let param = {
            name: this.from.name,
            parentId: this.currentDm.id
          };
          addDepartment(param)
            .then(res => {
              if (res.data.code == 200) this.upSuccess(1);
              else this.upError(1);
            })
            .catch(err => {
              this.upError(1);
            });
        }
      });
    }
  },
  components:{
    Layer
  }
};
</script>

<style lang="less">
.department {
  font-size: 18px;
  text-align: center;
  position: relative;
  .subtable {
    background-color: #fff;
    .icon-close {
      color:#fff;
    }
    .add-department {
      width: 440px;
      .ivu-form {
        padding:20px 15px;
      }
      .ivu-btn {
        background-color: #5cb85c;
        border: none;
      }
    }
    .del-department {
      width:400px;
      .mr10 {
        margin-right:10px;
      }
      .ivu-btn {
        background-color: #5cb85c;
        border: none;
        padding: 5px 25px 6px 25px;
        text-align: center;
        &.ivu-btn-warning {
          background-color: #ff9900;
        }
      }
    }
    .subtitle {
      position: relative;
      text-align: center;
      color:#fff;
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
  .actions {
    font-size: 16px;
    overflow: hidden;
    line-height: 33px;
  }
  .ivu-icon {
    margin-right: 5px;
  }
  .mr5 {
    margin-right: 5px;
  }
  .fl {
    float: left;
  }
  .fr {
    float: right;
  }
  .p5 {
    padding: 5px;
    cursor: pointer;
  }
  .tl {
    text-align: left;
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
}
</style>
