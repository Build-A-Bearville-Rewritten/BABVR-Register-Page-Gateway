// Handles redrawing the canvas whenever the screen is resized, or loaded for the first time. 

import screenHandlerModule from '../../modules/screen-handler-module.js';

export default class CanvasRenderer {
  
  static get CANVAS_PERCENT_OF_SCREEN() {
    return 0.8;
  }

  // the ratio of the buildabear registration screen
  static get TARGET_RATIO() {
    return 1.46531764706;
  }

  constructor(canvas) {
    this.canvas = canvas;
  }

  // Init canvas rendering and create resize event for resizing the canvas
  // when the screen size changes
  startRender() {
    const screenHandler = screenHandlerModule.getInstance(this.canvas)
    this.resizeCanvas4by3();
    
    // binds the resizeCanvas4by3 method to the page's resize event.
    window.addEventListener(
      'resize',
      function () {
        this.resizeCanvas4by3();
        window.requestAnimationFrame(screenHandler.drawScreen);
      }.bind(this)
    );
  }

  // Make canvas have orignal 4:3 screen ratio 
  resizeCanvas4by3() {
    const ctx = this.canvas.getContext('2d');

    const currentWidth = window.innerWidth;
    const currentHeight = window.innerHeight;

    let newHeight = currentHeight;
    let newWidth = currentWidth;

    const currentRatio = currentWidth / currentHeight;

    if (currentRatio > CanvasRenderer.TARGET_RATIO)
      newWidth = currentHeight * CanvasRenderer.TARGET_RATIO;
    else newHeight = currentWidth / CanvasRenderer.TARGET_RATIO;

    this.canvas.height = newHeight * CanvasRenderer.CANVAS_PERCENT_OF_SCREEN;
    this.canvas.width = newWidth * CanvasRenderer.CANVAS_PERCENT_OF_SCREEN;
  }
}
