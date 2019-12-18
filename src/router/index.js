import Vue from 'vue'
import VueRouter from 'vue-router'
// import routes from './routes'
import { Cookies } from 'quasar'

Vue.use(VueRouter)

export default function ({ ssrContext }) {
  let allRoutes = [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../pages/Login.vue')
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../pages/Register')
    },
    {
      path: '/about',
      name: 'About',
      component: () => import('../pages/About')
    },
    {
      path: '/changepassword',
      name: 'Trocar Senha',
      component: () => import('../pages/ChangePassword'),
      meta: { requiredAuth: true }
    },
    {
      path: '/folder',
      name: 'Folder',
      component: () => import('../pages/Folder'),
      meta: { requiredAuth: true }
    },
    {
      path: '/board/:idFolder',
      name: 'Board',
      props: true,
      component: () => import('../pages/Board'),
      meta: { requiredAuth: true }
    },
    {
      path: '/task/:idFolder/:idBoard',
      name: 'Task',
      props: true,
      component: () => import('../pages/Task'),
      meta: { requiredAuth: true }
    }
  ]
  if (process.env.MODE !== 'ssr') {
    allRoutes.push(
      {
        path: '*',
        redirect: '/login'
      }
    )
  }

  const router = new VueRouter({
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE,
    routes: allRoutes
  })

  router.beforeEach((to, from, next) => {
    const authRequired = to.matched.some(record => record.meta.requiredAuth)
    let user
    let cookies

    if (process.env.MODE !== 'ssr') {
      user = Cookies.get('user')
    } else {
      cookies = process.env.SERVER ? Cookies.parseSSR(ssrContext) : Cookies // otherwise we're on client
      user = cookies.get('user')
    }
    if (authRequired === true) {
      if (user !== undefined) {
        next()
      } else {
        next({
          path: '/login'
        })
      }
    } else {
      next()
    }
  })

  return router
}
