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
    component: () => import("@/view/login/login.vue")
  },
  {
    path: "/",
    name: "_home",
    redirect: "/home",
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: "/home",
        name: "home",
        meta: {
          hideInMenu: true,
          title: "首页",
          notCache: true,
          icon: "md-home"
        },
        component: () => import("@/view/single-page/home")
      }
    ]
  },
  {
    path: "/alarm-push",
    name: "alarmPush",
    meta: {
      icon: "_tuisong1",
      title: "报警推送"
    },
    component: Main,
    children: [
      {
        path: "/realtimepush",
        name: "realTimePush",
        meta: {
          icon: "_tuisong",
          title: "实时推送"
        },
        component: () => import("@/view/alarm-push/realtime-push/index.vue")
      },
      {
        path: "/allalarm",
        name: "allAlarm",
        meta: {
          icon: "ios-paper",
          title: "所有报警"
        },
        component: () => import("@/view/alarm-push/all-alarm/index.vue")
      },
      {
        path: "/allsnap",
        name: "allSnap",
        meta: {
          icon: "_ai14",
          title: "所有抓拍"
        },
        component: () => import("@/view/alarm-push/all-snap/index.vue")
      }
    ]
  },
  {
    path: "/like-retrieve",
    name: "likeRetrieve",
    meta: {
      icon: "_renlianjiansuo",
      title: "人像检索"
    },
    component: Main,
    children: [
      {
        path: "/retrieve",
        name: "retrieve",
        meta: {
          icon: "_renlianjiansuo",
          title: "人像库检索"
        },
        component: () => import("@/view/like-retrieve/index.vue")
      }
    ]
  },
  {
    path: "/resource-management",
    name: "resourceManagement",
    meta: {
      icon: "md-albums",
      title: "资源管理"
    },
    component: Main,
    children: [
      {
        path: "/likelibrary",
        name: "likeLibrary",
        meta: {
          icon: "_guanli1",
          title: "人像库管理"
        },
        component: () => import("@/view/resource-management/facelib.vue")
      }
    ]
  },
  {
    path: "/system-management",
    name: "systemManagement",
    meta: {
      icon: "md-albums",
      title: "系统管理"
    },
    component: Main,
    children: [
      {
        path: "/department",
        name: "bdManagement",
        meta: {
          icon: "_bumen",
          title: "部门管理"
        },
        component: () => import("@/view/system-management/department.vue")
      },
      {
        path: "/user",
        name: "userManagement",
        meta: {
          icon: "_iconrenxiang",
          title: "用户管理"
        },
        component: () => import("@/view/system-management/user.vue")
      },
      {
        path: "/role",
        name: "roleManagement",
        meta: {
          icon: "_jiaose",
          title: "角色管理"
        },
        component: () => import("@/view/system-management/role.vue")
      },
      {
        path: "/log",
        name: "logManagement",
        meta: {
          icon: "_rizhi",
          title: "系统日志"
        },
        component: () => import("@/view/system-management/log.vue")
      }
    ]
  }
];
