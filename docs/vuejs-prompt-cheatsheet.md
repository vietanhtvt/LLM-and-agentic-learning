# Vue.js AI Prompt Cheatsheet

> Tổng hợp nhanh các prompts thường dùng khi làm việc với AI cho Vue.js development.

---

## Quick Reference

### Tạo Component
```
Tạo Vue 3 component <script setup> + TypeScript cho [mô tả].
Props: [list]. Emits: [list]. Dùng Tailwind CSS.
```

### Tạo Composable
```
Tạo composable `use[X]` để [mục đích].
Trả về: reactive state, methods. Cleanup trong onUnmounted.
```

### Tạo Pinia Store
```
Tạo Pinia store `use[X]Store` với setup syntax + TypeScript.
State: [list]. Actions cần gọi API: [endpoints].
```

### Viết Unit Test
```
Viết Vitest tests cho component sau. Cover: render, props, emits, user interactions.
[Paste component]
```

### Code Review
```
Review Vue 3 code sau: performance, reactivity, security, accessibility.
[Paste code]
```

### Debug
```
Component bị [vấn đề]. Error: [error message]. Code: [paste]. Fix giúp tôi.
```

### Refactor
```
Refactor component này: tách composables, cải thiện readability, giữ nguyên logic.
[Paste component]
```

### TypeScript Types
```
Thêm TypeScript types đầy đủ (props, emits, generics) cho component:
[Paste component]
```

---

## Patterns Hay Dùng

### v-model Custom Component
```
Tạo custom input component hỗ trợ v-model với TypeScript.
Value type: [string/number/object]. Validation built-in.
```

### Async Data Loading
```
Tạo Vue 3 component load data từ API [endpoint] với:
loading skeleton, error state, empty state, retry button.
```

### Infinite Scroll
```
Thêm infinite scroll vào danh sách Vue 3 dùng IntersectionObserver.
Có loading indicator và xử lý end-of-list.
```

### Optimistic Update
```
Implement optimistic update cho action [thêm/sửa/xóa] item.
Rollback nếu API call thất bại. Dùng Pinia store.
```

### Modal/Dialog
```
Tạo reusable modal component với:
- Teleport vào body
- Focus trap
- ESC để đóng
- Animate open/close
- TypeScript + slots
```

---

## Context Setup Nhanh

Paste đầu mỗi conversation:

```
Project: Vue 3 + TypeScript + Vite + Pinia + Vue Router 4 + Tailwind CSS
Style: <script setup>, Composition API, strict TypeScript
Testing: Vitest + Vue Test Utils
Linting: ESLint + Prettier
```

---

*Xem chi tiết tại: [vuejs-ai-skills.md](./vuejs-ai-skills.md)*
