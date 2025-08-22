import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomePage from '../views/home/HomePage.vue'
import Shop from '../views/home/Shop.vue'
import Contact from '../views/home/Contact.vue'
import Men from '../views/home/Men.vue'
import Women from '../views/home/Women.vue'
import KidsFashion from '../views/home/KidsFashion.vue'

const routes = [
  // Home routes
  {
    path: '/',
    name: 'HomePage',
    component: HomePage,
  },
  {
    path: '/men',
    component: Men,
  },
  {
    path: '/women',
    component: Women,
  },
  {
    path: '/shop',
    component: Shop,
  },
  {
    path: '/contact',
    component: Contact,
  },
    {
    path: '/kids',
    component: KidsFashion,
  },

  // Unified admin routes - accessible through main login
  {
    path: '/admin',
    component: () => import('@/components/admin/AdminLayout.vue'),
    meta: { requiresAuth: true, requiresRole: 'admin' },
    children: [
      {
        path: '',
        redirect: '/admin/dashboard',
      },
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
        path: 'orders',
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

  // Seller routes
  {
    path: '/seller',
    component: () => import('@/layouts/SellerLayout.vue'),
    meta: { requiresAuth: true, requiresRole: 'seller' },
    children: [
      {
        path: '',
        redirect: '/seller/dashboard'
      },
      {
        path: 'dashboard',
        name: 'SellerDashboard',
        component: () => import('@/views/seller/SellerDashboard.vue')
      },
      {
        path: 'products',
        name: 'SellerProducts',
        component: () => import('@/views/seller/Products.vue')
      },
      {
        path: 'products/add',
        name: 'AddProduct',
        component: () => import('@/components/seller/ProductForm.vue')
      },
      {
        path: 'products/edit/:id',
        name: 'EditProduct',
        component: () => import('@/components/seller/ProductForm.vue'),
        props: true
      },
      {
        path: 'orders',
        name: 'SellerOrders',
        component: () => import('@/views/seller/Orders.vue')
      },
      {
        path: 'inventory',
        name: 'SellerInventory',
        component: () => import('@/components/seller/InventoryTable.vue')
      },
      {
        path: 'revenue',
        name: 'SellerRevenue',
        component: () => import('@/views/seller/Revenue.vue')
      },
      {
        path: 'analytics',
        name: 'SellerAnalytics',
        component: () => import('@/views/seller/Analytics.vue')
      },
      {
        path: 'settings',
        name: 'SellerSettings',
        component: () => import('@/views/seller/Settings.vue')
      }
    ]
  },

  // Buyer routes
  {
    path: '/buyer',
    redirect: '/buyer/dashboard',
    meta: { requiresAuth: true, requiresRole: 'buyer' }
  },
  {
    path: '/buyer/dashboard',
    name: 'BuyerDashboard',
    component: () => import('@/views/home/HomePage.vue'),
    meta: { requiresAuth: true, requiresRole: 'buyer' }
  },

  // User authentication routes
  {
    path: '/registeruser',
    name: 'RegisterUser',
    component: () => import('@/components/auth/RegisterUser.vue'),
  },
  {
    path: '/loginuser',
    name: 'LoginUser',
    component: () => import('@/components/auth/LoginUser.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Check and restore authentication state from localStorage
  if (!authStore.isLoggedIn) {
    authStore.checkAuth()
  }

  // Allow home page to be accessed without any checks
  if (to.path === '/') {
    next()
    return
  }

  // Handle authentication requirements
  if (to.meta.requiresAuth) {
    if (!authStore.isLoggedIn) {
      next('/loginuser')
      return
    }

    // Handle role-based access
    if (to.meta.requiresRole) {
      const requiredRole = to.meta.requiresRole
      const userRole = authStore.role

      if (userRole !== requiredRole) {
        // Redirect based on actual role
        switch (userRole) {
          case 'admin':
            next('/admin/dashboard')
            break
          case 'seller':
            next('/seller/dashboard')
            break
          case 'buyer':
            next('/')
            break
          default:
            next('/')
        }
        return
      }
    }
  }

  // Redirect logged-in users away from login/register
  if ((to.path === '/loginuser' || to.path === '/registeruser') && authStore.isLoggedIn) {
    switch (authStore.role) {
      case 'admin':
        next('/admin/dashboard')
        break
      case 'seller':
        next('/seller/dashboard')
        break
      case 'buyer':
        next('/')
        break
      default:
        next('/')
    }
    return
  }

  next()
})

export default router
