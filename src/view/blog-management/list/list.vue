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
import { getArticleList, deleteArticle } from '@/api/article'
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
          key: 'gist'
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
      data: [],
      isAlert: false,
      currentItem: null
    }
  },
  mounted() {
    //获取文章列表
    getArticleList().then(res => {
      if (res) {
        const list = this.detalData(res.data)
        this.data = list.reverse()
      }
    })
  },
  methods: {
    detalData(data) {
      return data.map(item => {
        return {
          title: item.title,
          date: item.date,
          gist: item.gist,
          classify: item.category.join('、 '),
          readtimes: item.readtimes || 10,
          _id: item._id
        }
      })
    },
    addArticle() {
      this.$router.push('/editor')
    },
    showArticle(id) {
      //线上地址
    },
    editorArticle(id) {
      this.$router.push('/editor/' + id)
    },
    removeArticle(row, index) {
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
      deleteArticle({ _id: this.currentItem._id })
        .then(res => {
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
        .catch(err => {
          self.isAlert = false
          self.$Message.error({
            top: 250,
            content: '删除失败',
            duration: 2,
            onClose: () => {
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
