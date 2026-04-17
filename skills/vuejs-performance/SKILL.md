# vuejs-performance

**Hướng dẫn tối ưu hiệu năng Vue 3. Áp dụng khi build app production hoặc fix performance issues.**

---

## 1. Bundle size — lazy load mọi thứ nặng

**Không import toàn bộ thư viện. Không load component nặng ở initial bundle.**

```typescript
// ✅ Lazy load component
const HeavyChart = defineAsyncComponent({
  loader: () => import('./HeavyChart.vue'),
  loadingComponent: Skeleton,
  errorComponent: ErrorFallback,
  delay: 200,     // Hiển thị loading sau 200ms (tránh flash)
  timeout: 10000
})

// ✅ Route-level code splitting
const routes: RouteRecordRaw[] = [
  { path: '/', component: () => import('@/pages/Home.vue') },
  { path: '/dashboard', component: () => import('@/pages/Dashboard.vue') },
]

// ✅ Tree-shaking — import cụ thể, không import cả thư viện
import { format, parseISO } from 'date-fns' // ✅
import * as dateFns from 'date-fns'          // ❌ 200kb+

import { debounce } from 'lodash-es'        // ✅ ES modules
import _ from 'lodash'                       // ❌ CommonJS, không tree-shake được
```

---

## 2. Reactivity — shallowRef và shallowReactive cho data lớn

**Deep reactivity tốn kém. Dùng shallow variants khi chỉ cần track thay đổi top-level.**

```typescript
// ✅ shallowRef — chỉ track thay đổi khi replace cả value
const rows = shallowRef<TableRow[]>([])

// Để trigger update, phải reassign (không phải mutate)
function updateRows(newData: TableRow[]) {
  rows.value = [...newData] // reassign → trigger update
}

// ❌ ref() cho list 10,000 items — Vue track tất cả nested properties
const bigList = ref<Item[]>(tenThousandItems) // Quá tốn kém

// ✅ shallowReactive — track shallow, tốt cho form config
const config = shallowReactive({
  pageSize: 20,
  sortBy: 'name',
  filters: {} // thay đổi filters phải replace object
})
```

---

## 3. Template: v-memo và v-once cho static/ít-thay-đổi

```vue
<!-- ✅ v-once — render một lần, không bao giờ re-render -->
<AppLogo v-once />
<StaticTermsText v-once />

<!-- ✅ v-memo — skip re-render sub-tree khi deps không đổi -->
<!-- Chỉ re-render khi item.id hoặc item.selected thay đổi -->
<div v-for="item in list" :key="item.id" v-memo="[item.id, item.selected]">
  <ComplexItemCard :item="item" />
</div>

<!-- ❌ Không dùng v-memo cho list đơn giản — overhead không đáng -->
<li v-for="s in strings" :key="s" v-memo="[s]">{{ s }}</li>
```

---

## 4. List virtualization — bắt buộc cho 1000+ items

**Render 1000+ DOM nodes gây lag. Dùng virtual scrolling.**

```vue
<!-- ✅ vue-virtual-scroller -->
<script setup lang="ts">
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
</script>

<template>
  <RecycleScroller
    :items="largeList"
    :item-size="60"
    key-field="id"
    v-slot="{ item }"
  >
    <ProductRow :product="item" />
  </RecycleScroller>
</template>

<!-- ❌ Render trực tiếp 10,000 items -->
<div v-for="item in tenThousandItems" :key="item.id">
  <ComplexRow :item="item" />
</div>
```

---

## 5. computed caching — không gọi method trong template

**`computed` được cache. Method gọi trong template sẽ chạy lại mỗi lần re-render.**

```vue
<script setup lang="ts">
// ✅ computed — chỉ tính lại khi dependency thay đổi
const sortedProducts = computed(() =>
  [...products.value].sort((a, b) => a.price - b.price)
)

const expensiveFilter = computed(() =>
  products.value.filter(p => complexValidation(p))
)

// ❌ Method — chạy lại mỗi re-render
function getSortedProducts() {
  return [...products.value].sort((a, b) => a.price - b.price)
}
</script>

<template>
  <!-- ✅ -->
  <ProductCard v-for="p in sortedProducts" :key="p.id" />

  <!-- ❌ getSortedProducts() chạy lại mỗi render cycle -->
  <ProductCard v-for="p in getSortedProducts()" :key="p.id" />
</template>
```

---

## 6. Props stability — tránh tạo object/array mới trong template

**Object/array mới mỗi render = child component luôn re-render dù data không đổi.**

```vue
<script setup lang="ts">
// ✅ Stable prop — tạo một lần
const tableConfig = computed(() => ({
  pageSize: 20,
  sortable: true,
  columns: columnDefs
}))

// ❌ Inline object — tạo mới mỗi render
</script>

<template>
  <!-- ✅ -->
  <DataTable :config="tableConfig" />

  <!-- ❌ Tạo object mới mỗi render → DataTable luôn re-render -->
  <DataTable :config="{ pageSize: 20, sortable: true }" />

  <!-- ❌ Tạo array mới mỗi render -->
  <Select :options="['A', 'B', 'C']" />
</template>
```

---

## 7. KeepAlive — preserve state cho tab switching

```vue
<!-- ✅ KeepAlive cho tab UI — tránh re-fetch khi switch tab -->
<KeepAlive :include="['ProductList', 'OrderHistory']" :max="5">
  <component :is="currentTab" />
</KeepAlive>

<!-- Trong component được keep-alive -->
<script setup lang="ts">
onActivated(() => {
  // Chạy khi component được kích hoạt lại
  if (needsRefresh.value) fetchData()
})

onDeactivated(() => {
  // Cleanup khi component bị deactivate (vẫn giữ trong cache)
  pauseVideoPlayback()
})
</script>
```

---

## 8. Watch optimization — tránh deep watch không cần thiết

```typescript
// ❌ Tốn kém — Vue phải traverse toàn bộ object tree
watch(formData, handler, { deep: true })

// ✅ Watch property cụ thể
watch(() => formData.value.email, (email) => validateEmail(email))
watch(() => formData.value.phone, (phone) => validatePhone(phone))

// ✅ Hoặc dùng watchEffect — tự track dependencies
watchEffect(() => {
  if (formData.value.email) validateEmail(formData.value.email)
})

// ✅ Debounce watch cho search input
const debouncedSearch = useDebounce(searchQuery, 300)
watch(debouncedSearch, fetchResults)
```

---

## 9. SSR và Static Generation

**SPA không tốt cho SEO và first-load performance. Dùng Nuxt 3 cho SSR/SSG.**

```typescript
// Nuxt 3 — built-in SSR, tự động code splitting, auto-imports
// nuxt.config.ts

export default defineNuxtConfig({
  // SSG: pre-render tất cả routes
  nitro: { prerender: { routes: ['/'] } },

  // Tối ưu bundle
  experimental: { payloadExtraction: true }
})

// Vs. SPA thuần — chỉ phù hợp cho:
// - App nội bộ (không cần SEO)
// - Behind authentication (no public crawling)
// - Prototypes
```

---

## 10. Performance checklist

### Build-time
- [ ] Route-level code splitting với dynamic import
- [ ] `defineAsyncComponent()` cho component nặng
- [ ] Tree-shaking: import cụ thể từ thư viện (lodash-es, date-fns)
- [ ] Pre-compile templates (không ship Vue compiler)
- [ ] Phân tích bundle với `rollup-plugin-visualizer`

### Runtime
- [ ] `shallowRef` / `shallowReactive` cho data lớn
- [ ] `v-once` cho content tĩnh
- [ ] `v-memo` cho list items ít thay đổi
- [ ] Virtual scroll cho list 1000+ items
- [ ] `computed` thay vì method trong template
- [ ] Props object/array stable (không tạo inline)
- [ ] `KeepAlive` cho tab switching

### Monitoring
- [ ] Lighthouse score > 90 cho LCP, FID, CLS
- [ ] Vue DevTools → Performance tab để identify bottlenecks
- [ ] Chrome Performance Profiler cho slow renders
- [ ] Bundle size < 200kb gzipped (initial load)

---

## Common performance anti-patterns

| Anti-pattern | Impact | Fix |
|---|---|---|
| `ref()` cho list 10k+ items | High CPU | `shallowRef()` |
| Method đắt trong template | Re-runs mỗi render | `computed` |
| `watch(obj, h, { deep: true })` | Traverse toàn bộ | Watch specific property |
| Inline object/array trong props | Child luôn re-render | Extract vào `computed` |
| Render 1000+ items trực tiếp | DOM lag | `vue-virtual-scroller` |
| Import cả lodash | +200kb bundle | `lodash-es` specific import |
| Không split routes | Lớn initial bundle | Dynamic `import()` |
| SPA cho public content | SEO + LCP kém | Nuxt 3 SSR/SSG |
