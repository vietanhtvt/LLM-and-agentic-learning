# Vue Router Skill

> Vue Router 4 — navigation, guards, lazy loading, và typed routes.

**Impact:** Medium | **Loại:** Capability

---

## Nguyên tắc cốt lõi

- **Lazy loading** mặc định cho tất cả route components.
- **Navigation guards** cho authentication — không kiểm tra auth trong component.
- **Typed routes** với `vue-router/auto-routes` hoặc manual typing.
- Nested routes cho layouts phức tạp.

---

## Cấu hình Router

```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/DefaultLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/pages/HomePage.vue'),
      },
      {
        path: 'products',
        name: 'products',
        component: () => import('@/pages/ProductsPage.vue'),
      },
      {
        path: 'products/:id',
        name: 'product-detail',
        component: () => import('@/pages/ProductDetailPage.vue'),
      },
    ],
  },
  {
    path: '/auth',
    component: () => import('@/layouts/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/pages/LoginPage.vue'),
        meta: { requiresGuest: true },
      },
    ],
  },
  {
    path: '/dashboard',
    component: () => import('@/layouts/DashboardLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('@/pages/DashboardPage.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/NotFoundPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
})

export default router
```

---

## Navigation Guards

### Global Guard cho Auth

```typescript
// router/guards.ts
import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

export function setupAuthGuard(router: Router) {
  router.beforeEach(async (to) => {
    const authStore = useAuthStore()

    // Trang yêu cầu đăng nhập
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }

    // Trang chỉ cho khách (đã đăng nhập thì redirect về home)
    if (to.meta.requiresGuest && authStore.isAuthenticated) {
      return { name: 'home' }
    }

    return true
  })
}

// router/index.ts
import { setupAuthGuard } from './guards'
setupAuthGuard(router)
```

### Route Meta Types

```typescript
// types/router.d.ts
import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    requiresGuest?: boolean
    title?: string
    roles?: string[]
  }
}
```

---

## Composable: useRouter trong Component

```vue
<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// Params và query có type
const productId = computed(() => route.params.id as string)
const searchQuery = computed(() => route.query.q as string ?? '')

// Programmatic navigation
function goToProduct(id: string) {
  router.push({ name: 'product-detail', params: { id } })
}

// Redirect sau login
function afterLogin() {
  const redirect = route.query.redirect as string
  router.push(redirect || { name: 'home' })
}
</script>
```

---

## Dynamic Routes và Params

```typescript
// ✅ Named params với TypeScript
interface ProductDetailParams {
  id: string
}

// ✅ Route với multiple params
{
  path: '/shop/:category/:productId',
  name: 'shop-product',
  component: () => import('@/pages/ShopProductPage.vue'),
  props: true,  // Tự động pass params như props
}

// Component nhận params như props
<script setup lang="ts">
defineProps<{ category: string; productId: string }>()
</script>
```

---

## Transition giữa Routes

```vue
<!-- App.vue -->
<template>
  <RouterView v-slot="{ Component, route }">
    <Transition :name="route.meta.transition || 'fade'" mode="out-in">
      <component :is="Component" :key="route.path" />
    </Transition>
  </RouterView>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
```

---

## Lazy Loading với Loading State

```typescript
// ✅ Async component với loading/error state
const ProductDetail = defineAsyncComponent({
  loader: () => import('@/pages/ProductDetailPage.vue'),
  loadingComponent: PageSkeleton,
  errorComponent: PageError,
  timeout: 5000,
})
```

---

## Checklist

- [ ] Tất cả route components dùng lazy import `() => import(...)`
- [ ] Auth logic trong navigation guard, không trong component
- [ ] Route meta types được khai báo trong `vue-router` module
- [ ] Named routes (không dùng path string hardcode)
- [ ] 404 route catch-all ở cuối
- [ ] `scrollBehavior` được cấu hình

---

## Tham khảo

- [Vue Router 4 Official Docs](https://router.vuejs.org/)
- [Navigation Guards](https://router.vuejs.org/guide/advanced/navigation-guards.html)
- [Typed Routes](https://router.vuejs.org/guide/advanced/typed-routes.html)
