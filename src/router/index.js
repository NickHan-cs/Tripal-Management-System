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
    redirect:"/inspect",
    children:[
      {
        path: "/inspect",
        name:"inspect",
        component: () => import("../views/inspection/inspect.vue"),
      },
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
