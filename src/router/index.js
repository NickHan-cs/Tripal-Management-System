import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  },{
    path: '/login',
    name: 'login',
    component: () => import('../views/personal/login.vue')
  },{
    path: '/register',
    name: 'register',
    component: () => import('../views/personal/register.vue')
  },{
    path: '/index',
    name: 'index',
    component: () => import('../views/manage/index.vue'),
    redirect:"/underInspect",
    children:[
      {
        path: "/newMsg",
        name:"newMsg",
        component: () => import("../views/message/newMsg.vue"),
      },
      {
        path: "/oldMsg",
        name:"oldMsg",
        component: () => import("../views/message/oldMsg.vue"),
      },
      {
        path: "/failInspect",
        name:"failInspect",
        component: () => import("../views/inspection/failInspect.vue"),
      },{
        path: "/user",
        name:"user",
        component: () => import("../views/manage/user.vue"),
      }, {
        path: "/passInspect",
        name:"passInspect",
        component: () => import("../views/inspection/passInspect.vue"),
      }, {
        path: "/underInspect",
        name:"underInspect",
        component: () => import("../views/inspection/underInspect.vue"),
      },{
        path: "/record",
        name:"record",
        component: () => import("../views/manage/record.vue"),
      },{
        path: "/place",
        name:"place",
        component: () => import("../views/manage/place.vue"),
      },{
        path: "/together",
        name:"together",
        component: () => import("../views/manage/together.vue"),
      },
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login' || to.path === '/' || to.path === '/register') {
    localStorage.removeItem('Authorization');
    localStorage.removeItem('Username');
    next();
  } else {
    let token = localStorage.getItem('Authorization');
    // console.log(token);
    if (token === null || token === '') {
      next('/login');
    } else {
      next();
    }
  }
});

export default router
