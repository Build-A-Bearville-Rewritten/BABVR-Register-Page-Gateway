import spriteRendererModule from './sprite-renderer-module.js';

const ScreenHandler = (() => {
  let _currentScreens = [];

  // Sets canvas's screen to be newScreen, clearing out the old screen
  function setScreen(canvas, newScreen) {
    const spriteRenderer = spriteRendererModule.getSpriteRenderer();
    spriteRenderer.removeAllSprites();
    

    addAllSpritesIn(newScreen);

    const prevScreen = _currentScreens[canvas];
    _currentScreens[canvas] = newScreen;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    destroyPreviousScreen(prevScreen);
  }

  // -----------------------------
  // Private functions:
  // -----------------------------

  async function addAllSpritesIn(object) {
    const spriteRenderer = spriteRendererModule.getSpriteRenderer();
    await spriteRenderer.addSpritesToScreen(object.sprites);

    // See if current object has any objects to search for sprites in
    // prettier-ignore
    for (const index in object.objects) {
      const childObject = object.objects[index];
      
      if(childObject.sprites)
        await spriteRenderer.addSpritesToScreen(childObject.sprites);
      
      // // TODO: needs testing
      // if (childObject.objects) 
      //   for (const grandChildObj in childObject.objects) 
      //     addAllSpritesIn(grandChildObj);
    }
  }

  // Destroys all the sprites in the previous screen
  function destroyPreviousScreen(prevScreen) {
    if (prevScreen) {
      prevScreen.sprites.forEach(sprite => {
        sprite.destroy();
      });
    }
  }

  return {
    setScreen
  };
})();

export default ScreenHandler;
