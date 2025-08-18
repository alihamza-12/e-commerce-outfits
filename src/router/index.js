import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    redirect: '/admin/dashboard',
  },
  {
    path: '/admin-register',
    name: 'AdminRegister',
    component: () => import('@/views/AdminSetup.vue'),
  },
  {
    path: '/admin-login',
    name: 'AdminLogin',
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/admin',
    component: () => import('@/components/LayOut.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/Dashboard.vue'),
      },
      {
        path: 'users',
        name: 'ManageUsers',
        component: () => import('@/views/admin/Users.vue'),
      },
      {
        path: 'sellers',
        name: 'ManageSellers',
        component: () => import('@/views/admin/Sellers.vue'),
      },
      {
        path: 'products',
        name: 'AllProducts',
        component: () => import('@/views/admin/Products.vue'),
      },
      {
        path: 'product-approval',
        name: 'ProductApproval',
        component: () => import('@/views/admin/ProductApproval.vue'),
      },
      {
        path: 'categories',
        name: 'Categories',
        component: () => import('@/views/admin/Categories.vue'),
      },
      {
        path: 'all-orders',
        name: 'AllOrders',
        component: () => import('@/views/admin/Orders.vue'),
      },
      {
        path: 'customer-orders',
        name: 'CustomerOrders',
        component: () => import('@/views/admin/CustomerOrders.vue'),
      },
      {
        path: 'seller-orders',
        name: 'SellerOrders',
        component: () => import('@/views/admin/SellerOrders.vue'),
      },
      {
        path: 'seller-products',
        name: 'SellerProducts',
        component: () => import('@/views/admin/SellerProducts.vue'),
      },
      {
        path: 'returns-refunds',
        name: 'ReturnsRefunds',
        component: () => import('@/views/admin/ReturnsRefunds.vue'),
      },
      {
        path: 'reports',
        name: 'Reports',
        component: () => import('@/views/admin/Reports.vue'),
      },
      {
        path: 'platform-stats',
        name: 'PlatformStats',
        component: () => import('@/views/admin/PlatformStats.vue'),
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/admin/Settings.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Check if admin is set up
  const isAdminSetup = await authStore.checkAdminSetup()
  
  // If admin is not set up and not going to register page, redirect to register
  if (!isAdminSetup && to.path !== '/admin-register') {
    next('/admin-register')
    return
  }
  
  // If admin is set up but going to register page, redirect to login
  if (isAdminSetup && to.path === '/admin-register') {
    next('/admin-login')
    return
  }
  
  // Handle authentication requirements
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next('/admin-login')
  } else if (to.path === '/admin-login' && authStore.isLoggedIn) {
    next('/admin/dashboard')
  } else {
    next()
  }
})

export default router
