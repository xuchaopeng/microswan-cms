import axios from "@/libs/api.request";
import { resetParam } from "@/libs/util";

export const login = ({ userName, password }) => {
  const data = {
    username: userName, //name
    pwd: password
  };
  return axios.request({
    url: "/api/user/login",
    data,
    method: "post"
  });
};

export const getUserInfo = (token, user_name) => {
  const data = {
    username: "admin",
    pwd: "12345678"
  };
  return axios.request({
    url: "/api/user/login",
    data,
    method: "post"
  });
};

export const logout = token => {
  let param = {
    token
  };
  return axios.request({
    url: "/api/user/logout" + resetParam(param),
    method: "get"
  });
};

export const userList = ({ departmentId, pageNo, pageSize }) => {
  if (!pageSize) pageSize = 10;
  if (!pageNo) pageNo = 1;
  const param = {
    departmentId,
    pageNo,
    pageSize
  };
  return axios.request({
    url: "/api/user/list" + resetParam(param),
    method: "get"
  });
};
