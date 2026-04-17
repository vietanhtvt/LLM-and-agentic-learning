# Vue.js AI Skills — Tổng quan

Bộ tài liệu hướng dẫn AI viết code Vue 3 đúng chuẩn. Được tổng hợp từ cộng đồng `vuejs-ai/skills`, tài liệu Vue chính thức, và các dự án thực tế.

---

## Tại sao cần bộ skill này?

AI thường mắc những lỗi cơ bản khi viết Vue.js:
- Trộn lẫn Vue 2 Options API với Vue 3 Composition API
- Dùng `modelValue` + emit thay vì `defineModel()` (Vue 3.4+)
- Destructure `reactive()` và mất reactivity
- Watch trực tiếp value thay vì getter function
- Dùng Vuex thay vì Pinia
- Viết side effects trong `computed`

Bộ skill này giải quyết những vấn đề đó bằng **hướng dẫn cụ thể, có ví dụ đúng/sai rõ ràng**.

---

## Cấu trúc bộ skill

```
CLAUDE.md                          # Điểm vào chính — quy tắc cốt lõi
skills/
  vuejs-core/SKILL.md              # Vue 3 Composition API
  vuejs-state/SKILL.md             # Pinia state management
  vuejs-patterns/SKILL.md          # Design patterns & component architecture
  vuejs-testing/SKILL.md           # Vitest + Vue Test Utils
  vuejs-performance/SKILL.md       # Performance optimization
.claude-plugin/plugin.json         # Plugin metadata
docs/
  VUE_AI_SKILLS_OVERVIEW.md        # File này
```

---

## Nội dung từng skill

### `CLAUDE.md` — Quy tắc cốt lõi (đọc trước)

Quick reference cho 15 quy tắc quan trọng nhất:
- `<script setup lang="ts">` luôn luôn
- Type-based props/emits syntax
- `defineModel()` cho v-model
- `ref` vs `reactive` — khi nào dùng cái nào
- `watch()` với getter function, không phải raw value
- Pinia Setup Store + `storeToRefs()`
- Bảng lỗi AI hay mắc và cách sửa

---

### `skills/vuejs-core/SKILL.md` — Composition API

**Chủ đề:** Cấu trúc component, reactivity system, lifecycle hooks, template directives

**Highlights:**
- Thứ tự chuẩn trong `<script setup>`: imports → props/emits → state → computed → methods → watchers → lifecycle
- `ref` vs `reactive` — bảng so sánh theo tình huống
- `computed` purity rules — không được có side effects
- `watch` vs `watchEffect` — khi nào dùng cái nào
- Lifecycle hooks — mục đích từng hook
- `defineExpose()` — chỉ expose khi thực sự cần
- Async trong setup — Suspense vs onMounted pattern

---

### `skills/vuejs-state/SKILL.md` — Pinia

**Chủ đề:** State management với Pinia, store design, composition

**Highlights:**
- Setup Store style (Composition API) vs Options Store — tại sao dùng Setup
- Phân chia store theo domain (auth, cart, catalog, ui)
- `storeToRefs()` — bắt buộc khi destructure state/getters
- Async actions — loading + error state pattern
- Store composition — store dùng store khác
- `$subscribe` và `$onAction` cho side effects
- Custom `reset()` function cho Setup Store
- Tránh `provide/inject` cho global state

---

### `skills/vuejs-patterns/SKILL.md` — Design Patterns

**Chủ đề:** Kiến trúc component, tái sử dụng logic, dependency injection

**Highlights:**
- **Composable Pattern** — tách logic ra `use*.ts`
- **Container/Presentational** — smart vs dumb components
- **Renderless (Headless) Component** — logic không có UI
- **Plugin Pattern** — extend Vue globally
- **Custom Directive** — khi nào cần DOM access trực tiếp
- **Async Component + Suspense** — lazy loading với fallback
- **Provide/Inject** — dependency injection với `InjectionKey` typed
- **Error Boundary** — `onErrorCaptured` để bắt lỗi con
- **Form Pattern** — `useForm` composable chuẩn

---

### `skills/vuejs-testing/SKILL.md` — Testing

**Chủ đề:** Vitest, Vue Test Utils, testing strategy

**Highlights:**
- Cấu hình `vitest.config.ts` chuẩn
- Factory function pattern — tránh lặp setup
- `data-testid` — query element ổn định
- Mock Pinia với `createTestingPinia()`
- Test async component với `flushPromises()`
- Test Vue Router — navigation guards
- Test composables — không cần mount component
- Test structure: unit/components, unit/composables, unit/stores, integration, e2e

---

### `skills/vuejs-performance/SKILL.md` — Performance

**Chủ đề:** Bundle optimization, runtime performance, rendering

**Highlights:**
- Bundle: lazy load routes + components, tree-shaking, không ship Vue compiler
- `shallowRef` / `shallowReactive` cho data lớn
- `v-once` và `v-memo` — skip renders khi không cần
- Virtual scrolling với `vue-virtual-scroller` cho 1000+ items
- `computed` caching — không gọi method trong template
- Props stability — tránh inline object/array
- `KeepAlive` — preserve state cho tab switching
- Debounce watchers cho search input
- Performance checklist và common anti-patterns table

---

## Nguồn tham khảo

| Nguồn | Loại |
|---|---|
| [vuejs-ai/skills](https://github.com/vuejs-ai/skills) | Community standard |
| [forrestchang/andrej-karpathy-skills](https://github.com/forrestchang/andrej-karpathy-skills) | Format reference |
| [alexanderop/claude-skill-vue-development](https://github.com/alexanderop/claude-skill-vue-development) | Claude skill example |
| [Vue.js Official Docs](https://vuejs.org/guide/best-practices/) | Primary reference |
| [Pinia Docs](https://pinia.vuejs.org/core-concepts/) | State management |
| [Vue Test Utils](https://test-utils.vuejs.org/) | Testing reference |
| [VoltAgent awesome-claude-code](https://github.com/VoltAgent/awesome-claude-code-subagents) | Vue expert agent |

---

## Cách dùng với Claude Code

### Option 1: CLAUDE.md tự động
Đặt `CLAUDE.md` vào root của project. Claude Code đọc file này tự động khi bắt đầu session.

### Option 2: Skill command
```bash
# Cài skill (nếu Claude Code hỗ trợ plugin)
/skill vuejs-core
/skill vuejs-state
```

### Option 3: Paste vào system prompt
Copy nội dung từ `CLAUDE.md` vào system prompt của AI assistant đang dùng.

### Option 4: Prefix câu hỏi
```
"Viết Vue 3 component theo Composition API với <script setup lang='ts'>:
[yêu cầu của bạn]"
```

---

## Techstack đầy đủ được bộ skill này hỗ trợ

| Layer | Công nghệ |
|---|---|
| Framework | Vue 3 |
| Language | TypeScript |
| Build tool | Vite |
| State | Pinia |
| Router | Vue Router 4 |
| Testing | Vitest + Vue Test Utils |
| E2E | Playwright hoặc Cypress |
| SSR/SSG | Nuxt 3 |
| IDE | VS Code + Volar |
| Linting | ESLint + vue-eslint-parser |

---

## Changelog

| Version | Ngày | Thay đổi |
|---|---|---|
| 1.0.0 | 2026-04-16 | Khởi tạo bộ skill Vue 3 với 5 SKILL.md files |
