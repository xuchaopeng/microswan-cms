import axios from "@/libs/api.request";
import { resetParam } from "@/libs/util";

//激活设备
export const getDevice = ({ departmentId, id }) => {
  let data = {
    departmentId,
    id
  };
  return axios.request({
    url: "/api/device" + resetParam(data),
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
//获取已激活设备列表
export const getActivatedList = ({
  departmentId,
  deviceName,
  deviceNo,
  pageNo = 1,
  pageSize = 10
}) => {
  let param = {
    departmentId,
    pageNo,
    pageSize
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
