const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576


c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.6

const background = new Sprites({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/background.png'
})


const shop = new Sprites({
    position: {
        x: 610,
        y: 128
    },
    imageSrc: './img/shop.png',
    scale: 2.75,
    framesMax: 6,
    framesCurrent: 100
})

const player = new Fighter({
    position: {
        x: 90,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './img/samuraiMack/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imageSrc: './img/samuraiMack/Idle.png',
            framesMax: 8,
        },
        run: {
            imageSrc: './img/samuraiMack/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: './img/samuraiMack/Jump.png',
            framesMax: 2,
        },
        fall: {
            imageSrc: './img/samuraiMack/Fall.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc: './img/samuraiMack/Attack1.png',
            framesMax: 6,
        },
        takeHit: {
            imageSrc: './img/samuraiMack/Take_Hit-white-silhouette.png',
            framesMax: 4,
        },
        death: {
            imageSrc: './img/samuraiMack/Death.png',
            framesMax: 6,
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 140,
        height: 50
    }

})


const enemy = new Fighter({
    position: {
        x: 850,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './img/kenji/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imageSrc: './img/kenji/Idle.png',
            framesMax: 4,

        },
        run: {
            imageSrc: './img/kenji/Run.png',
            framesMax: 8,

        },
        jump: {
            imageSrc: './img/kenji/Jump.png',
            framesMax: 2,
        },
        fall: {
            imageSrc: './img/kenji/Fall.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc: './img/kenji/Attack1.png',
            framesMax: 4,
        },
        takeHit: {
            imageSrc: './img/kenji/Take_hit.png',
            framesMax: 3,
        },
        death: {
            imageSrc: './img/kenji/Death.png',
            framesMax: 7,
        }
    },
    attackBox: {
        offset: {
            x: -175,
            y: 50
        },
        width: 175,
        height: 50
    }
})


const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}

function rectangleCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height

    )
}

function determineWinner({ player, enemy, timerId }) {
    clearTimeout(timerId)
    document.querySelector('#displayText').style.display = 'flex'

    if (player.health === enemy.health) {
        document.querySelector('#displayText').innerHTML = 'EMPATE!'

    } else if (player.health > enemy.health) {
        document.querySelector('#displayText').innerHTML = 'PLAYER 1 GANO!'
    } else if (enemy.health > player.health) {
        document.querySelector('#displayText').innerHTML = 'PLAYER 2 GANO!'
    }
}

let timer = 60
let timerId
function decreaseTimer() {
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000)
        timer--
        document.querySelector('#timer').innerHTML = timer
    }

    if (timer === 0) {
        determineWinner({ player, enemy, timerId })
    }
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    c.fillStyle = 'rgba(255, 255, 255, 0.15)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()


    player.velocity.x = 0
    enemy.velocity.x = 0


    // PLAYER MOVEMENT
    // player.framesMax = player.sprites.idle.framesMax

    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
        player.switcheSprites('run')
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.switcheSprites('run')

    } else {
        player.switcheSprites('idle')

    }

    if (player.velocity.y < 0) {
        player.switcheSprites('jump')

    } else if (player.velocity.y > 0) {
        player.switcheSprites('fall')

    }
    // enemy.velocity.x = 0

    // ENEMY MOVEMENT


    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
        enemy.switcheSprites('run')


    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
        enemy.switcheSprites('run')
    } else {
        enemy.switcheSprites('idle')

    }

    if (enemy.velocity.y < 0) {
        enemy.switcheSprites('jump')

    } else if (enemy.velocity.y > 0) {
        enemy.switcheSprites('fall')

    }

    // Aca detectamos el ataque y a enemy lo fajan
    if (rectangleCollision({
        rectangle1: player,
        rectangle2: enemy
    }) &&
        player.isAttacking &&
        player.framesCurrent === 4
    ) {
        enemy.takeHit()
        player.isAttacking = false

        gsap.to('#enemyHealth', {
            width: enemy.health + '%'
        })
        console.log('player uso placaje')
    }

    // si player le erra

    if (player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false
    }

    // Aca detectamos el ataque y a player lo fajan

    if (rectangleCollision({
        rectangle1: enemy,
        rectangle2: player
    }) &&
        enemy.isAttacking &&
        enemy.framesCurrent === 2
    ) {
        player.takeHit()
        enemy.isAttacking = false
        gsap.to('#playerHealth', {
            width: player.health + '%'
        })
        console.log('enemy uso placaje')
    }

    // si enemy le erra

    if (enemy.isAttacking && enemy.framesCurrent === 3) {
        enemy.isAttacking = false
    }

    // END GAME segun la salu'
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerId })
    }

}

animate()

window.addEventListener('keydown', (event) => {
    if (!player.dead) {
        switch (event.key) {
            case 'a':
                keys.a.pressed = true
                player.lastKey = 'a'
                break
            case 'd':
                keys.d.pressed = true
                player.lastKey = 'd'
                break
            case 'w':
                player.velocity.y = -15

                break
            case ' ':
                player.attack()
                break
        }

    }
    if (!enemy.dead) {
        switch (event.key) {

            case 'ArrowRight':
                keys.ArrowRight.pressed = true
                enemy.lastKey = 'ArrowRight'
                break
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true
                enemy.lastKey = 'ArrowLeft'
                break
            case 'ArrowUp':
                enemy.velocity.y = -15
                break
            case 'm':
                enemy.attack()
                break
        }
    }

})


window.addEventListener('keyup', (event) => {
    //PLAYER keys
    switch (event.key) {
        case 'a':
            keys.a.pressed = false

            break
        case 'd':
            keys.d.pressed = false

            break
    }
    //ENEMY keys
    switch (event.key) {
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false

            break
        case 'ArrowRight':
            keys.ArrowRight.pressed = false

            break
    }
})