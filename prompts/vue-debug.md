# Prompt Template: Debug Vue.js Issues

> Dùng template này khi cần AI giúp debug lỗi trong Vue.js app.

---

## Template

```
Tôi gặp bug trong Vue.js app:

**Mô tả vấn đề:**
[Mô tả rõ ràng: expected behavior vs actual behavior]

**Reproduce steps:**
1. [Step 1]
2. [Step 2]
3. ...

**Error message (nếu có):**
```
[Paste error here]
```

**Code liên quan:**
```vue
[Paste component/composable/store code]
```

**Đã thử:**
- [Những gì đã thử nhưng không work]

**Environment:**
- Vue: 3.x
- Vite/Nuxt: ...
- Browser: ...

Hãy:
1. Phân tích nguyên nhân có thể
2. Giải thích tại sao bug xảy ra
3. Đề xuất fix (chỉ thay đổi tối thiểu cần thiết)
4. Gợi ý cách prevent bug tương tự
```

---

## Các Bug Phổ Biến trong Vue 3

### 1. Reactivity không hoạt động

```
Bug: State thay đổi nhưng UI không update

Hãy check:
- Có dùng ref() cho primitives không?
- Có dùng storeToRefs() khi destructure Pinia store không?
- Có trực tiếp assign thay vì mutate không?
  - ❌ arr = newArr (mất reactive)
  - ✅ arr.value = newArr
```

### 2. Props mutation

```
Bug: Warning "Avoid mutating a prop directly"

Code:
[paste component code]

Hãy refactor để dùng emit thay vì mutate props.
```

### 3. Memory leak từ event listeners

```
Bug: Memory leak sau khi component bị unmount

Code:
[paste composable có addEventListener]

Hãy check cleanup trong onUnmounted và fix nếu thiếu.
```

### 4. Async/await trong Vue lifecycle

```
Bug: Data không có khi component mount

Code:
[paste component với async setup hoặc onMounted]

Hãy phân tích timing issue và đề xuất fix.
```

### 5. v-for key issues

```
Bug: List render sai / animations bị lỗi

Template:
[paste v-for code]

Hãy check key attribute và đề xuất stable keys.
```

---

## Template cho Performance Debug

```
Trang [NAME] render chậm / lag khi [ACTION]

Profiling info từ Vue DevTools:
- Component re-renders: [số lần]
- Bottleneck: [component name nếu biết]

Code hiện tại:
[paste code]

Hãy:
1. Identify nguyên nhân re-render không cần thiết
2. Đề xuất optimization (v-memo, computed, shallowRef, etc.)
3. Ước lượng cải thiện performance
```

---

## Template cho TypeScript Errors

```
TypeScript error:
```
[paste full error với file path và line number]
```

Code:
```typescript
[paste relevant code]
```

Hãy explain lỗi và fix type issue mà không dùng 'as any' hoặc '!'.
```
