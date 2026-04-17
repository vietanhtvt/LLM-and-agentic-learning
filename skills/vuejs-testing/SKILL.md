# vuejs-testing

**Hướng dẫn viết test cho Vue 3 với Vitest và Vue Test Utils. Test behavior, không test implementation.**

---

## 1. Setup test environment

```typescript
// ✅ vitest.config.ts
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'url'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts']
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
```

```typescript
// ✅ tests/setup.ts
import { config } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

// Global mocks, plugins setup nếu cần
```

---

## 2. Nguyên tắc cốt lõi

**Test từ góc nhìn người dùng: render → interact → assert output. Không test internal state.**

```typescript
// ✅ Đúng — test behavior
it('hiển thị số sản phẩm trong giỏ hàng', () => {
  const wrapper = mount(CartIcon, {
    props: { itemCount: 3 }
  })
  expect(wrapper.find('[data-testid="count"]').text()).toBe('3')
})

// ❌ Sai — test implementation detail
it('cập nhật internal state', () => {
  const wrapper = mount(CartIcon, { props: { itemCount: 3 } })
  expect((wrapper.vm as any).localCount).toBe(3) // Test internal!
})
```

---

## 3. Mount helpers — tránh lặp setup

**Tạo factory function để mount component với defaults. Dễ thay đổi khi API thay đổi.**

```typescript
// ✅ Factory function
function createWrapper(props: Partial<LoginFormProps> = {}) {
  return mount(LoginForm, {
    global: {
      plugins: [createTestingPinia()]
    },
    props: {
      onSuccess: vi.fn(),
      ...props
    }
  })
}

describe('LoginForm', () => {
  it('hiển thị form', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('input[type="email"]').exists()).toBe(true)
    expect(wrapper.find('input[type="password"]').exists()).toBe(true)
  })

  it('disable submit khi đang loading', async () => {
    const wrapper = createWrapper({ isLoading: true })
    expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeDefined()
  })
})
```

---

## 4. Interact với component — trigger events

```typescript
// ✅ Các cách trigger event
const wrapper = mount(SearchBar)

// Click
await wrapper.find('button').trigger('click')

// Input text
await wrapper.find('input').setValue('hello world')

// Submit form
await wrapper.find('form').trigger('submit.prevent')

// Custom event
await wrapper.find('input').trigger('keyup.enter')

// Kiểm tra emit
expect(wrapper.emitted('search')).toBeTruthy()
expect(wrapper.emitted('search')?.[0]).toEqual(['hello world'])
```

---

## 5. Test với Pinia stores

**Mock Pinia bằng `createTestingPinia()` từ `@pinia/testing`. Không import store thật trong unit test.**

```typescript
import { createTestingPinia } from '@pinia/testing'
import { useAuthStore } from '@/stores/auth'

describe('UserProfile', () => {
  it('hiển thị tên user khi đã đăng nhập', () => {
    const wrapper = mount(UserProfile, {
      global: {
        plugins: [createTestingPinia({
          initialState: {
            auth: { user: { name: 'Nguyễn Văn A', email: 'a@test.com' } }
          }
        })]
      }
    })
    expect(wrapper.text()).toContain('Nguyễn Văn A')
  })

  it('gọi logout khi click button', async () => {
    const wrapper = mount(UserProfile, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })]
      }
    })
    const store = useAuthStore()
    await wrapper.find('[data-testid="logout-btn"]').trigger('click')
    expect(store.logout).toHaveBeenCalledOnce()
  })
})
```

---

## 6. Test async component — waitFor và flushPromises

```typescript
import { flushPromises } from '@vue/test-utils'

describe('ProductList', () => {
  beforeEach(() => {
    // Mock API
    vi.spyOn(productService, 'getAll').mockResolvedValue([
      { id: '1', name: 'iPhone', price: 999 }
    ])
  })

  it('hiển thị loading rồi hiển thị data', async () => {
    const wrapper = mount(ProductList)

    // Kiểm tra loading state
    expect(wrapper.find('[data-testid="loading"]').exists()).toBe(true)

    // Chờ async hoàn thành
    await flushPromises()

    // Kiểm tra data đã render
    expect(wrapper.find('[data-testid="loading"]').exists()).toBe(false)
    expect(wrapper.findAll('[data-testid="product-item"]')).toHaveLength(1)
    expect(wrapper.text()).toContain('iPhone')
  })

  it('hiển thị error khi API thất bại', async () => {
    vi.spyOn(productService, 'getAll').mockRejectedValue(new Error('Network error'))

    const wrapper = mount(ProductList)
    await flushPromises()

    expect(wrapper.find('[data-testid="error-msg"]').text()).toBe('Không thể tải sản phẩm')
  })
})
```

---

## 7. Test Vue Router

```typescript
import { createRouter, createMemoryHistory } from 'vue-router'

function createRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: Home },
      { path: '/login', component: Login },
      { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } }
    ]
  })
}

describe('Navigation', () => {
  it('redirect về login khi chưa auth', async () => {
    const router = createRouter()
    router.beforeEach((to, _, next) => {
      if (to.meta.requiresAuth && !isAuthenticated()) {
        next('/login')
      } else {
        next()
      }
    })

    await router.push('/dashboard')
    expect(router.currentRoute.value.path).toBe('/login')
  })
})
```

---

## 8. Test composables — thuần unit test

**Composable là pure function với Vue reactivity — test trực tiếp không cần mount component.**

```typescript
import { useCounter } from '@/composables/useCounter'

describe('useCounter', () => {
  it('bắt đầu với giá trị 0', () => {
    const { count } = useCounter()
    expect(count.value).toBe(0)
  })

  it('tăng count', () => {
    const { count, increment } = useCounter()
    increment()
    expect(count.value).toBe(1)
  })

  it('reset về 0', () => {
    const { count, increment, reset } = useCounter()
    increment()
    increment()
    reset()
    expect(count.value).toBe(0)
  })
})

// Composable có async/lifecycle cần withSetup wrapper
function withSetup<T>(composable: () => T) {
  let result: T
  const app = createApp({
    setup() {
      result = composable()
      return () => {}
    }
  })
  app.mount(document.createElement('div'))
  return { result: result!, app }
}
```

---

## 9. Test conventions và data-testid

**Dùng `data-testid` để query element — không dùng CSS class vì có thể thay đổi khi refactor styling.**

```vue
<!-- ✅ Template với data-testid -->
<template>
  <form data-testid="login-form">
    <input data-testid="email-input" type="email" v-model="email" />
    <input data-testid="password-input" type="password" v-model="password" />
    <p v-if="error" data-testid="error-message">{{ error }}</p>
    <button data-testid="submit-btn" type="submit">Đăng nhập</button>
  </form>
</template>
```

```typescript
// ✅ Query bằng data-testid
const emailInput = wrapper.find('[data-testid="email-input"]')
const submitBtn = wrapper.find('[data-testid="submit-btn"]')

// ✅ findByRole — accessible queries
const submitBtn = wrapper.find('button[type="submit"]')

// ❌ Tránh query bằng class
const btn = wrapper.find('.btn-primary.submit') // Fragile!
```

---

## 10. Coverage và cấu trúc test

```
tests/
  unit/
    components/     # Component tests
    composables/    # Composable tests
    stores/         # Store tests (với createTestingPinia)
    utils/          # Pure function tests
  integration/      # Multi-component interaction tests
  e2e/              # Playwright/Cypress end-to-end tests
```

**Mục tiêu coverage:**
- Business logic (composables, stores): 80%+
- UI components: test happy path + error states + edge cases
- Pure utils: 100%
- Không đặt mục tiêu coverage làm metric chính — chất lượng test quan trọng hơn số %

---

## 11. MSW — mock API ở network level

**Mock Service Worker (MSW) intercept HTTP requests — test thực tế hơn `vi.mock()`.**

```typescript
// ✅ tests/mocks/handlers.ts
import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/products', () => {
    return HttpResponse.json([
      { id: '1', name: 'iPhone', price: 999 }
    ])
  }),

  http.post('/api/products', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ id: '2', ...body }, { status: 201 })
  }),

  http.get('/api/products/:id', ({ params }) => {
    if (params.id === 'not-found') {
      return HttpResponse.json({ error: 'Not found' }, { status: 404 })
    }
    return HttpResponse.json({ id: params.id, name: 'Product', price: 100 })
  })
]

// ✅ tests/setup.ts — khởi động MSW server
import { setupServer } from 'msw/node'
import { handlers } from './mocks/handlers'

const server = setupServer(...handlers)
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

---

## 12. Snapshot testing — dùng đúng chỗ

**Snapshot hữu ích cho component output ổn định. Không dùng cho dynamic content.**

```typescript
// ✅ Snapshot cho UI components tĩnh
it('renders primary button correctly', () => {
  const wrapper = mount(BaseButton, {
    props: { variant: 'primary', label: 'Submit' }
  })
  expect(wrapper.html()).toMatchSnapshot()
})

// ✅ Inline snapshot cho small outputs
it('renders user avatar', () => {
  const wrapper = mount(UserAvatar, { props: { name: 'Nguyễn A' } })
  expect(wrapper.find('[data-testid="avatar-initials"]').text()).toMatchInlineSnapshot('"NA"')
})

// ❌ Snapshot cho dynamic content (date, random ID) → flaky tests
it('renders product card', () => {
  expect(wrapper.html()).toMatchSnapshot() // Sẽ fail mỗi khi date thay đổi!
})
