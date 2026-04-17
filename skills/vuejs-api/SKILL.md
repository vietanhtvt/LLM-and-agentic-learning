# vuejs-api

**Hướng dẫn tích hợp API và service layer trong Vue 3. Áp dụng khi build data fetching, error handling, và caching.**

---

## 1. Service layer — tách API calls khỏi component

**Không gọi `fetch()` trực tiếp trong component hay store. Đặt vào service functions.**

```typescript
// ✅ src/services/productService.ts
import type { Product, CreateProductPayload, PaginatedResponse } from '@/types'
import { apiClient } from './apiClient'

export const productService = {
  async getAll(params?: { page?: number; search?: string }): Promise<PaginatedResponse<Product>> {
    return apiClient.get('/products', { params })
  },

  async getById(id: string): Promise<Product> {
    return apiClient.get(`/products/${id}`)
  },

  async create(payload: CreateProductPayload): Promise<Product> {
    return apiClient.post('/products', payload)
  },

  async update(id: string, payload: Partial<CreateProductPayload>): Promise<Product> {
    return apiClient.patch(`/products/${id}`, payload)
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/products/${id}`)
  }
}
```

---

## 2. API client — centralized HTTP client

**Tạo một API client duy nhất với interceptors, timeout, base URL.**

```typescript
// ✅ src/services/apiClient.ts
import type { ApiError } from '@/types'

class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  setToken(token: string | null) {
    this.token = token
  }

  private async request<T>(
    method: string,
    path: string,
    options: RequestInit & { params?: Record<string, unknown> } = {}
  ): Promise<T> {
    const { params, ...fetchOptions } = options

    // Build URL with query params
    const url = new URL(`${this.baseURL}${path}`)
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null) {
          url.searchParams.append(k, String(v))
        }
      })
    }

    const response = await fetch(url.toString(), {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(this.token ? { Authorization: `Bearer ${this.token}` } : {})
      },
      signal: AbortSignal.timeout(10000), // 10s timeout
      ...fetchOptions
    })

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        code: 'UNKNOWN',
        message: `HTTP ${response.status}`
      }))
      throw new ApiClientError(error, response.status)
    }

    if (response.status === 204) return undefined as T
    return response.json()
  }

  get<T>(path: string, options?: { params?: Record<string, unknown> }): Promise<T> {
    return this.request<T>('GET', path, options)
  }

  post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('POST', path, {
      body: JSON.stringify(body)
    })
  }

  patch<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('PATCH', path, {
      body: JSON.stringify(body)
    })
  }

  delete<T>(path: string): Promise<T> {
    return this.request<T>('DELETE', path)
  }
}

export class ApiClientError extends Error {
  constructor(
    public readonly apiError: ApiError,
    public readonly status: number
  ) {
    super(apiError.message)
    this.name = 'ApiClientError'
  }
}

export const apiClient = new ApiClient(import.meta.env.VITE_API_URL)
```

---

## 3. useFetch composable — reusable data fetching

**Tạo `useFetch` composable tổng quát. Tích hợp loading, error, retry, abort.**

```typescript
// ✅ src/composables/useFetch.ts
export interface UseFetchOptions {
  immediate?: boolean   // Fetch ngay khi mount (default: true)
  retry?: number        // Số lần retry khi fail (default: 0)
}

export interface UseFetchReturn<T> {
  data: Ref<T | null>
  loading: Ref<boolean>
  error: Ref<Error | null>
  execute: () => Promise<void>
  reset: () => void
}

export function useFetch<T>(
  fetchFn: (signal: AbortSignal) => Promise<T>,
  options: UseFetchOptions = {}
): UseFetchReturn<T> {
  const { immediate = true, retry = 0 } = options

  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  let controller: AbortController | null = null

  async function execute(): Promise<void> {
    // Cancel previous request
    controller?.abort()
    controller = new AbortController()

    loading.value = true
    error.value = null

    let attempts = 0
    while (attempts <= retry) {
      try {
        data.value = await fetchFn(controller.signal)
        return
      } catch (e) {
        attempts++
        if (attempts > retry || controller.signal.aborted) {
          error.value = e instanceof Error ? e : new Error(String(e))
          return
        }
        await new Promise(r => setTimeout(r, 1000 * attempts)) // exponential backoff
      } finally {
        loading.value = false
      }
    }
  }

  function reset(): void {
    data.value = null
    error.value = null
    loading.value = false
    controller?.abort()
  }

  onMounted(() => { if (immediate) execute() })
  onUnmounted(() => { controller?.abort() })

  return { data: readonly(data) as Ref<T | null>, loading: readonly(loading) as Ref<boolean>, error: readonly(error) as Ref<Error | null>, execute, reset }
}

// ✅ Dùng trong component
const { data: products, loading, error, execute: refresh } = useFetch(
  (signal) => productService.getAll({ page: 1 }),
  { immediate: true, retry: 2 }
)
```

---

## 4. useInfiniteScroll — pagination và infinite loading

```typescript
// ✅ src/composables/useInfiniteList.ts
export function useInfiniteList<T>(
  fetchFn: (page: number) => Promise<{ data: T[]; hasMore: boolean }>
) {
  const items = ref<T[]>([])
  const page = ref(1)
  const hasMore = ref(true)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  async function loadMore(): Promise<void> {
    if (loading.value || !hasMore.value) return

    loading.value = true
    try {
      const result = await fetchFn(page.value)
      items.value = [...items.value, ...result.data]
      hasMore.value = result.hasMore
      page.value++
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e))
    } finally {
      loading.value = false
    }
  }

  async function reset(): Promise<void> {
    items.value = []
    page.value = 1
    hasMore.value = true
    error.value = null
    await loadMore()
  }

  onMounted(loadMore)

  return { items: readonly(items), loading, error, hasMore, loadMore, reset }
}
```

---

## 5. Optimistic updates — cập nhật UI trước khi confirm server

**Optimistic update giúp UI cảm giác nhanh hơn. Rollback nếu server fail.**

```typescript
// ✅ Optimistic update pattern
export const useTodoStore = defineStore('todos', () => {
  const todos = ref<Todo[]>([])

  async function toggleTodo(id: string): Promise<void> {
    // 1. Update UI ngay lập tức
    const todo = todos.value.find(t => t.id === id)
    if (!todo) return
    const previousValue = todo.completed
    todo.completed = !todo.completed

    try {
      // 2. Confirm với server
      await todoService.toggle(id)
    } catch (e) {
      // 3. Rollback nếu fail
      todo.completed = previousValue
      throw e
    }
  }

  async function deleteTodo(id: string): Promise<void> {
    const previousTodos = [...todos.value]
    todos.value = todos.value.filter(t => t.id !== id)

    try {
      await todoService.delete(id)
    } catch (e) {
      todos.value = previousTodos
      throw e
    }
  }

  return { todos, toggleTodo, deleteTodo }
})
```

---

## 6. Error handling — phân loại lỗi

**Phân loại lỗi để xử lý phù hợp. Không throw generic Error.**

```typescript
// ✅ src/utils/errorHandling.ts
import { ApiClientError } from '@/services/apiClient'

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiClientError) {
    switch (error.status) {
      case 401: return 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.'
      case 403: return 'Bạn không có quyền thực hiện thao tác này.'
      case 404: return 'Không tìm thấy dữ liệu.'
      case 422: return error.apiError.message || 'Dữ liệu không hợp lệ.'
      case 429: return 'Quá nhiều yêu cầu. Vui lòng thử lại sau.'
      default: return error.apiError.message || 'Lỗi server.'
    }
  }

  if (error instanceof TypeError && error.message.includes('fetch')) {
    return 'Không thể kết nối đến server. Kiểm tra kết nối mạng.'
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Đã xảy ra lỗi không xác định.'
}

// ✅ Global error handler cho router
router.onError((error) => {
  if (error.message.includes('Failed to fetch dynamically imported module')) {
    window.location.reload() // Reload khi chunk load fail (deploy mới)
  }
})
```

---

## 7. Request deduplication — tránh duplicate requests

**Dùng request map để deduplicate calls đến cùng endpoint.**

```typescript
// ✅ src/services/requestCache.ts
const pendingRequests = new Map<string, Promise<unknown>>()

export async function deduplicateRequest<T>(
  key: string,
  fetchFn: () => Promise<T>
): Promise<T> {
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key) as Promise<T>
  }

  const promise = fetchFn().finally(() => {
    pendingRequests.delete(key)
  })

  pendingRequests.set(key, promise)
  return promise
}

// Dùng trong service:
async function getUser(id: string): Promise<User> {
  return deduplicateRequest(`user-${id}`, () =>
    apiClient.get<User>(`/users/${id}`)
  )
}
```

---

## 8. Form submission với validation

**Kết hợp form validation (Zod) với API submission. Xử lý server validation errors.**

```typescript
// ✅ src/composables/useApiForm.ts
import { z } from 'zod'
import type { ApiClientError } from '@/services/apiClient'

export function useApiForm<TSchema extends z.ZodObject<z.ZodRawShape>>(
  schema: TSchema,
  submitFn: (data: z.infer<TSchema>) => Promise<void>
) {
  type FormData = z.infer<TSchema>

  const values = ref<Partial<FormData>>({})
  const fieldErrors = ref<Partial<Record<keyof FormData, string>>>({})
  const globalError = ref<string | null>(null)
  const isSubmitting = ref(false)

  async function submit(): Promise<boolean> {
    fieldErrors.value = {}
    globalError.value = null

    // Client-side validation
    const result = schema.safeParse(values.value)
    if (!result.success) {
      result.error.errors.forEach(e => {
        const field = e.path[0] as keyof FormData
        fieldErrors.value[field] = e.message
      })
      return false
    }

    isSubmitting.value = true
    try {
      await submitFn(result.data)
      return true
    } catch (e) {
      // Server validation errors (422)
      if (isApiError(e) && e.status === 422 && e.apiError.details) {
        Object.entries(e.apiError.details).forEach(([field, messages]) => {
          fieldErrors.value[field as keyof FormData] = messages[0]
        })
      } else {
        globalError.value = getErrorMessage(e)
      }
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  return { values, fieldErrors, globalError, isSubmitting, submit }
}
```

---

## 9. Real-time data — WebSocket và SSE

```typescript
// ✅ src/composables/useWebSocket.ts
export function useWebSocket(url: string) {
  const data = ref<unknown>(null)
  const status = ref<'connecting' | 'open' | 'closed' | 'error'>('connecting')
  let ws: WebSocket | null = null

  function connect() {
    ws = new WebSocket(url)

    ws.onopen = () => { status.value = 'open' }
    ws.onmessage = (e) => { data.value = JSON.parse(e.data) }
    ws.onerror = () => { status.value = 'error' }
    ws.onclose = () => { status.value = 'closed' }
  }

  function send(payload: unknown) {
    ws?.send(JSON.stringify(payload))
  }

  onMounted(connect)
  onUnmounted(() => { ws?.close() })

  return { data, status, send }
}

// ✅ Server-Sent Events (SSE)
export function useSSE(url: string) {
  const data = ref<string | null>(null)
  let eventSource: EventSource | null = null

  onMounted(() => {
    eventSource = new EventSource(url)
    eventSource.onmessage = (e) => { data.value = e.data }
  })

  onUnmounted(() => { eventSource?.close() })

  return { data }
}
```

---

## Anti-patterns

| Anti-pattern | Fix |
|---|---|
| `fetch()` trực tiếp trong component | Service layer + composable |
| Không handle abort/cleanup | `AbortController` + `onUnmounted` cleanup |
| `any` type cho API response | Typed interface + Zod validation |
| Catch lỗi rồi `console.log` và tiếp tục | Rethrow, hiển thị thông báo, hoặc rollback |
| Request duplicates không cần thiết | Deduplication map / SWR pattern |
| Hard-code `VITE_API_URL` trong service | `import.meta.env.VITE_API_URL` |
| Không timeout HTTP request | `AbortSignal.timeout(10000)` |
| Optimistic update không có rollback | Lưu previous state, rollback trong catch |
| Không handle network errors | `TypeError` check cho offline |
| 401 không redirect về login | Global error interceptor |
