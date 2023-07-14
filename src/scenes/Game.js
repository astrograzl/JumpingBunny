import Phaser from "../lib/phaser.js"
import Carrot from "../game/Carrot.js"

export default class Game extends Phaser.Scene {
    
    /** @type {Phaser.Physics.Arcade.Sprite} */ player
    /** @type {Phaser.Physics.Arcade.StaticGroup} */ platforms
    /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */ cursor
    /** @type {Phaser.Physics.Arcade.Group} */ carrots
    /** @type {Phaser.GameObjects.Text} */ label
    
    carrotCounter = 0

    constructor() {
        super("game") // unique key
    }
    
    init() { /* 8 */
        this.carrotCounter = 0;
    }

    preload() { /* -1 */
        this.load.audio("jump", "assets/sfx/phaseJump2.ogg")
        this.load.image("background", "assets/bg_layer2.png")
        this.load.image("platform", "assets/ground_grass.png")
        this.load.image("bunny-stand", "assets/bunny2_stand.png")
        this.load.image("bunny-jump", "assets/bunny2_jump.png")
        this.load.image("carrot", "assets/carrot.png")
    }
    
    create() { /* 0 */
        const style = {color: "#F00", fontSize: 24}
        this.add.image(0, 480, "background").setScrollFactor(1, 0)
        this.label = this.add.text(60, 600, "Carrots: 0", style).setScrollFactor(0)
        this.platforms = this.physics.add.staticGroup()
        for (let i = 0; i < 5; ++i) {
            const y = 128 * i
            const x = Phaser.Math.Between(48, 480)
            const platform = this.platforms.create(x, y, "platform")
            platform.scale = 0.5
            platform.body.updateFromGameObject()
        } /* this.physics.add.image(320, 320, "platform").setScale(0.5) */
        this.player = this.physics.add.sprite(320, 320, "bunny-stand").setScale(0.5)
        this.player.body.checkCollision.up = false
        this.player.body.checkCollision.left = false
        this.player.body.checkCollision.right = false
        this.cursor = this.input.keyboard.createCursorKeys()
        // const carrot = new Carrot(this, 320, 320, "carrot")
        this.carrots = this.physics.add.group({classType: Carrot})
        // this.carrots.get(320, 320, "carrot")
        // this.add.existing(carrot)
        this.physics.add.collider(this.platforms, this.player)
        this.physics.add.collider(this.platforms, this.carrots)
        this.physics.add.overlap(this.player, this.carrots, this.bucket, undefined, this)
        this.cameras.main.startFollow(this.player)
        // this.cameras.main.setDeadzone(this.scale.width * 1.02)
    }

    update(t, dt) { /* @ */
        this.platforms.children.iterate(platform => {
            const camY = this.cameras.main.scrollY
            if (platform.y >= camY + 640) {
                platform.y = camY - Phaser.Math.Between(32, 64)
                platform.body.updateFromGameObject()
                this.addCarrotAbbove(platform)
                /* Where there lost?  */
            }
        })

        const touchdown = this.player.body.touching.down

        if (touchdown) {
            this.sound.play("jump")
            this.player.setVelocityY(-300)
            this.player.setTexture("bunny-jump")
        } else {
            if (this.cursor.left.isDown) this.player.setVelocityX(-200)
            else if (this.cursor.right.isDown) this.player.setVelocityX(200)
            else this.player.setVelocityX(0)
        }

        if (this.player.body.velocity.y > 0) this.player.setTexture("bunny-stand")

        // this.horizontalWrap(this.player)

        const ground = this.bottom()
        if (this.player.y > ground.y + 200) {
            this.scene.start("game-over")
            console.log("Game Over!")
        }
    }

    /** @param {Phaser.GameObjects.Sprite} sprite */
    // horizontalWrap(sprite) {
    //     const halfWidth = sprite.displayWidth * 0.5
    //     const gameWidth = this.scale.width /* [x] */
    //     if (sprite.x < -halfWidth) sprite.x = gameWidth + halfWidth
    //     else if (sprite.x > gameWidth + halfWidth) sprite.x = -halfWidth
    // }

    /** @param {Phaser.GameObjects.Sprite} sprite */
    addCarrotAbbove(sprite) {
        const y = sprite.y - sprite.displayHeight
        const carrot = this.carrots.get(sprite.x, y, "carrot")
        carrot.body.setSize(carrot.width, carrot.height)/*?*/
        carrot.setActive(true)
        carrot.setVisible(true)
        this.physics.world.enable(carrot)
        this.add.existing(carrot)
        return carrot
    }

    bucket(carrot) {
        this.carrots.killAndHide(carrot)
        this.physics.world.disableBody(carrot.body)
        this.label.text = "Carrots: " + this.carrotCounter++
    }

    bottom() {
        const platforms = this.platforms.getChildren()
        let ground = platforms[0]
        for (let i = 1; i < platforms.length; ++i) {
            const platform = platforms[i]
            if (platform.y < ground.y) continue
            ground = platform
        } return ground
    }
}