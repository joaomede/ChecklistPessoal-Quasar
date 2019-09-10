import Vue from "vue";
import VueRouter from "vue-router";
//import routes from './routes'
import firebase from "firebase";
import { Cookies } from "quasar";

Vue.use(VueRouter);

export default function({ ssrContext }) {
  if (process.env.MODE !== "ssr") {
    const router = new VueRouter({
      mode: process.env.VUE_ROUTER_MODE,
      base: process.env.VUE_ROUTER_BASE,
      routes: [
        {
          path: "*",
          redirect: "/login"
        },
        {
          path: "/",
          redirect: "/login"
        },
        {
          path: "/login",
          name: "Login",
          component: () => import("../components/Login")
        },
        {
          path: "/registrar",
          name: "Registrar",
          component: () => import("../components/Registro")
        },
        {
          path: "/sobre",
          name: "Sobre",
          component: () => import("../components/Sobre")
        },
        {
          path: "/trocarsenha",
          name: "Trocar Senha",
          component: () => import("../components/TrocarSenha"),
          meta: { requerAuth: true }
        },
        {
          path: "/dash",
          name: "Dash",
          component: () => import("../components/Dash"),
          meta: { requerAuth: true }
        },
        {
          path: "/quadro/:idPasta",
          name: "Quadro",
          props: true,
          component: () => import("../components/Quadro"),
          meta: { requerAuth: true }
        },
        {
          path: "/tarefas",
          name: "Tarefas",
          component: () => import("../components/Tarefas"),
          meta: { requerAuth: true }
        }
      ]
    });

    router.beforeEach((to, from, next) => {
      let autorizacao = to.matched.some(record => record.meta.requerAuth);
      const user = Cookies.get("user");

      if (autorizacao) {
        if (user != null) {
          if (user.uid != null) {
            next();
          } else {
            next({
              path: "/login"
            });
          }
        } else {
          next({
            path: "/login"
          });
        }
      } else {
        next();
      }
    });

    return router;
  } else {
    const router = new VueRouter({
      mode: process.env.VUE_ROUTER_MODE,
      base: process.env.VUE_ROUTER_BASE,
      routes: [
        {
          path: "*",
          redirect: "/login"
        },
        {
          path: "/",
          redirect: "/login"
        },
        {
          path: "/login",
          name: "Login",
          component: () => import("../components/Login")
        },
        {
          path: "/registrar",
          name: "Registrar",
          component: () => import("../components/Registro")
        },
        {
          path: "/sobre",
          name: "Sobre",
          component: () => import("../components/Sobre")
        },
        {
          path: "/trocarsenha",
          name: "Trocar Senha",
          component: () => import("../components/TrocarSenha"),
          meta: { requerAuth: true }
        },
        {
          path: "/dash",
          name: "Dash",
          component: () => import("../components/Dash"),
          meta: { requerAuth: true }
        },
        {
          path: "/quadro",
          name: "Quadro",
          component: () => import("../components/Quadro"),
          meta: { requerAuth: true }
        },
        {
          path: "/tarefas",
          name: "Tarefas",
          component: () => import("../components/Tarefas"),
          meta: { requerAuth: true }
        }
      ]
    });

    router.beforeEach((to, from, next) => {
      let autorizacao = to.matched.some(record => record.meta.requerAuth);
      
      const cookies = process.env.SERVER ? Cookies.parseSSR(ssrContext) : Cookies; // otherwise we're on client
      const user = cookies.get("user");

      if (autorizacao) {
        if (user != null) {
          if (user.uid != null) {
            next();
          } else {
            next({
              path: "/login"
            });
          }
        } else {
          next({
            path: "/login"
          });
        }
      } else {
        next();
      }
    });

    return router;
  }
}
