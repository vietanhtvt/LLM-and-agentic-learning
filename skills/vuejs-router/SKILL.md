# vuejs-router

**Hướng dẫn dùng Vue Router 4 đúng chuẩn. Áp dụng khi thiết kế routing, navigation guards, và route composition.**

---

## 1. Định nghĩa routes với TypeScript

**Luôn type đầy đủ cho route meta và params. Dùng `RouteRecordRaw[]` cho route config.**

```typescript
// ✅ src/router/index.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

// Extend RouteMeta để type route metadata
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    roles?: string[]
    title?: string
    layout?: 'default' | 'auth' | 'admin'
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/HomePage.vue'),
    meta: { title: 'Trang chủ' }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/pages/DashboardPage.vue'),
    meta: { requiresAuth: true, roles: ['admin', 'user'], title: 'Dashboard' }
  },
  {
    path: '/products/:id',
    name: 'ProductDetail',
    component: () => import('@/pages/ProductDetailPage.vue'),
    props: true // Truyền params như props
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFoundPage.vue')
  }
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0, behavior: 'smooth' }
  }
})
```

---

## 2. Navigation Guards — auth và permissions

**Guard logic trong router, không phải trong component. Tách thành functions nhỏ.**

```typescript
// ✅ src/router/guards.ts
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export function authGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore()

  if (!to.meta.requiresAuth) return next()

  if (!authStore.isLoggedIn) {
    return next({ name: 'Login', query: { redirect: to.fullPath } })
  }

  if (to.meta.roles && !to.meta.roles.includes(authStore.user?.role ?? '')) {
    return next({ name: 'Forbidden' })
  }

  next()
}

export function titleGuard(to: RouteLocationNormalized) {
  document.title = to.meta.title ? `${to.meta.title} | MyApp` : 'MyApp'
}

// ✅ Đăng ký guards trong router/index.ts
router.beforeEach(authGuard)
router.afterEach(titleGuard)
```

---

## 3. useRoute và useRouter trong composables

**Không dùng `this.$route` hay `this.$router`. Dùng composables.**

```typescript
// ✅ Trong component
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Truy cập params — type-safe với params typing
const productId = computed(() => route.params.id as string)
const searchQuery = computed(() => route.query.q as string || '')

// Programmatic navigation
async function goToProduct(id: string) {
  await router.push({ name: 'ProductDetail', params: { id } })
}

async function goBack() {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push({ name: 'Home' })
  }
}
</script>
```

```typescript
// ✅ useRouteParams composable — reusable type-safe params
export function useRouteParams<T extends Record<string, string>>() {
  const route = useRoute()
  return computed(() => route.params as T)
}

// Dùng:
const { id } = useRouteParams<{ id: string }>().value
```

---

## 4. Route-level code splitting — bắt buộc

**Mỗi page component phải lazy-loaded. Không import trực tiếp.**

```typescript
// ✅ Đúng — dynamic import
const routes: RouteRecordRaw[] = [
  {
    path: '/products',
    component: () => import('@/pages/ProductsPage.vue')
  },
  {
    path: '/admin',
    // Chunk name cho debugging
    component: () => import(/* webpackChunkName: "admin" */ '@/pages/AdminPage.vue')
  }
]

// ❌ Sai — eager load tất cả pages
import ProductsPage from '@/pages/ProductsPage.vue'
import AdminPage from '@/pages/AdminPage.vue'
const routes = [
  { path: '/products', component: ProductsPage }, // Tất cả load cùng lúc!
  { path: '/admin', component: AdminPage }
]
```

---

## 5. Nested routes và layouts

**Dùng nested routes cho layout patterns. Tránh prop drilling layout qua component.**

```typescript
// ✅ src/router/index.ts — nested layout routes
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/DefaultLayout.vue'),
    children: [
      { path: '', name: 'Home', component: () => import('@/pages/HomePage.vue') },
      { path: 'about', name: 'About', component: () => import('@/pages/AboutPage.vue') }
    ]
  },
  {
    path: '/auth',
    component: () => import('@/layouts/AuthLayout.vue'),
    children: [
      { path: 'login', name: 'Login', component: () => import('@/pages/LoginPage.vue') },
      { path: 'register', name: 'Register', component: () => import('@/pages/RegisterPage.vue') }
    ]
  },
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, roles: ['admin'] },
    children: [
      { path: '', redirect: { name: 'AdminDashboard' } },
      { path: 'dashboard', name: 'AdminDashboard', component: () => import('@/pages/admin/DashboardPage.vue') }
    ]
  }
]
```

```vue
<!-- ✅ DefaultLayout.vue -->
<template>
  <div class="layout">
    <AppHeader />
    <main>
      <RouterView /> <!-- Render nested route -->
    </main>
    <AppFooter />
  </div>
</template>
```

---

## 6. Route props — tách component khỏi router

**Dùng `props: true` để component nhận params như props thay vì dùng `useRoute()` trong component.**

```typescript
// ✅ Router config
const routes = [
  {
    path: '/users/:id/posts/:postId',
    name: 'UserPost',
    component: () => import('@/pages/UserPostPage.vue'),
    props: true // params.id và params.postId trở thành props
  },
  {
    // props là function — transform route thành props phức tạp hơn
    path: '/search',
    component: () => import('@/pages/SearchPage.vue'),
    props: (route) => ({
      query: route.query.q,
      page: Number(route.query.page) || 1
    })
  }
]
```

```vue
<!-- ✅ UserPostPage.vue — nhận từ router props, không cần useRoute() -->
<script setup lang="ts">
const props = defineProps<{
  id: string
  postId: string
}>()
// Component không biết về router, dễ test hơn
</script>
```

---

## 7. Named views — multiple components cùng route

```typescript
// ✅ Named views cho dashboard layout
const routes = [
  {
    path: '/dashboard',
    components: {
      default: () => import('@/pages/DashboardMain.vue'),
      sidebar: () => import('@/components/DashboardSidebar.vue'),
      header: () => import('@/components/DashboardHeader.vue')
    }
  }
]
```

```vue
<!-- App.vue hoặc layout -->
<template>
  <RouterView name="header" />
  <RouterView name="sidebar" />
  <RouterView /> <!-- default -->
</template>
```

---

## 8. useLink và RouterLink

**Dùng `RouterLink` với custom styling. `useLink` cho custom link components.**

```vue
<!-- ✅ RouterLink cơ bản -->
<RouterLink :to="{ name: 'ProductDetail', params: { id: product.id } }">
  {{ product.name }}
</RouterLink>

<!-- ✅ active class tùy chỉnh -->
<RouterLink
  :to="{ name: 'Dashboard' }"
  active-class="nav-active"
  exact-active-class="nav-exact-active"
>
  Dashboard
</RouterLink>
```

```typescript
// ✅ Custom link component với useLink
const AppLink = defineComponent({
  props: {
    to: { type: [String, Object], required: true }
  },
  setup(props) {
    const { href, isActive, isExactActive, navigate } = useLink({
      to: computed(() => props.to)
    })
    return { href, isActive, navigate }
  }
})
```

---

## 9. Route-level data fetching patterns

**Fetch data trong navigation guard (trước khi navigate) hoặc trong component (sau khi mounted).**

```typescript
// ✅ Pattern 1: Fetch trước navigate — dùng beforeEnter
const routes = [
  {
    path: '/products/:id',
    component: () => import('@/pages/ProductDetailPage.vue'),
    async beforeEnter(to) {
      const store = useProductStore()
      try {
        await store.fetchProduct(to.params.id as string)
      } catch {
        return { name: 'NotFound' }
      }
    }
  }
]
```

```vue
<!-- ✅ Pattern 2: Fetch trong component (dùng với loading skeleton) -->
<script setup lang="ts">
const route = useRoute()
const store = useProductStore()

const productId = computed(() => route.params.id as string)

// Re-fetch khi route params thay đổi
watch(productId, (id) => store.fetchProduct(id), { immediate: true })
</script>

<template>
  <LoadingSkeleton v-if="store.loading" />
  <ProductDetail v-else-if="store.product" :product="store.product" />
  <ErrorState v-else />
</template>
```

---

## 10. Redirect sau login — redirect query param

```typescript
// ✅ authGuard — lưu redirect path
router.beforeEach((to, _from, next) => {
  if (to.meta.requiresAuth && !isLoggedIn()) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

// ✅ LoginPage.vue — redirect sau login thành công
const route = useRoute()
const router = useRouter()

async function handleLogin(credentials: LoginCredentials) {
  await authStore.login(credentials)
  const redirectTo = route.query.redirect as string || '/'
  await router.push(redirectTo)
}
```

---

## Anti-patterns

| Anti-pattern | Thay bằng |
|---|---|
| Import page component trực tiếp trong routes | Dynamic `import()` — lazy loading |
| Auth logic trong component | Navigation guard trong router |
| `this.$router.push()` | `useRouter().push()` trong setup |
| `route.params.id` không cast type | `route.params.id as string` |
| `watch(route, ...)` deep watch toàn bộ route | `watch(() => route.params.id, ...)` |
| Fetch data trong `created()` / `mounted()` mà không handle re-route | `watch(routeParam, fetchFn, { immediate: true })` |
| Hardcode paths `/dashboard` trong code | Named routes `{ name: 'Dashboard' }` |
| Quên handle redirect loop (auth → login → auth) | Kiểm tra `isLoggedIn` trước khi redirect |
