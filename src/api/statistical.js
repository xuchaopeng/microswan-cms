import axios from "axios";
import config from "@/config";
import { resetParam} from "@/libs/util";

const baseUrl =
  process.env.NODE_ENV === "development"
    ? config.baseUrl.dev
    : config.baseUrl.pro;

const api = axios.create({
  baseURL : baseUrl,
});

function downLoadFile (url,_cb,_catchcb) {
  return api.get(url,{responseType: 'blob'},{
    responseType: 'arraybuffer',
    headers : {
      'Content-Type' : 'application/json',
    }
  }).then(_cb).catch(_catchcb)
}

//下载设备统计
export const deviceDownload = id => {
  let param = {
    departmentId:id
  };
  const url = "/api/device/download" + resetParam(param);
  return new Promise((resolve,reject) => {
    downLoadFile(url,(res) => {
      if(res.data) resolve(res.data);
      else reject(null);
    },(err) => {reject(err)})
  })
};
