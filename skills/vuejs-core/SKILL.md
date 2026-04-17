# vuejs-core

**Hướng dẫn viết Vue 3 Composition API đúng chuẩn. Áp dụng khi tạo hoặc refactor component Vue.**

---

## 1. Cấu trúc file component chuẩn

**Thứ tự: `<script setup>` → `<template>` → `<style scoped>`. Không đặt template lên đầu.**

```vue
<script setup lang="ts">
// 1. Imports
import { ref, computed, watch, onMounted } from 'vue'
import type { PropType } from 'vue'

// 2. Props & Emits
const props = withDefaults(defineProps<{
  title: string
  items?: string[]
}>(), { items: () => [] })

const emit = defineEmits<{
  select: [item: string]
  close: []
}>()

// 3. Reactive state
const isOpen = ref(false)
const selectedItem = ref<string | null>(null)

// 4. Computed
const hasItems = computed(() => props.items.length > 0)

// 5. Methods
function handleSelect(item: string) {
  selectedItem.value = item
  emit('select', item)
}

// 6. Watchers
watch(() => props.title, (newTitle) => {
  document.title = newTitle
})

// 7. Lifecycle hooks
onMounted(() => {
  // side effects
})
</script>

<template>
  <div class="container">
    <h2>{{ title }}</h2>
    <ul v-if="hasItems">
      <li
        v-for="item in items"
        :key="item"
        @click="handleSelect(item)"
      >
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.container { /* ... */ }
</style>
```

---

## 2. ref vs reactive — khi nào dùng cái nào

**Dùng `ref` cho tất cả mọi thứ theo mặc định. Chỉ dùng `reactive` khi có lý do cụ thể.**

| Tình huống | Nên dùng |
|---|---|
| Primitive (string, number, boolean) | `ref()` |
| Nullable value | `ref<User \| null>(null)` |
| Array | `ref<string[]>([])` |
| Object đơn giản | `ref()` hoặc `reactive()` |
| Form data với nhiều fields | `reactive()` |
| Return từ composable | `ref()` — destructuring an toàn |

```typescript
// ✅ ref — luôn access qua .value, dễ track
const count = ref(0)
const user = ref<User | null>(null)

// ✅ reactive — không cần .value, nhưng mất reactivity khi destructure
const form = reactive({ email: '', password: '' })

// ❌ reactive bị mất reactivity khi destructure
const { email } = reactive({ email: '' }) // email không còn reactive!
```

---

## 3. computed — không có side effects

**`computed` chỉ được đọc state, không được thay đổi state.**

```typescript
// ✅ Đúng — pure derived value
const fullName = computed(() => `${user.value?.firstName} ${user.value?.lastName}`)

// ✅ Writable computed cho v-model
const modelVal = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})

// ❌ Sai — side effect trong computed
const total = computed(() => {
  store.setSomeValue(123) // KHÔNG làm thế này
  return items.value.reduce((a, b) => a + b, 0)
})
```

---

## 4. watch vs watchEffect — chọn đúng

**`watchEffect` khi muốn auto-track dependencies. `watch` khi cần biết giá trị cũ hoặc watch cụ thể.**

```typescript
// ✅ watchEffect — tự track, chạy ngay lập tức
watchEffect(() => {
  document.title = `${route.name} - MyApp`
})

// ✅ watch — explicit source, có oldVal
watch(count, (newVal, oldVal) => {
  console.log(`Changed from ${oldVal} to ${newVal}`)
})

// ✅ watch multiple sources
watch([firstName, lastName], ([newFirst, newLast]) => {
  updateProfile(newFirst, newLast)
})

// ❌ Sai — watch với deep không cần thiết
watch(largeObject, handler, { deep: true }) // Quá tốn kém
// Thay bằng:
watch(() => largeObject.value.specificProp, handler)
```

---

## 5. Lifecycle hooks — thứ tự và mục đích

| Hook | Dùng khi |
|---|---|
| `onMounted` | Fetch data, setup DOM, khởi tạo thư viện bên thứ 3 |
| `onUnmounted` | Cleanup: clearInterval, removeEventListener, unsubscribe |
| `onBeforeMount` | Hiếm dùng — trước khi DOM render |
| `onUpdated` | Sau khi component re-render (tránh dùng, dùng `watch` thay thế) |
| `onErrorCaptured` | Xử lý lỗi từ component con |

```typescript
// ✅ Cleanup đúng cách
onMounted(() => {
  const timer = setInterval(tick, 1000)
  const handler = (e: KeyboardEvent) => handleKey(e)
  window.addEventListener('keydown', handler)

  onUnmounted(() => {
    clearInterval(timer)
    window.removeEventListener('keydown', handler)
  })
})
```

---

## 6. Template directives — dùng đúng

```vue
<!-- ✅ v-if vs v-show -->
<!-- v-if: khi điều kiện ít thay đổi (unmount/mount) -->
<HeavyComponent v-if="isLoaded" />

<!-- v-show: khi toggle thường xuyên (chỉ ẩn CSS) -->
<Tooltip v-show="isHovered" />

<!-- ✅ v-for luôn cần :key unique và stable -->
<li v-for="item in items" :key="item.id">{{ item.name }}</li>

<!-- ❌ Sai — không dùng index làm key khi list có thể reorder -->
<li v-for="(item, i) in items" :key="i">{{ item.name }}</li>

<!-- ✅ v-bind shorthand -->
<Component :title="title" :disabled="isDisabled" />

<!-- ✅ v-on shorthand và event modifiers -->
<form @submit.prevent="handleSubmit">
  <input @keyup.enter="confirm" />
</form>

<!-- ✅ v-model -->
<input v-model="searchQuery" />
<MySelect v-model="selectedOption" />
```

---

## 7. defineExpose — chỉ expose khi cần thiết

**Mặc định component dùng `<script setup>` không expose gì cả. Chỉ expose khi parent thực sự cần dùng ref.**

```typescript
// ✅ Expose interface rõ ràng cho parent
const inputRef = ref<HTMLInputElement | null>(null)

defineExpose({
  focus: () => inputRef.value?.focus(),
  clear: () => { model.value = '' }
})

// ❌ Expose toàn bộ internal state — vi phạm encapsulation
defineExpose({ internalState, privateMethod })
```

---

## 8. Async trong setup — dùng Suspense hoặc xử lý trong onMounted

```vue
<!-- ✅ Với Suspense (top-level await) -->
<script setup lang="ts">
const data = await fetchData() // Chỉ dùng được trong Suspense parent
</script>

<!-- ✅ Không có Suspense — dùng onMounted + loading state -->
<script setup lang="ts">
const data = ref<Data | null>(null)
const loading = ref(false)
const error = ref<Error | null>(null)

onMounted(async () => {
  loading.value = true
  try {
    data.value = await fetchData()
  } catch (e) {
    error.value = e as Error
  } finally {
    loading.value = false
  }
})
</script>
```

---

## 9. Slots — typed slots với defineSlots

**Vue 3.3+ cho phép type slots với `defineSlots()`. Giúp component library có better DX.**

```typescript
// ✅ Typed slots
const slots = defineSlots<{
  default(props: { item: Product; index: number }): unknown
  empty(): unknown
  header(props: { total: number }): unknown
}>()

// ✅ Trong template — pass typed slot props
<template>
  <div>
    <slot name="header" :total="items.length" />
    <div v-if="items.length === 0">
      <slot name="empty" />
    </div>
    <div v-for="(item, i) in items" :key="item.id">
      <slot :item="item" :index="i" />
    </div>
  </div>
</template>
```

---

## 10. Teleport — render ngoài component tree

**Dùng `<Teleport>` cho modal, toast, tooltip — render vào `body` thay vì trong component.**

```vue
<!-- ✅ Modal với Teleport -->
<template>
  <button @click="isOpen = true">Mở modal</button>

  <Teleport to="body">
    <div v-if="isOpen" class="modal-overlay" @click.self="isOpen = false">
      <div class="modal">
        <slot />
        <button @click="isOpen = false">Đóng</button>
      </div>
    </div>
  </Teleport>
</template>

<!-- ✅ Disable Teleport khi cần (ví dụ: SSR) -->
<Teleport to="body" :disabled="isServer">
  <Modal />
</Teleport>
```

---

## Anti-patterns cần tránh

| Anti-pattern | Thay bằng |
|---|---|
| `watch` với `immediate: true` + `deep: true` trên object lớn | `watchEffect` hoặc watch property cụ thể |
| Logic phức tạp trong template | Extract ra computed hoặc method |
| Dùng `$refs` để set value | `v-model` hoặc reactive state |
| `provide/inject` cho global state | Pinia store |
| Component quá lớn (>300 dòng) | Tách composable + child components |
| Async trong `watch` callback không có cancel | Dùng `watchEffect` với cleanup function |
| Modal render bên trong component có overflow:hidden | `<Teleport to="body">` |
| Không type slots | `defineSlots<{ ... }>()` |
