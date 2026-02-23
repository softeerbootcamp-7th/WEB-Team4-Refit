# Design System (`src/ui/`)

Reusable UI components are in `src/ui/components/` and exported from `src/ui/components/index.ts`:

- `Button`, `Input`, `Modal`, `Badge`, `Border`, `Checkbox`
- `NativeCombobox`, `SearchableCombobox`, `PlainCombobox`
- `Navbar`, `MobileNavbar`
- `SidebarLayout`, `MinimizedSidebarLayout`, sidebar container components
- `TabBar`, `Table` family, `FadeScrollArea`

SVG assets are in `src/ui/assets/` and imported as React components via `vite-plugin-svgr`.
