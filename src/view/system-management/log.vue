<template>
  <div class="user">
    <Card>
      <div class="search">
        <Select v-model="selectOperation" style="width:200px;" placeholder="请选择操作">
          <Option v-for="item in operation" :value="item">
            {{ item }}
          </Option>
        </Select>
        <Button class="ml10" type="primary" icon="ios-search" @click="searchLog">搜索</Button>
      </div>
      <Table :columns="column" :data="tabdata" class="comcss"></Table>
      <div class="pages" v-if="totalCount > 10">
        <Page :total="totalCount" show-elevator show-total @on-change="changePage" />
      </div>
    </Card>
  </div>
</template>

<script>
import { getOperation, getLogList } from '@/api/system';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      operation: [],
      selectOperation: '全部',
      totalCount: 1,
      tabdata: [],
      column: [
        {
          title: '用户名',
          key: 'username'
        },
        {
          title: '操作名称',
          key: 'operation'
        },
        {
          title: '操作IP',
          key: 'ip'
        },
        {
          title: '创建时间',
          key: 'createTime'
        },
        {
          title: '内容',
          key: 'content'
        }
      ],
    }
  },
  mounted() {
    this.pageNo = 1;
    this.getActions();
    this.getLogData();
  },
  computed: {
    ...mapGetters(['departmentId'])
  },
  methods: {
    //翻页
    changePage(pageNo) {
      this.pageNo = pageNo;
      this.getLogData();
    },
    //搜索
    searchLog() {
      this.pageNo = 1;
      this.getLogData();
    },
    //获取日志选项
    getActions() {
      getOperation().then(res => {
        if (res.data.code == 200) {
          this.operation = res.data.data;
        }
      }).catch(err => { })
    },
    //获取日志数据
    getLogData() {
      let param = {
        departmentId: this.departmentId,
        operation: this.selectOperation,
        pageNo: this.pageNo
      }
      getLogList(param).then(res => {
        const r = res.data;
        if (r.code == 200 && r.data) {
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
      }).catch(err => { })
    }
  }
}
</script>

<style lang="less" scoped>
.user {
  font-size: 30px;
  text-align: center;
  .search {
    margin-bottom: 20px;
  }
  .comcss {
    min-height: 300px;
  }
  .ml10 {
    margin-left: 20px;
  }
  .pages {
    margin-top: 20px;
    text-align: right;
  }
}
</style>
