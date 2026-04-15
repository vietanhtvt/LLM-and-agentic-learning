# Vue.js AI Skills — Index

Mỗi skill file là một tài liệu hướng dẫn AI agent hiểu đúng conventions và best practices cho từng lĩnh vực cụ thể trong Vue.js ecosystem.

## Danh sách Skills

| Skill | Mô tả | Impact |
|-------|-------|--------|
| [vue-best-practices](./vue-best-practices.md) | Composition API, TypeScript, cấu trúc project | High |
| [vue-component-patterns](./vue-component-patterns.md) | Props/emits, slots, renderless components | High |
| [vue-state-management](./vue-state-management.md) | Pinia stores, actions, getters | High |
| [vue-router](./vue-router.md) | Navigation guards, lazy loading, typed routes | Medium |
| [vue-testing](./vue-testing.md) | Vitest, Vue Test Utils, Playwright | High |
| [vue-composables](./vue-composables.md) | Custom composables, VueUse patterns | Medium |
| [vue-performance](./vue-performance.md) | Code splitting, memoization, bundle optimization | Medium |

## Cách dùng skill trong prompt

```
# Kích hoạt toàn bộ Vue best practices
"Dùng vue-best-practices skill để tạo component ProductCard"

# Kết hợp nhiều skills
"Dùng vue-state-management và vue-testing skill: tạo Pinia store cho cart và viết tests"
```

## Cấu trúc của mỗi skill file

```markdown
# [Tên Skill]
> Mô tả ngắn

## Nguyên tắc cốt lõi
## Patterns đúng / sai (với code examples)
## Checklist
## Tham khảo
```
