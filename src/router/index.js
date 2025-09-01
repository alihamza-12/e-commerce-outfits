import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomePage from '../views/home/HomePage.vue'
import Contact from '../views/home/Contact.vue'


const routes = [
  // Home routes
  {
    path: '/',
    name: 'HomePage',
    component: HomePage,
  },
 
  {
    path: '/contact',
    component: Contact,
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
        name: 'SellerProductsList',
        component: () => import('@/views/admin/SellerProducts.vue'),
      },
      {
        path: 'sellers/:sellerId/products',
        name: 'SellerProducts',
        component: () => import('@/views/admin/SellerProducts.vue'),
        props: true,
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
    component: () => import('@/views/seller/SellerLayout.vue'),
    meta: { requiresAuth: true, requiresRole: 'seller' },
    children: [
      {
        path: '',
        redirect: '/seller/dashboard',
      },
      {
        path: 'dashboard',
        name: 'SellerDashboard',
        component: () => import('@/views/seller/SellerDashboard.vue'),
        meta: { requiresAuth: true, requiresRole: 'seller' }
      },
      {
        path: 'products',
        name: 'SellerProducts',
        component: () => import('@/views/seller/ProductForm.vue'),
        meta: { requiresAuth: true, requiresRole: 'seller' }
      },
      {
        path: 'products/add',
        name: 'AddProduct',
        component: () => import('@/views/seller/ProductForm.vue'),
        meta: { requiresAuth: true, requiresRole: 'seller' }
      },
      {
        path: 'orders',
        name: 'SellerOrdersPanel',
        component: () => import('@/views/seller/OrderManagement.vue'),
        meta: { requiresAuth: true, requiresRole: 'seller' }
      },
      {
       path: 'stock', name: 'SellerStock', component: () => import('@/views/seller/UpdateStock.vue')
      },
      {
        path: 'settings',
        name: 'SellerSettings',
        component: () => import('@/views/seller/SellerStats.vue'),
        meta: { requiresAuth: true, requiresRole: 'seller' }
      },
      {
        path: 'profile',
        component: () => import('@/views/seller/Profile.vue')
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

  //Coustomer Routes
  {
  path: '/customer/profile',
  name: 'CustomerProfile',
  component: () => import('@/views/customer/CustomerProfile.vue'),
  meta: { requiresAuth: true } // optional
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
