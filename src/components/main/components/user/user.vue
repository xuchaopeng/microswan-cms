<template>
  <div class="user-avator-dropdown">
    <!-- <Icon class="iconfont icon-tuichu" @click="handleClick('logout')"></Icon> -->
    <Dropdown @on-click="handleClick">
      <!-- <Badge :dot="!!messageUnreadCount">
        <Avatar :src="userAvator" />
      </Badge>-->
      <Icon class="iconfont icon-tuichu"></Icon>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <!-- <DropdownItem name="message">
          消息中心<Badge style="margin-left: 10px" :count="messageUnreadCount"></Badge>
        </DropdownItem>-->
        <DropdownItem name="logout">退出登录</DropdownItem>
        <DropdownItem name="changepassword">修改密码</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <Layer v-if="view">
      <div class="sub">
        <Icon class="close" custom="icon iconfont icon-close" size="24" @click="close" />
        <div class="changepassword">
          <p class="title">修改密码</p>
          <div class="change">
            <Form ref="passForm" :model="form" :rules="rule" @keydown.enter.native="changeSubmit">
              <FormItem prop="passward" label="输入新密码">
                <Input v-model="form.passward" type="password"></Input>
              </FormItem>
              <FormItem prop="pwdCheck" label="确认密码">
                <Input v-model="form.pwdCheck" type="password"></Input>
              </FormItem>
              <FormItem>
                <Button @click="changeSubmit" type="primary" :loading="loading" long>保存</Button>
              </FormItem>
            </Form>
          </div>
        </div>
      </div>
    </Layer>
  </div>
</template>

<script>
import "./user.less";
import Layer from "_c/layer";
import { resetPwd } from "@/api/user";
import { mapActions } from "vuex";
export default {
  name: "User",
  data() {
    const checkpass = (rule, value, callback) => {
      const reg = /^\w{8,17}$/;
      if (value == "") {
        callback(new Error("请输入密码"));
      } else if (!reg.test(value)) {
        callback(new Error("只能包含字母、数字和下划线，至少8位"));
      } else {
        if (this.form.pwdCheck !== "") {
          this.$refs.passForm.validateField("pwdCheck");
        }
        callback();
      }
    };
    const checksame = (rule, value, callback) => {
      const reg = /^\w{8,17}$/;
      if (!value) {
        callback(new Error("请确认密码"));
      } else if (!reg.test(value)) {
        callback(new Error("只能包含字母、数字和下划线，至少8位"));
      } else if (value !== this.form.passward) {
        callback(new Error("两次密码输入不一致"));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      view: false,
      form: {
        passward: "",
        pwdCheck:""
      },
      rule: {
        passward: [{ required: true, validator: checkpass, trigger: "blur" }],
        pwdCheck: [{ required: true, validator: checksame, trigger: "blur" }]
      }
    };
  },
  props: {
    userAvator: {
      type: String,
      default: ""
    },
    messageUnreadCount: {
      type: Number,
      default: 0
    }
  },
  methods: {
    ...mapActions(["handleLogOut"]),
    logout() {
      this.handleLogOut().then(() => {
        this.$router.push({
          name: "login"
        });
      });
    },
    message() {
      this.$router.push({
        name: "message_page"
      });
    },
    handleClick(name) {
      switch (name) {
        case "logout":
          this.logout();
          break;
        case "message":
          this.message();
          break;
        case "changepassword":
          this.changepassword();
          break;
      }
    },
    changepassword() {
      this.view = true;
      for(var k in this.form) {
        this.form[k] = '';
      }
    },
    close() {
      this.view = false;
    },
    //密码修改成功
    changesuccess() {
      this.view = false;
      for (var k in this.form) {
        this.form[k] = "";
      }
      this.$Message.success({
        content: "密码修改成功",
        duration: 1.5,
        closable: true
      });
    },
    //密码修改失败
    changeerror(text) {
      this.view = false;
      this.$Message.error({
        content: text || "密码修改失败",
        duration: 1.5,
        closable: true
      });
    },
    changeSubmit() {
      this.$refs["passForm"].validate(valid => {
        if (valid) {
          resetPwd(this.form.passward)
            .then(res => {
              if (res.data.code == 200) this.changesuccess();
              else this.changeerror(res.data.msg);
            })
            .catch(err => {
              this.changeerror();
            });
        }
      });
    }
  },
  components: {
    Layer
  }
};
</script>
