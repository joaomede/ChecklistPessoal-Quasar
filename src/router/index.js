import Vue from 'vue'
import VueRouter from 'vue-router'
// import routes from './routes'
import { Cookies } from 'quasar'

Vue.use(VueRouter)

export default function ({ ssrContext }) {
  if (process.env.MODE !== 'ssr') {
    const router = new VueRouter({
      mode: process.env.VUE_ROUTER_MODE,
      base: process.env.VUE_ROUTER_BASE,
      routes: [
        {
          path: '*',
          redirect: '/login'
        },
        {
          path: '/',
          redirect: '/login'
        },
        {
          path: '/login',
          name: 'Login',
          component: () => import('../pages/Login')
        },
        {
          path: '/registrar',
          name: 'Registrar',
          component: () => import('../pages/Registro')
        },
        {
          path: '/about',
          name: 'About',
          component: () => import('../pages/About')
        },
        {
          path: '/trocarsenha',
          name: 'Trocar Senha',
          component: () => import('../pages/TrocarSenha'),
          meta: { requerAuth: true }
        },
        {
          path: '/folder',
          name: 'Folder',
          component: () => import('../pages/Folder'),
          meta: { requerAuth: true }
        },
        {
          path: '/board/:idFolder',
          name: 'Board',
          props: true,
          component: () => import('../pages/Board'),
          meta: { requerAuth: true }
        },
        {
          path: '/task/:idFolder/:idBoard',
          name: 'Task',
          props: true,
          component: () => import('../pages/Task'),
          meta: { requerAuth: true }
        }
      ]
    })

    router.beforeEach((to, from, next) => {
      let autorizacao = to.matched.some(record => record.meta.requerAuth)
      const user = Cookies.get('user')

      if (autorizacao) {
        if (user != null) {
          if (user.uid != null) {
            next()
          } else {
            next({
              path: '/login'
            })
          }
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
  } else {
    const router = new VueRouter({
      mode: process.env.VUE_ROUTER_MODE,
      base: process.env.VUE_ROUTER_BASE,
      routes: [
        {
          path: '/',
          redirect: '/login'
        },
        {
          path: '/login',
          name: 'Login',
          component: () => import('../pages/Login')
        },
        {
          path: '/registrar',
          name: 'Registrar',
          component: () => import('../pages/Registro')
        },
        {
          path: '/about',
          name: 'About',
          component: () => import('../pages/About')
        },
        {
          path: '/trocarsenha',
          name: 'Trocar Senha',
          component: () => import('../pages/TrocarSenha'),
          meta: { requerAuth: true }
        },
        {
          path: '/folder',
          name: 'Folder',
          component: () => import('../pages/Folder'),
          meta: { requerAuth: true }
        },
        {
          path: '/board/:idFolder',
          name: 'Board',
          props: true,
          component: () => import('../pages/Board'),
          meta: { requerAuth: true }
        },
        {
          path: '/task/:idFolder/:idBoard',
          name: 'Task',
          props: true,
          component: () => import('../pages/Task'),
          meta: { requerAuth: true }
        }
      ]
    })

    router.beforeEach((to, from, next) => {
      let autorizacao = to.matched.some(record => record.meta.requerAuth)

      const cookies = process.env.SERVER ? Cookies.parseSSR(ssrContext) : Cookies // otherwise we're on client
      const user = cookies.get('user')

      if (autorizacao) {
        if (user != null) {
          if (user.uid != null) {
            next()
          } else {
            next({
              path: '/login'
            })
          }
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
}
