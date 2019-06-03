import Vue from 'vue'
import VueRouter from 'vue-router'
//import routes from './routes'
import firebase from 'firebase'

import Login from '../components/Login'
import Registro from '../components/Registro'
import Tarefas from '../components/Tarefas'
import Quadro from '../components/Quadro'
import Dash from '../components/Dash'
import Sobre from '../components/Sobre'
import TrocarSenha from '../components/TrocarSenha'

Vue.use(VueRouter)

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
      component: Login,
    },
    {
      path: '/registrar',
      name: 'Registrar',
      component: Registro,
    },
    {
      path: '/sobre',
      name: 'Sobre',
      component: Sobre,
    },
    {
      path: '/trocarsenha',
      name: 'Trocar Senha',
      component: TrocarSenha,
      meta: { requerAuth: true }
    },
    {
      path: '/dash',
      name: 'Dash',
      component: Dash,
      meta: { requerAuth: true }
    },
    {
      path: '/quadro',
      name: 'Quadro',
      component: Quadro,
      meta: { requerAuth: true }
    },
    {
      path: '/tarefas',
      name: 'Tarefas',
      component: Tarefas,
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

export default router;

