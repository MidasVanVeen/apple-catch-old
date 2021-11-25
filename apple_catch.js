// auteur: Midas van Veen
// datum start: 
// datum eind:

canvas = document.getElementById('canvas')
ctx = canvas.getContext('2d')

var LEFTPRESSED = false,
    RIGHTPRESSED = false,
    UPPRESSED = false,
    DOWNPRESSED = false

var APRESSED = false,
    DPRESSED = false,
    WPRESSED = false,
    SPRESSED = false

var JPRESSED = false,
    LPRESSED = false,
    IPRESSED = false,
    KPRESSED = false

// disclamer: ik heb de sound effects van youtube gepakt
const COLLECTSOUND = 'sounds/apple_collect.mp3' // https://youtu.be/mKHVqEfhZrE
const WINSOUND = 'sounds/win_sound.mp3' // https://youtu.be/ZmAUi3Sbq74
const JUMPSOUND = 'sounds/jump_sound.mp3' // https://youtu.be/r0WKn-3RFXo

var config = {
    noclip: false,
    nogameover: false,
    apple_amount: 5,
    gameoverscore: 20,
}

class Ground {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.color = 'green'
        this.height = 10
    }

    draw() {
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.rect(this.x, this.y, 300, this.height)
        ctx.fill()
    }
}

class Player {
    constructor(x, y, color, keybinds, name) {
        this.x = x
        this.y = y
        this.width = 7
        this.height = 7
        this.centerx = this.x + (this.width / 2)
        this.vel = {
            y: 0,
            x: 2
        }
        this.color = color
        this.gravity = 2
        this.acc = 0.2
        this.jumping = false
        this.grounded = false
        this.fric = 1
        this.keybindconfig = keybinds
        this.leftcontrols = false
        this.rightcontrols = false
        this.upcontrols = false
        this.downcontrols = false
        this.score = 0
        this.name = name
    }

    update() {
        if (this.keybindconfig == 'default') {
            this.leftcontrols = LEFTPRESSED
            this.rightcontrols = RIGHTPRESSED
            this.upcontrols = UPPRESSED
            this.downcontrols = DOWNPRESSED
        }
        if (this.keybindconfig == 'wasd') {
            this.leftcontrols = APRESSED
            this.upcontrols = WPRESSED
            this.downcontrols = SPRESSED
            this.rightcontrols = DPRESSED
        }
        if (this.keybindconfig == 'ijkl') {
            this.leftcontrols = JPRESSED
            this.downcontrols = KPRESSED
            this.rightcontrols = LPRESSED
            this.upcontrols = IPRESSED
        }

        if (config.noclip) {
            if (this.leftcontrols) {
                this.x -= this.vel.x
            }
            if (this.rightcontrols) {
                this.x += this.vel.x
            }
            if (this.upcontrols) {
                this.y -= this.vel.x
            }
            if (this.downcontrols) {
                this.y += this.vel.x
            }
        } else {
            if (this.jumping) {
                this.y -= this.vel.y
                this.vel.y -= this.acc
            } else {
                this.y += this.gravity
            }

            if (this.y > ground.y - (this.height)) {
                this.y = ground.y - (this.height)
                this.grounded = true
                this.jumping = false
                this.fric = 0.75
            } else {
                this.grounded = false
                this.fric = 1
            }

            if (this.leftcontrols == true) {
                this.x -= this.vel.x * this.fric
            }
            if (this.rightcontrols == true) {
                this.x += this.vel.x * this.fric
            }
            if (this.x < 0) {
                this.x = 0
            }
            if (this.x + this.width > canvas.width) {
                this.x = canvas.width - this.width
            }
        }
    }

    jump() {
        if (this.grounded && !this.jumping && !config.noclip) {

            var jumpsound = new Audio(JUMPSOUND)
            jumpsound.play()

            this.jumping = true
            this.vel.y = 7
        }
    }

    draw() {
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.rect(this.x, this.y, this.width, this.height)
        ctx.fill()
    }
}

class Apple {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.width = 7
        this.height = 7
        this.color = '#660000'
    }

    draw() {
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.rect(this.x, this.y, this.width, this.height)
        ctx.fill()
    }
}

// dit kon ook met een switch statement maar het is nu te veel werk om te veranderen
document.addEventListener('keydown', function(event) {
    if (event.keyCode == 37) {
        LEFTPRESSED = true
    }
    if (event.keyCode == 39) {
        RIGHTPRESSED = true
    }
    if (event.keyCode == 38) {
        UPPRESSED = true
        for (let i = 0; i < players.length; i++) {
            if (players[i].keybindconfig == 'default') {
                players[i].jump()
            }
        }
    }
    if (event.keyCode == 40) {
        DOWNPRESSED = true
    }
    if (event.keyCode == 65) {
        APRESSED = true
    }
    if (event.keyCode == 68) {
        DPRESSED = true
    }
    if (event.keyCode == 87) {
        WPRESSED = true
        for (let i = 0; i < players.length; i++) {
            if (players[i].keybindconfig == 'wasd') {
                players[i].jump()
            }
        }
    }
    if (event.keyCode == 83) {
        SPRESSED = true
    }
    if (event.keyCode == 74) {
        JPRESSED = true
    }
    if (event.keyCode == 76) {
        LPRESSED = true
    }
    if (event.keyCode == 73) {
        IPRESSED = true
        for (let i = 0; i < players.length; i++) {
            if (players[i].keybindconfig == 'ijkl') {
                players[i].jump()
            }
        }
    }
    if (event.keyCode == 75) {
        KPRESSED = true
    }
    if (event.keyCode == 82) {
        clearInterval(gameloopinterval)
        start()
    }
})

document.addEventListener('keyup', function(event) {
    if (event.keyCode == 37) {
        LEFTPRESSED = false
    }
    if (event.keyCode == 39) {
        RIGHTPRESSED = false
    }
    if (event.keyCode == 38) {
        UPPRESSED = false
    }
    if (event.keyCode == 40) {
        DOWNPRESSED = false
    }
    if (event.keyCode == 65) {
        APRESSED = false
    }
    if (event.keyCode == 68) {
        DPRESSED = false
    }
    if (event.keyCode == 87) {
        WPRESSED = false
    }
    if (event.keyCode == 83) {
        SPRESSED = false
    }
    if (event.keyCode == 74) {
        JPRESSED = false
    }
    if (event.keyCode == 76) {
        LPRESSED = false
    }
    if (event.keyCode == 73) {
        IPRESSED = false
    }
    if (event.keyCode == 74) {
        KPRESSED = false
    }
})

// check of de appels te dicht op elkaar liggen
function appleChecker(newApple, appleArray) {
    for (let i = 0; i < appleArray.length; i++) {
        var margin = 30,
            topbound = appleArray[i].y - margin,
            bottombound = appleArray[i].y + appleArray[i].height + margin,
            leftbound = appleArray[i].x - margin,
            rightbound = appleArray[i].x + appleArray[i].width + margin

        if (newApple.x + newApple.width > leftbound &&
            newApple.x < rightbound &&
            newApple.y + newApple.height > topbound &&
            newApple.y < bottombound) {
            return false
        }
    }
    return true
}

// game over scherm
function gameover(winner) {
    clearInterval(gameloopinterval)

    var winsound = new Audio(WINSOUND)
    winsound.play()

    ctx.fillStyle = 'lightblue'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.font = '30px Arial'
    ctx.fillStyle = 'black'
    ctx.fillText(winner + ' wins!', canvas.width / 2 - 85, canvas.height / 2)
    ctx.font = '9px Arial'
    ctx.fillText("press r to restart", canvas.width / 2 - 25, canvas.height / 2 + 20)
}

start()

// maak alle objects aan en start de gameloop
function start() {
    ground = new Ground(0, 140)
    player = new Player(10, ground.y - 30, 'red', 'default', 'player 1')
    player2 = new Player(30, ground.y - 30, 'blue', 'wasd', 'player 2')
    player3 = new Player(50, ground.y - 30, 'purple', 'ijkl', 'player 3')

    players = new Array()
    players.push(player)
    players.push(player2)
    players.push(player3)

    apples = new Array()

    gameloopinterval = setInterval(gameloop, 18)
}

// de gameloop
function gameloop() {
    ctx.fillStyle = 'lightblue'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ground.draw()
    for (let i = 0; i < players.length; i++) {
        players[i].update()
        players[i].draw()
    }
    for (let i = 0; apples.length < config.apple_amount; i++) {
        randy = Math.floor(Math.random() * 60) + 20;
        randx = Math.floor(Math.random() * (canvas.width - 10))
        var newapple = new Apple(randx, randy)
        if (appleChecker(newapple, apples)) {
            apples.push(newapple)
        }
    }
    for (let i = 0; i < apples.length; i++) {
        for (let p = 0; p < players.length; p++) {
            // hieronder zorgt iets voor een error, maar ik kon het niet vinden. 
            // het lijk niet gameplay te beinvloeden dus het is niet zo erg
            if (players[p].x < apples[i].x + apples[i].width &&
                players[p].x + players[p].width > apples[i].x &&
                players[p].y < apples[i].y + apples[i].height &&
                players[p].y + players[p].height > apples[i].y) {
                players[p].score += 1
                apples.splice(i, 1)
                var collect_sound = new Audio(COLLECTSOUND)
                collect_sound.play()
            }
        }
    }
    for (let i = 0; i < apples.length; i++) {
        apples[i].draw()
    }
    ctx.font = '9px Arial'
    var scoreTextWidth = 10
    for (let i = 0; i < players.length; i++) {
        ctx.fillText('score ' + players[i].name + ': ' + players[i].score, 10, scoreTextWidth)
        scoreTextWidth += 10
    }
    if (!config.nogameover) {
        for (let i = 0; i < players.length; i++) {
            if (players[i].score >= config.gameoverscore) {
                gameover(players[i].name)
                continue
            }
        }
    }
}
