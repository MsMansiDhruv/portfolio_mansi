# Release v1 — Interactive Universe Portfolio

**Tag:** `v1`  
**Date:** 2026-08-12  
**Concept:** *Enter Mansi's World* — person-first interactive universe with silhouette protagonist and 3D globe navigation.

Use this release as the revert point before diverging to a new creative direction.

## Revert to v1

```bash
# Inspect the tagged snapshot (detached HEAD)
git checkout v1

# Or restore main branch to this release (destructive — review first)
git checkout main
git reset --hard v1

# Or create a branch from v1 to continue the universe concept
git checkout -b universe-v1 v1
```

## What v1 includes

### Homepage (`/`)

- **Interactive 3D personal globe** — raw Three.js (not React Three Fiber)
- **Silhouette character** at center — no photo hero, no generic avatar
- **Globe-as-navigation** — 13 life domains (Person, Work, AI Lab, Brain, Journey, People, Play, Stories, Travel, Strategy, Badminton, Notes, Next)
- **Dark / Day themes** with full environment transform
- **Secondary flat nav** + **Quick view** recruiter mode
- **Cinematic node entry** — camera zoom into node, then route navigation
- **Exploration tracking** — localStorage; connected-universe finale after ~55% nodes explored
- **Mobile / reduced-motion fallback** — touch-friendly constellation grid

### Key paths

| Route | Role in v1 |
|-------|------------|
| `/` | Universe homepage (`UniverseHome`) |
| `/projects` | Story chapter shell + project gallery |
| `/credentials` | About, journey, recommendations archive |
| `/tools/ai-lab` | AI Lab (6 modes, knowledge-grounded) |
| `/contact` | Contact |
| `/blog` | Field notes |

### Core files

```
app/(homepage)/page.js              → UniverseHome
components/universe/                → Globe engine, HUD, nav, quick view
components/universe/engine/         → createUniverse.js, sphereMath.js
components/anime-cinema/            → SilhouetteCharacter, scroll story (legacy, unwired from home)
components/world/StoryChapterShell  → Inner page atmosphere
lib/data/universe-nodes.js          → Globe nodes, opening copy, flat nav
lib/universe/exploration.js         → Visit tracking
styles/universe.css                 → Universe design system
styles/mansi-world.css              → Story chapter styling
```

### Visual identity (v1)

- **Palette:** deep ink, warm ivory, vermilion accent (`#c45c5c`)
- **Motif:** vermilion thread (curiosity → connection → growth)
- **Typography:** editorial display + mono metadata
- **Character:** cinematic SVG silhouette, recurring across worlds

### Tech stack

- Next.js 16, React 19
- Three.js (homepage globe)
- Framer Motion, GSAP (inner experiences)
- DSv2ThemeProvider (dark/light)

### Confidentiality

Public portfolio — no client-identifying details in project copy. See `.cursor/rules/portfolio-confidentiality.mdc`.

## What v1 does NOT include (planned but not built)

- Full cinematic scroll journey (Play, Anime, Travel worlds as immersive scenes)
- 3D project gallery installations with animated data flows
- Spatial career timeline with silhouette travel
- AI Lab as visual laboratory environment
- Loading ritual (“Building world…”)
- Custom 404 (“We took the wrong path”)
- Lenis smooth scroll sitewide

## Build & run

```bash
npm install
npm run build
npm run dev
```

---

*Checkpoint created before pivot to a new portfolio concept.*
