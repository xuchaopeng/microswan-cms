import axios from "@/libs/api.request";
import { resetParam } from "@/libs/util";

//部门相关接口
export const getDepartmentTree = id => {
  let param = {
    id
  };
  return axios.request({
    url: "/api/department/getTree" + resetParam(param),
    method: "get"
  });
};

export const addDepartment = ({ name, parentId }) => {
  const data = {
    name,
    parentId
  };
  return axios.request({
    url: "/api/department/add",
    data,
    method: "post"
  });
};

export const delDepartment = id => {
  const param = {
    id
  };
  return axios.request({
    url: "/api/department/delete" + resetParam(param),
    method: "get"
  });
};

export const getDepartmentList = ({
  departmentId,
  name,
  pageNo = 1,
  pageSize = 10
}) => {
  const param = {
    departmentId,
    // name,
    pageNo,
    pageSize
  };
  return axios.request({
    url: "/api/department/list" + resetParam(param),
    method: "get"
  });
};

//角色管理接口
export const addRole = ({ departmentId, description, name }) => {
  const data = {
    departmentId,
    description,
    name
  };
  return axios.request({
    url: "/api/role/add",
    data,
    method: "post"
  });
};

export const assignRole = ({ id, permissions }) => {
  const data = {
    id,
    permissions
  };
  return axios.request({
    url: "/api/role/assign",
    data,
    method: "post"
  });
};

export const getRoleList = ({
  departmentId,
  name,
  pageNo = 1,
  pageSize = 10
}) => {
  let param = {
    departmentId,
    pageNo,
    pageSize
  };
  return axios.request({
    url: "/api/role/list" + resetParam(param),
    method: "get"
  });
};

export const deleteRole = id => {
  let param = {
    id
  };
  return axios.request({
    url: "/api/role/delete" + resetParam(param),
    method: "get"
  });
};

export const showPermissions = id => {
  let param = {
    id
  };
  return axios.request({
    url: "/api/role/showPermissions" + resetParam(param),
    method: "get"
  });
};

export const updateRole = ({ id, description }) => {
  let data = {
    id,
    description
  };
  return axios.request({
    url: "/api/role/update",
    data,
    method: "post"
  });
};

//用户管理

export const getUserList = ({ departmentId, pageNo = 1, pageSize = 10 }) => {
  let param = {
    departmentId,
    pageNo,
    pageSize
  };
  return axios.request({
    url: "/api/user/list" + resetParam(param),
    method: "get"
  });
};

export const addUser = ({ departmentId, policeNum, pwd, roleId, username }) => {
  let data = {
    departmentId,
    policeNum,
    pwd,
    roleId,
    username
  };
  return axios.request({
    url: "/api/user/add",
    data,
    method: "post"
  });
};

export const deleteUser = id => {
  let param = {
    id
  };
  return axios.request({
    url: "/api/user/delete" + resetParam(param),
    method: "get"
  });
};

export const updateUser = ({ id, roleId }) => {
  let data = {
    id,
    roleId
  };
  return axios.request({
    url: "/api/user/update",
    data,
    method: "post"
  });
};
