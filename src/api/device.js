import axios from "@/libs/api.request";
import { resetParam } from "@/libs/util";

//激活设备
export const getDevice = ({ departmentId, id }) => {
  let data = {
    departmentId,
    id
  };

  return axios.request({
    url: "/api/device/active" + resetParam(data),
    method: "post"
  });
};
//删除设备
export const delDevice = id => {
  let param = {
    id
  };
  return axios.request({
    url: "/api/device/delete" + resetParam(param),
    method: "get"
  });
};
//展示正常、维护、报废的设备
export const getActivatedList = ({
  departmentId,
  deviceName,
  deviceNo,
  pageNo = 1,
  pageSize = 10,
  status
}) => {
  let param = {
    departmentId,
    pageNo,
    pageSize,
    status
  };
  if (deviceName) param.deviceName = deviceName;
  if (deviceNo) param.deviceNo = deviceNo;

  return axios.request({
    url: "/api/device/list" + resetParam(param),
    method: "get"
  });
};
//获取未激活设备列表
export const getInactiveList = (pageNo = 1, pageSize = 10) => {
  let param = {
    pageNo,
    pageSize
  };
  return axios.request({
    url: "/api/device/listInactivated" + resetParam(param),
    method: "get"
  });
};
//设备维修
export const deviceMaintain = id => {
  let data = {
    id
  };
  return axios.request({
    url: "/api/device/maintain" + resetParam(data),
    method: "post"
  });
};
//设备正常化设备
export const deviceNormal = id => {
  let data = {
    id
  };
  return axios.request({
    url: "/api/device/normal" + resetParam(data),
    method: "post"
  });
};
//报废设备
export const deviceScrap = id => {
  let data = {
    id
  };
  return axios.request({
    url: "api/device/scrap" + resetParam(data),
    method: "post"
  });
};
// 查看设备日志
export const getListLogs = ({
  deviceId,
  operation,
  pageNo = 1,
  pageSize = 10
}) => {
  let data = {
    deviceId,
    operation,
    pageNo,
    pageSize
  };
  return axios.request({
    url: "/api/device/listLog" + resetParam(data),
    method: "post"
  });
};
//获取设备日志操作类型
export const getLogOptions = () => {
  return axios.request({
    url: "/api/device/listLogOption",
    method: "post"
  });
};
