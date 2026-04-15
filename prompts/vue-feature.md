# Prompt Template: Phát triển Tính năng Vue.js

> Dùng template này khi yêu cầu AI xây dựng một tính năng mới trong Vue.js app.

---

## Template

```
Tôi cần xây dựng tính năng: [MÔ TẢ NGẮN GỌN]

**Context:**
- Techstack: Vue 3 + TypeScript + Pinia + Vue Router + Vitest
- Phần của app: [component/page/feature name]
- Files liên quan: [liệt kê nếu có]

**Yêu cầu chức năng:**
1. [Requirement 1]
2. [Requirement 2]
3. ...

**Tiêu chí hoàn thành (Definition of Done):**
- [ ] Component render đúng theo requirements
- [ ] TypeScript không có errors
- [ ] Có unit tests (Vitest)
- [ ] Xử lý loading state và error state
- [ ] Responsive (nếu cần)

**Constraints:**
- Chỉ dùng Composition API + <script setup>
- Không dùng any type
- Follows naming conventions: PascalCase cho components, camelCase cho composables

Hãy:
1. Nêu hiểu biết của bạn về requirement trước khi code
2. Liệt kê files sẽ tạo/sửa
3. Implement từng file
4. Viết tests
```

---

## Ví dụ thực tế

### Ví dụ 1: Product List với filter

```
Tôi cần xây dựng tính năng: Product List với filter và search

Context:
- Techstack: Vue 3 + TypeScript + Pinia + Vitest
- Phần của app: /pages/ProductsPage.vue
- API endpoint đã có: GET /api/products?category=&search=&page=

Yêu cầu:
1. Hiển thị danh sách sản phẩm (grid layout)
2. Filter theo category (dropdown)
3. Search theo tên (debounced 300ms)
4. Pagination
5. Loading skeleton khi fetch
6. Empty state khi không có kết quả

Tiêu chí hoàn thành:
- [ ] Filter và search có thể kết hợp
- [ ] URL sync với filter state (query params)
- [ ] TypeScript types cho Product
- [ ] Tests: filter logic, pagination, empty state

Dùng vue-best-practices và vue-state-management skill.
```

### Ví dụ 2: Authentication Form

```
Tôi cần xây dựng: Login form với validation

Context:
- File: /features/auth/components/LoginForm.vue
- Store đã có: useAuthStore với action login(email, password)
- Redirect sau login: về trang trước đó (từ query.redirect)

Yêu cầu:
1. Email + password fields
2. Client-side validation (email format, password min 8 chars)
3. Show/hide password toggle
4. Disable submit khi đang loading
5. Hiện error message từ server

Tiêu chí hoàn thành:
- [ ] Form không submit khi validation fail
- [ ] Loading state khi đang authenticate
- [ ] Error hiển thị rõ ràng
- [ ] Redirect sau login thành công
- [ ] Tests: validation, submit, error handling
```

---

## Tips cho AI hiệu quả hơn

1. **Cụ thể về data types**: Cung cấp interface/type nếu đã có
2. **Nêu rõ API contract**: Endpoint, request/response format
3. **Specify UI framework**: Tailwind, Vuetify, Element Plus...
4. **Existing patterns**: "Tham khảo cách UserCard.vue đang làm"
5. **Test coverage mong muốn**: "Viết tests cho happy path và 2 error cases"
