# Accessibility and performance release checklist

## Automated gates

- Production build and TypeScript must pass.
- Run `npm run verify`; no credential patterns may be committed.
- Test public landing, authentication and one route for every persona at 360 px, 768 px and desktop widths.

## Keyboard and assistive technology

- Skip link reaches the main product surface.
- Every interactive control is reachable in a logical order with a visible focus ring.
- Dialogs require focus trapping and Escape-to-close before production rollout.
- Icon-only buttons require accessible names; decorative icons remain ignored by reading order.
- Validate English and Hinglish with NVDA/Chrome and TalkBack/Android.

## Visual and cognitive access

- Body text and controls meet WCAG AA contrast; status never relies on color alone.
- Layout survives 200% zoom and text enlargement without horizontal page scrolling.
- Respect reduced-motion and increased-contrast preferences.
- Assessment accommodation mode supports extra time, simplified language and keyboard-only completion.

## Media and low bandwidth

- YouTube resources require captions and a text fallback.
- Drive resources require accessible source documents or HTML/text alternatives.
- Do not autoplay external media. Load embeds only after user intent where feasible.
- Keep the learner dashboard and next action usable before optional 3D/media bundles load.

## Performance budgets

- Target LCP under 2.5 s, INP under 200 ms and CLS under 0.1 at the 75th percentile.
- Cap first-load JavaScript per operational route; keep Three.js isolated to the public story.
- Test an entry-level Android profile under a throttled 4G connection.
