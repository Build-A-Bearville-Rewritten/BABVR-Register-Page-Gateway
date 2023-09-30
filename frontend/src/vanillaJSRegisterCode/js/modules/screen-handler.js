import spriteRendererModule from './sprite-renderer-module.js';

const ScreenHandler = (() => {
  let _currentScreens = [];

  // Sets canvas's screen to be newScreen, clearing out the old screen
  // canvas: canvas to be drawn on
  // screenToDraw: the screen to draw
  // screenArgs: any args the screen constructor should have (except canvas)
  async function setScreen(canvas, screenToDraw, screenArgs) {
    const spriteRenderer = spriteRendererModule.getSpriteRenderer();
    const previousScreen = _currentScreens[canvas];

    screenArgs = screenArgs || [];

    if (previousScreen) spriteRenderer.removeAllSprites();

    // const ctx = canvas.getContext('2d');
    // ctx.clearRect(0, 0, canvas.width, canvas.height);

    const newScreen = new screenToDraw(canvas, ...screenArgs);
    _currentScreens[canvas] = newScreen;

    spriteRenderer.updateAnimations();
  }

  async function drawScreen() {
    const spriteRenderer = spriteRendererModule.getSpriteRenderer();

    if (spriteRenderer.numSprites > 0) {
      spriteRenderer.drawSprites();
    }
  }
  // -----------------------------
  // Private functions:
  // -----------------------------

  return {
    setScreen,
    drawScreen
  };
})();

export default ScreenHandler;
