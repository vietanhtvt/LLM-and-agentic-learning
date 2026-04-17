# Vue.js AI Development Guidelines

Hướng dẫn hành vi cho AI khi phát triển ứng dụng Vue.js. Dựa trên cộng đồng `vuejs-ai/skills`, tài liệu chính thức Vue 3, và các thực hành tốt nhất được kiểm chứng.

> **Khi dùng AI để viết Vue code: luôn đề cập "dùng Vue 3 Composition API với `<script setup>`".**

---

## 1. Luôn dùng Vue 3 `<script setup lang="ts">` — không bao giờ Options API

**Không trộn lẫn. Không dùng `defineComponent`. Không dùng `this`.**

```vue
<!-- ✅ Đúng — mọi component mới -->
<script setup lang="ts">
const count = ref(0)
</script>

<!-- ❌ Sai — Options API lỗi thời -->
<script>
export default { data() { return { count: 0 } } }
</script>
```

---

## 2. Props và Emits: type-based syntax — không dùng runtime array

```typescript
// ✅ Đúng
const props = withDefaults(defineProps<{
  title: string
  count?: number
}>(), { count: 0 })

const emit = defineEmits<{
  change: [value: string]   // named tuple syntax (Vue 3.3+)
  submit: [payload: FormData]
}>()

// ❌ Sai
const props = defineProps(['title', 'count'])
const emit = defineEmits(['change'])
```

---

## 3. v-model: dùng defineModel() — không tự viết modelValue + emit

**Vue 3.4+ có `defineModel()` — loại bỏ boilerplate.**

```typescript
// ✅ Vue 3.4+ — ngắn gọn, đúng chuẩn
const model = defineModel<string>()
const title = defineModel<string>('title') // multiple v-models

// ❌ Legacy pattern (chỉ dùng khi target Vue < 3.4)
const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [string] }>()
```

---

## 4. ref vs reactive — chọn đúng

| Tình huống | Dùng |
|---|---|
| Primitive (string, number, boolean, null) | `ref()` |
| Object có thể replace cả object | `ref()` |
| Object lớn, không cần deep reactivity | `shallowRef()` |
| Object mutations in-place | `reactive()` |
| Object được destructure | `ref()` + `toRefs()` |

```typescript
// ✅ shallowRef cho data lớn, immutable
const tableData = shallowRef<Row[]>([])

// ❌ reactive bị mất reactivity khi destructure hoặc reassign
let obj = reactive({ count: 0 })
obj = { count: 1 } // Vue mất tracking!
const { count } = reactive({ count: 0 }) // count không reactive!
```

---

## 5. watch — không watch trực tiếp value, phải dùng getter

```typescript
// ❌ Sai — watch snapshot, watcher không hoạt động
watch(state.count, handler)
watch(props.id, handler) // props.id là static

// ✅ Đúng — watch với getter function
watch(() => state.count, handler)
watch(() => props.id, handler)

// ✅ Async watch với cleanup
watch(query, async (newVal, oldVal, onCleanup) => {
  const controller = new AbortController()
  onCleanup(() => controller.abort())
  results.value = await fetch(url, { signal: controller.signal })
})
```

---

## 6. computed — không có side effects, không mutate

```typescript
// ✅ Pure derived state
const total = computed(() =>
  items.value.reduce((sum, item) => sum + item.price, 0)
)

// ❌ Side effect trong computed — BUG
const total = computed(() => {
  store.setSomething(123) // KHÔNG
  return items.value.length
})
```

---

## 7. Pinia — dùng Setup Store, trả về tất cả, storeToRefs

```typescript
// ✅ Setup Store style
export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isLoggedIn = computed(() => !!user.value)
  async function login(creds: Credentials) { /* ... */ }

  return { user, isLoggedIn, login } // BẮT BUỘC return tất cả
})

// ✅ Dùng trong component
const store = useAuthStore()
const { user, isLoggedIn } = storeToRefs(store) // state + getters
const { login } = store // actions: destructure trực tiếp

// ❌ Sai — mất reactivity
const { user } = useAuthStore()
```

---

## 8. Composables — toValue(), return plain object, không conditional

```typescript
// ✅ MaybeRefOrGetter — composable linh hoạt
import type { MaybeRefOrGetter } from 'vue'

export function useDebounce<T>(value: MaybeRefOrGetter<T>, delay = 300) {
  const debounced = ref(toValue(value))
  // ...
  return { debounced } // plain object, không reactive({})
}

// ❌ Gọi composable có điều kiện — vi phạm Rules of Composables
if (condition) {
  const { data } = useFetch(url) // LỖI
}
```

---

## 9. Performance: lazy load, shallowRef, v-memo

```typescript
// Lazy load component
const HeavyChart = defineAsyncComponent(() => import('./HeavyChart.vue'))

// Lazy load route
const routes = [
  { path: '/dashboard', component: () => import('./Dashboard.vue') }
]
```

```vue
<!-- v-once cho static content -->
<StaticHeader v-once />

<!-- v-memo cho list, skip re-render khi deps không đổi -->
<div v-for="item in list" :key="item.id" v-memo="[item.id, item.active]">
  {{ item.name }}
</div>
```

---

## 10. Security: không dùng v-html với user input

```vue
<!-- ❌ XSS vulnerability -->
<div v-html="userInputContent" />

<!-- ✅ Sanitize trước hoặc escape -->
<div>{{ userInputContent }}</div>
<!-- Hoặc sanitize: -->
<div v-html="DOMPurify.sanitize(content)" />
```

---

## Những lỗi AI hay mắc phải — phải tránh

| Lỗi | Đúng |
|---|---|
| Mix Options API + Composition API | Chỉ dùng `<script setup lang="ts">` |
| `watch(props.value, ...)` | `watch(() => props.value, ...)` |
| Destructure `reactive()` trực tiếp | Dùng `toRefs()` |
| Reassign biến `reactive()` | Dùng `ref()` |
| Viết manual `modelValue` + emit | Dùng `defineModel<T>()` |
| Side effects trong `computed` | Chuyển vào `watch` hoặc action |
| `const { x } = store` | `const { x } = storeToRefs(store)` |
| Vuex cho state management | Pinia (Vuex đã EOL) |
| Composable trong `if` block | Gọi ở top-level `setup()` |
| `v-html` với user input | Escape hoặc sanitize (DOMPurify) |
| Render 1000+ items không virtualize | `vue-virtual-scroller` |
| Quên `return` trong Pinia setup store | Return tất cả state/getters/actions |
| Dùng `any` type trong TypeScript | Khai báo type rõ ràng |
| Fetch API trực tiếp trong component | Đặt trong service hoặc store action |
| Không cleanup side effects | `onUnmounted(() => cleanup())` |

---

## Cấu trúc thư mục chuẩn

```
src/
  assets/
  components/
    ui/           # Atomic components (Button, Input, Modal)
    layout/       # Layout (Header, Sidebar, Footer)
    features/     # Feature-specific components
  composables/
    core/         # Generic (useDebounce, useFetch, useIntersection)
    features/     # Feature-specific (useAuth, useCart)
  pages/ (views/) # Route-level components
  router/         # Router config + guards
  stores/         # Pinia stores (một file/domain)
  services/       # API abstractions
  types/          # TypeScript interfaces/types
  utils/          # Pure functions
```

---

## TypeScript chuẩn cho Vue 3

```json
// tsconfig.json tối thiểu
{
  "compilerOptions": {
    "strict": true,
    "jsx": "preserve",
    "moduleResolution": "bundler",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

- Chạy `vue-tsc --noEmit` trong CI để catch template type errors
- Dùng `@vue/language-tools` (Volar) trong VS Code, không dùng Vetur
