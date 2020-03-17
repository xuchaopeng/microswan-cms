import axios from "@/libs/api.request";
import { resetParam } from "@/libs/util";

//人像库管理
export const addFaceLib = ({ departmentId, description, libName, type }) => {
  let data = {
    departmentId,
    description,
    libName,
    type
  };
  return axios.request({
    url: "/api/faceLib/add",
    data,
    method: "post"
  });
};

export const deleteFaceLib = id => {
  let param = {
    id
  };
  return axios.request({
    url: "/api/faceLib/delete" + resetParam(param),
    method: "get"
  });
};

export const getLibTypes = () => {
  return axios.request({
    url: "/api/faceLib/getLibType",
    method: "get"
  });
};

export const getFaceLibList = ({
  departmentId,
  pageNo = 1,
  pageSize = 10,
  type
}) => {
  let param = {
    departmentId,
    pageNo,
    pageSize,
    type
  };
  return axios.request({
    url: "/api/faceLib/list" + resetParam(param),
    method: "get"
  });
};

export const updateFaceLib = ({ description, libName, id }) => {
  let data = {
    description,
    libName,
    id
  };
  return axios.request({
    url: "/api/faceLib/update",
    data,
    method: "post"
  });
};

export const subscribe = id => {
  let data = {
    id: id
  };
  return axios.request({
    url: "/api/faceLib/subscribe" + resetParam(data),
    method: "post"
  });
};

export const unsubscribe = id => {
  let data = {
    id: id
  };
  return axios.request({
    url: "/api/faceLib/unsubscribe" + resetParam(data),
    method: "post"
  });
};

export const addFace = data => {
  return axios.request({
    url: "/api/face/add",
    data,
    method: "post"
  });
};

export const getFaceList = ({ libId, pageNo = 1, pageSize = 10 }) => {
  let param = {
    libId,
    pageNo,
    pageSize
  };
  return axios.request({
    url: "/api/face/list" + resetParam(param),
    method: "get"
  });
};
