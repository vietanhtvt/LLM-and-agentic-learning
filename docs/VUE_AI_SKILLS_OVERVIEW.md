# Vue.js AI Skills — Tổng quan

Bộ tài liệu hướng dẫn AI viết code Vue 3 đúng chuẩn. Được tổng hợp từ cộng đồng `vuejs-ai/skills`, `alexanderop/claude-skill-vue-development`, tài liệu Vue chính thức, và các dự án thực tế.

---

## Tại sao cần bộ skill này?

AI thường mắc những lỗi cơ bản khi viết Vue.js:
- Trộn lẫn Vue 2 Options API với Vue 3 Composition API
- Dùng `modelValue` + emit thay vì `defineModel()` (Vue 3.4+)
- Destructure `reactive()` và mất reactivity
- Watch trực tiếp value thay vì getter function
- Dùng Vuex thay vì Pinia
- Viết side effects trong `computed`
- Không có service layer — fetch trực tiếp trong component
- Hardcode route path thay vì dùng named routes
- Dùng `any` type thay vì proper TypeScript

Bộ skill này giải quyết những vấn đề đó bằng **hướng dẫn cụ thể, có ví dụ đúng/sai rõ ràng**.

---

## Cấu trúc bộ skill

```
CLAUDE.md                          # Điểm vào chính — 13 quy tắc cốt lõi
.cursorrules                       # Cursor IDE rules (tương đương CLAUDE.md)
skills/
  vuejs-core/SKILL.md              # Vue 3 Composition API
  vuejs-state/SKILL.md             # Pinia state management
  vuejs-router/SKILL.md            # Vue Router 4 (MỚI)
  vuejs-typescript/SKILL.md        # TypeScript nâng cao (MỚI)
  vuejs-api/SKILL.md               # API integration & service layer (MỚI)
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

Quick reference cho 13 quy tắc quan trọng nhất + bảng 21 lỗi AI hay mắc:
- `<script setup lang="ts">` luôn luôn
- Type-based props/emits syntax
- `defineModel()` cho v-model
- `ref` vs `reactive` — khi nào dùng cái nào
- `watch()` với getter function, không phải raw value
- Vue Router — named routes, lazy load, guards
- TypeScript — no any, const objects, type guards
- API service layer — không fetch trong component
- Pinia Setup Store + `storeToRefs()`

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
- **Typed slots** với `defineSlots<>()` (MỚI)
- **`<Teleport>`** cho modal/toast (MỚI)

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

### `skills/vuejs-router/SKILL.md` — Vue Router 4 *(MỚI)*

**Chủ đề:** Routing, navigation guards, typed routes, code splitting

**Highlights:**
- Định nghĩa routes với TypeScript — extend `RouteMeta`
- Navigation guards — auth, permissions, title
- `useRoute()` và `useRouter()` — không dùng `this.$route`
- Route-level code splitting — dynamic import bắt buộc
- Nested routes + layout patterns
- Route props — tách component khỏi router
- Named views cho dashboard layouts
- Route-level data fetching patterns
- Redirect sau login với query param

---

### `skills/vuejs-typescript/SKILL.md` — TypeScript Nâng cao *(MỚI)*

**Chủ đề:** Generic components, utility types, strict TypeScript cho Vue 3

**Highlights:**
- Generic component với `<script setup lang="ts" generic="T">`
- Template ref typing — `HTMLInputElement`, `InstanceType<typeof Component>`
- Composable return types — explicit interface
- `MaybeRefOrGetter<T>` — composable linh hoạt
- Emit typing — Vue 3.3+ named tuple syntax
- Discriminated union cho async state
- Store typing với generic CRUD pattern
- API types — `PaginatedResponse<T>`, `ApiError`
- `const` object thay vì TypeScript enum
- `vue-tsc --noEmit` trong CI

---

### `skills/vuejs-api/SKILL.md` — API Integration *(MỚI)*

**Chủ đề:** HTTP client, service layer, data fetching, error handling

**Highlights:**
- Service layer pattern — `src/services/`
- Centralized `ApiClient` với timeout, auth headers, error handling
- `useFetch` composable — loading, error, retry, abort
- `useInfiniteList` — infinite scroll/pagination
- Optimistic updates với rollback
- Phân loại lỗi — 401, 403, 404, 422, 429
- Request deduplication
- Form submission với Zod validation + server errors
- WebSocket và SSE composables

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
- **Compound Component Pattern** — implicit state sharing (MỚI)

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
- **MSW (Mock Service Worker)** — mock API ở network level (MỚI)
- **Snapshot testing** — khi nào nên/không nên dùng (MỚI)
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
| [aliarghyani/vue-cursor-rules](https://github.com/aliarghyani/vue-cursor-rules) | Cursor rules structure |
| [KIMJINWOO4/vue-skills](https://github.com/KIMJINWOO4/vue-skills) | Progressive disclosure pattern |
| [Vue.js Official Docs](https://vuejs.org/guide/best-practices/) | Primary reference |
| [Pinia Docs](https://pinia.vuejs.org/core-concepts/) | State management |
| [Vue Router Docs](https://router.vuejs.org/guide/) | Routing reference |
| [Vue Test Utils](https://test-utils.vuejs.org/) | Testing reference |
| [MSW Docs](https://mswjs.io/) | API mocking |

---

## Cách dùng với Claude Code

### Option 1: CLAUDE.md tự động
Đặt `CLAUDE.md` vào root của project. Claude Code đọc file này tự động khi bắt đầu session.

### Option 2: Cursor IDE
File `.cursorrules` tự động được Cursor đọc. Bao gồm tất cả rules tương đương CLAUDE.md.

### Option 3: Skill command
```bash
/skill vuejs-core
/skill vuejs-router
/skill vuejs-typescript
/skill vuejs-api
```

### Option 4: Paste vào system prompt
Copy nội dung từ `CLAUDE.md` vào system prompt của AI assistant đang dùng.

### Option 5: Prefix câu hỏi
```
"Viết Vue 3 component theo Composition API với <script setup lang='ts'>,
dùng Pinia cho state, Vue Router 4 cho navigation, và service layer cho API:
[yêu cầu của bạn]"
```

---

## Techstack đầy đủ được bộ skill này hỗ trợ

| Layer | Công nghệ |
|---|---|
| Framework | Vue 3 |
| Language | TypeScript (strict mode) |
| Build tool | Vite |
| State | Pinia |
| Router | Vue Router 4 |
| HTTP | Fetch API / Axios |
| Validation | Zod |
| Testing | Vitest + Vue Test Utils |
| API Mocking | MSW (Mock Service Worker) |
| E2E | Playwright hoặc Cypress |
| SSR/SSG | Nuxt 3 |
| IDE | VS Code + Volar |
| Linting | ESLint + vue-eslint-parser |

---

## Changelog

| Version | Ngày | Thay đổi |
|---|---|---|
| 2.0.0 | 2026-04-17 | Thêm 3 skill mới: vuejs-router, vuejs-typescript, vuejs-api. Thêm .cursorrules. Cải thiện CLAUDE.md (13 rules, 21 anti-patterns). Thêm Teleport, typed slots, compound components, MSW, snapshot testing |
| 1.0.0 | 2026-04-16 | Khởi tạo bộ skill Vue 3 với 5 SKILL.md files |
