# Learning notes — React & this project

## Table of contents

- [TypeScript workflow and null safety](#typescript-workflow-and-null-safety)
- [Naming & folder conventions](#naming--folder-conventions)
- [Tailwind CSS in this Vite project](#tailwind-css-in-this-vite-project)
- [Shared chrome: layout routes and `<Outlet />`](#shared-chrome-layout-routes-and-outlet-)
- [React Router building blocks](#react-router-building-blocks)
- [Dynamic routes and `useParams`](#dynamic-routes-and-useparams)
- [Navigation components: `Link` vs `NavLink`](#navigation-components-link-vs-navlink)
- [Flutter → React mental model](#flutter--react-mental-model)
- [App shell scrolling: `h-screen` vs regions](#app-shell-scrolling-h-screen-vs-regions)

---

## TypeScript workflow and null safety

- **`.tsx` vs `.ts`**: React files containing JSX use `.tsx`; data, routes, scripts, and tests without JSX use `.ts`. MDX content stays `.mdx`, typed through `@types/mdx`.
- **Props interfaces** replace `prop-types`. Required fields work like Dart constructor parameters marked `required`; `showSideBar?: boolean` is optional and can receive a default during destructuring. TypeScript checks callers at compile time; it does not validate incoming API data at runtime.
- **Recursive interfaces**: `SidebarItem.children?: SidebarItem[]` describes nested navigation, like a Dart class holding an optional `List<SidebarItem>`.
- **Null safety**: `strict` checks nullable route parameters and DOM lookups. `noUncheckedIndexedAccess` makes array/map access potentially `undefined`; check the value before using it instead of forcing a non-null assertion (`!` in both TypeScript and Dart).
- **Typed refs**: `useRef<HTMLDivElement>(null)` restricts the element reference while allowing `null` before mounting, much like accessing a Flutter key's state only after its widget exists.
- **Type-only imports**: `import type` imports a compile-time contract without adding a runtime dependency. Types are erased; JSON Schema/AJV still handle runtime validation.
- **Build checks**: Vite transpiles without checking types. `npm run typecheck` runs `tsc -b`, and `npm run build` runs that check before bundling. Browser types belong to `tsconfig.app.json`; Node tooling/tests belong to `tsconfig.node.json`. Shared strict settings live in `tsconfig.base.json`.
- **Tooling**: `tsx` executes TypeScript generators without emitting JavaScript files; it does not type-check them. ESLint uses `typescript-eslint` and loads `eslint.config.ts` through `jiti`.

---

## Naming & folder conventions

- **Route-level components** in web React are usually called **`*Page`** (e.g. `HomePage`, `AboutPage`). **`*Screen`** is common in **React Native**, not wrong on web, but **`*Page`** is the more typical web convention.
- **File names** usually **match the component** and use **PascalCase**: `HomePage.tsx` exporting `HomePage`. Some teams use `home-page.tsx` with a default export; both exist, but **PascalCase file = PascalCase component** is widely recognized.
- **Folders**: common patterns are `src/pages/`, `src/components/`, `src/layouts/`. You can group a page with its hooks as `pages/HomePage/index.tsx`; for small apps, **flat** `pages/HomePage.tsx` is fine.
- **Data / config**: `src/data/protocols.ts` holds static lists or API helpers—keeps routes thin.

---

## Tailwind CSS in this Vite project

- **Stack**: **Tailwind v4** with the official **`@tailwindcss/vite`** plugin (see `vite.config.ts`). This is a common setup for **Vite** projects: one plugin, no separate PostCSS config file unless you need it.
- **Entry CSS**: `src/index.css` uses **`@import "tailwindcss"`** — that pulls in **Preflight** (opinionated reset), the design tokens, and **utility classes**.
- **Usage in React**: Put **utility classes** on **`className`**. Prefer **composition** on the element over global CSS for layout components. For **`NavLink`**, the prop **`className`** can be a **function** `({ isActive }) => string` — that pairs well with Tailwind for active styles.
- **Optional extras** (not installed here): **`clsx`** / **`tailwind-merge`** help merge conditional class strings; many teams add them when class logic gets noisy.

---

## Shared chrome: layout routes and `<Outlet />`

- In Flutter you might use a **base page** / shell widget. In React Router v6, the usual pattern is a **layout route**: a component that renders **shared UI** (navbar, sidebar) and a **child slot** via **`<Outlet />`**.
- **Do not** import the sidebar into every page. Define **one** layout component (`MainLayout`) and nest routes under it so each page only supplies the **main** content.
- **Benefit**: one place to change shell behavior; pages stay focused on their content.

---

## React Router building blocks

- **`BrowserRouter`** (in `main.tsx`): wraps the app so routing uses the **browser history** (URLs like `/about`, not only hash URLs).
- **`Routes` / `Route`**: declarative map from **URL paths** to **elements** (components).
- **Index route**: `<Route index element={<HomePage />} />` means “**default child**” of the parent path—here, **`/`** when the parent layout has no extra path segment.
- **Layout route**: a `<Route>` with **`element={<MainLayout />}`** and **nested** `<Route>` children. The parent renders; the matching child renders **inside** `<Outlet />`.
- **Catch-all / 404**: `<Route path="*" element={...} />` matches anything unmatched; here it **redirects** home with `<Navigate replace />`.

---

## Dynamic routes and `useParams`

- A path like **`/protocol/:protocolId`** declares a **dynamic segment**. The name after `:` is the **param key**.
- In the page component, **`useParams()`** returns an object, e.g. `{ protocolId: 'ifs-food' }`, so you can load or look up data for that id.

---

## Navigation components: `Link` vs `NavLink`

- **`Link`**: navigates without full page reload; use for inline links (e.g. “Back home”).
- **`NavLink`**: same as `Link`, but can style the **active** route (e.g. via `className` or `style` callback with `isActive`). Good for **menus** and **sidebars**.

---

## Flutter → React mental model

| Flutter idea       | React Router idea                                                       |
| ------------------ | ----------------------------------------------------------------------- |
| Base page / shell  | Layout route + `<Outlet />`                                             |
| Named route + args | Path params (`:id`) + `useParams`, or query (`?q=`) + `useSearchParams` |
| Navigator.push     | `<Link>` / `useNavigate()`                                              |

---

## App shell scrolling: `h-screen` vs regions

- **Problem**: Using **`h-screen`** (`100vh`) **inside** a layout that already has a **navbar** makes that block as tall as the **full viewport**, not the space **below** the bar. The flex column then **overflows** → the **whole page** scrolls and the bar can leave the viewport. Same idea as Flutter: **`SizedBox(height: MediaQuery.sizeOf(context).height)`** inside a **`Column`** that already has a **`AppBar`** — you double-count height.
- **Fix**: Establish a **height chain**: `html, body, #root { height: 100% }`, shell **`h-full overflow-hidden`**, row **`flex-1 min-h-0`**, **`main`** and **sidebar** each **`min-h-0`** with their own **`overflow-y-auto`** so they scroll **independently** when only one side is long.
- **Flex gotcha**: Flex items default to **`min-height: auto`**, so they won’t shrink below content. **`min-h-0`** (or `min-h-0` on the scrollable child) lets **`overflow`** work — similar to capping a **`Flexible`** / **`Expanded`** child in Flutter.

---
