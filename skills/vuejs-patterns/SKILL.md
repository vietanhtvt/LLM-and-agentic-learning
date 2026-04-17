# vuejs-patterns

**Các design pattern và kiến trúc component chuẩn trong Vue 3. Áp dụng khi thiết kế component hoặc composable.**

---

## 1. Composable Pattern — tách logic khỏi component

**Bất kỳ logic nào có thể tái sử dụng hoặc quá phức tạp đều nên là composable.**

```typescript
// ✅ src/composables/usePagination.ts
export function usePagination(
  fetchFn: (page: number, perPage: number) => Promise<PaginatedResponse>,
  options: { perPage?: number } = {}
) {
  const { perPage = 10 } = options

  const items = ref<unknown[]>([])
  const currentPage = ref(1)
  const totalPages = ref(0)
  const loading = ref(false)

  async function goToPage(page: number) {
    loading.value = true
    try {
      const res = await fetchFn(page, perPage)
      items.value = res.data
      totalPages.value = res.totalPages
      currentPage.value = page
    } finally {
      loading.value = false
    }
  }

  onMounted(() => goToPage(1))

  return { items, currentPage, totalPages, loading, goToPage }
}

// ✅ Dùng trong component
const { items, currentPage, totalPages, goToPage } = usePagination(
  (page, perPage) => productService.list({ page, perPage })
)
```

---

## 2. Container/Presentational Pattern

**Tách component thành "smart" (data fetching, logic) và "dumb" (chỉ nhận props, emit events).**

```vue
<!-- ✅ Container component — UserListContainer.vue -->
<script setup lang="ts">
const store = useUserStore()
const { users, loading } = storeToRefs(store)
const { fetchUsers, deleteUser } = store

onMounted(fetchUsers)
</script>

<template>
  <UserList
    :users="users"
    :loading="loading"
    @delete="deleteUser"
  />
</template>
```

```vue
<!-- ✅ Presentational component — UserList.vue (thuần display) -->
<script setup lang="ts">
const props = defineProps<{
  users: User[]
  loading?: boolean
}>()

const emit = defineEmits<{ delete: [id: string] }>()
</script>

<template>
  <div>
    <LoadingSpinner v-if="loading" />
    <ul v-else>
      <li v-for="user in users" :key="user.id">
        {{ user.name }}
        <button @click="emit('delete', user.id)">Xóa</button>
      </li>
    </ul>
  </div>
</template>
```

---

## 3. Renderless Component (Headless) — logic không có UI

**Dùng khi muốn tách hoàn toàn logic khỏi presentation. Thay thế tốt cho mixin.**

```vue
<!-- ✅ RenderlessSelect.vue — logic không có markup -->
<script setup lang="ts">
const props = defineProps<{
  options: Option[]
  modelValue: string | null
}>()

const emit = defineEmits<{ 'update:modelValue': [v: string | null] }>()

const isOpen = ref(false)
const selected = computed(() => props.options.find(o => o.value === props.modelValue))

function toggle() { isOpen.value = !isOpen.value }
function select(option: Option) {
  emit('update:modelValue', option.value)
  isOpen.value = false
}
</script>

<template>
  <slot
    :is-open="isOpen"
    :selected="selected"
    :toggle="toggle"
    :select="select"
    :options="options"
  />
</template>
```

```vue
<!-- Dùng với custom UI -->
<RenderlessSelect v-model="value" :options="opts">
  <template #default="{ isOpen, selected, toggle, select, options }">
    <div class="my-custom-select">
      <button @click="toggle">{{ selected?.label ?? 'Chọn...' }}</button>
      <ul v-show="isOpen">
        <li v-for="opt in options" :key="opt.value" @click="select(opt)">
          {{ opt.label }}
        </li>
      </ul>
    </div>
  </template>
</RenderlessSelect>
```

---

## 4. Plugin Pattern — extend Vue globally

**Dùng plugin để thêm global functionality: directives, components, composables utility.**

```typescript
// ✅ src/plugins/toast.ts
import type { App } from 'vue'
import ToastContainer from '@/components/ToastContainer.vue'

const toastPlugin = {
  install(app: App) {
    // Register global component
    app.component('ToastContainer', ToastContainer)

    // Add global property
    const toast = useToastStore()
    app.config.globalProperties.$toast = toast
    app.provide('toast', toast) // Tốt hơn globalProperties
  }
}

// ✅ main.ts
const app = createApp(App)
app.use(toastPlugin)
```

---

## 5. Custom Directive — khi DOM manipulation là cần thiết

**Dùng directive khi cần truy cập trực tiếp DOM element và không thể dùng binding thông thường.**

```typescript
// ✅ src/directives/vFocus.ts
import type { Directive } from 'vue'

export const vFocus: Directive = {
  mounted(el: HTMLElement) {
    el.focus()
  }
}

// ✅ src/directives/vClickOutside.ts
export const vClickOutside: Directive<HTMLElement, () => void> = {
  mounted(el, binding) {
    el._clickOutsideHandler = (event: MouseEvent) => {
      if (!el.contains(event.target as Node)) {
        binding.value()
      }
    }
    document.addEventListener('click', el._clickOutsideHandler)
  },
  unmounted(el) {
    document.removeEventListener('click', el._clickOutsideHandler)
    delete el._clickOutsideHandler
  }
}

// ✅ Đăng ký trong main.ts
app.directive('focus', vFocus)
app.directive('click-outside', vClickOutside)

// ✅ Dùng trong template
<input v-focus />
<div v-click-outside="closeDropdown">...</div>
```

---

## 6. Async Component + Suspense

**Lazy load component nặng. Dùng Suspense để handle loading state.**

```vue
<!-- ✅ Định nghĩa async component -->
<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const HeavyChart = defineAsyncComponent({
  loader: () => import('./HeavyChart.vue'),
  loadingComponent: ChartSkeleton,
  errorComponent: ErrorFallback,
  delay: 200,
  timeout: 5000
})
</script>

<template>
  <!-- ✅ Suspense wrapper -->
  <Suspense>
    <template #default>
      <HeavyChart :data="chartData" />
    </template>
    <template #fallback>
      <ChartSkeleton />
    </template>
  </Suspense>
</template>
```

---

## 7. Provide/Inject — dependency injection trong component tree

**Dùng cho config/service injection, không phải global state. Luôn type với InjectionKey.**

```typescript
// ✅ src/composables/useTheme.ts
import type { InjectionKey } from 'vue'

interface ThemeContext {
  theme: Ref<'light' | 'dark'>
  toggleTheme: () => void
}

export const THEME_KEY: InjectionKey<ThemeContext> = Symbol('theme')

// Provider component
export function provideTheme() {
  const theme = ref<'light' | 'dark'>('light')
  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }
  provide(THEME_KEY, { theme, toggleTheme })
}

// Consumer composable
export function useTheme() {
  const context = inject(THEME_KEY)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
```

---

## 8. Error Boundary Pattern

**Dùng `onErrorCaptured` để bắt lỗi từ component con, tránh crash toàn bộ app.**

```vue
<!-- ✅ ErrorBoundary.vue -->
<script setup lang="ts">
const error = ref<Error | null>(null)

onErrorCaptured((err: Error) => {
  error.value = err
  return false // Dừng propagation
})
</script>

<template>
  <slot v-if="!error" />
  <div v-else class="error-boundary">
    <p>Có lỗi xảy ra: {{ error.message }}</p>
    <button @click="error = null">Thử lại</button>
  </div>
</template>

<!-- Dùng trong app -->
<ErrorBoundary>
  <ComplexFeature />
</ErrorBoundary>
```

---

## 9. Form Pattern với composable

```typescript
// ✅ src/composables/useForm.ts
export function useForm<T extends Record<string, unknown>>(
  initialValues: T,
  onSubmit: (values: T) => Promise<void>
) {
  const values = reactive({ ...initialValues }) as T
  const errors = reactive<Partial<Record<keyof T, string>>>({})
  const isSubmitting = ref(false)

  function setError(field: keyof T, message: string) {
    errors[field] = message
  }

  function clearErrors() {
    Object.keys(errors).forEach(k => delete errors[k as keyof T])
  }

  async function handleSubmit() {
    clearErrors()
    isSubmitting.value = true
    try {
      await onSubmit(values)
    } finally {
      isSubmitting.value = false
    }
  }

  function reset() {
    Object.assign(values, initialValues)
    clearErrors()
  }

  return { values, errors, isSubmitting, setError, handleSubmit, reset }
}
```

---

## 10. Compound Component Pattern — liên kết implicit

**Khi các components liên kết chặt chẽ, dùng provide/inject để share state ẩn.**

```typescript
// ✅ src/components/ui/Tabs/index.ts — Compound components
// Tabs.vue — parent component
const activeTab = ref<string>('')
const TABS_KEY: InjectionKey<{ activeTab: Ref<string>; setTab: (id: string) => void }> = Symbol()

provide(TABS_KEY, {
  activeTab,
  setTab: (id: string) => { activeTab.value = id }
})
```

```vue
<!-- TabItem.vue — child component -->
<script setup lang="ts">
const props = defineProps<{ id: string; label: string }>()
const tabs = inject(TABS_KEY)!
const isActive = computed(() => tabs.activeTab.value === props.id)
</script>

<template>
  <button
    role="tab"
    :aria-selected="isActive"
    :class="{ active: isActive }"
    @click="tabs.setTab(props.id)"
  >
    {{ label }}
  </button>
</template>
```

```vue
<!-- Dùng Compound Component -->
<Tabs default-tab="profile">
  <TabList>
    <TabItem id="profile" label="Hồ sơ" />
    <TabItem id="security" label="Bảo mật" />
  </TabList>
  <TabPanel id="profile"><ProfileForm /></TabPanel>
  <TabPanel id="security"><SecurityForm /></TabPanel>
</Tabs>
```

---

## Checklist khi thiết kế component

- [ ] Component có single responsibility không?
- [ ] Props interface có type đầy đủ không?
- [ ] Logic tái sử dụng được đặt trong composable chưa?
- [ ] Side effects được cleanup trong `onUnmounted` chưa?
- [ ] Component có quá 300 dòng không? → Cần tách
- [ ] Có truyền quá nhiều props (prop drilling)? → Dùng provide/inject hoặc store
- [ ] Event names có dùng camelCase không? → Nên dùng kebab-case trong template
- [ ] Compound components có dùng provide/inject không? → Không dùng props drilling
- [ ] Slots có được typed với `defineSlots<>()` không?
