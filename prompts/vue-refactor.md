# Prompt Template: Refactor Vue.js Code

> Dùng khi cần AI refactor code hiện tại sang Vue 3 best practices.

---

## Template cơ bản

```
Hãy refactor code sau theo Vue 3 best practices:

**Mục tiêu refactor:**
[ ] Options API → Composition API + <script setup>
[ ] JavaScript → TypeScript
[ ] Vuex → Pinia
[ ] Tách logic vào composable
[ ] Cải thiện performance (lazy loading, memoization)
[ ] Cải thiện type safety

**Code hiện tại:**
```vue
[Paste code cần refactor]
```

**Constraints:**
- Không thay đổi behavior — chỉ cải thiện structure/quality
- Giữ nguyên tên props/emits public API
- Không refactor code ngoài phạm vi yêu cầu

Hãy:
1. Liệt kê những gì sẽ thay đổi và tại sao
2. Cung cấp code đã refactor
3. Highlight các thay đổi quan trọng
```

---

## Ví dụ: Options API → Composition API

```
Refactor component này từ Options API sang Composition API + TypeScript:

```vue
<script>
export default {
  props: ['userId'],
  data() {
    return {
      user: null,
      loading: false,
    }
  },
  computed: {
    displayName() {
      return this.user?.name || 'Unknown'
    },
  },
  async created() {
    this.loading = true
    this.user = await fetchUser(this.userId)
    this.loading = false
  },
  methods: {
    async updateUser(data) {
      await updateUser(this.userId, data)
      this.user = { ...this.user, ...data }
    },
  },
}
</script>
```

Yêu cầu:
- Dùng <script setup lang="ts">
- Type cho props và data
- xử lý error state (hiện tại không có)
- Không thay đổi template và public API
```

---

## Ví dụ: Tách logic vào Composable

```
Component này quá lớn (300+ dòng). Hãy tách business logic vào composable:

```vue
[Paste component]
```

Hãy:
1. Identify những logic nào có thể tách vào composable
2. Tạo composable(s) trong /composables/
3. Refactor component để dùng composable
4. Đảm bảo TypeScript types đầy đủ
```

---

## Ví dụ: Vuex → Pinia

```
Migrate store này từ Vuex 4 sang Pinia:

```javascript
// store/modules/auth.js (Vuex)
const authModule = {
  namespaced: true,
  state: () => ({
    user: null,
    token: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  mutations: {
    SET_USER(state, user) { state.user = user },
    SET_TOKEN(state, token) { state.token = token },
  },
  actions: {
    async login({ commit }, { email, password }) {
      const { user, token } = await authApi.login(email, password)
      commit('SET_USER', user)
      commit('SET_TOKEN', token)
    },
  },
}
```

Yêu cầu:
- Dùng Setup Store syntax (không dùng Options Store)
- TypeScript với đầy đủ types
- Giữ nguyên behavior
- Thêm error và loading state nếu chưa có
```

---

## Checklist sau Refactor

- [ ] Không breaking changes trong public API (props, emits)
- [ ] TypeScript strict — không có `any`
- [ ] Tests vẫn pass (hoặc đã update tests)
- [ ] Không thay đổi behavior ngoài yêu cầu
- [ ] Code ngắn hơn hoặc dễ đọc hơn (refactor phải có giá trị)
