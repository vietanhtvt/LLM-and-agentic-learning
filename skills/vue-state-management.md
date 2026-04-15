# Vue State Management Skill (Pinia)

> Pinia — state management chính thức cho Vue 3. Không dùng Vuex.

**Impact:** High | **Loại:** Capability

---

## Nguyên tắc cốt lõi

- **Pinia là tiêu chuẩn** cho Vue 3 — Vuex chỉ cho legacy projects.
- Dùng **Setup Store syntax** (giống Composition API) — không dùng Options Store.
- Mỗi store theo **domain** (auth, cart, users...) — không có "global store" chung chung.
- Dùng `storeToRefs()` khi destructure để giữ reactivity.
- Actions là **async-friendly** — xử lý loading/error state trong action.

---

## Setup Store (Recommended)

```typescript
// stores/useUserStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'

export const useUserStore = defineStore('user', () => {
  // State
  const currentUser = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters (computed)
  const isAuthenticated = computed(() => currentUser.value !== null)
  const displayName = computed(() =>
    currentUser.value?.name ?? 'Guest'
  )

  // Actions
  async function login(email: string, password: string) {
    isLoading.value = true
    error.value = null
    try {
      currentUser.value = await authApi.login(email, password)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Login failed'
    } finally {
      isLoading.value = false
    }
  }

  function logout() {
    currentUser.value = null
  }

  return { currentUser, isLoading, error, isAuthenticated, displayName, login, logout }
})
```

```typescript
// ❌ Sai — Options Store syntax (hạn chế dùng)
export const useUserStore = defineStore('user', {
  state: () => ({ user: null }),
  getters: { isAuth: (state) => !!state.user },
  actions: { login() {} },
})
```

---

## Dùng Store trong Component

```vue
<script setup lang="ts">
import { useUserStore } from '@/stores/useUserStore'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()

// ✅ storeToRefs() để destructure reactive state và getters
const { currentUser, isLoading, isAuthenticated } = storeToRefs(userStore)

// ✅ Actions destructure trực tiếp (không cần storeToRefs)
const { login, logout } = userStore

async function handleLogin() {
  await login(email.value, password.value)
}
</script>

<template>
  <div v-if="isLoading">Logging in...</div>
  <div v-else-if="isAuthenticated">
    Welcome, {{ currentUser?.name }}!
    <button @click="logout">Logout</button>
  </div>
</template>
```

```typescript
// ❌ Sai — mất reactivity khi destructure không dùng storeToRefs
const { currentUser } = userStore  // currentUser không reactive!
```

---

## Tổ chức Stores theo Domain

```
stores/
├── useAuthStore.ts        # Authentication state
├── useCartStore.ts        # Shopping cart
├── useProductStore.ts     # Products list, filters
├── useNotificationStore.ts # Toast notifications
└── useUIStore.ts          # UI state (sidebar, modal, theme)
```

---

## Patterns nâng cao

### Store gọi Store

```typescript
// stores/useCartStore.ts
import { useUserStore } from './useUserStore'

export const useCartStore = defineStore('cart', () => {
  const userStore = useUserStore()
  const items = ref<CartItem[]>([])

  // Chỉ thêm item nếu user đã login
  function addItem(product: Product) {
    if (!userStore.isAuthenticated) {
      throw new Error('Must be logged in to add items')
    }
    items.value.push({ ...product, quantity: 1 })
  }

  return { items, addItem }
})
```

### Persistence với plugin

```typescript
// main.ts
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

// stores/useAuthStore.ts
export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  return { token }
}, {
  persist: {
    key: 'auth-token',
    paths: ['token'],  // Chỉ persist token, không persist user data
  },
})
```

### Reset Store

```typescript
export const useFormStore = defineStore('form', () => {
  const initialState = { name: '', email: '', message: '' }
  const form = reactive({ ...initialState })

  function $reset() {
    Object.assign(form, initialState)
  }

  return { form, $reset }
})
```

### Optimistic Updates

```typescript
export const usePostStore = defineStore('post', () => {
  const posts = ref<Post[]>([])

  async function deletePost(id: string) {
    // Optimistic: xóa ngay lập tức trên UI
    const index = posts.value.findIndex(p => p.id === id)
    const [removed] = posts.value.splice(index, 1)

    try {
      await postsApi.delete(id)
    } catch {
      // Rollback nếu lỗi
      posts.value.splice(index, 0, removed)
    }
  }

  return { posts, deletePost }
})
```

---

## Testing Pinia Store

```typescript
// stores/__tests__/useCartStore.test.ts
import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { useCartStore } from '../useCartStore'

describe('useCartStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('adds item to cart', () => {
    const store = useCartStore()
    store.addItem({ id: '1', name: 'Product', price: 100 })
    expect(store.items).toHaveLength(1)
    expect(store.totalPrice).toBe(100)
  })

  it('removes item from cart', () => {
    const store = useCartStore()
    store.addItem({ id: '1', name: 'Product', price: 100 })
    store.removeItem('1')
    expect(store.items).toHaveLength(0)
  })
})
```

---

## Checklist

- [ ] Dùng Setup Store syntax (không dùng Options Store)
- [ ] Stores tổ chức theo domain, tên file `use*Store.ts`
- [ ] `storeToRefs()` khi destructure state/getters
- [ ] Actions xử lý loading và error state
- [ ] Không lưu sensitive data không cần thiết trong store
- [ ] Viết unit tests cho stores

---

## Tham khảo

- [Pinia Official Docs](https://pinia.vuejs.org/)
- [Pinia — Setup Stores](https://pinia.vuejs.org/core-concepts/#setup-stores)
- [pinia-plugin-persistedstate](https://prazdevs.github.io/pinia-plugin-persistedstate/)
