import Sprite from "./sprite.js";

// Creates the character creator creator frame
export default class chloeTalk {
  constructor(canvas) {
    this.canvas = canvas;
    this.createSprites();
  }
  createSprites() {
    (this.testSprite = new Sprite({
      canvas: this.canvas,
      imageSrc: "assets/Register/sprites/NamingScreen.png",
      parent: this.canvas,
      sizeScale: 0.6,
      anchorPoint: { x: 0.5, y: 0.5 },
      positionScale: { x: 0.42, y: 0.5 },
    }))
  }
  showScreen(){
    this.createSprites();
  }
  clearScreen(ctx){
    console.log("The 'S' key was pressed!");
   // ctx.clearRect(0.42, 0.5, this.canvas.width, this.canvas.height);
  }
}
