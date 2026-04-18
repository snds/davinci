# Davinci — Web App UI Kit

A click-through recreation of the three core pages: **Feed**, **Profile**, and **Company**.

## Files
- `index.html` — entry; composes all components with a route switcher
- `davinci.css` — kit-specific styles; depends on `/colors_and_type.css` tokens
- `Shared.jsx` — `TopNav`, `Logo`, `Avatar`, `Icon`, `Button`, `Pill`, `Panel`
- `Rails.jsx` — `LeftRail` (profile summary + nav), `RightRail` (news + people to follow)
- `Feed.jsx` — `Composer`, `Post`, `Feed`
- `ProfilePage.jsx` — cover + header + about + experience + education
- `CompanyPage.jsx` — cover + tabs + overview + recent post + jobs

## Visual rules
- **Dark default** (toggle via `data-theme="light"` on `<html>`).
- Sand neutrals, blue primary, yellow for accents and highlights.
- 6px default radius; pill radius on avatars and follow/message buttons.
- Material Symbols Rounded icons.
- Subtle dashed separators inside cards, solid 1px borders between cards.

## Not included (intentionally)
Messaging, notifications, and the full search overlay — they're stubs. Focus of the kit is component coverage for the three pages, not every screen.
