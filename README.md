# LLM & Agentic Learning — Vue.js AI Skills

Bộ tài liệu **AI Skills và Prompts** tổng hợp các best practices, hướng dẫn, và prompt templates dành cho phát triển Vue.js với sự hỗ trợ của AI (Claude Code, Cursor, GitHub Copilot...).

## Mục tiêu

- Cung cấp **skill files** chuẩn hóa để AI agent hiểu và áp dụng đúng conventions Vue 3.
- Giảm thiểu các lỗi phổ biến khi dùng AI để viết code Vue (over-engineering, sai patterns, thiếu type safety).
- Tích hợp kiến thức từ cộng đồng Vue.js và các nghiên cứu về LLM coding.

## Cấu trúc

```
├── CLAUDE.md                    # Nguyên tắc AI coding tổng quát
├── skills/
│   ├── README.md                # Index các skills
│   ├── vue-best-practices.md    # Composition API, TypeScript, cấu trúc dự án
│   ├── vue-component-patterns.md # Patterns thiết kế component
│   ├── vue-state-management.md  # Pinia — quản lý state
│   ├── vue-router.md            # Vue Router 4
│   ├── vue-testing.md           # Vitest + @vue/test-utils
│   ├── vue-composables.md       # Custom composables
│   └── vue-performance.md       # Tối ưu hiệu năng
└── prompts/
    ├── vue-feature.md           # Template: phát triển tính năng mới
    ├── vue-debug.md             # Template: debug & xử lý lỗi
    └── vue-refactor.md          # Template: refactor code
```

## Cách dùng

### Với Claude Code
```bash
# Copy CLAUDE.md vào root dự án Vue của bạn
cp CLAUDE.md /your-vue-project/CLAUDE.md

# Hoặc dùng skill cụ thể trong prompt
"Use vue-best-practices skill: tạo component UserProfile"
```

### Với Cursor / GitHub Copilot
Dùng nội dung trong `skills/*.md` làm nội dung cho `.cursorrules` hoặc Copilot instructions.

## Techstack được hỗ trợ

| Công nghệ | Phiên bản | Skill |
|-----------|-----------|-------|
| Vue | 3.x | vue-best-practices |
| TypeScript | 5.x | vue-best-practices |
| Pinia | 2.x | vue-state-management |
| Vue Router | 4.x | vue-router |
| Vitest | 2.x | vue-testing |
| VueUse | 12.x | vue-composables |
| Vite | 6.x | vue-best-practices |
| Nuxt | 3.x | vue-best-practices |

## Tham khảo

- [vuejs-ai/skills](https://github.com/vuejs-ai/skills) — Agent skills chuẩn của cộng đồng Vue
- [andrej-karpathy-skills](https://github.com/forrestchang/andrej-karpathy-skills) — Nguyên tắc AI coding của Karpathy
- [vibecodekit](https://github.com/croffasia/vibecodekit) — AI-first Vue.js starter
- [Vue School — AI Agent Tips](https://vueschool.io/articles/vuejs-tutorials/vue-agent-skills-for-reliable-ai-development/)
