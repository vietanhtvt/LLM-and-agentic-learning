# vuejs-state

**Hướng dẫn quản lý state với Pinia trong Vue 3. Áp dụng khi thiết kế hoặc refactor state management.**

---

## 1. Cấu trúc Pinia store — dùng Setup Store style

**Dùng Composition API style (Setup Store) thay vì Options Store. Linh hoạt hơn, dễ test hơn.**

```typescript
// ✅ src/stores/auth.ts — Setup Store style
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  // State — refs
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const loading = ref(false)

  // Getters — computed
  const isLoggedIn = computed(() => !!user.value && !!token.value)
  const userName = computed(() => user.value?.name ?? 'Guest')

  // Actions — async functions
  async function login(credentials: LoginCredentials) {
    loading.value = true
    try {
      const { user: u, token: t } = await authService.login(credentials)
      user.value = u
      token.value = t
      localStorage.setItem('token', t)
    } finally {
      loading.value = false
    }
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  return { user, token, loading, isLoggedIn, userName, login, logout }
})
```

```typescript
// ❌ Options Store style — ít linh hoạt hơn
export const useAuthStore = defineStore('auth', {
  state: () => ({ user: null, token: null }),
  getters: { isLoggedIn: (state) => !!state.user },
  actions: { async login(creds) { /* ... */ } }
})
```

---

## 2. Phân chia store theo domain

**Một store = một business domain. Không tạo một store "global" chứa tất cả.**

```
src/stores/
  auth.ts         # Authentication: user, token, login/logout
  cart.ts         # Shopping cart: items, total, add/remove
  catalog.ts      # Products: list, filters, pagination
  ui.ts           # UI state: sidebar open, theme, notifications (nếu cần share)
  notification.ts # Toast/alert messages
```

```typescript
// ✅ Store nhỏ, tập trung
export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  const total = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.qty, 0)
  )

  function addItem(product: Product, qty = 1) {
    const existing = items.value.find(i => i.id === product.id)
    if (existing) {
      existing.qty += qty
    } else {
      items.value.push({ ...product, qty })
    }
  }

  function removeItem(id: string) {
    items.value = items.value.filter(i => i.id !== id)
  }

  return { items, total, addItem, removeItem }
})
```

---

## 3. Dùng store trong component

**Luôn gọi `useXxxStore()` bên trong `<script setup>` hoặc hàm. Không gọi bên ngoài setup.**

```vue
<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'

// ✅ Gọi trong setup
const authStore = useAuthStore()
const cartStore = useCartStore()

// ✅ Destructure với storeToRefs để giữ reactivity cho state/getters
const { user, isLoggedIn } = storeToRefs(authStore)
// Actions không cần storeToRefs
const { login, logout } = authStore
</script>

<template>
  <div v-if="isLoggedIn">
    Xin chào, {{ user?.name }}
    <button @click="logout">Đăng xuất</button>
  </div>
</template>
```

```typescript
// ❌ Sai — gọi ngoài setup mất reactivity context
const store = useAuthStore() // Lỗi nếu không có active Pinia instance
export const globalStore = useAuthStore() // KHÔNG làm thế này
```

---

## 4. storeToRefs — bắt buộc khi destructure state/getters

**Destructure trực tiếp từ store sẽ mất reactivity. Chỉ actions mới được destructure trực tiếp.**

```typescript
const store = useUserStore()

// ✅ Đúng — state và getters cần storeToRefs
const { user, fullName } = storeToRefs(store)
// ✅ Actions: destructure thẳng
const { fetchUser, updateProfile } = store

// ❌ Sai — mất reactivity
const { user, fullName } = store // user và fullName sẽ không cập nhật!
```

---

## 5. Async actions — xử lý loading và error state

**Mọi async action nên quản lý loading state. Error phải được handle, không để throw lên component.**

```typescript
export const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchProducts(filters?: ProductFilter) {
    loading.value = true
    error.value = null
    try {
      products.value = await productService.getAll(filters)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Lỗi không xác định'
      // Re-throw nếu component cần biết
    } finally {
      loading.value = false
    }
  }

  return { products, loading, error, fetchProducts }
})
```

---

## 6. Store subscriptions và plugins

**Dùng `$subscribe` để watch state changes, `$onAction` để hook vào actions.**

```typescript
// ✅ Persist state với $subscribe
const cartStore = useCartStore()
cartStore.$subscribe((mutation, state) => {
  localStorage.setItem('cart', JSON.stringify(state.items))
})

// ✅ Logging plugin
const loggingPlugin: PiniaPlugin = ({ store }) => {
  store.$onAction(({ name, args, after, onError }) => {
    const start = Date.now()
    after((result) => {
      console.log(`[${store.$id}] ${name} took ${Date.now() - start}ms`)
    })
    onError((error) => {
      console.error(`[${store.$id}] ${name} failed:`, error)
    })
  })
}

// Đăng ký plugin
const pinia = createPinia()
pinia.use(loggingPlugin)
```

---

## 7. Store composition — store dùng store khác

**Store có thể gọi store khác. Tránh circular dependency.**

```typescript
export const useOrderStore = defineStore('order', () => {
  const authStore = useAuthStore() // ✅ Gọi store khác bên trong
  const cartStore = useCartStore()

  async function placeOrder() {
    if (!authStore.isLoggedIn) {
      throw new Error('Chưa đăng nhập')
    }
    const order = await orderService.create({
      userId: authStore.user!.id,
      items: cartStore.items
    })
    cartStore.$reset() // Reset cart sau khi đặt hàng
    return order
  }

  return { placeOrder }
})
```

---

## 8. Reset store state

```typescript
export const useFormStore = defineStore('form', () => {
  const data = ref({ name: '', email: '' })
  const isDirty = ref(false)

  // ✅ Custom reset function (Setup Store không có $reset tự động)
  function reset() {
    data.value = { name: '', email: '' }
    isDirty.value = false
  }

  return { data, isDirty, reset }
})

// Options Store có $reset() sẵn:
const store = useOptionsStore()
store.$reset()
```

---

## 9. Không dùng provide/inject cho global state

**`provide/inject` dành cho dependency injection trong component tree, không phải global state.**

```typescript
// ❌ Sai — dùng provide/inject thay thế Pinia
// app.provide('globalState', reactive({ user: null }))

// ✅ Đúng — Pinia cho global state, provide/inject cho service/config
app.provide(THEME_KEY, useTheme()) // OK: một service/config cụ thể
```

---

## Anti-patterns

| Vấn đề | Giải pháp |
|---|---|
| Store quá lớn (>200 dòng) | Tách theo sub-domain |
| Fetch data trực tiếp trong component | Chuyển vào store action |
| Mutate store state bên ngoài store | Dùng `$patch` hoặc action |
| Circular store dependency | Redesign domain boundary |
| Lưu UI state cục bộ vào store | Để state trong component local |
| Không cleanup subscription | Gọi `store.$dispose()` khi không cần |
