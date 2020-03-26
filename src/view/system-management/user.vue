<template>
  <div class="user">
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
            <Button type="success" size="large" @click="addNewUser">+添加新用户</Button>
          </p>
          <Table :columns="column" :data="tabdata" no-data-text="该部门下暂无用户">
            <template slot-scope="{ row, index }" slot="action">
              <Button class="mr10" type="primary" size="small" @click="editorUser(row)">更新</Button>
              <Button type="error" size="small" @click="removeRole(row)">删除</Button>
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
        <div class="adduser" v-show="tk.add">
          <p class="subtitle">添加用户</p>
          <Form ref="saveFrom" :model="from" :rules="rule" @keydown.enter.native="addSubmit">
            <FormItem prop="username" label="用户名">
              <Input v-model="from.username"></Input>
            </FormItem>
            <FormItem prop="pwd" label="密码">
              <Input v-model="from.pwd" type="password"></Input>
            </FormItem>
            <FormItem prop="pwdCheck" label="确认密码">
              <Input v-model="from.pwdCheck" type="password"></Input>
            </FormItem>
            <FormItem prop="policeNum" label="编号">
              <Input v-model="from.policeNum"></Input>
            </FormItem>
            <FormItem prop="roleId" label="角色" v-if="roleListOptions.length">
              <Select v-model="from.roleId" style="width:200px" placeholder="请设置角色">
                <Option
                  v-for="item in roleListOptions"
                  :value="item.id"
                  :key="item.id"
                >{{ item.name }}</Option>
              </Select>
            </FormItem>
            <FormItem>
              <Button @click="addSubmit" type="primary" :loading="tk.loading" long>
                <span v-if="!tk.loading">立即保存</span>
                <span v-else>保存中...</span>
              </Button>
            </FormItem>
          </Form>
        </div>
        <div class="del-user" v-show="tk.del">
          <p class="subtitle">确认删除该用户吗?</p>
          <p>{{ currentUser.username }}</p>
          <p class="dels">
            <Button class="mr10" @click="delSubmit" type="primary">确认</Button>
            <Button @click="closeBtn" type="warning">取消</Button>
          </p>
        </div>
        <div class="pmscnt" v-show="tk.pms">
          <p class="subtitle">用户角色更新</p>
          <div class="cnt">
            <div class="clearfix mrb20">
              <span class="fl mr5">名称：</span>
              <span class="fl">{{ currentUser.username }}</span>
            </div>
            <div class="clearfix mrb20">
              <span class="fl mr5">编号：</span>
              <span class="fl">{{ currentUser.policeNum }}</span>
            </div>
            <div class="clearfix mrb20">
              <span class="fl mr5">角色：</span>
              <Select v-model="from.roleId" style="width:200px;float:left;">
                <Option
                  v-for="item in roleListOptions"
                  :value="item.id"
                  :key="item.id"
                >{{ item.name }}</Option>
              </Select>
            </div>
            <p class="savepms">
              <Button @click="userUpdateSubmit" type="primary" :loading="tk.loading">
                <span v-if="!tk.loading">保存</span>
                <span v-else>保存中...</span>
              </Button>
            </p>
          </div>
        </div>
      </div>
    </Layer>
  </div>
</template>

<script>
import {
  getDepartmentTree,
  addUser,
  getUserList,
  deleteUser,
  getListRoleOptions,
  updateUser
} from "@/api/system";
import Layer from '_c/layer';
import { mapMutations, mapGetters } from "vuex";

//树形节点 设置disabled
export default {
  data() {
    //用户名至少6位
    const userCheck = (rule, value, callback) => {
      if (!value) {
        callback(new Error("用户名不能为空"));
      } else if (value.length < 6) {
        callback(new Error("用户名长度至少为6位"));
      } else {
        callback();
      }
    };
    //密码至少为8位
    const pwdPass = (rule, value, callback) => {
      const reg = /^\w{8,17}$/;
      if (value == "") {
        callback(new Error("请输入密码"));
      } else if (!reg.test(value)) {
        callback(new Error("只能包含字母、数字和下划线，至少8位"));
      } else {
        if (this.from.pwdCheck !== "") {
          this.$refs.saveFrom.validateField("pwdCheck");
        }
        callback();
      }
    };
    //密码再次验证
    const pwdCheck = (rule, value, callback) => {
      const reg = /^\w{8,17}$/;
      if (!value) {
        callback(new Error("请确认密码"));
      } else if (!reg.test(value)) {
        callback(new Error("只能包含字母、数字和下划线，至少8位"));
      } else if (value !== this.from.pwd) {
        callback(new Error("两次密码输入不一致"));
      } else {
        callback();
      }
    };
    //角色验证
    const setRole = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请设置一个角色A"));
      } else {
        callback();
      }
    };
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
      //操作当前用户
      currentUser: {
        name: "",
        id: "",
        description: "",
        permissions: null //当前用户修改后的权限
      },
      //左侧部门列表
      dmlist: [{}],
      //右侧分页用户列表
      tabdata: [],
      column: [
        {
          title: "用户名称",
          key: "username"
        },
        {
          title: "编号",
          key: "policeNum"
        },
        {
          title: "操作",
          slot: "action",
          key: "cz"
        }
      ],
      //部门列表数据总数量
      totalCount: 1,
      //用户添加，表单提交
      from: {
        username: "",
        policeNum: "",
        pwd: "",
        pwdCheck: "",
        roleId: ""
      },
      rule: {
        username: [{ required: true, validator: userCheck, trigger: "blur" }],
        policeNum: [
          { required: true, message: "用户编号不能为空", trigger: "blur" }
        ],
        pwd: [{ required: true, validator: pwdPass, trigger: "blur" }],
        pwdCheck: [{ required: true, validator: pwdCheck, trigger: "blur" }],
        roleId: [{ required: true, validator: setRole, trigger: "change" }]
      },
      //部门可选角色列表
      roleListOptions: []
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
    //根据部门id 来获取角色选项
    getListRole() {
      getListRoleOptions(this.currentDm.id)
        .then(res => {
          let r = res.data;
          if (r.code == 200) {
            const len = this.roleListOptions.length;
            this.roleListOptions.splice(0, len);
            r.data.forEach(m => {
              this.roleListOptions.push(m);
            });
          } else {
          }
        })
        .catch(err => {});
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
        .catch(res => {});
    },
    //切换页面
    changePage(pageNo) {
      this.pageNo = pageNo;
      this.renderList();
    },
    //展现右侧用户列表
    renderList() {
      if (!this.currentDm.name || !this.currentDm.id) return;
      let param = {
        name: this.currentDm.name,
        departmentId: this.currentDm.id,
        pageNo: this.pageNo
      };
      getUserList(param).then(res => {
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
      });
    },
    //当前部门被选择
    selectDepartment(item) {
      // console.log(item, '部门数据')
      if (!item || !item[0]) return;
      this.currentDm.id = item[0].id;
      this.currentDm.name = item[0].title;
      this.renderList();
    },
    /**
     * 接口调取成功响应
     * v  1为用户增加成功  2为用户删除成功 3用户更新角色成功
     */
    upSuccess(v) {
      this.tk.loading = false;
      this.tk.sv = false;
      switch (v) {
        case 1:
          this.tk.add = false;
          for (var k in this.from) {
            this.from[k] = "";
          }
          this.$Message.success({
            content: "用户添加成功",
            duration: 1.5,
            closable: true
          });
          break;
        case 2:
          this.tk.del = false;
          this.$Message.success({
            content: "用户删除成功",
            duration: 1.5,
            closable: true
          });
          break;
        case 3:
          this.tk.pms = false;
          this.$Message.success({
            content: "用户角色更新成功",
            duration: 1.5,
            closable: true
          });
          break;
      }
      if (v !== 3) this.renderList();
    },
    /**
     * v  1为用户增加失败  2为用户删除失败 3用户更新角色失败
     * */
    upError(v) {
      this.tk.loading = false;
      this.tk.sv = false;
      switch (v) {
        case 1:
          this.tk.add = false;
          for (var k in this.from) {
            this.from[k] = "";
          }
          this.$Message.error({
            content: "用户保存失败",
            duration: 1.5,
            closable: true
          });
          break;
        case 2:
          this.tk.del = false;
          this.$Message.error({
            content: "用户删除失败",
            duration: 1.5,
            closable: true
          });
          break;
        case 3:
          this.tk.pms = false;
          this.$Message.error({
            content: "用户角色更新失败",
            duration: 1.5,
            closable: true
          });
          break;
      }
    },
    //添加新用户
    addNewUser() {
      if (!this.currentDm.name) {
        this.$Message.success({
          content: "请选择一个部门",
          duration: 1.5,
          closable: true
        });
        return;
      }
      //弹框提示操作
      this.tk.sv = true;
      this.tk.del = false;
      this.tk.pms = false;
      this.tk.add = true;
      //获取对应部门角色
      this.getListRole();
    },
    //修改用户权限
    editorUser(row) {
      if (!row) return;
      this.currentUser.id = row.id;
      this.currentUser.username = row.username;
      this.currentUser.policeNum = row.policeNum;
      //弹框提示操作
      this.tk.sv = true;
      this.tk.del = false;
      this.tk.add = false;
      this.tk.pms = true;
      //获取所有可选用户权限
      this.getListRole();
    },
    //删除用户
    removeRole(row) {
      if (!row) return;
      this.currentUser.id = row.id;
      this.currentUser.username = row.username;
      this.currentUser.policeNum = row.policeNum;
      //弹框提示操作
      this.tk.sv = true;
      this.tk.del = true;
      this.tk.pms = false;
      this.tk.add = false;
    },
    //删除提交
    delSubmit() {
      if (!this.currentUser.id) return;
      deleteUser(this.currentUser.id)
        .then(res => {
          if (res.data.code == 200) this.upSuccess(2);
          else this.upError(2);
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
            username: this.from.username,
            departmentId: this.currentDm.id,
            policeNum: this.from.policeNum,
            pwd: this.from.pwd,
            roleId: this.from.roleId
          };
          addUser(param)
            .then(res => {
              if (res.data.code == 200) this.upSuccess(1);
              else this.upError(1);
            })
            .catch(err => {
              this.upError(1);
            });
        }
      });
    },
    //用户更新提交
    userUpdateSubmit() {
      if (!this.from.roleId) return;
      let param = {
        id: this.currentUser.id,
        roleId: this.from.roleId
      };
      this.tk.loading = true;
      updateUser(param)
        .then(res => {
          if (res.data.code == 200) this.upSuccess(3);
          else this.upError(3);
        })
        .catch(err => {
          this.upError(3);
        });
    }
  },
  components:{
    Layer
  }
};
</script>

<style lang="less">
.user {
  font-size: 18px;
  text-align: center;
  position: relative;
  .subtable {
    background-color: #fff;
    .ivu-select {
      display: block;
    }
    .subtitle {
      text-align: center;
    }
    .adduser {
      width:440px;
      .ivu-form-item {
        margin-bottom: 40px;
      }
      .ivu-btn {
        background-color: #5cb85c;
        border: none;
      }
      .ivu-form {
        padding:15px 15px 15px 10px;
        .ivu-btn-primary {
          margin-top: 0;
        }
      }
    }
    .del-user {
      width:400px;
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
    .pmscnt {
      width:410px;
      text-align: left;
      font-size:16px;
      text-align: center;
      .cnt {
        padding-left:45px;
      }
      .ivu-tree {
        ul {
          font-size: 16px;
          text-align: left;
        }
      }
      .savepms {
        text-align: left;
        padding: 10px 0 10px 50px;
        .ivu-btn {
           background-color: #5cb85c;
          border: none;
          padding: 5px 30px 6px 30px;
          text-align: center;
        }
      }
    }
    .close {
      position: absolute;
      right: 0;
      top: 5px;
      cursor: pointer;
      z-index: 10;
      color:#fff;
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
  .pr10 {
    padding-right: 10px;
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
