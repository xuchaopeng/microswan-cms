<template>
  <div>
    <form ref="fromxcp">
      请输入名称:<Input type="text" name="name" /><br>
      请选择上传的图片1:<input type="file" ref="file" @change="xcp1"> <br>
      请选择上传的图片2:<input type="file" ref="idFile" @change="xcp2"><br>
      <input value="提交" @click="TJ"><br>
    </form>
    <!-- <Modal title="View Image" v-model="visible"> -->
    <!-- <img :src="'https://o5wwk8baw.qnssl.com/' + imgName + '/large'" v-if="visible" style="width: 100%"> -->
    <!-- </Modal> -->
  </div>
</template>
<script>
import { addFace2, addFace, addFace1 } from '@/api/resources';
import { objectToFormData, makeFormData } from "@/libs/util";
export default {
  data() {
    return {
      names: ''
    }
  },
  methods: {
    xcp1(f) {
      // console.log(f.files[0], 'xcp1')
    },
    xcp2(f) { },
    TJ() {
      let file1 = this.$refs.file;
      let file2 = this.$refs.idFile;
      const formData = new window.FormData();
      const v = { name: "xcp", alias: "HA", ethnic: "汉", idcard: "362202199211182456", "libId": 1 };
      const o = { 'addVO': v };
      formData.append('file', file1.files[0]);
      formData.append('idFile', file2.files[0]);
      makeFormData(o, formData);
      console.log(formData.get('addVO'), 'HAHAHAHAH');
      addFace2(formData).then(res => {
        console.log(res, 'xcp');
      }).catch(err => { cosole.log(err) })

      // addFace1(formData).then(res => {
      //   console.log(res, 'xcp');
      // }).catch(err => { cosole.log(err) })
    }
  },
  mounted() {
  }
}
</script>
<style>
</style>
