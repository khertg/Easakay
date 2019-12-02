import Vue from 'vue'
import Router from 'vue-router'
import store from './store.js'

import Dashboard from './modules/Dashboard.vue'
import LandingPage from './modules/LandingPage.vue'
import Login from './modules/Login.vue'
import Register from './modules/Register.vue'
import BusCRUD from './modules/BusCRUD.vue'
import HelloWorld from './components/HelloWorld.vue'

Vue.use(Router)

const auth = (to, from, next) => {
    if (store.getters.isLoggedIn) {
        next()
    }else{
        next('/login')
    }
}

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: LandingPage
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
    ,
    {
        path: '/helloworld',
        name: 'helloworld',
        component: HelloWorld
      },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      beforeEnter: auth
    },
    {
      path: '/buscrud',
      name: 'buscrud',
      component: BusCRUD
    }
  ]
})

export default router