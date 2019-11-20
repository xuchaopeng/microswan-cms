<template>
  <div class="articlelist">
    <Card>
      <p>
        <Button type="success" size="large" @click="addArticle">+新建</Button>
      </p>
      <div class="list">
        <Table border :columns="column" :data="data">
          <template slot-scope="{ row }" slot="classify">
            <strong>{{ row.classify }}</strong>
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <Button class="mr5" type="success" size="small" @click="showArticle(row._id)">查看</Button>
            <Button class="mr5" type="primary" size="small" @click="editorArticle(row._id)">编辑</Button>
            <Button type="error" size="small" @click="removeArticle(row, index)">删除</Button>
          </template>
        </Table>
      </div>
      <Alert type="warning" show-icon v-if="isAlert">
        此操作将永久删除该文章, 是否继续?
        <template slot="desc">
          <Button type="info" class="mr10" size="small" @click="continueDelete">继续</Button>
          <Button size="small" @click="cancelDelete">取消</Button>
        </template>
      </Alert>
    </Card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      column: [
        {
          title: '标题',
          key: 'title'
        },
        {
          title: '日期',
          key: 'date'
        },
        {
          title: '摘要',
          key: 'sum'
        },
        {
          title: '分类',
          slot: 'classify',
          align: 'center'
        },
        {
          title: '浏览次数',
          key: 'readtimes'
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center'
        }
      ],
      data: [
        {
          title: 'John Brown',
          date: '2019-11-19',
          sum: '明世隐二技能的冷却',
          classify: 'Youxi',
          readtimes: '10',
          _id: 'abcsf23'
        },
        {
          title: 'Hi Gilrl',
          date: '2019-11-19',
          sum: '刘禅的萎缩',
          classify: 'Youxi',
          readtimes: '10',
          _id: 'abcsf24'
        },
        {
          title: 'WZJ',
          date: '2018-08-19',
          sum: '团控技能的重要性',
          classify: 'Youxi',
          readtimes: '10',
          _id: 'abcsf25'
        },
        {
          title: 'HUli',
          date: '2018-06-01',
          sum: '阿狸的爆发，吓死你',
          classify: 'Youxi',
          readtimes: '10',
          _id: 'abcsf26'
        }
      ],
      isAlert: false,
      currentItem: null
    }
  },
  methods: {
    addArticle() {},
    showArticle(id) {
      //线上地址
    },
    editorArticle(id) {
      this.$router.push('/editor/' + id)
    },
    removeArticle(index, row) {
      if (this.isAlert) return
      this.isAlert = true
      this.currentItem = Object.assign({}, row, { index })
    },
    cancelDelete() {
      this.isAlert = false
      this.currentItem = null
    },
    continueDelete() {
      const self = this
      setTimeout(function() {
        self.isAlert = false
        self.$Message.success({
          top: 250,
          content: '成功删除',
          duration: 2,
          onClose: () => {
            self.data.splice(self.currentItem.index, 1)
            self.currentItem = null
          }
        })
      })
    }
  }
}
</script>

<style lang="less">
.articlelist {
  .list {
    margin-top: 30px;
  }
  .mr5 {
    margin-right: 5px;
  }
  .mr10 {
    margin-right: 10px;
  }
  .ivu-alert-with-desc {
    position: absolute;
    top: 10px;
    left: 50%;
    margin-left: -155px;
    width: 310px;
    height: 80px;
    padding-left: 50px;
    .ivu-alert-icon {
      left: 14px;
    }
    .ivu-alert-desc {
      padding-top: 10px;
    }
  }
}
</style>
