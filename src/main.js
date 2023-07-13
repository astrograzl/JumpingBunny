import Phaser from "./lib/phaser.js"
import Game from "./scenes/Game.js"
import GameOver from "./scenes/GameOver.js"

export default new Phaser.Game({
    type: Phaser.AUTO,
    scene: [Game, GameOver],
    width: 640,
    height: 640,
    physics: {
        default: "arcade",
        arcade: {
            gravity: {
                y: 200
            },
            debug: true
        }
    }
})

console.log("Welcome 2 machine")
console.dir(Phaser)