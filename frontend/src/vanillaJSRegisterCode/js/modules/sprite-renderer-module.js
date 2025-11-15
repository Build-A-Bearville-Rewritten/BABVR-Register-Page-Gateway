import SpriteRenderer from '../classes/rendering/sprite-renderer.ts';

// keeps track of all sprite loader instances,
// and allows for getting and setting sprite renderers for each canvas
const SpriteRendererModule = (() => {
  let spriteRenderers = [];

  // Gets the sprite loader, returning a new one if it doesn't already exist.
  function getSpriteRenderer(canvas) {
    if (!spriteRenderers[canvas]) {
      const newLoader = new SpriteRenderer(canvas);
      spriteRenderers[canvas] = newLoader;
    }

    return spriteRenderers[canvas];
  }

  return {
    getSpriteRenderer
  };
})();

export default SpriteRendererModule;
