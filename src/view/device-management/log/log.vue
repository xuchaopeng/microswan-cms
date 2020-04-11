<template>
  <div class="device-log">
    <Layer v-if="">
      <div class="device-log-cnts">
        <Icon
          class="close"
          custom="icon iconfont icon-close"
          size="24"
          @click="closeIcon"
        />
        <div class="title">
          {{ currentdevice.deviceName }}-{{
            currentdevice.deviceNo
          }}设备日志查询
        </div>
        <div class="search">
          <Select
            v-model="selectOperation"
            class="selectOperation"
            placeholder="请选择操作"
          >
            <Option v-for="m in operation" :value="m">
              {{ m }}
            </Option>
          </Select>
          <Button
            class="search-btn"
            type="primary"
            icon="ios-search"
            @click="searchLog"
            >搜索</Button
          >
        </div>
        <div class="tables">
          <Table
            :loading="logloading"
            height="360"
            :columns="column"
            :data="tableData"
            class="table-log"
            no-data-text="暂无数据"
          ></Table>
        </div>
        <div class="pages" v-if="totalCount > 10">
          <Page
            :total="totalCount"
            show-elevator
            show-total
            @on-change="changePage"
          />
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
      selectOperation: "",
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
        }
      ],
      tableData: [],
      operation: []
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
        operation: this.selectOperation,
        pageNo: this.pageNo
      };

      this.logloading = true;
      const len = this.tableData.length;
      this.tableData.splice(0, len);
      getListLogs(param)
        .then(res => {
          const r = res.data;

          //伪造假数据 start
          setTimeout(() => {
            for (var i = 0; i < 10; i++) {
              this.tableData.push({
                username: "A",
                operation: "要做什么",
                ip: Math.random()
                  .toString(5)
                  .slice(5)
              });
              this.totalCount = 30;
            }
            this.logloading = false;
          }, 1500);

          //伪造假数据  end
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
          } else {
          }
        })
        .catch(err => {});
    },
    getOptions() {
      getLogOptions()
        .then(res => {
          if (res.data.code == 200) {
            this.operation = res.data.data;
            this.selectOperation = this.operation[0];
          }
        })
        .catch(err => {});
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
