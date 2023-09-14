import CharacterCreator from "./classes/character-creator.js";
import Character from "./classes/character.js";
import ColorWheel from "./classes/color-wheel.js";

import spriteModule from "./modules/sprite-loader-module.js";
import Sprite from "./classes/sprite.js";
import SpriteLoader from "./classes/sprite-loader.js";

(function () {
  const CANVAS_PERCENT_OF_SCREEN = 0.8;
  const TARGET_RATIO = 1.46531764706;

  var canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  canvas.style.margin = "auto";
  canvas.style.display = "block";

  let ctx = canvas.getContext("2d");

  let isResizing = false;

  spriteModule.setSpriteLoader(canvas, new SpriteLoader(canvas));

  const spriteLoader = spriteModule.getSpriteLoader(canvas);

  let backgroundImage = new Sprite({
    canvas: canvas,
    parent: canvas,
    imageSrc: "assets/Register/sprites/BABW_Register_Background.png",
    sizeScale: { x: 1, y: 1 },
  });

  const colorWheel = new ColorWheel(canvas);
  const characterCreator = new CharacterCreator(canvas);
  const character = new Character(canvas, characterCreator.characterContainer);

  let loginHUD = new Sprite({
    canvas: canvas,
    parent: canvas,
    imageSrc: "assets/Register/sprites/loginHUD.png",
    sizeScale: { x: 1, y: 1 },
  });

  function resizeCanvas4by3() {
    let currentWidth = window.innerWidth;
    let currentHeight = window.innerHeight;

    let newHeight = currentHeight;
    let newWidth = currentWidth;

    let currentRatio = currentWidth / currentHeight;

    if (currentRatio > TARGET_RATIO) {
      newWidth = currentHeight * TARGET_RATIO;
    } else {
      newHeight = currentWidth / TARGET_RATIO;
    }

    canvas.height = newHeight * CANVAS_PERCENT_OF_SCREEN;
    canvas.width = newWidth * CANVAS_PERCENT_OF_SCREEN;
  }

  let lastFrameTime = 0;

  function refreshCanvas(timestamp) {
    if (!isResizing) {
      lastFrameTime = timestamp;

      ctx.fillStyle = "red";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      spriteLoader.redrawSprites();
      window.requestAnimationFrame(refreshCanvas);
    }
  }

  function onImagesPreloaded() {
    resizeCanvas4by3();
    window.requestAnimationFrame(refreshCanvas);

    window.addEventListener("resize", function () {
      isResizing = true;
      resizeCanvas4by3();
      isResizing = false;
    });
  }

  // let imgOfScreen = new Sprite({
  //   canvas: canvas,
  //   parent: canvas,
  //   sizeScale: { x: 1, y: 1 },
  //   zIndex: 0,
  // });

  // document.addEventListener("keydown", function (event) {
  //   if (event.key === "s") {
  //     console.log("The 'S' key was pressed!");
  //     const tempImage = new Image();
  //     tempImage.src = canvas.toDataURL();
  //     imgOfScreen.zIndex = 999999;
  //     imgOfScreen.setImage("assets/Register/chloe/talk1/frames/4.png");
  //   }
  // });

  spriteLoader.preloadCB = onImagesPreloaded;
})();
