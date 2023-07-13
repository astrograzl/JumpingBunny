import Phaser from "../lib/phaser.js"

export default class Game extends Phaser.Scene {
    
    /** @type {Phaser.Physics.Arcade.Sprite} */
    player

    contructor() {
        // super("game") // unique key
    }
    
    preload() /* -1 */ {
        this.load.image("background", "assets/bg_layer2.png")
        this.load.image("platform", "assets/ground_grass.png")
        this.load.image("bunny-stand", "assets/bunny2_stand.png")
    }
    
    create() /* 0 */ {
        this.add.image(0, 480, "background")
        const platforms = this.physics.add.staticGroup()
        for (let i = 0; i < 5; ++i) {
            const x = Phaser.Math.Between(48, 480)
            const y = 128 * i
            const platform = platforms.create(x, y, "platform")
            platform.scale = 0.5
            const body = platform.body
            body.updateFromGameObject()
        }
        this.player = this.physics.add.sprite(320, 320, "bunny-stand").setScale(0.5)
        this.player.body.checkCollision.up = false
        this.player.body.checkCollision.left = false
        this.player.body.checkCollision.right = false
        this.physics.add.collider(platforms, this.player)
        this.cameras.main.startFollow(this.player)
        // this.physics.add.image(320, 320, "platform").setScale(0.5)
    }

    update() /* @ */ {
        if (this.player.body.touching.down) {
            this.player.setVelocityY(-300)
        }
    }
}