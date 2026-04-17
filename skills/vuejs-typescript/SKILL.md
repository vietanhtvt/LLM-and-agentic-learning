# vuejs-typescript

**Hướng dẫn TypeScript nâng cao trong Vue 3. Áp dụng khi cần type-safe components, composables, và stores.**

---

## 1. Component props typing — generics và conditional types

**Dùng TypeScript generics để tạo component linh hoạt mà vẫn type-safe.**

```typescript
// ✅ Generic component
<script setup lang="ts" generic="T extends { id: string }">
const props = defineProps<{
  items: T[]
  selected?: T | null
  renderItem: (item: T) => string
}>()

const emit = defineEmits<{
  select: [item: T]
}>()
</script>

// Dùng: TypeScript infer T từ items prop
<GenericList
  :items="products"      // T = Product
  :render-item="p => p.name"
  @select="handleSelect" // (item: Product) => void
/>
```

```typescript
// ✅ Conditional props (exclusive options)
type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
} & (
  | { href: string; type?: never }      // Link button
  | { href?: never; type?: 'button' | 'submit' | 'reset' }  // Regular button
)

const props = defineProps<ButtonProps>()
```

---

## 2. Template ref typing — HTMLElement và component refs

**Luôn type template refs đầy đủ. Không dùng `any` hoặc `HTMLElement` chung.**

```typescript
// ✅ DOM element refs
const inputRef = ref<HTMLInputElement | null>(null)
const formRef = ref<HTMLFormElement | null>(null)
const videoRef = ref<HTMLVideoElement | null>(null)

// Access safely
function focusInput() {
  inputRef.value?.focus()
}

// ✅ Component refs — dùng InstanceType
import type MyModal from '@/components/MyModal.vue'
const modalRef = ref<InstanceType<typeof MyModal> | null>(null)

// Sau khi defineExpose trong MyModal:
modalRef.value?.open()
modalRef.value?.close()
```

---

## 3. Composable return types — explicit types

**Type return type của composable thay vì dùng type inference.**

```typescript
// ✅ Explicit return type cho composable public API
interface UsePaginationReturn<T> {
  items: Readonly<Ref<T[]>>
  currentPage: Ref<number>
  totalPages: Readonly<Ref<number>>
  loading: Readonly<Ref<boolean>>
  goToPage: (page: number) => Promise<void>
  nextPage: () => Promise<void>
  prevPage: () => Promise<void>
}

export function usePagination<T>(
  fetchFn: (page: number) => Promise<{ data: T[]; total: number }>,
  perPage = 10
): UsePaginationReturn<T> {
  // implementation
}
```

```typescript
// ✅ MaybeRefOrGetter — composable nhận cả ref và value
import type { MaybeRefOrGetter } from 'vue'

export function useFormatDate(
  date: MaybeRefOrGetter<Date | string | null>,
  locale: MaybeRefOrGetter<string> = 'vi-VN'
): ComputedRef<string> {
  return computed(() => {
    const d = toValue(date)
    const l = toValue(locale)
    if (!d) return ''
    return new Intl.DateTimeFormat(l).format(new Date(d))
  })
}

// Dùng:
useFormatDate(new Date())          // ✅ raw value
useFormatDate(dateRef)             // ✅ ref
useFormatDate(() => user.value?.createdAt) // ✅ getter
```

---

## 4. Emit typing — Vue 3.3+ named tuple syntax

**Dùng named tuple syntax cho emit type. Rõ ràng hơn, tài liệu tốt hơn.**

```typescript
// ✅ Vue 3.3+ — named tuple syntax (khuyên dùng)
const emit = defineEmits<{
  change: [value: string]
  submit: [payload: FormData, isValid: boolean]
  'update:modelValue': [value: number]
  error: [error: Error, context: string]
}>()

// ❌ Old tuple syntax — không có tên param
const emit = defineEmits<{
  (e: 'change', value: string): void
  (e: 'submit', payload: FormData): void
}>()
```

---

## 5. Type utilities — utility types cho Vue 3

**Dùng các utility types có sẵn của TypeScript và Vue để tránh lặp code.**

```typescript
// ✅ ExtractPropTypes — lấy prop types của component
import type { ExtractPropTypes, PropType } from 'vue'

// Khi cần dùng prop types của component bên ngoài
type ButtonProps = ExtractPropTypes<typeof Button>

// ✅ ComponentPublicInstance — type instance của component
import type { ComponentPublicInstance } from 'vue'
type ModalInstance = ComponentPublicInstance<{}, { open(): void; close(): void }>

// ✅ Partial props với defaults
function createDefaultProps<T extends object>(defaults: Partial<T>): T {
  return defaults as T
}
```

```typescript
// ✅ Type guards cho API responses
interface ApiResponse<T> {
  data: T
  status: 'success' | 'error'
  message?: string
}

function isSuccessResponse<T>(response: ApiResponse<T>): response is ApiResponse<T> & { status: 'success' } {
  return response.status === 'success'
}

// ✅ Discriminated union cho state management
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error }

const state = ref<AsyncState<User[]>>({ status: 'idle' })

// Narrowing
if (state.value.status === 'success') {
  console.log(state.value.data) // User[]
}
```

---

## 6. Store typing với Pinia

**Type stores đầy đủ. Dùng generic types cho reusable store patterns.**

```typescript
// ✅ Typed store với explicit interface
interface UserState {
  user: User | null
  permissions: string[]
  lastFetched: Date | null
}

export const useUserStore = defineStore('user', () => {
  const state = ref<UserState>({
    user: null,
    permissions: [],
    lastFetched: null
  })

  const isAdmin = computed((): boolean =>
    state.value.permissions.includes('admin')
  )

  async function fetchUser(id: string): Promise<void> {
    const data = await userService.getById(id)
    state.value.user = data
    state.value.lastFetched = new Date()
  }

  return { state, isAdmin, fetchUser }
})

// ✅ Infer store type cho use ở chỗ khác
type UserStore = ReturnType<typeof useUserStore>
```

```typescript
// ✅ Generic store factory — reusable CRUD store pattern
function defineCRUDStore<T extends { id: string }>(name: string, service: CRUDService<T>) {
  return defineStore(name, () => {
    const items = ref<T[]>([])
    const loading = ref(false)
    const selected = ref<T | null>(null)

    async function fetchAll(): Promise<void> {
      loading.value = true
      try {
        items.value = await service.getAll()
      } finally {
        loading.value = false
      }
    }

    async function create(data: Omit<T, 'id'>): Promise<T> {
      const item = await service.create(data)
      items.value.push(item)
      return item
    }

    async function update(id: string, data: Partial<T>): Promise<void> {
      const updated = await service.update(id, data)
      const index = items.value.findIndex(i => i.id === id)
      if (index !== -1) items.value[index] = updated
    }

    async function remove(id: string): Promise<void> {
      await service.delete(id)
      items.value = items.value.filter(i => i.id !== id)
    }

    return { items, loading, selected, fetchAll, create, update, remove }
  })
}
```

---

## 7. API types — type API responses

**Không dùng `any` cho API responses. Type đầy đủ với generic wrappers.**

```typescript
// ✅ src/types/api.ts — Base API types
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    perPage: number
    total: number
    totalPages: number
  }
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, string[]>
}

// ✅ src/types/models.ts — Domain types
export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user' | 'viewer'
  createdAt: string // ISO date string
  avatar?: string
}

export type CreateUserPayload = Pick<User, 'email' | 'name' | 'role'>
export type UpdateUserPayload = Partial<CreateUserPayload>
```

---

## 8. Strict mode và cấu hình TypeScript

**Bật strict mode. Không bypass TypeScript với any hoặc type assertion không cần thiết.**

```json
// ✅ tsconfig.json chuẩn cho Vue 3
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "jsx": "preserve",
    "lib": ["ESNext", "DOM"],
    "paths": {
      "@/*": ["./src/*"]
    },
    "verbatimModuleSyntax": true
  },
  "include": ["src/**/*.ts", "src/**/*.vue", "src/**/*.tsx"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

```typescript
// ❌ Không dùng type assertion vô cớ
const element = document.getElementById('app') as HTMLDivElement // Có thể null!

// ✅ Dùng non-null assertion chỉ khi chắc chắn + comment giải thích
const element = document.getElementById('app')!  // App.vue always mounts to #app

// ✅ Hoặc narrow type properly
const element = document.getElementById('app')
if (!(element instanceof HTMLDivElement)) throw new Error('#app must be a div')

// ❌ Không dùng any
function processData(data: any) { ... }

// ✅ Dùng unknown + type guard
function processData(data: unknown): ProcessedData {
  if (!isValidData(data)) throw new TypeError('Invalid data')
  return transform(data)
}
```

---

## 9. Enums và const objects — không dùng enum

**Dùng `const` object + `typeof` thay vì TypeScript enums.**

```typescript
// ❌ TypeScript enum — có vấn đề về tree-shaking
enum UserRole {
  Admin = 'admin',
  User = 'user',
  Viewer = 'viewer'
}

// ✅ Const object — better runtime, tree-shakeable
export const USER_ROLES = {
  Admin: 'admin',
  User: 'user',
  Viewer: 'viewer'
} as const

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES]
// UserRole = 'admin' | 'user' | 'viewer'

// ✅ Dùng
const role: UserRole = USER_ROLES.Admin
function setRole(role: UserRole) { ... }
```

---

## 10. Template typing — type-safe template expressions

**Dùng `vue-tsc` để type-check templates. Các lỗi phổ biến cần tránh.**

```bash
# Chạy trong CI
npx vue-tsc --noEmit
```

```vue
<!-- ✅ Đúng — TypeScript trong template -->
<script setup lang="ts">
const items = ref<Array<{ id: string; label: string }>>([])
const selected = ref<string | null>(null)
</script>

<template>
  <!-- ✅ type-safe computed lookup -->
  <div v-for="item in items" :key="item.id">
    <!-- item.id là string, không phải any -->
    <button :class="{ active: item.id === selected }">
      {{ item.label }}
    </button>
  </div>

  <!-- ❌ Dùng $event mà không type -->
  <input @change="handleChange($event)" />
  <!-- ✅ Type event parameter -->
  <input @change="(e: Event) => handleChange(e)" />
</template>
```

---

## Anti-patterns

| Anti-pattern | Fix |
|---|---|
| `any` trong props, return types | Dùng `unknown`, type guards, hoặc generics |
| `as Type` assertion thay cho type guard | `instanceof`, discriminated union, type guard function |
| Enum thay vì `const` object | `const OBJ = { ... } as const` + `typeof OBJ[keyof typeof OBJ]` |
| Không type return value của composable | Explicit interface `interface UseFooReturn { ... }` |
| `ref<any>([])` cho list | `ref<Product[]>([])` |
| `HTMLElement` chung cho template refs | `HTMLInputElement`, `HTMLFormElement` cụ thể |
| Không chạy `vue-tsc` trong CI | Thêm `vue-tsc --noEmit` vào pre-commit / CI |
| `!` non-null assertion vô căn cứ | Narrow type với `if` hoặc optional chaining `?.` |
| Type toàn file là `interface` | Dùng `type` cho union types, `interface` cho object shapes |
