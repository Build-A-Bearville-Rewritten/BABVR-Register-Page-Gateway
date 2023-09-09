// keeps track of all sprite loader instances,
// and allows for getting and setting spriteloaders for each canvas
const SpriteLoaderModule = (() => {
  let spriteLoaders = [];

  function setSpriteLoader(canvas, spriteLoader) {
    if (getSpriteLoader(canvas)) {
      throw new Error("Sprite loader already exists");
    }

    spriteLoaders[canvas] = spriteLoader;
  }

  function getSpriteLoader(canvas) {
    return spriteLoaders[canvas];
  }

  return {
    setSpriteLoader,
    getSpriteLoader,
  };
})();

export default SpriteLoaderModule;
