<template>
  <div class="device-management">
    <Row :gutter="15">
      <Col span="6">
        <div class="actions">
          <div class="navs">
            <span class="fl">
              <Icon custom="icon iconfont icon-bumen" size="24" />设备管理
            </span>
          </div>
          <div class="tbs">
            <Tree :data="dmlist" @on-select-change="selectDepartment"></Tree>
          </div>
        </div>
      </Col>
      <Col span="18">
        <div class="list">
          <div class="search">
            <Select
              class="mr15"
              v-model="deviceType"
              style="width:200px;"
              placeholder
            >
              <Option value="0">未激活</Option>
              <Option value="1">正常</Option>
              <Option value="2">维护</Option>
              <Option value="3">报废</Option>
            </Select>
            <Button
              class="ml10"
              type="primary"
              icon="ios-search"
              @click="searchList"
              :loading="loading"
              >搜索</Button
            >
          </div>
          <Table
            border
            :columns="column"
            :data="tabdata"
            no-data-text="暂无设备数据"
          >
            <template slot-scope="{ row, index }" slot="status">
              <span>{{ getDeviceStatus(row.status) }}</span>
            </template>
            <template slot-scope="{ row, index }" slot="action">
              <Button
                class="mro"
                type="error"
                :disabled="!viewaccesswrite"
                size="small"
                @click="removeDevice(row)"
                >删除</Button
              >
              <Button
                v-if="row.status == 0"
                class="mro"
                type="success"
                :disabled="!viewaccesswrite"
                ghost
                size="small"
                @click="activatedDevice(row)"
                >激活</Button
              >

              <Button
                v-if="row.status !== 1 && row.status !== 0 && row.status !== 3"
                class="mro"
                type="success"
                :disabled="!viewaccesswrite"
                ghost
                size="small"
                @click="normalDevice(row)"
                >正常</Button
              >

              <Button
                v-if="row.status !== 2 && row.status !== 0 && row.status !== 3"
                class="mro"
                type="success"
                :disabled="!viewaccesswrite"
                ghost
                size="small"
                @click="maintainDevice(row)"
                >维护</Button
              >

              <Button
                v-if="row.status !== 3 && row.status !== 0"
                class="mro"
                type="success"
                :disabled="!viewaccesswrite"
                ghost
                size="small"
                @click="scrapDevice(row)"
                >报废</Button
              >

              <Button
                v-if="row.status"
                class="mro"
                type="success"
                :disabled="!viewaccessread"
                ghost
                size="small"
                @click="seelogs(row)"
              >
                查看日志</Button
              >
            </template>
          </Table>
        </div>
      </Col>
    </Row>
    <Layer v-if="type">
      <div class="subtable">
        <Icon
          class="close"
          custom="icon iconfont icon-close"
          size="24"
          @click="closeBtn"
        />
        <div class="del-device" v-if="type == 1">
          <p class="subtitle">确认删除该设备吗?</p>
          <p>{{ currentdevice.deviceName }}-{{ currentdevice.deviceNo }}</p>
          <p class="dels">
            <Button class="mr10" @click="delSubmit" type="primary">确认</Button>
            <Button @click="closeBtn" type="warning">取消</Button>
          </p>
        </div>
        <div class="activated-device" v-if="type == 2">
          <p class="subtitle">激活该设备?</p>
          <p>
            设备：{{ currentdevice.deviceName }}-{{ currentdevice.deviceNo }}
          </p>
          <p>部门：{{ currentDm.name }}</p>
          <p class="dels">
            <Button
              class="mr10"
              @click="activatedSubmit"
              type="primary"
              :loading="loading"
              >确认</Button
            >
            <Button @click="closeBtn" type="warning">取消</Button>
          </p>
        </div>
        <div class="normal-device" v-if="type == 3">
          <p class="subtitle">设备状态更新为“正常” ?</p>
          <p>
            设备：{{ currentdevice.deviceName }}-{{ currentdevice.deviceNo }}
          </p>
          <p>部门：{{ currentDm.name }}</p>
          <p class="dels">
            <Button
              class="mr10"
              @click="normalSubmit"
              type="primary"
              :loading="loading"
              >确认</Button
            >
            <Button @click="closeBtn" type="warning">取消</Button>
          </p>
        </div>
        <div class="maintain-device" v-if="type == 4">
          <p class="subtitle">设备状态更新为“维修”?</p>
          <p>
            设备：{{ currentdevice.deviceName }}-{{ currentdevice.deviceNo }}
          </p>
          <p>部门：{{ currentDm.name }}</p>
          <p class="dels">
            <Button
              class="mr10"
              @click="maintainSubmit"
              type="primary"
              :loading="loading"
              >确认</Button
            >
            <Button @click="closeBtn" type="warning">取消</Button>
          </p>
        </div>
        <div class="scrap-device" v-if="type == 5">
          <p class="subtitle">设备状态更新为“报废”?</p>
          <p>
            设备：{{ currentdevice.deviceName }}-{{ currentdevice.deviceNo }}
          </p>
          <p>部门：{{ currentDm.name }}</p>
          <p class="dels">
            <Button
              class="mr10"
              @click="scrapSubmit"
              type="primary"
              :loading="loading"
              >确认</Button
            >
            <Button @click="closeBtn" type="warning">取消</Button>
          </p>
        </div>
      </div>
    </Layer>
    <DeviceLogs
      :currentdevice="currentdevice"
      v-if="viewlogs"
      @closeLogs="closeLogs"
    ></DeviceLogs>
  </div>
</template>
<script>
import "./status.less";
import Layer from "_c/layer";
import DeviceLogs from "../log";
import { getDepartmentTree } from "@/api/system";
import {
  getActivatedList,
  getInactiveList,
  delDevice,
  getDevice,
  deviceMaintain,
  deviceNormal,
  deviceScrap
} from "@/api/device";
import { mapMutations, mapGetters } from "vuex";
import { objectToFormData, makeFormData } from "@/libs/util";
import { hasOneOf } from "@/libs/tools";
export default {
  data() {
    return {
      viewlogs: false,
      loading: false,
      type: 0,
      totalCount: 1,
      //设备类型
      deviceType: "1",
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
          title: "设备名称",
          key: "deviceName"
        },
        {
          title: "设备编号",
          key: "deviceNo"
        },
        {
          title: "状态",
          slot: "status",
          key: "status"
        },
        {
          title: "操作",
          slot: "action",
          key: "cz"
        }
      ],
      //操作当前设备
      currentdevice: {
        deviceName: "",
        deviceNo: "",
        status: "",
        id: ""
      }
    };
  },
  computed: {
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
  methods: {
    ...mapMutations(["setDepartmentList"]),
    //选择部门
    selectDepartment(item) {
      if (!item || !item[0]) return;
      this.currentDm.id = item[0].id;
      this.currentDm.name = item[0].title;
      this.renderList(Number(this.deviceType));
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
    //展示右侧列表
    renderList(type) {
      this.loading = true;
      if (type !== 0) {
        let param = {
          departmentId: this.currentDm.id,
          status: type
        };
        getActivatedList(param)
          .then(res => {
            let r = res.data;
            if (r.code == 200) {
              const page = r.data.pageContent;
              const len = this.tabdata.length;
              if (page) {
                this.tabdata.splice(0, len);
                page.forEach(em => {
                  this.tabdata.push(em);
                });
                this.totalCount = r.data.totalCount;
              }
            }
            this.loading = false;
          })
          .catch(err => {
            this.loading = false;
          });
        return;
      }
      getInactiveList()
        .then(res => {
          let r = res.data;
          if (r.code == 200) {
            const page = r.data.pageContent;
            const len = this.tabdata.length;
            if (page) {
              this.tabdata.splice(0, len);
              page.forEach(em => {
                this.tabdata.push(em);
              });
              this.totalCount = r.data.totalCount;
            }
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    //设置当前操作设备
    setCurrentDevice(row) {
      this.currentdevice.id = row.id;
      this.currentdevice.deviceName = row.deviceName;
      this.currentdevice.deviceNo = row.deviceNo;
      this.currentdevice.status = row.status;
    },
    //删除设备
    removeDevice(row) {
      if (!row) return;
      this.setCurrentDevice(row);
      this.type = 1;
    },
    //激活设备
    activatedDevice(row) {
      if (!row) return;
      this.setCurrentDevice(row);
      this.type = 2;
    },
    //设备正常
    normalDevice(row) {
      if (!row) return;
      this.setCurrentDevice(row);
      this.type = 3;
    },
    //维修设备
    maintainDevice(row) {
      if (!row) return;
      this.setCurrentDevice(row);
      this.type = 4;
    },
    //报废设备
    scrapDevice(row) {
      if (!row) return;
      this.setCurrentDevice(row);
      this.type = 5;
    },
    //获取设备状态
    getDeviceStatus(type) {
      let name = "";
      type = Number(type);
      if (type === 0) name = "未激活";
      else if (type === 1) name = "正常";
      else if (type === 2) name = "维护";
      else if (type === 3) name = "报废";
      return name;
    },
    //关闭弹框
    closeBtn() {
      this.type = 0;
    },
    //成功提示弹框
    upSuccess(v) {
      this.loading = false;
      this.type = 0;
      if (v == 1) {
        this.$Message.success({
          content: "设备删除成功",
          duration: 1.5,
          closable: true
        });
      }
      if (v == 2) {
        this.$Message.success({
          content: "设备激活成功",
          duration: 1.5,
          closable: true
        });
      }

      if (v == 3) {
        this.$Message.success({
          content: "设备状态更新为'正常'",
          duration: 1.5,
          closable: true
        });
      }

      if (v == 4) {
        this.$Message.success({
          content: "设备状态更新为'维护'",
          duration: 1.5,
          closable: true
        });
      }

      if (v == 5) {
        this.$Message.success({
          content: "设备状态更新为'报废'",
          duration: 1.5,
          closable: true
        });
      }

      this.renderList(Number(this.deviceType));
    },
    //失败提示弹框
    upError(v, text) {
      this.loading = false;
      this.type = 0;
      if (v == 1) {
        this.$Message.error({
          content: text || "设备删除失败",
          duration: 1.5,
          closable: true
        });
      }
      if (v == 2) {
        this.$Message.error({
          content: text || "设备激活失败",
          duration: 1.5,
          closable: true
        });
      }
      if (v == 3) {
        this.$Message.error({
          content: text || "设备状态改为正常，更新失败",
          duration: 1.5,
          closable: true
        });
      }

      if (v == 4) {
        this.$Message.error({
          content: text || "设备状态改为维修，更新失败",
          duration: 1.5,
          closable: true
        });
      }

      if (v == 5) {
        this.$Message.error({
          content: text || "设备状态改为报废，更新失败",
          duration: 1.5,
          closable: true
        });
      }
    },
    //删除提交
    delSubmit() {
      delDevice(this.currentdevice.id)
        .then(res => {
          if (res.data.code == 200) this.upSuccess(1);
          else this.upError(1, res.data.msg);
        })
        .catch(err => {
          this.upError(1);
        });
    },
    //激活提交
    activatedSubmit() {
      if (this.currentdevice.id == "" || this.currentDm.id == "") return;
      let param = {
        departmentId: this.currentDm.id,
        id: this.currentdevice.id
      };
      this.loading = true;
      getDevice(param)
        .then(res => {
          if (res.data.code == 200) this.upSuccess(2);
          else this.upError(2, res.data.msg);
        })
        .catch(err => {
          this.upError(2);
        });
    },
    //正常化提交
    normalSubmit() {
      this.loading = true;
      deviceNormal(this.currentdevice.id)
        .then(res => {
          if (res.data.code == 200) this.upSuccess(3);
          else this.upError(3, res.data.msg);
        })
        .catch(err => {
          this.upError(3);
        });
    },
    //维修提交
    maintainSubmit() {
      this.loading = true;
      deviceMaintain(this.currentdevice.id)
        .then(res => {
          if (res.data.code == 200) this.upSuccess(4);
          else this.upError(4, res.data.msg);
        })
        .catch(err => {
          this.upError(4);
        });
    },
    //报废提交
    scrapSubmit() {
      this.loading = true;
      deviceScrap(this.currentdevice.id)
        .then(res => {
          if (res.data.code == 200) this.upSuccess(5);
          else this.upError(5, res.data.msg);
        })
        .catch(err => {
          this.upError(5);
        });
    },
    //按状态查询设备列表
    searchList() {
      if (this.currentDm.id == "" || typeof this.currentDm.id == "undefined") {
        this.$Message.success({
          content: "请选择一个部门",
          duration: 1.5,
          closable: true
        });
        return;
      }
      if (this.deviceType == "") return;
      this.renderList(Number(this.deviceType));
    },
    //查看日志
    seelogs(row) {
      if (!row) return;
      this.setCurrentDevice(row);
      this.viewlogs = true;
    },
    //关闭日志
    closeLogs() {
      this.viewlogs = false;
    }
  },
  mounted() {
    this.getTreeData(); //部门树
  },
  components: {
    Layer,
    DeviceLogs
  }
};
</script>
<style></style>
