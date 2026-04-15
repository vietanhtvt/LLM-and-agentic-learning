# Vue Testing Skill

> Vitest + @vue/test-utils + Playwright — chiến lược test toàn diện cho Vue 3.

**Impact:** High | **Loại:** Capability

---

## Nguyên tắc cốt lõi

- **Test behavior, not implementation** — test những gì user thấy/làm, không test internals.
- **Vitest** cho unit & component tests, **Playwright** cho E2E.
- Dùng `mount` cho integration tests, `shallowMount` cho unit tests component.
- Viết tests **trước hoặc ngay sau** khi code feature, không để dồn lại.
- Target **> 80% coverage** cho business logic, không cần 100% cho mọi thứ.

---

## Cấu hình Vitest

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'url'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['src/test/**', '**/*.d.ts'],
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
```

```typescript
// src/test/setup.ts
import { config } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

// Global stubs nếu cần
config.global.stubs = {
  RouterLink: true,
  RouterView: true,
}
```

---

## Component Testing với Vue Test Utils

### Test cơ bản

```typescript
// components/__tests__/UserCard.test.ts
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import UserCard from '../UserCard.vue'

const mockUser = {
  id: '1',
  name: 'Alice',
  email: 'alice@example.com',
  avatar: '/avatar.jpg',
}

describe('UserCard', () => {
  it('renders user name', () => {
    const wrapper = mount(UserCard, {
      props: { user: mockUser },
    })
    expect(wrapper.text()).toContain('Alice')
  })

  it('shows avatar when showAvatar is true', () => {
    const wrapper = mount(UserCard, {
      props: { user: mockUser, showAvatar: true },
    })
    expect(wrapper.find('img').exists()).toBe(true)
    expect(wrapper.find('img').attributes('alt')).toBe('Alice')
  })

  it('hides avatar when showAvatar is false', () => {
    const wrapper = mount(UserCard, {
      props: { user: mockUser, showAvatar: false },
    })
    expect(wrapper.find('img').exists()).toBe(false)
  })

  it('emits select event when clicked', async () => {
    const wrapper = mount(UserCard, {
      props: { user: mockUser },
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted('select')).toBeTruthy()
    expect(wrapper.emitted('select')![0]).toEqual([mockUser])
  })
})
```

### Testing với Pinia

```typescript
// components/__tests__/CartButton.test.ts
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { useCartStore } from '@/stores/useCartStore'
import CartButton from '../CartButton.vue'

describe('CartButton', () => {
  it('shows item count from store', () => {
    const wrapper = mount(CartButton, {
      global: {
        plugins: [createTestingPinia({
          initialState: {
            cart: { items: [{ id: '1' }, { id: '2' }] },
          },
        })],
      },
    })
    expect(wrapper.text()).toContain('2')
  })

  it('calls addItem action when clicked', async () => {
    const wrapper = mount(CartButton, {
      props: { productId: 'abc' },
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
    })

    const cartStore = useCartStore()
    await wrapper.find('button').trigger('click')
    expect(cartStore.addItem).toHaveBeenCalledWith('abc')
  })
})
```

---

## Testing Composables

```typescript
// composables/__tests__/useCounter.test.ts
import { describe, it, expect } from 'vitest'
import { useCounter } from '../useCounter'

describe('useCounter', () => {
  it('increments count', () => {
    const { count, increment } = useCounter()
    expect(count.value).toBe(0)
    increment()
    expect(count.value).toBe(1)
  })

  it('resets to initial value', () => {
    const { count, increment, reset } = useCounter(5)
    increment()
    reset()
    expect(count.value).toBe(5)
  })
})
```

### Composable với lifecycle hooks

```typescript
// composables/__tests__/useWindowSize.test.ts
import { mount } from '@vue/test-utils'
import { useWindowSize } from '../useWindowSize'

// Cần wrap trong component để lifecycle hooks chạy đúng
describe('useWindowSize', () => {
  it('returns window dimensions', () => {
    let width: number, height: number

    mount({
      setup() {
        const size = useWindowSize()
        width = size.width.value
        height = size.height.value
      },
      template: '<div />',
    })

    expect(width).toBe(window.innerWidth)
    expect(height).toBe(window.innerHeight)
  })
})
```

---

## Testing Pinia Stores

```typescript
// stores/__tests__/useAuthStore.test.ts
import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAuthStore } from '../useAuthStore'
import * as authApi from '@/api/auth'

vi.mock('@/api/auth')

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('sets user on successful login', async () => {
    const mockUser = { id: '1', name: 'Alice' }
    vi.mocked(authApi.login).mockResolvedValue(mockUser)

    const store = useAuthStore()
    await store.login('alice@test.com', 'password')

    expect(store.currentUser).toEqual(mockUser)
    expect(store.isAuthenticated).toBe(true)
    expect(store.error).toBeNull()
  })

  it('sets error on failed login', async () => {
    vi.mocked(authApi.login).mockRejectedValue(new Error('Invalid credentials'))

    const store = useAuthStore()
    await store.login('bad@test.com', 'wrong')

    expect(store.currentUser).toBeNull()
    expect(store.error).toBe('Invalid credentials')
  })
})
```

---

## Testing Forms

```typescript
// components/__tests__/LoginForm.test.ts
import { mount } from '@vue/test-utils'
import LoginForm from '../LoginForm.vue'

describe('LoginForm', () => {
  it('emits submit with email and password', async () => {
    const wrapper = mount(LoginForm)

    await wrapper.find('[data-testid="email-input"]').setValue('user@test.com')
    await wrapper.find('[data-testid="password-input"]').setValue('secret123')
    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('submit')).toBeTruthy()
    expect(wrapper.emitted('submit')![0]).toEqual([{
      email: 'user@test.com',
      password: 'secret123',
    }])
  })

  it('shows validation error for empty email', async () => {
    const wrapper = mount(LoginForm)
    await wrapper.find('form').trigger('submit')

    expect(wrapper.text()).toContain('Email is required')
  })
})
```

---

## Async Tests

```typescript
it('loads and displays users', async () => {
  vi.mocked(fetchUsers).mockResolvedValue([{ id: '1', name: 'Alice' }])

  const wrapper = mount(UserList)

  // Đợi async operations hoàn thành
  await flushPromises()

  expect(wrapper.findAll('[data-testid="user-item"]')).toHaveLength(1)
  expect(wrapper.text()).toContain('Alice')
})
```

---

## Checklist

- [ ] Tests đặt cạnh component (`__tests__/` folder)
- [ ] Dùng `data-testid` attributes cho selectors, không dùng CSS classes
- [ ] `mount` cho integration tests, `shallowMount` chỉ khi cần isolate
- [ ] Mock API calls với `vi.mock()`
- [ ] `createTestingPinia` cho tests cần Pinia
- [ ] `flushPromises()` sau async operations
- [ ] Test error states và loading states

---

## Tham khảo

- [Vitest Official Docs](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [@pinia/testing](https://pinia.vuejs.org/cookbook/testing.html)
