<template>
  <div>部门消息推送</div>
</template>

<script>
import { getNewestHitInfo, getListHitInfo } from '@/api/hitinfo';
export default {
  data() {
    return {}
  },
  mounted() {
    // getNewestHitInfo(1).then(res => {
    //   console.log(res);
    // }).catch(err => { console.log(err); });
    getListHitInfo({ departmentId: 1 }).then(res => {
      console.log(res, 'getListHitInfo');
    }).catch(err => { console.log(err); });
    // WebSocketTest();
    // function WebSocketTest() {
    //   if ('WebSocket' in window) {
    //     //  /user/queue/hitInfo    /api/faceLib/getNewestHitInfo
    //     var ws = new window.WebSocket("ws://localhost:8080/user/queue/hitInfo?departmentId=1");
    //     ws.onopen = function () {
    //       console.log('数据已链接上');
    //       ws.send('');
    //     };
    //     ws.onmessage = function (evt) {
    //       console.log(evt, '数据接受了');
    //     };
    //     ws.onclose = function () {
    //       console.log('链接已经关闭');
    //     }
    //   } else {
    //     console.log('浏览器不支持 WebSocket');
    //   }
    // }
  },
  methods: {

  }
}
</script>
