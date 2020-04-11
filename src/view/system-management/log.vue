<template>
  <div class="log">
    <Row :gutter="15">
      <Col span="6">
        <Card class="comcss bmlist">
          <div class="actions">
            <span class="fl">
              <Icon custom="icon iconfont icon-bumen" size="24" />部门列表
            </span>
          </div>
          <div class="tables">
            <Tree :data="dmlist" @on-select-change="selectDepartment"></Tree>
          </div>
        </Card>
      </Col>
      <Col span="18">
        <div class="dmcons comcss">
          <div class="search">
            <Select
              v-model="selectOperation"
              style="width:200px;"
              placeholder="请选择操作"
            >
              <Option v-for="item in operation" :value="item">
                {{ item }}
              </Option>
            </Select>
            <Button
              class="ml10"
              type="primary"
              icon="ios-search"
              @click="searchLog"
              >搜索</Button
            >
          </div>
          <Table
            :columns="column"
            :data="tabdata"
            class="comcss"
            no-data-text="暂无数据"
          ></Table>
          <div class="pages" v-if="totalCount > 10">
            <Page
              :total="totalCount"
              show-elevator
              show-total
              @on-change="changePage"
            />
          </div>
        </div>
      </Col>
    </Row>
  </div>
</template>

<script>
import { getDepartmentTree, getOperation, getLogList } from "@/api/system";
import { mapGetters, mapMutations } from "vuex";
export default {
  data() {
    return {
      //当前选中部门
      currentDm: {
        name: "",
        id: ""
      },
      //左侧部门列表
      dmlist: [{}],
      operation: [],
      selectOperation: "全部",
      totalCount: 1,
      tabdata: [],
      column: [
        {
          title: "用户名",
          key: "username"
        },
        {
          title: "操作名称",
          key: "operation"
        },
        {
          title: "操作IP",
          key: "ip"
        },
        {
          title: "创建时间",
          key: "createTime"
        },
        {
          title: "内容",
          key: "content"
        }
      ]
    };
  },
  mounted() {
    this.pageNo = 1;
    this.getTreeData();
    this.getActions();
  },
  computed: {
    ...mapGetters(["departmentId", "departmentList"])
  },
  methods: {
    ...mapMutations(["setDepartmentList"]),
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
    //当前部门被选择
    selectDepartment(item) {
      if (!item || !item[0]) return;
      this.currentDm.id = item[0].id;
      this.currentDm.name = item[0].title;
    },
    //翻页
    changePage(pageNo) {
      this.pageNo = pageNo;
      this.getLogData();
    },
    //搜索
    searchLog() {
      if (!this.currentDm.name) {
        this.$Message.success({
          content: "请选择一个部门",
          duration: 1.5,
          closable: true
        });
        return;
      }
      if (!this.selectOperation) {
        this.$Message.success({
          content: "请选择日志查询操作",
          duration: 1.5,
          closable: true
        });
        return;
      }
      this.pageNo = 1;
      this.getLogData();
    },
    //获取日志选项
    getActions() {
      getOperation()
        .then(res => {
          if (res.data.code == 200) {
            this.operation = res.data.data;
          }
        })
        .catch(err => {});
    },
    //获取日志数据
    getLogData() {
      let param = {
        departmentId: this.departmentId,
        operation: this.selectOperation,
        pageNo: this.pageNo
      };
      getLogList(param)
        .then(res => {
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
        })
        .catch(err => {});
    }
  }
};
</script>

<style lang="less">
.log {
  font-size: 30px;
  text-align: center;
  .search {
    margin-bottom: 20px;
  }
  .comcss {
    min-height: 300px;
    background-color: #fff;
  }
  .bmlist {
    min-height: 385px;
  }
  .ml10 {
    margin-left: 20px;
  }
  .dmcons {
    padding: 10px;
  }
  .actions {
    font-size: 16px;
    overflow: hidden;
    line-height: 33px;
  }
  .tables {
    .ivu-tree {
      ul {
        font-size: 16px;
        text-align: left;
      }
    }
  }
  .ivu-icon {
    margin-right: 5px;
  }
  .pages {
    margin-top: 20px;
    padding: 15px;
    text-align: right;
    font-size: 14px;
    overflow: hidden;
    background-color: #fff;
    .ivu-page {
      float: right;
    }
  }
  .fl {
    float: left;
  }
}
</style>
