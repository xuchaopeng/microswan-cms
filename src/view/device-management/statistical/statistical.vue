<template>
  <div class="statistical">
    <Row :gutter="15">
      <Col span="6">
        <div class="actions">
          <div class="navs">
            <span class="fl">
              <Icon custom="icon iconfont icon-bumen" size="24" />设备统计
            </span>
          </div>
          <div class="tbs">
            <Tree :data="dmlist" @on-select-change="selectDepartment"></Tree>
          </div>
        </div>
      </Col>
      <Col span="18">
        <div class="list">
          <div class="download">
            <a id="0421download">
              <Button
                size="large"
                icon="ios-download-outline"
                type="primary"
                @click="downloadTable"
              >下载统计表</Button>
            </a>
          </div>
          <Table
            :loading="loading"
            border
            :columns="column"
            :data="tabdata"
            :no-data-text="dataText"
          ></Table>
        </div>
      </Col>
    </Row>
  </div>
</template>

<script>
import "./statistical.less";
import { mapMutations, mapGetters } from "vuex";
import { getDepartmentTree } from "@/api/system";
import {deviceStatistics} from '@/api/device';
import {deviceDownload} from '@/api/statistical';
import { operateFile,ranFileName }from '@/libs/util';
export default {
  data() {
    return {
      loading:false,
      pageNo: 1,
      // 当前选中部门
      currentDm: {
        name: "",
        id: ""
      },
      //部门列表
      dmlist: [{}],
       //设备列表
      tabdata: [],
      column: [
        {
          title: "部门",
          key: "departmentName"
        },
        {
          title: "正常的数量",
          key: "numOfNormal"
        },
        {
          title: "维修的数量",
          key: "numOfRepaired"
        },
        {
          title: "报废的数量",
          key: "numOfScrapped"
        },
        {
          title: "未激活的数量",
          key: "numOfUnactivated"
        }
      ],
      dataText:'左侧栏目，请选择一个部门'
    }
  },
  computed:{
    ...mapGetters(["departmentId", "departmentList"]),
    access() {
      return this.$store.state.user.permissions;
    },
    viewaccessread() {
      return hasOneOf(["device:read"], this.access);
    },
    viewaccesswrite() {
      return hasOneOf(["device:write"], this.access);
    }
  },
  methods:{
    ...mapMutations(["setDepartmentList"]),
    //选择部门
    selectDepartment(item) {
      if (!item || !item[0]) return;
      this.currentDm.id = item[0].id;
      this.currentDm.name = item[0].title;
      this.renderList();
    },
     //更新部门树数据
    updateDepartmentList(a) {
      // 如果用户当前未选中任何部门，这里默认为最高级部门
      if (!this.currentDm.id) this.currentDm.id = a.id;
      let index = 1;
      function getTree(tree = []) {
        let arr = [];
        if (!!tree && tree.length !== 0) {
          tree.forEach(item => {
            let obj = {};
            obj.title = item.name;
            obj.expand = index < 2;
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
    //获取部门树
    getTreeData() {
      if (this.departmentList && this.departmentList.length) {
        this.updateDepartmentList(this.departmentList);
        return;
      }
      getDepartmentTree(this.departmentId)
        .then(res => {
          let data = null;
          const r = res.data;
          if (r.code == 200 && r.data) {
            data = r.data;
            let list = [data];
            this.updateDepartmentList(list);
            this.setDepartmentList(list);
          }
        })
        .catch(res => {});
    },
    //更新统计
    renderList(){
      let param = {
        departmentId: this.currentDm.id,
        pageNo:this.pageNo
      }
      this.loading = true;
      deviceStatistics(param).then(res => {
         let r = res.data;
         console.log(r,'HAHAH');
         if(r.code == 200) {
            const page = r.data.pageContent;
            const len = this.tabdata.length;
            if (page) {
              this.tabdata.splice(0, len);
              page.forEach(em => {
                this.tabdata.push(em);
              });
              this.totalCount = r.data.totalCount;
            }
            if(!len) this.dataText = '暂无数据';
         } else {
           this.dataText = '暂无数据';
         }
         this.loading = false;
      }).catch(err => {
        this.loading = false;
        this.dataText = '暂无数据';
      })
    },
    //下载统计表
    downloadTable(){
      if(this.currentDm.id === '' || typeof this.currentDm.id == "undefined") {
        this.$Message.success({
          content: "请选择一个部门",
          duration: 1.5,
          closable: true
        });
        return;
      }
      deviceDownload(this.currentDm.id).then(res => {
        if(res) operateFile(res,ranFileName());
      }).catch(err => {})
    }
  },
  mounted(){
    this.getTreeData();
  }
}
</script>
