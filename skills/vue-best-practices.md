# Vue Best Practices Skill

> Composition API, TypeScript, cấu trúc project — nền tảng cho mọi Vue 3 app.

**Impact:** High | **Loại:** Capability + Efficiency

---

## Nguyên tắc cốt lõi

1. **Composition API là mặc định** — dùng `<script setup>` cho tất cả component mới.
2. **TypeScript strict** — không dùng `any`, không bỏ qua type errors.
3. **Single Responsibility** — mỗi component làm một việc. Nếu có > 3 props và > 2 emits, cân nhắc tách.
4. **Reactivity là hợp đồng** — không mutate props, không bypass Vue reactivity system.

---

## Cấu trúc Project

```
src/
├── assets/          # Static assets
├── components/      # Reusable UI components (không có business logic)
│   └── ui/          # Atomic components (Button, Input, Modal...)
├── composables/     # Custom composables (use*.ts)
├── layouts/         # Layout components
├── pages/ (hoặc views/)  # Route-level components
├── router/          # Vue Router config
├── stores/          # Pinia stores
├── types/           # TypeScript type definitions
└── utils/           # Pure utility functions
```

---

## Composition API với `<script setup>`

### Component cơ bản

```vue
<!-- ✅ Đúng -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { User } from '@/types'

interface Props {
  userId: string
  showAvatar?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showAvatar: true,
})

const emit = defineEmits<{
  'user-selected': [user: User]
  'update:modelValue': [value: string]
}>()

const user = ref<User | null>(null)
const displayName = computed(() => user.value?.name ?? 'Unknown')

onMounted(async () => {
  user.value = await fetchUser(props.userId)
})
</script>

<template>
  <div class="user-card">
    <img v-if="showAvatar && user?.avatar" :src="user.avatar" :alt="displayName" />
    <span>{{ displayName }}</span>
  </div>
</template>
```

```vue
<!-- ❌ Sai — dùng Options API cho component mới -->
<script lang="ts">
export default {
  props: ['userId'],
  data() {
    return { user: null }
  },
}
</script>
```

---

## TypeScript Patterns

### Định nghĩa Props với TypeScript

```typescript
// ✅ Typed props với defineProps<T>()
interface Props {
  title: string
  count?: number
  items: string[]
  config: { theme: 'light' | 'dark'; size: 'sm' | 'md' | 'lg' }
}
const props = withDefaults(defineProps<Props>(), {
  count: 0,
})
```

### Typed Emits

```typescript
// ✅ Typed emits với defineEmits<T>()
const emit = defineEmits<{
  'item-click': [item: Item, index: number]
  'update:modelValue': [value: string]
  close: []
}>()

// Gọi emit
emit('item-click', item, 0)
emit('update:modelValue', newValue)
```

### Reactive State Typing

```typescript
// ✅ ref với type
const count = ref<number>(0)
const user = ref<User | null>(null)
const items = ref<string[]>([])

// ✅ reactive với interface
interface FormState {
  name: string
  email: string
  isSubmitting: boolean
}
const form = reactive<FormState>({
  name: '',
  email: '',
  isSubmitting: false,
})
```

---

## Reactivity Rules

```typescript
// ✅ ref() cho primitives
const count = ref(0)
const message = ref('')
const isOpen = ref(false)

// ✅ reactive() cho objects (khi cần destructure cùng nhau)
const position = reactive({ x: 0, y: 0 })

// ✅ computed() cho derived state — có cache
const fullName = computed(() => `${firstName.value} ${lastName.value}`)

// ✅ watch() khi cần side effect với old/new values
watch(userId, async (newId, oldId) => {
  if (newId !== oldId) await loadUser(newId)
})

// ✅ watchEffect() khi cần track dependencies tự động
watchEffect(() => {
  document.title = `${count.value} items`
})

// ❌ Sai — mutate prop trực tiếp
const props = defineProps<{ modelValue: string }>()
props.modelValue = 'new value' // LỖI!

// ✅ Đúng — emit để update
emit('update:modelValue', 'new value')
```

---

## Template Best Practices

```vue
<template>
  <!-- ✅ v-if / v-else rõ ràng -->
  <div v-if="isLoading">Loading...</div>
  <UserList v-else-if="users.length > 0" :users="users" />
  <EmptyState v-else />

  <!-- ✅ Dùng key trong v-for -->
  <UserCard
    v-for="user in users"
    :key="user.id"
    :user="user"
    @select="handleSelect"
  />

  <!-- ✅ Event modifier rõ nghĩa -->
  <form @submit.prevent="handleSubmit">
    <input @keydown.enter.prevent="handleEnter" />
  </form>

  <!-- ❌ Tránh v-if + v-for trên cùng element -->
  <!-- ✅ Dùng computed để filter thay thế -->
  <UserCard v-for="user in activeUsers" :key="user.id" :user="user" />
</template>

<script setup lang="ts">
// Filter trong computed, không trong template
const activeUsers = computed(() => users.value.filter(u => u.isActive))
</script>
```

---

## Tổ chức component theo Feature

```
features/
└── auth/
    ├── components/
    │   ├── LoginForm.vue
    │   └── RegisterForm.vue
    ├── composables/
    │   └── useAuth.ts
    ├── stores/
    │   └── authStore.ts
    └── types.ts
```

---

## Checklist

- [ ] Dùng `<script setup lang="ts">` cho tất cả component
- [ ] Props và emits có TypeScript types đầy đủ
- [ ] Không có `any` type
- [ ] State reactivity đúng loại (`ref` vs `reactive`)
- [ ] Computed cho derived state (không tính toán trong template)
- [ ] `key` attribute trong tất cả `v-for`
- [ ] Không mutate props
- [ ] Component tên PascalCase, file tên PascalCase.vue

---

## Tham khảo

- [Vue 3 Official Docs — Composition API](https://vuejs.org/guide/introduction.html)
- [Vue 3 TypeScript Guide](https://vuejs.org/guide/typescript/overview.html)
- [vuejs-ai/skills](https://github.com/vuejs-ai/skills)
