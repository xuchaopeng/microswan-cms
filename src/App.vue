<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style lang="less">
.ivu-message {
  width: auto !important;
  top: 50% !important;
  left: 50% !important;
}
.size {
  width: 100%;
  height: 100%;
}
html,
body {
  .size;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
#app {
  .size;
  .ivu-menu {
    z-index: 11;
  }
  .main {
    .left-sider {
      .ivu-layout-sider-children {
        background: linear-gradient(#040a17, #1e3b86);
      }
      .side-menu-wrapper {
        .ivu-menu-dark {
          background: none;
          .ivu-menu-submenu {
            .ivu-menu-item-active {
              background-color: #345098 !important;
            }
          }
        }
      }
      // .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item-active
    }
    .header-con {
      background: linear-gradient(#040a17, #060f22);
      // background: #040a17;
      .sider-trigger-a {
        color: #fff;
      }
      .ivu-breadcrumb > span:last-child {
        color: #fff;
      }
      .full-screen-btn-con {
        color: rgba(255, 255, 255, 0.7);
      }
      .ivu-dropdown {
        .ivu-dropdown-rel {
          a {
            color: rgba(255, 255, 255, 0.7);
          }
        }
      }
      .ivu-breadcrumb {
        a {
          color: #fff;
        }
      }
    }
    .realtime {
      background-color: #ecf0f5;
      .faceListPic {
        li.cur {
          .pic {
            border-color: #00b3ff;
          }
        }
      }
      .listContainer {
        .comBtn {
          color: #0085bd;
        }
      }
    }
    .infopush {
      .nohasHitInfo {
        color: #515a6e;
      }
      // .comcss {
      //   // background-color: #ecf0f5;
      // }
      .dmcons {
        background-color: #fff;
        border: 1px solid #e6e6e6;
        .hitInfoList {
          .item {
            background-color: #f5f7f9;
          }
        }
      }
    }
    .ivu-card-bordered {
      border-color: #e6e6e6;
    }
    .facelib,
    .department {
      .comcss {
        border: 1px solid #e6e6e6;
        border-radius: 5px;
      }
    }
    .user,
    .role,
    .log {
      .dmcons {
        border: 1px solid #e6e6e6;
        border-radius: 5px;
      }
    }
    .department {
      .ivu-table-wrapper {
        border: none;
      }
    }
  }
}
</style>
