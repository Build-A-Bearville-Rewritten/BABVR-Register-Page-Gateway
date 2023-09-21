import CharacterCreator from "./classes/character-creator.js";
import ChloeTalk from "./classes/chloeTalk.js";
import Character from "./classes/character.js";
import ColorWheel from "./classes/color-wheel.js";
import NamingScreen from "./classes/naming.js";

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
  const screens = ["talk", "charactercreator", "naming", "tos"];
  let currentScreen = 0; 

  let isResizing = false;

  spriteModule.setSpriteLoader(canvas, new SpriteLoader(canvas));

  const spriteLoader = spriteModule.getSpriteLoader(canvas);

  let backgroundImage = new Sprite({
    canvas: canvas,
    parent: canvas,
    imageSrc: "assets/Register/sprites/BABW_Register_Background.png",
    sizeScale: { x: 1, y: 1 },
  });

  let nextButton = new Sprite({ //Change screen button
    canvas: canvas,
    imageSrc: "./assets/Register/sprites/emptyButton.png", 
    sizeScale: 0.05,
    parent: canvas, 
    anchorPoint: { x: 0.5, y: -1 }, 
    positionScale: { x: 0.83, y: 0.85 }, 
  });
  
  let backButton = new Sprite({ //Change screen button
    canvas: canvas,
    imageSrc: "./assets/Register/sprites/emptyButton.png", 
    sizeScale: 0.05,
    parent: canvas, 
    anchorPoint: { x: 5.5, y: -1 }, 
    positionScale: { x: 0.83, y: 0.85 }, 
  });

  const chloeTalk = new ChloeTalk(canvas); //chloe's talk, which is the default screen/ cant be accessed with buttons

  function characterCreator(){
    const colorWheel = new ColorWheel(canvas);
    const characterCreator = new CharacterCreator(canvas);
    const character = new Character(canvas, characterCreator.characterContainer);
  }

  function namingScreen(){
    const namingScreen = new NamingScreen(canvas);
  }
  
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

    nextButton.onClick(() => { 
      screenChange("f");
    });

    //Parameters: 
    // f (Forward)
    // b (Backward)
    function screenChange(dir){
      if (dir = "f"){
          if (currentScreen != 3){
            currentScreen++;
            screenLoader(screens[currentScreen])
          }
        }
      }
      //Just loads the screens. screenChange handles the switching/clearing
      function screenLoader(screen){
        if (screen.localeCompare(screens[1]) == 0) {
          characterCreator()
          console.log("Character Creator");
        }
        if (screen.localeCompare(screens[2]) == 0) {
          namingScreen();
          console.log("Naming Screen");
          //call character to move over!
        }
        if (screen.localeCompare(screens[3]) == 0) {
          //tosScreen();
          console.log("TOS Screen");
        }
      }




  //Dummyed out for now
  //let chloeAnimation = new Sprite({
  //  canvas: canvas,
 //   parent: canvas,
 //   sizeScale: { x: 1, y: 1 },
  //  numFrames: 337,
  //  frameBuffer: 3,
 //   animationFolder: "assets/Register/chloe/talk1/frames/",
 //   zIndex: 999999,
 // });



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
