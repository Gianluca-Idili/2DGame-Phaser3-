import { Game, Scale } from "phaser";
import { Level } from "./src/Level.js";


new Game({
  width: 640,
  height: 360,
  scene: Level,
  physics:{
    default: 'arcade',
    arcade:{
      debug: false
  }
  },
  scale: {
    autoCenter: Scale.CENTER_BOTH,
    mode: Scale.FIT,
  },
  pixelArt: true,
})
