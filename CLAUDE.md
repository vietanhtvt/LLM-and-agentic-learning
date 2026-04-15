# CLAUDE.md — AI Coding Guidelines cho Vue.js

> Được lấy cảm hứng từ [Andrej Karpathy's LLM coding principles](https://github.com/forrestchang/andrej-karpathy-skills) và cộng đồng [vuejs-ai/skills](https://github.com/vuejs-ai/skills).

---

## 1. Think Before Coding (Suy nghĩ trước khi code)

- Nêu rõ **các giả định** trước khi viết code. Nếu không chắc, hỏi.
- Khi prompt mơ hồ, trình bày **nhiều cách hiểu** và để user chọn, không tự ý chọn im lặng.
- Phân tích kiến trúc component trước: Props → Emits → State → Side Effects → Template.

```
Trước khi code:
✅ "Tôi hiểu yêu cầu là X. Giả định: A, B, C. Tiến hành nhé?"
❌ Tự suy đoán rồi code ngay, sau đó nói "tôi đã giả định X"
```

---

## 2. Simplicity First (Đơn giản là ưu tiên)

- Viết code **tối thiểu** giải quyết đúng vấn đề đặt ra — không thêm tính năng ngoài yêu cầu.
- Không tạo abstraction cho code chỉ dùng **một lần**.
- Nếu có thể viết 30 dòng thay vì 100 dòng, hãy làm vậy.
- Tránh over-engineering: không generic hóa trước khi thực sự cần.

**Áp dụng Vue:**
```vue
<!-- ✅ Đơn giản, đúng yêu cầu -->
<script setup lang="ts">
const count = ref(0)
</script>

<!-- ❌ Over-engineered không cần thiết -->
<script setup lang="ts">
const useCounter = createCounterFactory({ initialValue: 0, step: 1 })
const { count } = useCounter()
</script>
```

---

## 3. Surgical Changes (Thay đổi phẫu thuật)

- Khi sửa code có sẵn, **chỉ thay đổi đúng phần được yêu cầu**.
- Không "cải thiện" code lân cận, comment, hoặc formatting trừ khi được yêu cầu rõ ràng.
- Không xóa imports/functions cũ trừ khi chính thay đổi của bạn làm chúng obsolete.

```
Khi được yêu cầu "Fix lỗi validation trong form":
✅ Chỉ sửa logic validation
❌ Refactor toàn bộ component, đổi tên biến, thêm TypeScript types mới
```

---

## 4. Goal-Driven Execution (Thực thi hướng mục tiêu)

- Chuyển task mơ hồ thành **tiêu chí kiểm tra cụ thể**:
  - "Thêm validation" → "Viết test cho input không hợp lệ, sau đó làm test pass"
  - "Tối ưu performance" → "Giảm LCP xuống dưới 2.5s, đo bằng Lighthouse"
- Với task nhiều bước: nêu kế hoạch ngắn gọn + bước kiểm tra trước khi thực hiện.

---

## 5. Vue.js Standards (Quy chuẩn Vue.js)

### Bắt buộc
- Dùng **Composition API + `<script setup>`** — Options API chỉ cho codebase kế thừa.
- Dùng **TypeScript** với strict mode.
- State management: **Pinia** (không dùng Vuex).
- Routing: **Vue Router 4**.
- Testing: **Vitest + @vue/test-utils**.

### Quy tắc đặt tên
| Loại | Quy tắc | Ví dụ |
|------|---------|-------|
| Component | PascalCase | `UserProfile.vue` |
| Composable | camelCase + `use` prefix | `useAuthStore.ts` |
| Props | camelCase | `userName`, `isLoading` |
| Emits | kebab-case | `update:modelValue`, `item-selected` |
| Store | camelCase + `Store` suffix | `useUserStore` |

### Reactivity
- Dùng `ref()` cho primitives, `reactive()` cho objects phức tạp.
- Dùng `computed()` cho derived state (có cache).
- Tránh mutate props trực tiếp — dùng emit hoặc `v-model`.

---

## 6. Checklist trước khi hoàn thành task

```bash
npm run build        # Build thành công
npm run test         # Tất cả tests pass
npm run lint         # Không có lint errors
npx vue-tsc --noEmit # TypeScript không có lỗi
```

---

## Khi nào vi phạm nguyên tắc?

Chỉ vi phạm khi user **yêu cầu rõ ràng** và biết về trade-off. Ví dụ:
- "Tôi biết là over-engineering, nhưng tôi cần abstraction này cho tương lai"
- "Hãy refactor toàn bộ file khi sửa bug này"

---

*Xem thêm skills chi tiết trong thư mục [`skills/`](./skills/README.md)*
