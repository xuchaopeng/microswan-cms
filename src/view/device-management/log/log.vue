<template>
  <div class="device-log">
    <Layer v-if>
      <div class="device-log-cnts">
        <Icon class="close" custom="icon iconfont icon-close" size="24" @click="closeIcon" />
        <div class="title">
          {{ currentdevice.deviceName }}-{{
          currentdevice.deviceNo
          }}设备日志查询
        </div>
        <div class="search">
          <Select v-model="selectOperation" class="selectOperation" placeholder="请选择操作">
            <Option v-for="m in operation" :value="m.k">{{ m.v }}</Option>
          </Select>
          <Button class="search-btn" type="primary" icon="ios-search" @click="searchLog">搜索</Button>
        </div>
        <div class="tables">
          <Table
            :loading="logloading"
            height="360"
            :columns="column"
            :data="tableData"
            class="table-log"
            no-data-text="暂无数据"
          >
            <template slot-scope="{ row, index }" slot="operation">
              <span>{{ getOptionsValue(row) }}</span>
            </template>
          </Table>
        </div>
        <div class="pages" v-if="totalCount > 10">
          <Page :total="totalCount" show-elevator show-total @on-change="changePage" />
        </div>
      </div>
    </Layer>
  </div>
</template>

<script>
import "./log.less";
import Layer from "_c/layer";
import { getListLogs, getLogOptions } from "@/api/device";
export default {
  name: "DeviceLogs",
  props: {
    currentdevice: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      logloading: false,
      pageNo: 1,
      totalCount: 1,
      selectOperation: "all",
      column: [
        {
          title: "部门",
          key: "departmentName"
        },
        {
          title: "用户编号",
          key: "policeNum"
        },
        {
          title: "设备名称",
          key: "deviceName"
        },
        {
          title: "设备名编号",
          key: "deviceNo"
        },
         {
          title: "操作",
          key: "operation",
          slot: "operation"
        },
        {
          title: "创建时间",
          key: "createTime"
        },
        {
          title: "内容",
          key: "content"
        }
      ],
      tableData: [],
      operation: [],
      curoperation:{}
    };
  },
  created() {
    this.getOptions();
  },
  mounted() {
    this.searchLog();
  },
  methods: {
    closeIcon() {
      this.$emit("closeLogs");
    },
    searchLog() {
      let param = {
        deviceId: this.currentdevice.id,
        pageNo: this.pageNo
      };
      if(this.selectOperation !== 'all') param.operation = this.selectOperation;
      this.logloading = true;
      getListLogs(param)
        .then(res => {
          const r = res.data;
          if (r.code == 200 && r.data) {
            const page = r.data.pageContent;
            const len = this.tableData.length;
            if (page && page.length) {
              this.tableData.splice(0, len);
              page.forEach(em => {
                this.tableData.push(em);
              });
              this.totalCount = r.data.totalCount;
            }
          }
          console.log(this.tableData);
          this.logloading = false;
        })
        .catch(err => { });
    },
    getOptions() {
      if(this.operation.length)return;
      getLogOptions()
        .then(res => {
          if (res.data.code == 200) {
            const options = res.data.data;
            this.operation.push({k:'all',v:'全部'});
            for(var k in options) {
              this.curoperation[k] = options[k];//保留原始对象数据
              this.operation.push({
                k:k,
                v:options[k]
              });
            }
            console.log(this.operation,'Options');
          }
        })
        .catch(err => { });
    },
    getOptionsValue(row){
      if(!row) return '';
      else {
        const cu = this.curoperation[String(row.operation)]
        if(cu) return cu;
        else return '';
      }
    },
    changePage(pageNo) {
      this.pageNo = pageNo;
      this.searchLog();
    }
  },
  components: {
    Layer
  }
};
</script>
