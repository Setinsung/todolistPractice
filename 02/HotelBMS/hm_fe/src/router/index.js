import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import Hello from '@/views/homepage/Hello.vue'
import User from '@/views/user/User.vue'

import Staff from '@/views/staff/Staff.vue'
import Stafftype from '@/views/staff/Stafftype.vue'

import Room from '@/views/room/Room.vue'
import Roomtype from '@/views/room/Roomtype.vue'

import Customer from '@/views/customer/Customer.vue'
import Customertype from '@/views/customer/Customertype.vue'

import Movein from '@/views/housing/Movein.vue'
import Reserve from '@/views/housing/Reserve.vue'
import Moveout from '@/views/housing/Moveout.vue'

import Handling from '@/views/handling/Handling.vue'

import Bill from '@/views/bill/bill.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/hello',
    children: [
      { path: '/hello', component: Hello },
      { path: '/user', component: User },

      { path: '/staff', component: Staff },
      { path: '/stafftype', component: Stafftype },

      { path: '/room', component: Room },
      { path: '/roomtype', component: Roomtype },

      { path: '/customer', component: Customer },
      { path: '/customertype', component: Customertype },

      { path: '/movein', component: Movein },
      { path: '/reserve', component: Reserve },
      { path: '/moveout', component: Moveout },

      { path: '/handling', component: Handling },

      { path: '/bill', component: Bill }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  // token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
