import Main from "@/components/main";
import parentView from "@/components/parent-view";

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: "/login",
    name: "login",
    meta: {
      title: "Login - 登录",
      hideInMenu: true
    },
    component: resolve => require(["@/view/login/login.vue"], resolve)
  },
  {
    path: "/",
    name: "_home",
    redirect: "/realtimepush",
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    }
    // children: [
    //   {
    //     path: "/home", // /home  /alarm-push/realtimepush
    //     name: "home", //home realtimepush
    //     meta: {
    //       hideInMenu: true,
    //       title: "首页", //首页 实时推送
    //       notCache: true,
    //       icon: "md-home" // md-home  _tuisong
    //     },
    //     component: () => import("@/view/single-page/home/home.vue")
    //   }
    // ]
  },
  {
    path: "/alarm-push",
    name: "alarmPush",
    meta: {
      icon: "_tuisong1",
      title: "报警推送",
      access: ["db:read"]
    },
    component: Main,
    children: [
      {
        path: "/realtimepush",
        name: "realTimePush",
        meta: {
          icon: "_tuisong",
          title: "实时推送",
          access: ["db:read"]
        },
        component: resolve =>
          require(["@/view/alarm-push/realtime-push/index.vue"], resolve)
      },
      {
        path: "/infopush",
        name: "infopush",
        meta: {
          icon: "ios-paper",
          title: "消息推送",
          access: ["db:read"]
        },
        component: resolve =>
          require(["@/view/alarm-push/info-push/index.vue"], resolve)
      }
    ]
  },
  {
    path: "/device-management",
    name: "deviceManagement",
    meta: {
      icon: "_guanli",
      title: "设备管理",
      access: ["device:read", "device:write"]
    },
    component: Main,
    children: [
      {
        path: "/device",
        name: "device",
        meta: {
          icon: "_guanli",
          title: "设备管理",
          access: ["device:read", "device:write"]
        },
        component: resolve =>
          require(["@/view/device-management/status/status.vue"], resolve)
      },
      {
        path: "/deviceStatistical",
        name: "deviceStatistical",
        meta: {
          icon: "_guanli",
          title: "设备统计",
          access: ["device:read", "device:write"]
        },
        component: resolve =>
          require(["@/view/device-management/statistical/statistical.vue"], resolve)
      }
    ]
  },
  {
    path: "/resource-management",
    name: "resourceManagement",
    meta: {
      icon: "md-albums",
      title: "资源管理",
      access: ["db:write", "db:read"]
    },
    component: Main,
    children: [
      {
        path: "/likelibrary",
        name: "likeLibrary",
        meta: {
          icon: "_guanli1",
          title: "人像库管理",
          access: ["db:write", "db:read"]
        },
        component: resolve =>
          require(["@/view/resource-management/facelib.vue"], resolve)
      }
    ]
  },
  {
    path: "/system-management",
    name: "systemManagement",
    meta: {
      icon: "md-albums",
      title: "系统管理",
      access: [
        "role:write",
        "role:read",
        "user:write",
        "user:read",
        "department:write",
        "department:read",
        "log:read"
      ]
    },
    component: Main,
    children: [
      {
        path: "/department",
        name: "bdManagement",
        meta: {
          icon: "_bumen",
          title: "部门管理",
          access: ["department:write", "department:read"]
        },
        component: resolve =>
          require(["@/view/system-management/department.vue"], resolve)
      },
      {
        path: "/user",
        name: "userManagement",
        meta: {
          icon: "_iconrenxiang",
          title: "用户管理",
          access: ["user:write", "user:read"]
        },
        component: resolve =>
          require(["@/view/system-management/user.vue"], resolve)
      },
      {
        path: "/role",
        name: "roleManagement",
        meta: {
          icon: "_jiaose",
          title: "角色管理",
          access: ["role:write", "role:read"]
        },
        component: resolve =>
          require(["@/view/system-management/role.vue"], resolve)
      },
      {
        path: "/log",
        name: "logManagement",
        meta: {
          icon: "_rizhi",
          title: "系统日志",
          access: ["log:read"]
        },
        component: resolve =>
          require(["@/view/system-management/log.vue"], resolve)
      }
    ]
  },
  {
    path: "/401",
    name: "error_401",
    meta: {
      hideInMenu: true
    },
    component: resolve => require(["@/view/error-page/401.vue"], resolve)
  },
  {
    path: "/500",
    name: "error_500",
    meta: {
      hideInMenu: true
    },
    component: resolve => require(["@/view/error-page/500.vue"], resolve)
  },
  {
    path: "*",
    name: "error_404",
    meta: {
      hideInMenu: true
    },
    component: resolve => require(["@/view/error-page/404.vue"], resolve)
  }
];
