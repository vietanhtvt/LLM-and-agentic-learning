# Vue Performance Skill

> Code splitting, lazy loading, memoization, bundle optimization — Vue app nhanh từ đầu.

**Impact:** Medium | **Loại:** Efficiency

---

## Nguyên tắc cốt lõi

- **Measure first** — dùng Vue DevTools và Lighthouse trước khi optimize.
- **Code splitting** mặc định cho routes và components nặng.
- **Computed** cho derived state — không tính toán trong template.
- **Virtual scrolling** cho lists > 100 items.
- Bundle size: target **< 200KB** JS initial load (gzipped).

---

## Code Splitting

### Lazy Load Routes (bắt buộc)

```typescript
// ✅ Lazy load tất cả route components
const routes = [
  {
    path: '/dashboard',
    component: () => import('@/pages/DashboardPage.vue'),  // Chunk riêng
  },
]

// ❌ Không import trực tiếp (tăng bundle size)
import DashboardPage from '@/pages/DashboardPage.vue'
```

### Lazy Load Components nặng

```typescript
import { defineAsyncComponent } from 'vue'

// ✅ Chart, Editor, Map — load khi cần
const RichTextEditor = defineAsyncComponent(
  () => import('@/components/RichTextEditor.vue')
)

const ChartWidget = defineAsyncComponent({
  loader: () => import('@/components/ChartWidget.vue'),
  loadingComponent: SkeletonLoader,
  delay: 200,
})
```

---

## Tối ưu Reactivity

### `v-memo` cho danh sách phức tạp

```vue
<!-- Re-render chỉ khi item.id hoặc item.selected thay đổi -->
<div v-for="item in list" :key="item.id" v-memo="[item.id, item.selected]">
  <ExpensiveComponent :item="item" />
</div>
```

### `v-once` cho static content

```vue
<!-- Render một lần, không bao giờ update -->
<footer v-once>
  <p>Copyright {{ year }}</p>
  <LegalText />
</footer>
```

### `shallowRef` và `shallowReactive` cho objects lớn

```typescript
// ✅ Dùng khi không cần deep reactivity
const bigDataset = shallowRef<DataRow[]>([])

// Cập nhật: replace toàn bộ array thay vì mutate
bigDataset.value = [...bigDataset.value, newRow]
```

---

## Virtual Scrolling cho Lists Lớn

```vue
<!-- Dùng @vueuse/core hoặc vue-virtual-scroller -->
<script setup lang="ts">
import { useVirtualList } from '@vueuse/core'

const { list, containerProps, wrapperProps } = useVirtualList(
  allItems,
  { itemHeight: 56 }
)
</script>

<template>
  <!-- Chỉ render items trong viewport -->
  <div v-bind="containerProps" style="height: 400px; overflow-y: auto">
    <div v-bind="wrapperProps">
      <div v-for="{ data: item } in list" :key="item.id" style="height: 56px">
        <UserRow :user="item" />
      </div>
    </div>
  </div>
</template>
```

---

## KeepAlive cho Tab Components

```vue
<!-- Cache component state khi switch tabs -->
<KeepAlive :include="['ProductList', 'UserList']" :max="5">
  <component :is="currentTabComponent" />
</KeepAlive>

<!-- Lifecycle hooks trong cached component -->
<script setup>
onActivated(() => {
  // Refresh data khi component được activate lại
  refreshData()
})
</script>
```

---

## Tối ưu Watchers

```typescript
// ✅ Watch cụ thể thay vì deep watch
watch(
  () => user.value?.address?.city,
  (city) => updateLocation(city)
)

// ❌ Tránh deep watch trên objects lớn (performance hit)
watch(user, () => {}, { deep: true })

// ✅ watchEffect với cleanup
watchEffect((onCleanup) => {
  const subscription = dataStream.subscribe(handleData)
  onCleanup(() => subscription.unsubscribe())
})
```

---

## Bundle Optimization với Vite

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Tách vendor chunks
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'ui-vendor': ['@headlessui/vue', '@heroicons/vue'],
        },
      },
    },
    // Cảnh báo khi chunk > 500KB
    chunkSizeWarningLimit: 500,
  },
})
```

### Tree Shaking imports

```typescript
// ✅ Named imports — tree shakeable
import { ref, computed, watch } from 'vue'
import { format, parseISO } from 'date-fns'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'

// ❌ Default import của cả thư viện
import * as dateFns from 'date-fns'
import _ from 'lodash'  // Import cả lodash!
// ✅ Dùng thay thế
import debounce from 'lodash-es/debounce'
```

---

## Tối ưu Images

```vue
<!-- ✅ Native lazy loading -->
<img src="/hero.jpg" loading="lazy" decoding="async" />

<!-- ✅ Modern formats với fallback -->
<picture>
  <source srcset="/image.avif" type="image/avif" />
  <source srcset="/image.webp" type="image/webp" />
  <img src="/image.jpg" alt="..." loading="lazy" />
</picture>
```

---

## Đo Performance

```typescript
// Dùng Vue DevTools Performance tab để track re-renders
// Hoặc dùng browser DevTools

// Đo component render time
if (import.meta.env.DEV) {
  app.config.performance = true
}
```

```bash
# Phân tích bundle size
npx vite-bundle-analyzer
# hoặc
npx rollup-plugin-visualizer
```

---

## Checklist

- [ ] Tất cả route components lazy loaded
- [ ] Components nặng (charts, editors) dùng `defineAsyncComponent`
- [ ] Lists > 100 items dùng virtual scrolling
- [ ] Không có `watch(..., { deep: true })` trên objects lớn
- [ ] Tree-shaking imports (named imports)
- [ ] Bundle size đã được kiểm tra
- [ ] Lighthouse score > 90 cho Production build

---

## Tham khảo

- [Vue 3 Performance Guide](https://vuejs.org/guide/best-practices/performance.html)
- [Vite Build Optimization](https://vitejs.dev/guide/build.html)
- [VueUse — useVirtualList](https://vueuse.org/core/useVirtualList/)
