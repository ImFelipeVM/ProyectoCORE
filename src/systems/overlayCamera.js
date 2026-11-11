import { RENDER_DEPTH } from './renderDepth.js';

/**
 * Keeps screen-space interface objects out of the world camera entirely.
 * The world camera keeps following the scene; this transparent camera renders
 * only the interface layer on top of it.
 */
export function createOverlayCamera(scene, width, height) {
  const worldCamera = scene.cameras.main;
  const layer = scene.add.layer().setDepth(RENDER_DEPTH.UI_LAYER);
  const screenCamera = scene.cameras.add(0, 0, width, height);

  screenCamera.setScroll(0, 0).setZoom(1).setRoundPixels(true);
  screenCamera.setBackgroundColor('rgba(0, 0, 0, 0)');

  // Layer.willRender checks its own filter, so this remains effective for
  // children added after the layer is created.
  layer.cameraFilter |= worldCamera.id;

  // The screen camera draws only the interface layer. Future UI is reparented
  // into that layer by add(), while all existing scene objects stay world-only.
  screenCamera.ignore(scene.children.list.filter(object => object !== layer));

  return {
    layer,
    camera: screenCamera,
    add(object, depth = 0) {
      object.setScrollFactor(0).setDepth(depth);
      layer.add(object);
      return object;
    }
  };
}
