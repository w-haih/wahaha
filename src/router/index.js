import Vue from 'vue'
import VueRouter from 'vue-router'
import Table1 from '../views/Table1.vue'
import Table2 from '../views/Table2.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Table1',
    component: Table1
  },
  {
    path: '/Table2',
    name: 'Table2',
    // route level code-splitting  路由级代码拆分
    // this generates a separate chunk (about.[hash].js) for this route 这将为此路由生成一个单独的块（关于[hash].js）
    // which is lazy-loaded when the route is visited. 当访问路由时，它是延迟加载的。
    //component: () => import(/* webpackChunkName: "about" */ '../views/Table2.vue')
    component: Table2
  }
]

const router = new VueRouter({
  routes
})

export default router
