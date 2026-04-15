# Vue Component Patterns Skill

> Patterns thiết kế component: Props/Emits, Slots, v-model, Renderless Components, Compound Components.

**Impact:** High | **Loại:** Capability

---

## Nguyên tắc cốt lõi

- Component nhỏ, tập trung một trách nhiệm.
- API của component (props/emits/slots) phải trực quan và dự đoán được.
- Ưu tiên composition over inheritance.
- Dùng slots cho nội dung linh hoạt, tránh prop drilling.

---

## Props Design

### Single Source of Truth

```vue
<!-- ✅ Controlled component — parent giữ state -->
<script setup lang="ts">
defineProps<{ modelValue: string }>()
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <input
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>
```

### Props Validation với TypeScript

```typescript
// ✅ Union types cho giá trị có giới hạn
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger'
  size: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
}

// ✅ withDefaults cho optional props
const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
})
```

---

## v-model — Two-way Binding

### v-model đơn giản

```vue
<!-- Parent -->
<template>
  <SearchInput v-model="query" />
</template>

<!-- SearchInput.vue -->
<script setup lang="ts">
defineProps<{ modelValue: string }>()
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>
```

### Multiple v-model

```vue
<!-- Parent -->
<template>
  <UserForm v-model:name="user.name" v-model:email="user.email" />
</template>

<!-- UserForm.vue -->
<script setup lang="ts">
defineProps<{
  name: string
  email: string
}>()
defineEmits<{
  'update:name': [value: string]
  'update:email': [value: string]
}>()
</script>
```

---

## Slots

### Default + Named Slots

```vue
<!-- Card.vue -->
<template>
  <div class="card">
    <div v-if="$slots.header" class="card__header">
      <slot name="header" />
    </div>
    <div class="card__body">
      <slot />
    </div>
    <div v-if="$slots.footer" class="card__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<!-- Sử dụng -->
<Card>
  <template #header>
    <h2>Title</h2>
  </template>
  <p>Content</p>
  <template #footer>
    <Button @click="save">Save</Button>
  </template>
</Card>
```

### Scoped Slots — truyền data từ child lên parent

```vue
<!-- DataTable.vue — expose row data qua slot -->
<template>
  <table>
    <tr v-for="row in rows" :key="row.id">
      <slot name="row" :row="row" :index="index" />
    </tr>
  </table>
</template>

<!-- Parent — quyết định render row như thế nào -->
<DataTable :rows="users">
  <template #row="{ row, index }">
    <td>{{ index + 1 }}</td>
    <td>{{ row.name }}</td>
    <td><Button @click="edit(row)">Edit</Button></td>
  </template>
</DataTable>
```

---

## Renderless Components

Tách business logic ra khỏi UI — parent quyết định cách render.

```vue
<!-- useMouseTracker.ts — composable thay vì renderless component -->
export function useMouseTracker() {
  const x = ref(0)
  const y = ref(0)

  const update = (e: MouseEvent) => {
    x.value = e.clientX
    y.value = e.clientY
  }

  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  return { x, y }
}

<!-- Parent quyết định render -->
<script setup>
const { x, y } = useMouseTracker()
</script>
<template>
  <div>Mouse: {{ x }}, {{ y }}</div>
</template>
```

---

## Compound Components Pattern

Nhóm các component liên quan lại với nhau, chia sẻ state qua provide/inject.

```vue
<!-- Tabs.vue — parent component -->
<script setup lang="ts">
import { provide, ref } from 'vue'

const activeTab = ref<string>('')

provide('tabs', {
  activeTab,
  setActiveTab: (id: string) => { activeTab.value = id },
})
</script>

<template>
  <div class="tabs">
    <slot />
  </div>
</template>
```

```vue
<!-- TabButton.vue — child component -->
<script setup lang="ts">
import { inject } from 'vue'

const props = defineProps<{ id: string }>()
const { activeTab, setActiveTab } = inject('tabs')!
</script>

<template>
  <button
    :class="{ active: activeTab === id }"
    @click="setActiveTab(id)"
  >
    <slot />
  </button>
</template>

<!-- Sử dụng -->
<Tabs>
  <TabButton id="home">Home</TabButton>
  <TabButton id="settings">Settings</TabButton>
</Tabs>
```

---

## Async Components + Suspense

```typescript
// ✅ Lazy load component nặng
import { defineAsyncComponent } from 'vue'

const HeavyChart = defineAsyncComponent({
  loader: () => import('./HeavyChart.vue'),
  loadingComponent: LoadingSpinner,
  errorComponent: ErrorDisplay,
  delay: 200,
  timeout: 3000,
})
```

```vue
<!-- Dùng với Suspense -->
<Suspense>
  <template #default>
    <HeavyChart :data="chartData" />
  </template>
  <template #fallback>
    <LoadingSpinner />
  </template>
</Suspense>
```

---

## Fallthrough Attributes

```vue
<!-- Button.vue -->
<script setup lang="ts">
// Tắt auto-inherit nếu muốn control thủ công
defineOptions({ inheritAttrs: false })

const props = defineProps<{ variant: 'primary' | 'secondary' }>()
</script>

<template>
  <!-- Áp dụng $attrs vào đúng element -->
  <button
    v-bind="$attrs"
    :class="['btn', `btn--${variant}`]"
  >
    <slot />
  </button>
</template>
```

---

## Checklist

- [ ] Props rõ ràng, có TypeScript types
- [ ] Emit events thay vì mutate props
- [ ] Dùng slots cho flexible content
- [ ] Scoped slots khi child cần expose data
- [ ] `v-if="$slots.xxx"` để check slot có content không
- [ ] Async components cho heavy UI
- [ ] Không quá 3 levels prop drilling — dùng provide/inject hoặc store

---

## Tham khảo

- [Vue 3 — Component Basics](https://vuejs.org/guide/components/registration.html)
- [Vue 3 — Slots](https://vuejs.org/guide/components/slots.html)
- [Vue 3 — Provide/Inject](https://vuejs.org/guide/components/provide-inject.html)
