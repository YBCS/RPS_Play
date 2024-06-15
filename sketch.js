/*
Goals:
*/

let agents = []
let rocks = []
let papers = []
let scissors = []
let rock
let paper
let scissor
let mask
let rock_sound
let paper_sound
let scissor_sound
let button
var debug

function preload() {
    rock = loadImage('assets/rock.png')
    paper = loadImage('assets/paper.png')
    scissor = loadImage('assets/scissor.png')
    mask = loadImage('assets/performing-arts.png')
    // rock_sound = loadSound("assets/rock_effect.wav");
    // paper_sound = loadSound("assets/paper_effect.wav");
    // scissor_sound = loadSound("assets/scissor_effect.mp3");
}

function setup() {
    rectMode(CENTER)
    imageMode(CENTER)
    createCanvas(400, 400)
    numOfAgents = 10
    for (let i = 0; i < numOfAgents; i++) {
        agents.push(new AgentGeneric('rock'))
        agents.push(new AgentGeneric('paper'))
        agents.push(new AgentGeneric('scissor'))
    }
    button = createButton('Pause/Play')
    button.position(width / 2 - 50, height)
    button.mousePressed(toggleLoop)
    debug = false
}

function toggleLoop() {
    if (isLooping()) {
        noLoop()
    } else {
        loop()
    }
}

function draw() {
    qtree = QuadTree.create()
    background(0)

    for (let i = 0; i < agents.length; i++) {
        let curr = agents[i]
        rectangle = new Rectangle(
            curr.position.x,
            curr.position.y,
            curr.r,
            curr.r,
            curr
        )
        qtree.insert(rectangle)
        let range = new Circle(curr.position.x, curr.position.y, curr.r * 2) // range kinda small ?
        let points = qtree.query(range)
        // curr.checkCollisions(points)
        curr.checkCollisionsAndDrawLine(points)
        // order matters because we set highlight in checkCollisions. draw() is called after this
        curr.draw()
        // curr.jitter()
        curr.move()
        curr.boundary()
    }
    show(qtree)
    if (agents.every((agent) => agent.choice === agents[0].choice)) {
        console.log(`GAME OVER !!! ${agents[0].choice} WINS.`)
        noLoop()
        alert(`GAME OVER !!! ${agents[0].choice} WINS.`)
    }

    // stroke("red")
    // text(`mouse X ${mouseX} and mouse Y ${mouseY}`, 50, 50);
}

function show(qtree) {
    noFill()
    strokeWeight(1)
    rectMode(CENTER)
    stroke(255, 41)
    rect(qtree.boundary.x, qtree.boundary.y, qtree.boundary.w, qtree.boundary.h)

    stroke(255)
    strokeWeight(2)

    if (qtree.divided) {
        show(qtree.northeast)
        show(qtree.northwest)
        show(qtree.southeast)
        show(qtree.southwest)
    }
}

/* for debugging */
// function mouseClicked() {
//     agents.push(new AgentGeneric('mask', mouseX, mouseY))
// }
