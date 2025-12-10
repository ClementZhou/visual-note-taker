import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('./pages/Dashboard.vue')
  },
  {
    path: '/category/:id',
    name: 'CategoryView',
    component: () => import('./pages/CategoryView.vue')
  },
  {
    path: '/compare',
    name: 'ComparisonView',
    component: () => import('./pages/ComparisonView.vue')
  },
  {
    path: '/analytics',
    name: 'Analytics',
    component: () => import('./pages/Analytics.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('./pages/Settings.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
