import Vue from 'vue'
import VueRouter from 'vue-router'
//import routes from './routes'
import firebase from 'firebase'

Vue.use(VueRouter)

export default function ({ssrContext}) {
  if (process.env.MODE !== 'ssr') {
    const router = new VueRouter({
      mode: 'history',
      base: process.env.VUE_ROUTER_BASE,
      routes: [
        {
          path: '*',
          redirect: '/login',
        },
        {
          path: '/',
          redirect: '/login',
        },
        {
          path: '/login',
          name: 'Login',
          component: () => import('../components/Login'),
        },
        {
          path: '/registrar',
          name: 'Registrar',
          component: () => import('../components/Registro'),
        },
        {
          path: '/sobre',
          name: 'Sobre',
          component: () => import('../components/Sobre'),
        },
        {
          path: '/trocarsenha',
          name: 'Trocar Senha',
          component: () => import('../components/TrocarSenha'),
          meta: { requerAuth: true }
        },
        {
          path: '/dash',
          name: 'Dash',
          component: () => import('../components/Dash'),
          meta: { requerAuth: true }
        },
        {
          path: '/quadro',
          name: 'Quadro',
          component: () => import('../components/Quadro'),
          meta: { requerAuth: true }
        },
        {
          path: '/tarefas',
          name: 'Tarefas',
          component: () => import('../components/Tarefas'),
          meta: { requerAuth: true }
        }
      ]
    })
    
    router.beforeEach((to, from, next) => {
      let usuario = firebase.auth().currentUser;
      let autorizacao = to.matched.some(record => record.meta.requerAuth);
    
      if (autorizacao && !usuario) {
        next('login')
      } else if (autorizacao && usuario) {
        next();
      }
    
      else {
        next();
      }
    })

    return router;
  } else {
    const router = new VueRouter({
      mode: 'history',
      base: process.env.VUE_ROUTER_BASE,
      routes: [
        {
          path: '*',
          redirect: '/login',
        },
        {
          path: '/',
          redirect: '/login',
        },
        {
          path: '/login',
          name: 'Login',
          component: () => import('../components/Login'),
        },
        {
          path: '/registrar',
          name: 'Registrar',
          component: () => import('../components/Registro'),
        },
        {
          path: '/sobre',
          name: 'Sobre',
          component: () => import('../components/Sobre'),
        },
        {
          path: '/trocarsenha',
          name: 'Trocar Senha',
          component: () => import('../components/TrocarSenha'),
          meta: { requerAuth: true }
        },
        {
          path: '/dash',
          name: 'Dash',
          component: () => import('../components/Dash'),
          meta: { requerAuth: true }
        },
        {
          path: '/quadro',
          name: 'Quadro',
          component: () => import('../components/Quadro'),
          meta: { requerAuth: true }
        },
        {
          path: '/tarefas',
          name: 'Tarefas',
          component: () => import('../components/Tarefas'),
          meta: { requerAuth: true }
        }
      ]
    })
    
    router.beforeEach((to, from, next) => {
      let usuario = firebase.auth().currentUser;
      let autorizacao = to.matched.some(record => record.meta.requerAuth);
    
      if (autorizacao && !usuario) {
        next('login')
      } else if (autorizacao && usuario) {
        next();
      }
    
      else {
        next();
      }
    })

    return router;
  }
}
