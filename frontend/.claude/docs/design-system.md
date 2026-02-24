# Design System (`src/ui/`)

Reusable UI components are in `src/ui/components/` and exported from `src/ui/components/index.ts`:

- `Button`, `Input`, `Modal`, `Badge`, `Border`, `Checkbox`
- `NativeCombobox`, `SearchableCombobox`, `PlainCombobox`

### 접근성 (A11y) 규칙

- `Input`, `NativeCombobox`: `label` prop 전달 시 `useId()`로 자동 생성한 id를 `<label htmlFor>` — `<input id>` 에 연결. 외부에서 `id` prop을 직접 전달하면 해당 값 우선 사용.
- 아이콘 전용 버튼에는 반드시 `aria-label` 추가.
- 커스텀 인터랙티브 요소에는 `focus-visible:ring-2 focus-visible:ring-orange-500` 적용.
- `Navbar`, `MobileNavbar`
- `SidebarLayout`, `MinimizedSidebarLayout`, sidebar container components
- `TabBar`, `Table` family, `FadeScrollArea`

SVG assets are in `src/ui/assets/` and imported as React components via `vite-plugin-svgr`.
