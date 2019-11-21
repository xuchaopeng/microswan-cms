<template>
  <div class="edit_wrap">
    <Card>
      <p>
        <span class="goback" @click="goBack">
          <Icon type="ios-arrow-back" size="24" />返回
        </span>
      </p>
      <div class="com_sub">
        <h3>文章标题</h3>
        <Input v-model="title" placeholder="请输入标题" style="width:600px" />
      </div>

      <div class="com_sub">
        <h3>分类</h3>
        <CheckboxGroup v-model="category" size="large">
          <Checkbox v-for="category in categorys" :label="category" :key="category">{{category}}</Checkbox>
        </CheckboxGroup>
      </div>

      <div class="com_sub">
        <h3>简介</h3>
        <Input
          v-model="gist"
          placeholder="请输入简介"
          type="textarea"
          :autosize="{minRows: 2,maxRows: 5}"
        ></Input>
      </div>

      <div class="com_sub">
        <h3>内容 (Markdown编辑器)</h3>
        <div class="markdown">
          <mavon-editor v-model="content" />
        </div>
      </div>

      <div class="com_save">
        <Button type="success" size="large" @click="updateArticle">更新</Button>
      </div>
    </Card>
  </div>
</template>

<script>
import { getArticleDetail, updateArticleDetail } from '@/api/article'
export default {
  name: 'editor',
  data() {
    return {
      title: '',
      date: '',
      gist: '',
      content: '',
      category: [],
      categorys: [
        'JavaScript',
        'ES6',
        'jQuery',
        'css',
        'ajax',
        'http',
        'https',
        'websocket',
        'apache',
        'Vue',
        'react',
        'react-native',
        'android',
        'node',
        'mongo',
        'CentOS',
        'webpack',
        'NW.js',
        'Electron',
        'easyUI',
        'ECharts',
        'wx',
        'HBuilder'
      ]
    }
  },
  mounted() {
    const self = this
    if (this.$route.params.id) {
      getArticleDetail({ id: this.$route.params.id })
        .then(res => {
          if (res.status == 200) self.initArticle(res.data)
        })
        .catch(err => {})
    }
  },
  methods: {
    getDate() {
      let mydate, y, m, d, hh, mm, ss
      mydate = new Date()
      y = mydate.getFullYear()
      m = mydate.getMonth() + 1
      d = mydate.getDate()
      hh = mydate.getHours()
      mm = mydate.getMinutes()
      ss = mydate.getSeconds()
      if (m < 10) m = '0' + m
      if (d < 10) d = '0' + d
      if (hh < 10) hh = '0' + hh
      if (mm < 10) mm = '0' + mm
      if (ss < 10) ss = '0' + ss
      this.date = y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    },
    updateArticle() {
      const self = this
      let param = {
        _id: this.$route.params.id,
        title: this.title,
        date: this.date,
        category: this.category,
        gist: this.gist,
        content: this.content
      }
      if (param._id) {
        updateArticleDetail(param)
          .then(res => {
            self.$Message.success({
              top: 500,
              content: '文章更新成功',
              duration: 2
            })
          })
          .catch(err => {
            self.$Message.error({
              top: 500,
              content: '文章更新失败',
              duration: 2
            })
          })
      }
    },
    goBack() {
      this.$router.go(-1)
    },
    initArticle(article) {
      this.title = article.title
      this.date = article.date
      this.content = article.content
      this.gist = article.gist
      this.category = article.category
    }
  }
}
</script>

<style lang="less" scoped>
.edit_wrap {
  width: 100%;
  height: auto;
  .com_sub {
    h3 {
      margin: 15px 0;
    }
  }
  .goback {
    font-size: 16px;
    cursor: pointer;
    color: #2d8cf0;
  }
  .ivu-checkbox-group-item {
    margin: 10px;
    font-size: 16px;
  }
  .ivu-icon-ios-arrow-back {
    color: #2d8cf0;
  }
  .com_save {
    margin: 20px 0;
  }
}
</style>
