# DESIGN.md

## 1. Style & Tone

- **Vibe:** Warm, Minimal, Editorial.
- **Prohibited:** Pure #000, Pure #FFF.
- **Layout:** Simple 1–3 column grids. Max-width: 1200px.

## 2. Tokens

| Token            | Value       |
| :--------------- | :---------- |
| **Background**   | `#f2f1ed`   |
| **Surface (P)**  | `#ebeae5`   |
| **Surface (S)**  | `#e6e5e0`   |
| **Text (P)**     | `#26251e`   |
| **Text (Muted)** | `#26251e99` |
| **Text (S)**     | `#26251e8c` |
| **Primary**      | `#f54e00`   |
| **Link Hover**   | `#f54e00`   |
| **Hover/Err**    | `#cf2d56`   |
| **Success**      | `#1f8a65`   |
| **Border**       | `#26251e1a` |
| **Border Focus** | `#26251e33` |

## 3. Typography

- **Font Import:** `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700&display=swap');`
- **Font:** Poppins (Headings 600-700), Inter (Body 400-700).
- **Sizes:** H1: 40px, H2: 28px, H3: 22px, Body: 16px, Small: 14px.
- **Code:** monospace (for technical/code text).
- **Rules:** Line-height 1.4–1.6. No extreme letter-spacing.

## 4. Geometry

- **Grid:** 8px base (Use: 8, 12, 16, 24, 32).
- **Radius:** 4px (S), 8px (Default), 9999px (Pill).

## 5. Components

- **Primary Button:** `#ebeae5` bg | `#26251e` text | 8px radius | 10px 14px padding.
- **Pill Button:** `#e6e5e0` bg | `#26251e99` text | 9999px radius | 4px 10px padding.
- **Card:** `#e6e5e0` bg | 1px border | 8px radius | 16px padding.
- **Input:** Surface bg | 1px border | 8px padding | Focus: border `#26251e33`.

## 6. Interaction

- **Transition:** 150-200ms ease.
- **Hover:** Button text becomes `#cf2d56`. Links become `#f54e00`.

## 7. Agent Protocol

- Reuse existing components, slots and token values.
- Do not invent new styles; prefer consistency over creativity.
- Keep UI simple, readable, and snapped to the 8px grid.
- Strict adherence to tokens; no new styles.
- Snap all `.pen` coordinates/sizes to 4px/8px increments.
