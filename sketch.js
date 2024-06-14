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
    createCanvas(800, 800)
    numOfAgents = 300
    for (let i = 0; i < numOfAgents; i++) {
        agents.push(new AgentGeneric('rock'))
        agents.push(new AgentGeneric('paper'))
        agents.push(new AgentGeneric('scissor'))
    }
}

function draw() {
    qtree = QuadTree.create()
    background(0)

    for (let i = 0; i < agents.length; i++) {
        let curr = agents[i]
        rectangle = new Rectangle(curr.x, curr.y, curr.r, curr.r, curr)
        qtree.insert(rectangle)
        let range = new Circle(curr.x, curr.y, curr.r * 2)
        let points = qtree.query(range)
        curr.checkCollisions(points)
        // order matters because we set highlight in checkCollisions. draw() is called after this
        curr.draw()
        curr.move()
        curr.boundary()
    }
    show(qtree)
    if (agents.every((agent) => agent.choice === agents[0].choice)) {
        console.log(`GAME OVER !!! ${agents[0].choice} WINS.`)
        alert(`GAME OVER !!! ${agents[0].choice} WINS.`)
        noLoop()
    }
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
