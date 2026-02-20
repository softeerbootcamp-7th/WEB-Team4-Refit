# Interview Calendar UI — 2026-02-20

## Summary

CalendarFooter 빈 상태 UI를 개선했다. 기존 텍스트만 있던 회색 박스 대신 `CalendarStarIcon` 아이콘 + 메인 메시지 + 서브텍스트 3단 구조로 변경. 인터뷰 카드 시간 텍스트를 `text-gray-300` → `text-gray-500`으로 변경해 WCAG AA(4.5:1) 기준을 충족했다.

## Patterns & Conventions

- **CalendarGrid 이벤트 표시**: 날짜 숫자 원의 배경색으로 표시 (`bg-orange-100 text-orange-500` / `bg-gray-100 text-gray-500`). 도트 인디케이터 방식은 팀 선호가 아님.
- **빈 상태 UI 패턴**: `bg-gray-100 rounded-[10px]` 컨테이너 + `flex-col items-center` 정렬 + 아이콘(`h-8 w-8 text-gray-300`) + `body-s-medium text-gray-400` 메시지 + `caption-m-medium text-gray-300` 서브텍스트.
- **`CalendarStarIcon`**: 캘린더 관련 빈 상태에 적합한 아이콘 (`src/designs/assets/`에 있음).
- **WCAG AA 기준**: 흰 배경(`bg-white`) 위 소문자 텍스트는 `text-gray-500`(#606a7a, ~5.5:1)이 통과 최솟값. `text-gray-300`(~2.5:1), `text-gray-400`(~3.6:1)은 미달.
