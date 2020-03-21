import axios from "@/libs/api.request";
import { resetParam } from "@/libs/util";

//获取最新的5条推送消息  不要了
export const getNewestHitInfo = departmentId => {
  let param = {
    departmentId
  };
  return axios.request({
    url: "/api/faceLib/getNewestHitInfo" + resetParam(param),
    method: "get"
  });
};

//1、用户进来  每个用户进来 都掉用这个websocket， 这个首页来展示。暂时不考虑 首次进来  最多5条。
//2、人像点击  详情页（展示的对比详情），用户可以手动确认 （接口“人像库推送消息确认”）
//3、人像点击  详情页（展示轨迹入口），用户点击入口 （接口 "查看人像轨迹"）
//4、接口 “人像库推送消息展示” ，该接口会调整，不传部门的话，查看全部  新页面。

//人像库推送消息确认
export const hitInfoAck = ({ id, isSame }) => {
  let data = {
    id,
    isSame
  };
  return axios.request({
    url: "/api/faceLib/hitInfoAck" + resetParam(data),
    method: "post"
  });
};

//人像库推送消息展示
export const getListHitInfo = ({ departmentId, pageNo = 1, pageSize = 10 }) => {
  let data = {
    departmentId,
    pageNo,
    pageSize
  };
  return axios.request({
    url: "/api/faceLib/listHitInfo" + resetParam(data),
    method: "get"
  });
};

//查看人像轨迹
export const faceTrack = ({ faceId, pageNo = 1, pageSize = 10 }) => {
  let data = {
    faceId,
    pageNo,
    pageSize
  };
  return axios.request({
    url: "/api/Labcefib/track;" + resetParam(data),
    method: "get"
  });
};
