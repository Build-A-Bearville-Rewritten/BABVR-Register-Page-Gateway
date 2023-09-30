// TODO: Code for using temp image on screen resize
// Start of code is commented out below
//
// let imgOfScreen = new Sprite({
//   this.canvas: this.canvas,
//   parent: this.canvas,
//   sizeScale: { x: 1, y: 1 },
//   zIndex: 0,
// });

// document.addEventListener("keydown", function (event) {
//   if (event.key === "s") {
//     const tempImage = new Image();
//     tempImage.src = this.canvas.toDataURL();
//     imgOfScreen.zIndex = 999999;
//     imgOfScreen.setImage("assets/Register/chloe/talk1/frames/4.png");
//   }
// });

import screenHandler from '../../modules/screen-handler.js';

export default class CanvasRenderer {
  static get CANVAS_PERCENT_OF_SCREEN() {
    return 0.8;
  }
  static get TARGET_RATIO() {
    return 1.46531764706;
  }

  constructor(canvas) {
    this.canvas = canvas;
    this._isResizing = false;
  }

  startRender() {
    this.resizeCanvas4by3();

    window.addEventListener(
      'resize',
      function () {
        this._isResizing = true;
        this.resizeCanvas4by3();
        window.requestAnimationFrame(screenHandler.drawScreen);
        this._isResizing = false;
      }.bind(this)
    );
  }

  resizeCanvas4by3() {
    let ctx = this.canvas.getContext('2d');

    let currentWidth = window.innerWidth;
    let currentHeight = window.innerHeight;

    let newHeight = currentHeight;
    let newWidth = currentWidth;

    let currentRatio = currentWidth / currentHeight;

    if (currentRatio > CanvasRenderer.TARGET_RATIO)
      newWidth = currentHeight * CanvasRenderer.TARGET_RATIO;
    else newHeight = currentWidth / CanvasRenderer.TARGET_RATIO;

    this.canvas.height = newHeight * CanvasRenderer.CANVAS_PERCENT_OF_SCREEN;
    this.canvas.width = newWidth * CanvasRenderer.CANVAS_PERCENT_OF_SCREEN;
  }
}
