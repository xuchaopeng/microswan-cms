<template>
  <div class="user">
    <Card>
      <p class="addbtn">
        <Button type="success" size="large" @click="addNewRole">+添加新角色</Button>
      </p>
      <div class="list">
        <Table :columns="column" :data="data">
          <template slot-scope="{ row }" slot="classify">
            <strong>{{ row.classify }}</strong>
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <Button class="mr10" type="primary" size="small" @click="editorRole(row.id)">编辑</Button>
            <Button type="error" size="small" @click="removeRole(row, index)">删除</Button>
          </template>
        </Table>
      </div>
      <div class="pages">
        <Page :total="100" show-elevator show-total @on-change="changePage" />
      </div>
    </Card>
  </div>
</template>

<script>
import { getRoleList, getDepartmentTree } from '@/api/system';
import { mapGetters, mapMutations } from 'vuex';
export default {
  data() {
    return {
      pageNo: 1,
      totalCount: 1,
      data: [
        {
          "description": "浦东新区警察局",
          "id": 0,
          "name": "浦东新区"
        },
        {
          "description": "浦东新区警察局",
          "id": 1,
          "name": "浦东新区"
        }
      ],
      column: [
        {
          title: '指挥部',
          key: 'description'
        },
        {
          title: '创建者',
          key: 'name'
        },
        {
          title: '操作',
          slot: 'action',
          key: 'cz'
        }
      ]
    }
  },
  mounted() {
    this.renderList()
  },
  computed: {
    ...mapGetters(['departmentId', 'permissions', 'departmentName'])
  },
  methods: {
    ...mapMutations(['setDepartmentName']),
    getListData(pageNo) {
      this.getName(name => {
        const p = {
          departmentId: this.departmentId,
          name,
          pageNo,
          pageSize: 10
        }
        getRoleList(p).then(res => {
          console.log(res, '角色列表');
        })
      });
    },
    //获取部门名称
    getName(cb) {
      if (this.departmentName) cb(this.departmentName);
      else getDepartmentTree(this.departmentId).then(res => {
        console.log(res, 'iconssssss');
        if (res.status == 200 && res.data) {
          let r = res.data.data;
          const name = r.name ? r.name : '';
          if (name) this.setDepartmentName(name)
          cb(name);
        }
      })
    },
    editorRole() { },
    removeRole() { },
    addNewRole() { },
    changePage(r) { console.log(r); },
    renderList() {
      this.getListData(1);
    }
  }
}
</script>

<style lang="less" scoped>
.user {
  font-size: 16px;
  text-align: center;
  .addbtn {
    text-align: left;
    margin-bottom: 15px;
    .ivu-btn-large {
      font-size: 16px;
    }
  }
  .mr10 {
    margin-right: 10px;
  }
  .list {
    min-height: 200px;
    max-height: 480px;
  }
  .pages {
    overflow: hidden;
    .ivu-page {
      float: right;
    }
  }
}
</style>
