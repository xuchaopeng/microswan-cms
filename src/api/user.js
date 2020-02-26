import axios from "@/libs/api.request";

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
    username: user_name,
    pwd: token
  };
  return axios.request({
    url: "/api/user/login",
    data,
    method: "post"
  });
};

export const logout = token => {
  return axios.request({
    url: "/api/user/logout",
    data: { token },
    method: "get"
  });
};

export const userList = ({ departmentId, pageNo, pageSize }) => {
  if (!pageSize) pageSize = 10;
  if (!pageNo) pageNo = 1;
  const data = {
    departmentId,
    pageNo,
    pageSize
  };
  console.log(data, "list");
  return axios.request({
    url: "/api/user/list",
    data,
    method: "get"
  });
};
