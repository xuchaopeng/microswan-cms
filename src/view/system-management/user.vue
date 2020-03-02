<template>
  <div class="user">用户管理 待开发中 HAAH....</div>
</template>

<script>
import { userList } from '@/api/user';
import { mapMutations, mapActions, mapGetters } from 'vuex'
export default {
  data() {
    return {}
  },
  mounted() {
    // this.getUserList();
  },
  computed: {
    ...mapGetters(['departmentId'])
  },
  methods: {
    getUserList(pageNo) {
      if (pageNo) pageNo = 1;
      const p = {
        departmentId: this.departmentId,
        pageNo,
        pageSize: 10
      }
      userList(p).then(res => {
        console.log(res, 'USERLIST');
      })
    }
  }
}
</script>

<style lang="less" scoped>
.user {
  font-size: 30px;
  text-align: center;
}
</style>
