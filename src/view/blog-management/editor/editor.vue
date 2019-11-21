<template>
  <div class="edit_wrap">
    <Card>
      <div class="com_sub">
        <h3>标题</h3>
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
        <Button type="success" size="large" @click="saveDate">保存</Button>
      </div>
    </Card>
  </div>
</template>

<script>
import { saveArticle } from '@/api/article'
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
  mounted() {},
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
    saveDate() {
      let self = this
      this.getDate()
      let param = {
        title: this.title,
        date: this.date,
        category: this.category,
        gist: this.gist,
        content: this.content
      }
      saveArticle(param)
        .then(res => {
          if (res.data.status == 1) {
            self.$Message.success({
              top: 500,
              content: '发表文章成功',
              duration: 1,
              onClose: () => {
                self.refreshArticleList()
              }
            })
          }
        })
        .catch(res => {
          self.$Message.success({
            top: 500,
            content: '发表失败',
            duration: 1
          })
        })
    },
    refreshArticleList: function() {
      this.$router.push('/article')
    },
    goBack() {}
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
  .ivu-checkbox-group-item {
    margin: 10px;
    font-size: 16px;
  }
  .com_save {
    margin: 20px 0;
  }
}
</style>
