import Phaser from "../lib/phaser.js"

export default class Game extends Phaser.Scene {
    
    /** @type {Phaser.Physics.Arcade.Sprite} */ player
    /** @type {Phaser.Physics.Arcade.StaticGroup} */ platforms
    /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */ cursor

    contructor() {
        // super("game") // unique key
    }
    
    preload() { /* -1 */
        this.load.image("background", "assets/bg_layer2.png")
        this.load.image("platform", "assets/ground_grass.png")
        this.load.image("bunny-stand", "assets/bunny2_stand.png")
    }
    
    create() { /* 0 */
        this.add.image(0, 480, "background").setScrollFactor(1, 0)
        this.platforms = this.physics.add.staticGroup()
        for (let i = 0; i < 5; ++i) {
            const x = Phaser.Math.Between(48, 480)
            const y = 128 * i
            const platform = this.platforms.create(x, y, "platform")
            platform.scale = 0.5
            const body = platform.body
            body.updateFromGameObject()
        }
        this.player = this.physics.add.sprite(320, 320, "bunny-stand").setScale(0.5)
        this.player.body.checkCollision.up = false
        this.player.body.checkCollision.left = false
        this.player.body.checkCollision.right = false
        this.cursor = this.input.keyboard.createCursorKeys()
        this.physics.add.collider(this.platforms, this.player)
        this.cameras.main.startFollow(this.player)
        this.cameras.main.setDeadzone(this.scale.width * 1.5)
        // this.physics.add.image(320, 320, "platform").setScale(0.5)
    }

    update(t, dt) { /* @ */
        this.platforms.children.iterate(platform => {
            const camY = this.cameras.main.scrollY
            if (platform.y >= camY + 640) {
                platform.y = camY - Phaser.Math.Between(32, 64)
                platform.body.updateFromGameObject()
            }
        })

        const touchdown = this.player.body.touching.down

        if (touchdown) {
            this.player.setVelocityY(-300)
        } else {
            if (this.cursor.left.isDown) this.player.setVelocityX(-200)
            else if (this.cursor.right.isDown) this.player.setVelocityX(200)
            else this.player.setVelocityX(0)
        }

        // this.horizontalWrap(this.player)

    }

    /** @param {Phaser.GameObjects.Sprite} sprite */
    /* horizontalWrap(sprite) {
        const halfWidth = sprite.displayWidth * 0.5
        const gameWidth = this.scale.width //* [ ] /
        if (sprite.x < -halfWidth) sprite.x = gameWidth + halfWidth
        else if (sprite.x > gameWidth + halfWidth) sprite.x = -halfWidth
    }
    */
}