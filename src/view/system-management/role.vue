<template>
  <div class="role">
    <Row :gutter="15">
      <Col span="6">
      <Card class="comcss">
        <div class="actions">
          <span class="fl">
            <Icon custom="icon iconfont icon-bumen" size="24" />部门列表
          </span>
        </div>
        <div class="tbs">
          <Tree :data="dmlist" @on-select-change="selectDepartment"></Tree>
        </div>
      </Card>
      </Col>
      <Col span="18">
      <div class="dmcons comcss">
        <p class="addbtn">
          <Button type="success" size="large" @click="addNewRole">+添加新角色</Button>
        </p>
        <Table :loading="loading" :columns="column" :data="tabdata" no-data-text="该部门下暂无角色">
          <template slot-scope="{ row, index }" slot="action">
            <Button class="mr10" type="primary" size="small" @click="editorDis(row)" :disabled="!viewaccesswrite">编辑描述</Button>
            <Button class="mr10" type="primary" size="small" @click="editorRole(row)" :disabled="!viewaccesswrite">修改权限</Button>
            <Button type="error" size="small" @click="removeRole(row)" :disabled="!viewaccesswrite">删除</Button>
          </template>
        </Table>
        <div class="pages" v-if="totalCount > 10">
          <Page :total="totalCount" show-elevator show-total @on-change="changePage" />
        </div>
      </div>
      </Col>
    </Row>
    <Layer v-if="tk.sv">
      <div class="subtable">
        <Icon class="close" custom="icon iconfont icon-close" size="24" @click="closeBtn" />
        <div class="add-role" v-show="tk.add">
          <p class="subtitle">添加角色</p>
          <Form ref="saveFrom" :model="from" :rules="rule" @keydown.enter.native="addSubmit">
            <FormItem prop="name" label="角色名称">
              <Input v-model="from.name"></Input>
            </FormItem>
            <FormItem prop="description" label="角色描述">
              <Input v-model="from.description"></Input>
            </FormItem>
            <FormItem>
              <Button @click="addSubmit" type="primary" :loading="tk.loading" long>
                <span v-if="!tk.loading">立即保存</span>
                <span v-else>保存中...</span>
              </Button>
            </FormItem>
          </Form>
        </div>
        <div class="del-role" v-show="tk.del">
          <p class="subtitle">确认删除该角色吗?</p>
          <p>{{ currentRole.name }}</p>
          <p class="dels">
            <Button class="mr10" @click="delSubmit" type="primary">确认</Button>
            <Button @click="closeBtn" type="warning">取消</Button>
          </p>
        </div>
        <div class="discnt" v-show="tk.dis">
          <p class="subtitle">编辑描述</p>
          <Form ref="editorFrom" :model="editorFrom" :rules="editorRule" @keydown.enter.native="editorSubmit">
            <div class="clearfix mrb20">
              <span class="fl mr5">名称：</span>
              <span class="fl">{{ currentRole.name }}</span>
            </div>
            <FormItem prop="name" label="描述：">
              <Input v-model="editorFrom.description" type="textarea"></Input>
            </FormItem>
            <FormItem>
              <Button @click="editorSubmit" type="primary" :loading="tk.loading" long>
                <span v-if="!tk.loading">立即保存</span>
                <span v-else>保存中...</span>
              </Button>
            </FormItem>
          </Form>
        </div>
        <div class="pmscnt" v-show="tk.pms">
          <p class="subtitle">修改权限</p>
          <div class="clearfix pd10 mrb10">
            <span class="fl mr5">名称：</span>
            <span class="fl">{{ currentRole.name }}</span>
          </div>
          <div class="clearfix pd10">
            <span class="fl">权限：</span>
            <div class="pmist fl">
              <Tree class="fl" :data="permissionsList" @on-check-change="checkPermission" show-checkbox></Tree>
            </div>
          </div>
          <p class="savepms">
            <Button @click="pmsSubmit" type="primary" :loading="tk.loading">
              <span v-if="!tk.loading">保存</span>
              <span v-else>保存中...</span>
            </Button>
          </p>
        </div>
      </div>
    </Layer>
  </div>
</template>

<script>
import {
  getDepartmentTree,
  addRole,
  getRoleList,
  deleteRole,
  showPermissions,
  assignRole,
  updateRole
} from "@/api/system";
import Layer from '_c/layer';
import { mapMutations, mapGetters } from "vuex";
import { hasOneOf } from "@/libs/tools";
//树形节点 设置disabled
export default {
  data() {
    return {
      loading: false,
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
      //操作当前角色
      currentRole: {
        name: "",
        id: "",
        description: "",
        permissions: null //当前角色修改后的权限
      },
      //左侧部门列表
      dmlist: [{}],
      //右侧分页部门列表
      tabdata: [],
      column: [
        {
          title: "角色名称",
          key: "name"
        },
        {
          title: "描述",
          key: "description"
        },
        {
          title: "操作",
          slot: "action",
          key: "cz"
        }
      ],
      //部门列表数据总数量
      totalCount: 1,
      //角色添加，表单提交
      from: {
        name: "",
        description: ""
      },
      rule: {
        name: { required: true, message: "角色名称不能为空", trigger: "blur" },
        description: { required: false }
      },
      //角色描述编辑，表单提交
      editorFrom: {
        name: "",
        description: ""
      },
      editorRule: {
        name: { required: false, trigger: "blur" },
        permissions: { required: false, trigger: "blur" }
      },
      //角色权限编辑
      permissionsList: []
    };
  },
  mounted() {
    this.getTreeData();
  },
  computed: {
    ...mapGetters(["departmentId", "departmentList", 'permissions']),
    access() {
      return this.$store.state.user.permissions
    },
    viewaccessread() {
      return hasOneOf(['role:read'], this.access)
    },
    viewaccesswrite() {
      return hasOneOf(['role:write'], this.access)
    }
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
    //更新权限树数据
    upPmsData(a) {
      let obj = {
        title: "权限设置",
        expand: true,
        disabled: true,
        children: []
      };
      a.forEach(em => {
        let e = {};
        e.title = em.groupName;
        e.group = 1;
        e.children = [];
        if (em.permissionVOS && em.permissionVOS.length) {
          em.permissionVOS.forEach(pm => {
            e.children.push({
              title: pm.name,
              expand: true,
              id: pm.id,
              checked: pm.checked
            });
          });
        }
        if (e.children.length == 0) e.disabled = true;
        obj.children.push(e);
      });
      this.permissionsList.pop();
      this.permissionsList.push(obj);
    },
    //获取部门树数据
    getTreeData() {
      if (this.departmentList && this.departmentList.length) {
        this.upDmList(this.departmentList);
        return;
      }
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
        .catch(res => { });
    },
    //切换页面
    changePage(pageNo) {
      this.pageNo = pageNo;
      this.renderList();
    },
    //展现右侧角色列表
    renderList() {
      if (!this.currentDm.name || !this.currentDm.id) return;
      let param = {
        name: this.currentDm.name,
        departmentId: this.currentDm.id,
        pageNo: this.pageNo
      };
      this.loading = true;
      getRoleList(param).then(res => {
        let r = res.data;
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
        this.loading = false;
      }).catch(err => { this.loading = false; })
    },
    //当前部门被选择
    selectDepartment(item) {
      if (!item || !item[0]) return;
      this.currentDm.id = item[0].id;
      this.currentDm.name = item[0].title;
      this.renderList();
    },
    //获取角色权限数组
    getPermissionsData() {
      const id = this.currentRole.id;
      showPermissions(id).then(res => {
        let r = res.data;
        if (r.code == 200) {
          this.upPmsData(r.data);
        }
      });
    },
    //修改权限
    checkPermission(em, ary) {
      let pms = [];
      em.forEach(m => {
        if (typeof m.id !== "undefined") pms.push(m.id);
      });
      this.currentRole.permissions = pms;
    },
    /**
     * 接口调取成功响应
     * v  1为角色增加成功  2为角色删除成功 3为角色编辑成功 4权限设置成功
     */
    upSuccess(v) {
      this.tk.loading = false;
      this.tk.sv = false;
      switch (v) {
        case 1:
          this.tk.add = false;
          this.from.name = "";
          this.from.description = "";
          this.$Message.success({
            content: "角色添加成功",
            duration: 1.5,
            closable: true
          });
          break;
        case 2:
          this.tk.del = false;
          this.$Message.success({
            content: "角色删除成功",
            duration: 1.5,
            closable: true
          });
          break;
        case 3:
          this.tk.dis = false;
          this.$Message.success({
            content: "角色描述编辑成功",
            duration: 1.5,
            closable: true
          });
        case 4:
          this.tk.pms = false;
          this.currentRole.permissions = "";
          this.$Message.success({
            content: "权限设置成功",
            duration: 1.5,
            closable: true
          });
          break;
      }
      if (v !== 4) this.renderList();
    },
    /**
     * v  1为角色增加失败  2为角色删除失败 3为角色编辑失败 4权限设置失败
     */
    upError(v, text) {
      this.tk.loading = false;
      this.tk.sv = false;
      switch (v) {
        case 1:
          this.tk.add = false;
          this.from.name = "";
          this.from.description = "";
          this.$Message.error({
            content: "角色保存失败",
            duration: 1.5,
            closable: true
          });
          break;
        case 2:
          this.tk.del = false;
          this.$Message.error({
            content: "角色删除失败",
            duration: 1.5,
            closable: true
          });
          break;
        case 3:
          this.tk.dis = false;
          this.$Message.error({
            content: "角色描述编辑失败",
            duration: 1.5,
            closable: true
          });
          break;
        case 4:
          this.tk.pms = false;
          this.currentRole.permissions = "";
          this.$Message.error({
            content: "权限设置失败",
            duration: 1.5,
            closable: true
          });
          break;
      }
    },
    //添加新角色
    addNewRole() {
      if (!this.currentDm.name) {
        this.$Message.success({
          content: "请选择一个部门",
          duration: 1.5,
          closable: true
        });
        return;
      }
      for (var k in this.from) {
        this.from[k] = '';
      }
      //弹框提示操作
      this.tk.sv = true;
      this.tk.del = false;
      this.tk.pms = false;
      this.tk.add = true;
      this.tk.dis = false;
    },
    //修改角色权限
    editorRole(row) {
      if (!row) return;
      this.currentRole.id = row.id;
      this.currentRole.name = row.name;
      this.currentRole.description = row.description;
      //弹框提示操作
      this.tk.sv = true;
      this.tk.del = false;
      this.tk.add = false;
      this.tk.dis = false;
      this.tk.pms = true;
      //获取所有可选角色权限
      this.getPermissionsData();
    },
    //修改角色描述
    editorDis(row) {
      if (!row) return;
      this.currentRole.id = row.id;
      this.currentRole.name = row.name;
      this.currentRole.description = row.description;
      this.editorFrom.description = row.description;
      //弹框提示操作
      this.tk.sv = true;
      this.tk.del = false;
      this.tk.add = false;
      this.tk.pms = false;
      this.tk.dis = true;
    },
    //删除角色
    removeRole(row) {
      if (!row) return;
      this.currentRole.id = row.id;
      this.currentRole.name = row.name;
      this.currentRole.description = row.description;
      //弹框提示操作
      this.tk.sv = true;
      this.tk.del = true;
      this.tk.pms = false;
      this.tk.add = false;
      this.tk.dis = false;
    },

    //删除提交
    delSubmit() {
      if (!this.currentRole.id) return;
      deleteRole(this.currentRole.id)
        .then(res => {
          if (res.data.code == 200) this.upSuccess(2);
          else this.upError(2, res.data.msg);
        })
        .catch(err => {
          this.upError(2);
        });
    },
    //保存提交
    addSubmit() {
      this.$refs["saveFrom"].validate(valid => {
        if (valid) {
          this.tk.loading = true;
          let param = {
            name: this.from.name,
            departmentId: this.currentDm.id,
            description: this.from.description
          };
          addRole(param)
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
    //修改提交
    editorSubmit() {
      if (!this.currentRole.id) return;
      let param = {
        id: this.currentRole.id,
        description: this.editorFrom.description
      };
      updateRole(param)
        .then(res => {
          if (res.data.code == 200) this.upSuccess(3);
          else this.upError(3, res.data.msg);
        })
        .catch(er => {
          this.upError(3);
        });
    },
    //权限提交 权限即改动必位数组
    pmsSubmit() {
      if (!this.currentRole.id || !this.currentRole.permissions) return;
      let param = {
        id: this.currentRole.id,
        permissions: this.currentRole.permissions
      };
      this.tk.loading = true;
      assignRole(param)
        .then(res => {
          if (res.data.code == 200) this.upSuccess(4);
          else this.upError(4, res.data.msg);
        })
        .catch(err => {
          this.upError(4);
        });
    }
  },
  components: {
    Layer
  }
};
</script>

<style lang="less">
.role {
  font-size: 18px;
  text-align: center;
  position: relative;
  .subtable {
    background-color: #fff;
    .add-role {
      width: 440px;
      .ivu-form {
        padding: 20px 15px;
      }
      .ivu-btn {
        background-color: #5cb85c;
        border: none;
      }
    }
    .subtitle {
      text-align: center;
    }
    .pmscnt {
      text-align: left;
      font-size: 16px;
      .ivu-tree {
        ul {
          font-size: 16px;
          text-align: left;
        }
      }
      .pd10 {
        padding: 0 15px;
      }
      .pmist {
        width: 300px;
        min-height: 235px;
        overflow-y: scroll;
        background: #f4f4f4;
        border: 1px solid #dfdfdfcc;
      }
      .savepms {
        padding: 20px 0px 10px 65px;
        .ivu-btn {
          padding: 5px 25px 6px 25px;
          background-color: #5cb85c;
          border: none;
        }
      }
    }
    .discnt {
      width: 410px;
      text-align: left;
      font-size: 16px;
      .ivu-form {
        padding: 20px 10px 20px 20px;
        .ivu-form-item-label {
          width: auto;
          font-size: 16px;
          padding-right: 5px;
        }
      }
      .ivu-btn {
        background-color: #5cb85c;
        border: none;
        margin-left: 50px;
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
      color: #fff;
    }
    .del-role {
      width: 350px;
      .dels {
        padding: 20px 0;
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
    }
  }
  .addbtn {
    text-align: left;
    margin-bottom: 15px;
    .ivu-btn-large {
      font-size: 16px;
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
  .dmcons {
    padding: 10px;
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
  .mr10 {
    margin-right: 10px;
  }
  .mr5 {
    margin-right: 5px;
  }
  .mrb10 {
    margin-bottom: 10px;
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
  .p5 {
    padding: 5px;
    cursor: pointer;
  }

  .tl {
    text-align: left;
  }
  .clearfix {
    overflow: hidden;
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
