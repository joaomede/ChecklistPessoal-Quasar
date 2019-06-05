/*import Login from '../components/Login'
import Registro from '../components/Registro'
import Tarefas from '../components/Tarefas'
import Quadro from '../components/Quadro'
import Dash from '../components/Dash'
import Sobre from '../components/Sobre'
import TrocarSenha from '../components/TrocarSenha'

const routes = [
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



// Always leave this as last one
if (process.env.MODE !== 'ssr') {
    routes.push({
        path: '*',
        component: () => import('../components/login')
    })
}

export default routes*/
