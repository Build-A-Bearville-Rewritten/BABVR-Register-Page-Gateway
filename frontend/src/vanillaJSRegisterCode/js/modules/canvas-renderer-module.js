import CanvasRenderer from '../classes/rendering/canvas-renderer.js';

// keeps track of all sprite loader instances,
// and allows for getting and setting sprite renderers for each canvas
const CanvasRendererModule = (() => {
  let canvasRenderers = [];

  // Gets the sprite loader, returning a new one if it doesn't already exist.
  function getCanvasRenderer(canvas) {
    if (!canvasRenderers[canvas]) {
      const newRenderer = new CanvasRenderer(canvas);
      canvasRenderers[canvas] = newRenderer;
    }

    return canvasRenderers[canvas];
  }

  return {
    getCanvasRenderer
  };
})();

export default CanvasRendererModule;
