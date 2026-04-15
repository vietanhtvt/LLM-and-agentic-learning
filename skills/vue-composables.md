# Vue Composables Skill

> Custom composables và VueUse patterns — tái sử dụng logic có stateful.

**Impact:** Medium | **Loại:** Efficiency

---

## Nguyên tắc cốt lõi

- Composable tên bắt đầu bằng **`use`** (ví dụ: `useAuth`, `useForm`).
- Composable **luôn return reactive state** — không return plain values.
- Cleanup side effects trong **`onUnmounted`** (event listeners, timers, subscriptions).
- Composables là **pure functions** — dễ test, dễ compose.
- Ưu tiên dùng **VueUse** trước khi tự viết lại logic phổ biến.

---

## Cấu trúc Composable chuẩn

```typescript
// composables/useUsers.ts
import { ref, computed } from 'vue'
import type { Ref, ComputedRef } from 'vue'

interface User { id: string; name: string; email: string }

interface UseUsersReturn {
  users: Ref<User[]>
  isLoading: Ref<boolean>
  error: Ref<string | null>
  totalCount: ComputedRef<number>
  fetchUsers: () => Promise<void>
  refresh: () => Promise<void>
}

export function useUsers(): UseUsersReturn {
  const users = ref<User[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const totalCount = computed(() => users.value.length)

  async function fetchUsers() {
    isLoading.value = true
    error.value = null
    try {
      users.value = await usersApi.getAll()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch'
    } finally {
      isLoading.value = false
    }
  }

  const refresh = fetchUsers

  // Fetch on mount
  fetchUsers()

  return { users, isLoading, error, totalCount, fetchUsers, refresh }
}
```

---

## Lifecycle-aware Composables

```typescript
// composables/useEventListener.ts
import { onMounted, onUnmounted } from 'vue'

export function useEventListener(
  target: EventTarget | Ref<EventTarget | null>,
  event: string,
  handler: EventListener
) {
  onMounted(() => {
    const el = isRef(target) ? target.value : target
    el?.addEventListener(event, handler)
  })

  onUnmounted(() => {
    const el = isRef(target) ? target.value : target
    el?.removeEventListener(event, handler)
  })
}

// Sử dụng
function useKeyboard(key: string, callback: () => void) {
  useEventListener(window, 'keydown', (e: KeyboardEvent) => {
    if (e.key === key) callback()
  })
}
```

---

## Fetch Data Composable (Pattern phổ biến)

```typescript
// composables/useFetch.ts
import { ref, watchEffect, toValue } from 'vue'
import type { MaybeRefOrGetter } from 'vue'

export function useFetch<T>(url: MaybeRefOrGetter<string>) {
  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)
  const isLoading = ref(false)

  watchEffect(async () => {
    const resolvedUrl = toValue(url)
    if (!resolvedUrl) return

    isLoading.value = true
    data.value = null
    error.value = null

    try {
      const res = await fetch(resolvedUrl)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      data.value = await res.json()
    } catch (e) {
      error.value = e instanceof Error ? e : new Error('Unknown error')
    } finally {
      isLoading.value = false
    }
  })

  return { data, error, isLoading }
}

// Sử dụng — tự động re-fetch khi userId thay đổi
const userId = ref('1')
const { data: user, isLoading } = useFetch<User>(
  computed(() => `/api/users/${userId.value}`)
)
```

---

## Form Composable

```typescript
// composables/useForm.ts
import { reactive, ref } from 'vue'

interface FormConfig<T> {
  initialValues: T
  validate?: (values: T) => Partial<Record<keyof T, string>>
  onSubmit: (values: T) => Promise<void>
}

export function useForm<T extends Record<string, unknown>>({
  initialValues,
  validate,
  onSubmit,
}: FormConfig<T>) {
  const values = reactive({ ...initialValues }) as T
  const errors = reactive<Partial<Record<keyof T, string>>>({})
  const isSubmitting = ref(false)
  const isSuccess = ref(false)

  function reset() {
    Object.assign(values, initialValues)
    Object.keys(errors).forEach(k => delete errors[k as keyof T])
    isSuccess.value = false
  }

  async function handleSubmit() {
    if (validate) {
      const validationErrors = validate(values)
      Object.assign(errors, validationErrors)
      if (Object.keys(validationErrors).length > 0) return
    }

    isSubmitting.value = true
    try {
      await onSubmit(values)
      isSuccess.value = true
    } finally {
      isSubmitting.value = false
    }
  }

  return { values, errors, isSubmitting, isSuccess, reset, handleSubmit }
}
```

---

## Debounce & Throttle với VueUse

```typescript
// ✅ Dùng VueUse thay vì tự viết
import { useDebounceFn, useThrottleFn } from '@vueuse/core'

const debouncedSearch = useDebounceFn(async (query: string) => {
  results.value = await searchApi(query)
}, 300)

// Trong template
<input @input="debouncedSearch($event.target.value)" />
```

---

## Các VueUse Composables Hay Dùng

```typescript
import {
  useLocalStorage,    // Persist state vào localStorage
  useSessionStorage,  // Persist state vào sessionStorage
  useClipboard,       // Copy to clipboard
  useMediaQuery,      // Responsive breakpoints
  useDark,            // Dark mode
  useIntersectionObserver, // Lazy loading, infinite scroll
  useVirtualList,     // Virtual scrolling cho list lớn
  onClickOutside,     // Đóng dropdown khi click ngoài
  useResizeObserver,  // Theo dõi kích thước element
  useDebounce,        // Debounced ref
} from '@vueuse/core'

// Ví dụ: persist theme preference
const isDark = useDark()

// Ví dụ: infinite scroll
const { stop } = useIntersectionObserver(
  loadMoreTrigger,
  ([{ isIntersecting }]) => {
    if (isIntersecting) loadMore()
  }
)
```

---

## Composable cho Pagination

```typescript
// composables/usePagination.ts
export function usePagination(totalItems: Ref<number>, itemsPerPage = 10) {
  const currentPage = ref(1)
  const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage))
  const offset = computed(() => (currentPage.value - 1) * itemsPerPage)

  function goTo(page: number) {
    currentPage.value = Math.max(1, Math.min(page, totalPages.value))
  }

  const hasPrev = computed(() => currentPage.value > 1)
  const hasNext = computed(() => currentPage.value < totalPages.value)

  return { currentPage, totalPages, offset, hasPrev, hasNext, goTo }
}
```

---

## Checklist

- [ ] Tên composable bắt đầu bằng `use`
- [ ] Return object với named properties (không return array trừ `useState`-style)
- [ ] Cleanup side effects trong `onUnmounted`
- [ ] Return types được khai báo rõ ràng
- [ ] Kiểm tra VueUse trước khi tự viết lại logic
- [ ] Composable có unit tests riêng

---

## Tham khảo

- [VueUse Official](https://vueuse.org/)
- [Vue 3 Composables Guide](https://vuejs.org/guide/reusability/composables.html)
- [vue-composable patterns](https://github.com/vuejs-ai/skills)
