---
applyTo: "src/components/scenes/**/*.tsx, src/components/states/**/*.json, src/animation/**/*.ts, src/hooks/useAnimationPlayer.ts, src/content/stories/**/*.yaml"
---

# Animation Agent Instructions (Story Object Animation)

Use these rules when the user asks to animate a story object, improve object motion, or adjust animation timing.

## Goal

Animate story objects reliably with minimal setup by keeping scene refs, state keys, and story linkage in sync.

## Source of Truth

For any story, resolve this chain first:

1. Story YAML: `settings.scene` and `settings.state`
2. Scene component: `src/components/scenes/<SceneName>.tsx`
3. State JSON: `src/components/states/<StateName>.json`

Never animate blind. Open all three before making changes.

## Object Animation Contract

Treat these as mandatory:

1. Every top-level state key (except `fps`) must exist in scene `bindings`.
2. Every `bindings` value must be a declared `useRef`.
3. Every ref in `bindings` must be attached in JSX with `ref={...}`.
4. The referenced node must support animated properties used in state.

If any contract item fails, that object track will not animate.

## Preferred Track Shape

State file pattern:

```json
{
  "fps": 30,
  "model": [
    {
      "frame": 0,
      "position": [0, 0, 0],
      "rotation": [0, 0, 0],
      "scale": [1, 1, 1]
    },
    {
      "frame": 90,
      "position": [0.5, 0.2, 0],
      "rotation": [0, 0.4, 0],
      "scale": [1, 1, 1]
    }
  ]
}
```

Guidelines:

- Keep `fps` explicit (recommended `30`).
- Use ascending `frame` values.
- Use radians for `rotation`.
- Keep frame `0` near JSX defaults to avoid visual jumps.

## Convenient Object Animation Workflow

When user asks "animate object":

1. Identify the object ref key in scene (`model`, `armor`, `character`, etc.).
2. If missing, create the ref, attach it in JSX, and add it to `bindings`.
3. Create or update matching key in state JSON with at least 2 keyframes.
4. Ensure story YAML points to that exact scene/state pair.
5. Keep changes minimal and scoped to the selected story.

If object name is ambiguous, ask a single question before editing.

## Timing and Duration Rules

- Use story `duration` as the master timing setting.
- State frame span and `fps` should produce a motion that fits the story duration.
- If duration changes significantly, re-space keyframes instead of adding random in-between frames.

## Validation Checklist

Before finishing, verify all items:

1. State keys (excluding `fps`) exactly match scene `bindings` keys.
2. Every binding ref is declared and attached in JSX.
3. Animated properties exist on target object.
4. Story YAML `settings.scene` and `settings.state` point to edited files.
5. Motion is visible from the active camera path (object is not off-screen).

## Common Fixes

- No movement: fix key mismatch between state and `bindings`.
- Partial movement: attach missing JSX ref.
- Teleporting/jump at start: align frame `0` with JSX transform.
- Object disappears: reduce scale/translation and verify camera framing.

## Editing Boundaries

- Do not refactor unrelated scenes/stories.
- Do not rename keys unless all references are updated in scene + state.
- Prefer small, testable keyframe updates over large rewrites.
