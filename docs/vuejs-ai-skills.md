# Tổng Hợp AI Skills cho Vue.js Tech Stack

> Tài liệu này tổng hợp các kỹ năng, prompt templates và best practices khi sử dụng AI (LLM) để phát triển ứng dụng Vue.js hiệu quả.

---

## Mục Lục

1. [Thiết Lập Context cho AI](#1-thiết-lập-context-cho-ai)
2. [Component Development](#2-component-development)
3. [Composition API & Composables](#3-composition-api--composables)
4. [State Management với Pinia](#4-state-management-với-pinia)
5. [Vue Router](#5-vue-router)
6. [Form & Validation](#6-form--validation)
7. [API Integration](#7-api-integration)
8. [Performance Optimization](#8-performance-optimization)
9. [Testing](#9-testing)
10. [TypeScript với Vue](#10-typescript-với-vue)
11. [Agentic Workflows](#11-agentic-workflows)
12. [Prompt Templates Mẫu](#12-prompt-templates-mẫu)

---

## 1. Thiết Lập Context cho AI

### Skill: Cung cấp Tech Stack Context

Trước khi làm việc với AI, luôn cung cấp đầy đủ context về tech stack hiện tại.

**Prompt Template:**
```
Tech stack của dự án:
- Framework: Vue 3 (Composition API)
- Build tool: Vite
- State: Pinia
- Router: Vue Router 4
- UI: [Tailwind CSS / Element Plus / Vuetify]
- HTTP: Axios
- Testing: Vitest + Vue Test Utils
- Language: TypeScript

[Yêu cầu của bạn ở đây]
```

**Mẹo:**
- Tạo file `CLAUDE.md` ở root dự án để AI tự động đọc context
- Luôn chỉ rõ Vue 2 hay Vue 3, Options API hay Composition API
- Đề cập version của các dependencies quan trọng

### CLAUDE.md Template cho Vue.js Project

```markdown
# Vue.js Project Context

## Tech Stack
- Vue 3 + Composition API (`<script setup>` syntax)
- TypeScript (strict mode)
- Vite 5
- Pinia for state management
- Vue Router 4
- Tailwind CSS
- Axios for HTTP
- Vitest + Vue Test Utils for testing
- ESLint + Prettier

## Code Style
- Sử dụng `<script setup>` cho tất cả components
- Dùng `defineProps` và `defineEmits` với TypeScript types
- Composables đặt trong `src/composables/`
- Stores đặt trong `src/stores/`
- Mỗi component có file test tương ứng

## Conventions
- Component names: PascalCase
- Composable names: `useXxx`
- Store names: `useXxxStore`
- File names: kebab-case cho non-component files
```

---

## 2. Component Development

### Skill: Tạo Vue SFC (Single File Component)

**Prompt Template - Component cơ bản:**
```
Tạo Vue 3 component với <script setup> và TypeScript cho:
[Mô tả component]

Yêu cầu:
- Props: [danh sách props]
- Emits: [danh sách events]
- Slots: [named slots nếu cần]
- Accessibility: ARIA labels phù hợp
```

**Ví dụ Output tốt:**
```vue
<!-- UserCard.vue -->
<script setup lang="ts">
interface Props {
  userId: number
  name: string
  email: string
  avatar?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  edit: [userId: number]
  delete: [userId: number]
}>()
</script>

<template>
  <div class="user-card" role="article">
    <img :src="avatar ?? defaultAvatar" :alt="`Avatar của ${name}`" />
    <h3>{{ name }}</h3>
    <p>{{ email }}</p>
    <button @click="emit('edit', userId)">Sửa</button>
    <button @click="emit('delete', userId)">Xóa</button>
  </div>
</template>
```

### Skill: Refactor từ Options API sang Composition API

**Prompt Template:**
```
Chuyển đổi Vue component sau từ Options API sang Composition API với <script setup>:

[Paste component Options API vào đây]

Yêu cầu:
- Giữ nguyên logic, chỉ thay đổi cú pháp
- Dùng TypeScript types thích hợp
- Tách logic phức tạp thành composables nếu phù hợp
```

### Skill: Component Patterns

| Pattern | Khi nào dùng | Prompt gợi ý |
|---------|-------------|-------------|
| Renderless Component | Tái sử dụng logic không kèm UI | "Tạo renderless component cho [logic]" |
| Compound Components | UI phức tạp có nhiều phần | "Tạo compound component pattern cho [UI]" |
| Higher-Order Component | Wrap và extend component | "Tạo HOC để thêm [feature] vào component" |
| Async Component | Lazy loading | "Tạo async component với loading/error states" |

---

## 3. Composition API & Composables

### Skill: Tạo Composables Tái Sử Dụng

**Prompt Template:**
```
Tạo Vue 3 composable `use[TênFeature]` để:
[Mô tả chức năng]

Yêu cầu:
- TypeScript types đầy đủ
- Xử lý cleanup trong onUnmounted
- Expose reactive state và methods
- Viết JSDoc comments
```

**Ví dụ - useLocalStorage:**
```typescript
// composables/useLocalStorage.ts
import { ref, watch } from 'vue'

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const stored = localStorage.getItem(key)
  const data = ref<T>(stored ? JSON.parse(stored) : defaultValue)

  watch(data, (newValue) => {
    localStorage.setItem(key, JSON.stringify(newValue))
  }, { deep: true })

  return data
}
```

### Skill: Lifecycle Hooks Best Practices

**Prompt Template:**
```
Component này có vấn đề với [memory leak / race condition / stale closure].
Phân tích và fix sử dụng lifecycle hooks phù hợp:

[Paste component code]
```

### Composables Phổ Biến Cần Nắm

```
Yêu cầu AI tạo các composables sau cho dự án Vue 3:

1. useAsync - Quản lý async operations (loading, error, data)
2. useDebounce - Debounce reactive value
3. useIntersectionObserver - Lazy loading / infinite scroll
4. usePagination - Phân trang
5. useForm - Form state management
6. usePermission - Kiểm tra quyền user
7. useBreakpoint - Responsive breakpoints
```

---

## 4. State Management với Pinia

### Skill: Thiết Kế Pinia Store

**Prompt Template:**
```
Tạo Pinia store cho [tên feature] với:
- State: [danh sách state properties]
- Getters: [computed values cần thiết]
- Actions: [các actions bao gồm API calls]

Tech stack: Vue 3 + TypeScript + Axios
API endpoint: [mô tả API]
```

**Pattern tốt cho Pinia Store:**
```typescript
// stores/useUserStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'
import { userApi } from '@/api/user'

export const useUserStore = defineStore('user', () => {
  // State
  const users = ref<User[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const activeUsers = computed(() =>
    users.value.filter(u => u.isActive)
  )

  // Actions
  async function fetchUsers() {
    loading.value = true
    error.value = null
    try {
      users.value = await userApi.getAll()
    } catch (e) {
      error.value = 'Không thể tải danh sách user'
    } finally {
      loading.value = false
    }
  }

  return { users, loading, error, activeUsers, fetchUsers }
})
```

### Skill: Migrate từ Vuex sang Pinia

**Prompt Template:**
```
Chuyển đổi Vuex module sau sang Pinia store:
[Paste Vuex module]

Lưu ý:
- Bỏ mutations, chuyển logic vào actions
- Sử dụng setup store syntax
- Giữ nguyên tên getters và actions để tránh breaking changes
```

---

## 5. Vue Router

### Skill: Cấu Hình Router với Auth Guards

**Prompt Template:**
```
Tạo Vue Router 4 configuration với:
- Routes: [danh sách pages]
- Auth guard: redirect về /login nếu chưa đăng nhập
- Role-based access: [các roles và permissions]
- Lazy loading cho tất cả route components
- Meta fields cho page title và breadcrumbs
```

**Pattern Navigation Guard:**
```typescript
// router/guards.ts
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export async function authGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }

  if (to.meta.roles && !auth.hasRole(to.meta.roles as string[])) {
    next({ name: 'Forbidden' })
    return
  }

  next()
}
```

---

## 6. Form & Validation

### Skill: Form với VeeValidate + Zod

**Prompt Template:**
```
Tạo form Vue 3 cho [loại form: đăng ký / đăng nhập / tạo sản phẩm] với:
- VeeValidate 4 + Zod schema validation
- TypeScript types
- Xử lý submit với loading state
- Hiển thị lỗi inline dưới mỗi field
- Reset form sau khi submit thành công
```

**Zod Schema Pattern:**
```typescript
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'

const schema = toTypedSchema(z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(8, 'Mật khẩu tối thiểu 8 ký tự'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Mật khẩu không khớp',
  path: ['confirmPassword']
}))

const { handleSubmit, errors } = useForm({ validationSchema: schema })
```

---

## 7. API Integration

### Skill: Axios Instance với Interceptors

**Prompt Template:**
```
Tạo Axios instance cho Vue 3 project với:
- Base URL từ env variables
- Request interceptor: thêm Authorization header từ Pinia auth store
- Response interceptor: xử lý 401 (refresh token), 403, 500
- TypeScript generic types cho API responses
- Request/response logging trong development mode
```

**Pattern API Layer:**
```typescript
// api/base.ts
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10_000
})

api.interceptors.request.use((config) => {
  const { token } = useAuthStore()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response?.status === 401) {
      // Refresh token logic
    }
    return Promise.reject(error)
  }
)

export default api
```

### Skill: Composable cho API Calls

**Prompt Template:**
```
Tạo composable `useApi` có thể tái sử dụng với:
- Generic types cho request/response
- Loading, error, data states
- AbortController để cancel request khi component unmount
- Retry logic với exponential backoff
- Cache cho GET requests
```

---

## 8. Performance Optimization

### Skill: Phân Tích và Tối Ưu Component

**Prompt Template:**
```
Phân tích Vue component sau và đề xuất cải thiện hiệu năng:
[Paste component]

Kiểm tra:
- Computed vs method usage
- v-if vs v-show
- Key trong v-for
- Unnecessary re-renders
- Memory leaks trong watchers/event listeners
```

### Checklist Tối Ưu Vue 3

```
Hãy review code Vue 3 của tôi theo checklist sau và đề xuất cải thiện:

Performance:
- [ ] Dùng shallowRef cho large objects không cần deep reactivity
- [ ] v-memo cho lists tĩnh hoặc ít thay đổi
- [ ] defineAsyncComponent cho heavy components
- [ ] Virtualization (vue-virtual-scroller) cho lists dài

Bundle Size:
- [ ] Tree-shaking UI library imports
- [ ] Dynamic imports cho routes
- [ ] Tránh import toàn bộ thư viện

Reactivity:
- [ ] markRaw cho objects không cần reactive
- [ ] Tránh mutations trực tiếp trong templates
```

---

## 9. Testing

### Skill: Viết Tests với Vue Test Utils + Vitest

**Prompt Template:**
```
Viết unit tests cho Vue component sau:
[Paste component]

Yêu cầu:
- Test với Vitest + Vue Test Utils
- Cover: render đúng, props, emits, user interactions
- Mock Pinia store và Vue Router nếu cần
- Test accessibility với ARIA roles
- Snapshot test cho UI ổn định
```

**Pattern Test chuẩn:**
```typescript
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { describe, it, expect, vi } from 'vitest'
import UserCard from './UserCard.vue'

describe('UserCard', () => {
  const defaultProps = {
    userId: 1,
    name: 'Nguyen Van A',
    email: 'test@example.com'
  }

  it('renders user information correctly', () => {
    const wrapper = mount(UserCard, { props: defaultProps })
    expect(wrapper.text()).toContain('Nguyen Van A')
    expect(wrapper.text()).toContain('test@example.com')
  })

  it('emits edit event with userId when edit button clicked', async () => {
    const wrapper = mount(UserCard, { props: defaultProps })
    await wrapper.find('[data-testid="edit-btn"]').trigger('click')
    expect(wrapper.emitted('edit')?.[0]).toEqual([1])
  })
})
```

---

## 10. TypeScript với Vue

### Skill: Typing Props và Emits

**Prompt Template:**
```
Thêm TypeScript types đầy đủ cho Vue component:
[Paste component]

Yêu cầu:
- defineProps với generic syntax
- defineEmits với typed event payload
- Generic component nếu cần (e.g., DataTable<T>)
- Utility types như Partial, Pick, Omit khi phù hợp
```

### Skill: Generic Components

**Prompt Template:**
```
Tạo generic Vue 3 component `DataTable<T>` với:
- Generic type T cho data items
- Column definitions với type-safe accessor functions
- Sort, filter, pagination
- Slot để customize cell rendering
- TypeScript strict mode compatible
```

---

## 11. Agentic Workflows

### Skill: AI Agent cho Code Review Vue.js

Cấu hình AI agent tự động review Vue.js code với các tiêu chí:

```markdown
## Vue.js Code Review Checklist

### Component Structure
- SFC có đúng thứ tự: <script setup> → <template> → <style>?
- Component có quá nhiều responsibilities không? (>200 LOC xem xét tách)
- Props có validation đầy đủ?

### Reactivity
- Có unnecessary deep watchers không?
- Có side effects trong computed không?
- Có mutations trực tiếp trên props không?

### Performance
- Có render không cần thiết do thiếu key trong v-for?
- Có heavy computations trong template không nên có computed?

### Security
- Có v-html với untrusted content không?
- Có expose sensitive data trong template không?

### Accessibility
- Interactive elements có keyboard support?
- Images có alt text?
- Form elements có labels?
```

### Skill: Automated Refactoring Agent

**Prompt Template:**
```
Phân tích toàn bộ Vue component trong thư mục src/components/ và:

1. Tìm các components dùng Options API → đề xuất migration plan
2. Tìm duplicated logic → đề xuất composables để extract
3. Tìm inline styles → đề xuất CSS classes
4. Tìm hardcoded strings → đề xuất i18n keys

Ưu tiên theo impact: high / medium / low
```

---

## 12. Prompt Templates Mẫu

### Template 1: Tạo Feature Mới

```
Tôi đang xây dựng feature [Tên Feature] trong Vue 3 app.

## Context
- Tech stack: Vue 3, Pinia, Vue Router, TypeScript, Tailwind CSS
- Feature description: [Mô tả chi tiết]
- User stories: [Danh sách user stories]

## Yêu cầu kỹ thuật
- Components cần tạo: [Danh sách]
- Store changes: [State thay đổi]
- API endpoints: [Danh sách endpoints]
- Routes mới: [Danh sách routes]

## Constraints
- Không thay đổi existing store structure
- Phải support mobile responsive
- Cần unit tests

Hãy đề xuất implementation plan và bắt đầu với [component/store/api layer].
```

### Template 2: Debug Vue Component

```
Component Vue 3 của tôi có vấn đề: [Mô tả vấn đề]

## Triệu chứng
- [Triệu chứng 1]
- [Triệu chứng 2]

## Code
[Paste component code]

## Đã thử
- [Những gì đã thử]

## Console errors
[Paste errors nếu có]

Phân tích nguyên nhân và đề xuất fix.
```

### Template 3: Optimize Performance

```
Vue app của tôi bị chậm ở [trang/feature cụ thể].

## Metrics hiện tại
- First Contentful Paint: [x]ms
- Largest Contentful Paint: [x]ms
- Component render time: [x]ms

## Tech stack
Vue 3 + Vite + [other tools]

## Code liên quan
[Paste component/store code]

Phân tích bottlenecks và đề xuất optimizations theo mức độ ưu tiên.
```

### Template 4: Security Review

```
Review Vue 3 component này về security vulnerabilities:
[Paste component]

Kiểm tra:
1. XSS via v-html
2. CSRF trong form submissions
3. Exposed sensitive data trong state/localStorage
4. Insecure direct object references
5. Missing input sanitization

Đề xuất fixes cho từng issue tìm được.
```

### Template 5: Documentation Generation

```
Tạo documentation cho Vue 3 component sau theo format Storybook/VitePress:
[Paste component]

Bao gồm:
- Component description
- Props table (name, type, default, description)
- Events table
- Slots table
- Usage examples với code snippets
- Edge cases cần lưu ý
```

---

## Tài Nguyên Bổ Sung

| Tài nguyên | Mô tả |
|-----------|-------|
| [Vue 3 Docs](https://vuejs.org) | Official documentation |
| [Pinia Docs](https://pinia.vuejs.org) | State management |
| [VeeValidate](https://vee-validate.logaretm.com) | Form validation |
| [Vue Test Utils](https://test-utils.vuejs.org) | Testing utilities |
| [VueUse](https://vueuse.org) | Collection of composables |
| [Vue Router](https://router.vuejs.org) | Official router |

---

*Cập nhật lần cuối: 2026-04-15 | Phiên bản: 1.0*
