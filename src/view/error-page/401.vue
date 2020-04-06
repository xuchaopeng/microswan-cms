<template>
  <error-content
    code="401"
    desc="Oh~~您没有浏览这个页面的权限~"
    v-if="view401"
    :src="src"
  />
</template>

<script>
import error401 from "@/assets/images/error-page/error-401.svg";
import errorContent from "./error-content.vue";
import { filterOne } from "@/libs/util";
import { hasOneOf } from "@/libs/tools";
export default {
  name: "error_401",
  components: {
    errorContent
  },
  computed: {
    access() {
      return this.$store.state.user.permissions;
    },
    resetsrc() {
      return filterOne(this.access);
    }
  },
  mounted() {
    if (this.resetsrc) {
      this.$router.push({
        path: "/" + this.resetsrc
      });
    } else {
      this.view401 = true;
    }
  },
  data() {
    return {
      view401: false,
      src: error401
    };
  }
};
</script>
