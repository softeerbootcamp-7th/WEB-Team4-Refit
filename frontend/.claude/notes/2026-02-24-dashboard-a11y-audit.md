# Dashboard A11y Audit & Fix — 2026-02-24

## Summary

Dashboard 전체 컴포넌트(56개)에 대한 WCAG 2.1 AA 접근성 감사를 수행하고, 발견된 주요 이슈를 2차에 걸쳐 수정함. 1차: empty-state 텍스트 대비(9개 파일), 2차: 키보드 접근성, aria-label 누락, form label 연결, focus-visible 스타일(9개 파일 추가).

## Patterns & Conventions

- **색상 대비 기준**: `text-gray-400`(#808894)은 white/gray-100 배경에서 WCAG AA 미달(~3.5:1). 본문 텍스트에는 최소 `text-gray-500`(#606a7a, ~5.2:1) 사용. 아이콘은 3:1 기준(대형 텍스트/비텍스트 규칙) 적용 가능하므로 `text-gray-400` 허용.
- **인터랙티브 div 금지**: `div onClick` 대신 `<button type="button">` 사용. 불가피하면 `role="button" tabIndex={0} onKeyDown` 필수.
- **아이콘 전용 버튼**: 반드시 `aria-label` 추가 (예: `aria-label="더보기 메뉴"`).
- **Form label 연결**: `Input`, `NativeCombobox` 등 공통 컴포넌트에서 `useId()`로 id 생성 후 `<label htmlFor={id}>` — `<input id={id}>` 명시적 연결.
- **포커스 표시**: 커스텀 인터랙티브 요소에 `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500` 적용.

## Architectural Decisions

- **Input/NativeCombobox label 연결**: 외부에서 `id` prop을 전달하면 그대로 사용, 없으면 `useId()`로 자동 생성하는 패턴 채택. 기존 사용처 변경 없이 하위 호환 유지.
- **CategoryList div→button 전환**: `<div onClick>` 을 `<button type="button">`으로 변경. 기본 button 스타일 리셋은 Tailwind preflight가 처리하므로 추가 CSS 불필요.
