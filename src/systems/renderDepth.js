// World objects are sorted by their ground contact point. The overlay camera
// isolates screen-space UI; these bands order interface elements within it.
export const RENDER_DEPTH = Object.freeze({
  WORLD_BACKGROUND: -100,
  UI_LAYER: 20_000,
  HUD: 10000,
  HUD_HINT: 10100,
  MINIMAP: 10200,
  DIALOGUE_DIM: 11000,
  DIALOGUE: 11100,
  JOURNEY: 12000,
  MAP: 14000,
  NOTICE: 15000
});

export function groundDepth(y, offset = 0) {
  return Math.round(y + offset);
}
