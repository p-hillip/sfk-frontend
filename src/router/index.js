import {createRouter, createWebHistory} from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import UploadPage from '../pages/UploadPage.vue'
import BetaAccessPage from '../pages/BetaAccessPage.vue'

const SITE_ENABLED = false

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/upload',
    name: 'Upload',
    component: UploadPage
  },
  {
    path: '/beta-access',
    name: 'BetaAccess',
    component: BetaAccessPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (!SITE_ENABLED && to.name !== 'BetaAccess') {
    return next({ name: 'BetaAccess' })
  }
  next()
})

export default router