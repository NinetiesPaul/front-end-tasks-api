import { createRouter, createWebHistory } from 'vue-router'
import LoginForm from '../components/LoginForm.vue'
import Logout from '../components/Logout.vue'
import ListTasks from '../components/Tasks/ListTasks.vue'
import CreateTask from '../components/Tasks/CreateTask.vue'
import ViewTask from '../components/Tasks/ViewTask.vue'
import EditTask from '../components/Tasks/EditTask.vue'

const routes = [
  { path: '/login', component: LoginForm },
  { path: '/logout', component: Logout },
  { path: '/', component: ListTasks, meta: { requiresAuth: true } },
  { path: '/task', component: CreateTask, meta: { requiresAuth: true } },
  { path: '/task/view/:id', component: ViewTask, meta: { requiresAuth: true } },
  { path: '/task/edit/:id', component: EditTask, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const token = sessionStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    return '/login'
  }

  if (to.path === '/login' && token) {
    return '/'
  }
})

export default router
