---
applyTo: 'src/components/scenes/**/*.tsx, src/components/states/**/*.json, src/content/stories/**/*.yaml'
---

# Component Builder Instructions (Scenes + Animation State)

Use these instructions when building, checking, or modifying scene components and their animation state.

## Goal

Keep scene animation predictable by enforcing one rule at all times:

- Keys in the state JSON file must match keys in the scene `bindings` object exactly.
- Every binding entry must point to an existing React ref that is attached in JSX.

This project uses `useAnimationPlayer`, which applies state tracks by key name:

- `state track key` -> `bindings[key]` -> `bindings[key].current`

If any key or ref is wrong, that track silently does nothing.

## Files to Touch Together

When changing a scene, review and update these files as a set:

1. Scene component: `src/components/scenes/<scene-name>.tsx`
2. State file: `src/components/states/<state-name>.json`
3. Story config referencing scene/state: `src/content/stories/<story>.yaml`

Do not update only one file when key names or animated targets change.

## Build or Modify a Scene

1. Determine the active scene/state pair:

- Read `settings.scene` and `settings.state` in the relevant story YAML.
- Open that scene TSX and that state JSON before editing.

2. In the scene TSX, create one ref per animated target:

- Example refs: `cameraRef`, `lightRef`, `modelRef`, `armorRef`, `characterRef`.
- Use the correct Three.js type where possible.

3. Build `bindings` with exact state key names:

- If JSON has `camera`, `light`, `model`, then scene must have:
  - `camera: cameraRef`
  - `light: lightRef`
  - `model: modelRef`
- Use stable `useMemo(() => ({ ... }), [])` unless there is a reason not to.

4. Attach refs in JSX:

- `ref={cameraRef}` on `<PerspectiveCamera ... />`
- `ref={lightRef}` on `<pointLight ... />`
- `ref={modelRef}` (or equivalent) on the `<group>` / `<mesh>` being animated.

5. Keep a sensible initial transform in JSX:

- Initial `position`/`rotation`/`scale` in JSX should align with frame `0` in state when possible.

6. Call animation hook once:

- Use:
  - `animationData: animationState`
  - `durationSeconds: duration`
  - `bindings`

## State JSON Rules

Use this format in `src/components/states/*.json`:

- Top-level `fps` is optional but recommended (default is 30).
- Each animated target is a top-level key with a keyframe array.
- Keyframe object must include numeric `frame`.
- Supported animated properties include:
  - Vector: `position`, `rotation`, `scale` as `[x, y, z]`
  - Numeric: e.g. `intensity`, `fov`, or any numeric property that exists on the target.

Example:

```json
{
  "fps": 30,
  "camera": [{ "frame": 0, "position": [0, 2, 8], "rotation": [0, 0, 0] }],
  "light": [{ "frame": 0, "intensity": 0.8 }],
  "model": [
    {
      "frame": 0,
      "position": [0, 0, 0],
      "rotation": [0, 0, 0],
      "scale": [1, 1, 1]
    }
  ]
}
```

## Mandatory Validation Checklist

Before finishing any scene/state change, perform all checks below.

1. Key parity check:

- List top-level state keys excluding `fps`.
- List `bindings` keys in the scene.
- They must be identical (same names, no extras, no missing keys).

2. Ref existence check:

- For every `bindings.<key> = someRef`, confirm `someRef` is declared with `useRef`.
- Confirm `someRef` is attached in JSX via `ref={someRef}`.
- Confirm target element exists in render output.

3. Target capability check:

- If state animates `position`/`rotation`/`scale`, target must be an Object3D-like node (`group`, `mesh`, camera, etc.).
- If state animates numeric fields (like `intensity`), the target must actually have that property.

4. Story linkage check:

- Story YAML `settings.scene` points to edited scene file.
- Story YAML `settings.state` points to the intended state JSON file.

5. Runtime check:

- Run app/tests used by the repo.
- Scroll through the story and verify every animated target responds.

## Quick Audit Commands

Use this compact terminal flow to verify key parity and ref wiring quickly.

1. Set target files:

```bash
SCENE=src/components/scenes/skritek-wooden-statue.tsx
STATE=src/components/states/skritek-wooden-statue.json
STORY=src/content/stories/skritek-wooden-statue.yaml
```

2. Print state keys (excluding `fps`):

```bash
node -e "const fs=require('fs');const p=process.argv[1];const j=JSON.parse(fs.readFileSync(p,'utf8'));console.log(Object.keys(j).filter(k=>k!=='fps').sort().join('\n'));" "$STATE"
```

3. Print scene binding keys:

```bash
rg -No "bindings\s*=\s*useMemo\(\s*\(\)\s*=>\s*\(\{([\s\S]*?)\}\)" "$SCENE" | rg -No "^\s*([a-zA-Z0-9_]+)\s*:" -r '$1' | sort -u
```

4. Verify every binding key has a declared ref variable in scene:

```bash
for key in $(rg -No "bindings\s*=\s*useMemo\(\s*\(\)\s*=>\s*\(\{([\s\S]*?)\}\)" "$SCENE" | rg -No "^\s*([a-zA-Z0-9_]+)\s*:\s*([a-zA-Z0-9_]+)" -r '$2'); do
  rg -n "const\s+$key\s*=\s*useRef\(" "$SCENE" >/dev/null || echo "Missing useRef declaration: $key"
done
```

5. Verify every ref variable is attached in JSX:

```bash
for refVar in $(rg -No "bindings\s*=\s*useMemo\(\s*\(\)\s*=>\s*\(\{([\s\S]*?)\}\)" "$SCENE" | rg -No "^\s*[a-zA-Z0-9_]+\s*:\s*([a-zA-Z0-9_]+)" -r '$1'); do
  rg -n "ref=\{$refVar\}" "$SCENE" >/dev/null || echo "Missing JSX ref attachment: $refVar"
done
```

6. Verify story points to intended scene and state:

```bash
rg -n "scene:\s*skritek-wooden-statue\.tsx|state:\s*skritek-wooden-statue\.json" "$STORY"
```

7. Compare sorted state keys vs sorted binding keys:

```bash
STATE_KEYS=$(node -e "const fs=require('fs');const p=process.argv[1];const j=JSON.parse(fs.readFileSync(p,'utf8'));console.log(Object.keys(j).filter(k=>k!=='fps').sort().join(' '));" "$STATE")
BINDING_KEYS=$(rg -No "bindings\s*=\s*useMemo\(\s*\(\)\s*=>\s*\(\{([\s\S]*?)\}\)" "$SCENE" | rg -No "^\s*([a-zA-Z0-9_]+)\s*:" -r '$1' | sort -u | tr '\n' ' ')
echo "STATE_KEYS=$STATE_KEYS"
echo "BINDING_KEYS=$BINDING_KEYS"
[[ "$STATE_KEYS" == "$BINDING_KEYS" ]] && echo "OK: keys match" || echo "ERROR: key mismatch"
```

Notes:

- If the scene uses a different bindings construction pattern, inspect manually and adjust the `rg` pattern.
- Keep these checks focused on the active scene/state pair being edited.

## Safe Editing Practices

- Keep naming consistent across scene/state/story (`kebab-case` file names, clear target keys).
- Prefer minimal, focused edits; avoid unrelated refactors.
- If renaming a target key (example: `model` -> `statue`), update:
  1. State JSON key
  2. Scene `bindings` key
  3. Associated ref naming (recommended)
  4. Any docs/examples that mention the key

## Common Failure Modes

- State key typo (`ligth`) while scene uses `light`.
- Binding exists but ref was never attached in JSX.
- Ref attached to a different object than intended.
- Track animates a property that target does not have.
- Story points to a different state file than the one edited.

When any of these happen, animation appears partially or fully frozen without obvious errors.
