<style lang="less">
@import "./login.less";
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="社区微卡口管理系统" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <p class="login-tip">输入用户名和密码</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from "_c/login-form";
import { mapActions } from "vuex";
export default {
  components: {
    LoginForm
  },
  methods: {
    ...mapActions(["handleLogin"]), //getUserInfo
    handleSubmit({ userName, password }) {
      this.handleLogin({ userName, password })
        .then(res => {
          // this.getUserInfo().then(res => {
          this.$router.push({
            name: this.$config.homeName
          });
          // })
        })
        .catch(err => {
          this.$Message.warning({
            top: 250,
            content: "用户名或密码不对",
            duration: 2
          });
        });
    }
  }
};
</script>

<style></style>
