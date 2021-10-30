const game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update
})

let score = 0
let scoreText
let platforms
let diamonds
let cursors
let player
let obs
let cords = [
    [0, 300, 1],
    [500, 230, 0.5],
    [400, 400, 1],
    [800, 500, 0.3],
]
let fireballs

function preload() {
    game.load.image('sal', 'assets/sal.png')
    game.load.image('duoLady', 'assets/duoLady.png')
    game.load.image('discord', 'assets/discord.png')
    game.load.spritesheet('azad', 'assets/azad.png')
    game.load.image('sky', 'assets/sky.png')
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE)
    game.add.sprite(0, 0, 'sky')



    platforms = game.add.group()
    platforms.enableBody = true

    // Ground

    let ground = platforms.create(0, game.world.height - 64, 'duoLady')
    ground.scale.setTo(20, 2)
    ground.body.immovable = true

    // Player

    player = game.add.sprite(32, game.world.height - 250, 'azad')
    game.physics.arcade.enable(player)
    player.body.bounce.y = 0.1
    player.body.gravity.y = 800
    player.body.collideWorldBounds = true

    // Discord diamonds

    diamonds = game.add.group()
    diamonds.enableBody = true

    for (var i = 0; i < 18; i ++) {
        let diamond = diamonds.create(i * 100, 0, 'discord')
        diamond.body.gravity.y = 1000
        diamond.scale.setTo(0.5, 0.5)
        diamond.body.bounce.y = 0.3 + Math.random() * 0.2
    }

    // Score Text && keyboard stuff

    scoreText = game.add.text(16, 16, '', { fontSize: '32px', fill: '#000' })
    cursors = game.input.keyboard.createCursorKeys()

    // Fireballs

    fireballs = game.add.group()
    fireballs.enableBody = true

    for (var i = 0; i < 15; i ++) {
        var fireball = fireballs.create(i * 100, (1/Math.random()) * -100, 'sal')
        fireball.scale.setTo(0.1, 0.1)
        fireball.body.velocity.y = 800
    }

    // Blocks

    obs = game.add.group()
    obs.enableBody = true

    for (var i = 0; i < cords.length; i ++) {
        let ob = obs.create(cords[i][0], cords[i][1], 'duoLady')
        ob.scale.setTo(cords[i][2], cords[i][2])
        ob.body.immovable = true
    }

}

function update() {

    // Collisions

    game.physics.arcade.collide(player, platforms)
    game.physics.arcade.collide(diamonds, platforms)
    game.physics.arcade.collide(player, obs)
    game.physics.arcade.collide(diamonds, obs)
    game.physics.arcade.overlap(player, diamonds, collectDiamond, null, this)
    game.physics.arcade.overlap(player, fireballs, touchFireball, null, this)
    game.physics.arcade.overlap(obs, fireballs, killFireball, null, this)

    player.body.velocity.x = 0

    // Player movement

    if (cursors.left.isDown) {
        player.body.velocity.x = -350
        player.animations.play('left')
    } else if (cursors.right.isDown) {
        player.body.velocity.x = 350
        player.animations.play('right')
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.body.velocity.y = -750
    }

    for (var i = 0; i < fireballs.children.length; i ++) {
        var x = fireballs.children[i].x
        var y = fireballs.children[i].y
        if (y > 900) {
            fireballs.children[i].y = -5000 * Math.random()
            fireballs.children[i].x = Math.random() * window.innerWidth
        }
    }
}

// Collect diamond function

function collectDiamond(player, diamond) {
    diamond.kill()
    score += 10
    scoreText.text = 'Score: ' + score
}

function touchFireball(player, fireball) {
    alert('You touched a fireball')
    fireball.kill()
}

function killFireball(ob, fireball) {
    fireball.kill()
}
