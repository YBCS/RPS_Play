// version 0.2

/*
Goals:
    - [] detect game ends and stop loop
    - [] add support for scissor
*/

let agents = []
let rocks = []
let papers = []
let scissors = []
let rock
let paper
let scissor
let rock_sound
let paper_sound
let scissor_sound

function preload() {
    rock = loadImage('assets/rock.png')
    paper = loadImage('assets/paper.png')
    scissor = loadImage('assets/scissor.png')

    // rock_sound = loadSound("assets/rock_effect.wav");
    // paper_sound = loadSound("assets/paper_effect.wav");
    // scissor_sound = loadSound("assets/scissor_effect.mp3");
}

let agentRock
let agentPaper
function setup() {
    rectMode(CENTER)
    imageMode(CENTER)
    createCanvas(200, 200)
    numOfAgents = 3
    for (let i = 0; i < numOfAgents; i++) {
        agents.push(new AgentGeneric('rock'))
        agents.push(new AgentGeneric('paper'))
        // agents.push(new AgentGeneric("scissor"));
    }
}

function draw() {
    background(0)

    for (let i = 0; i < agents.length; i++) {
        // order matters because we set highlight in checkCollisions. draw() is called after this
        agents[i].checkCollisions(agents)
        agents[i].draw()
        agents[i].move()
        agents[i].boundary()
    }
}

// base class for all agents -> 🤘 📰 ✂
class Agent {
    constructor(x = random(width - 20), y = random(height - 20)) {
        this.x = x
        this.y = y
        this.r = 20 // gets complicated if r is exposed

        this.highlight = false
        this.speedX = random(0.05, 1)
        this.speedY = random(0.05, 1)
    }

    draw(i) {
        if (this.highlight) {
            fill(255, 100)
        } else {
            fill('white')
        }
        rect(this.x, this.y, this.r)
        stroke('black')
        text('✂️', this.x, this.y) // order matters
    }

    move() {
        this.x += this.speedX
        this.y += this.speedY
    }

    boundary() {
        // bounce off the walls

        if (this.x > width - this.r || this.x - this.r < 0) {
            this.speedX *= -1
        }
        if (this.y > height - this.r || this.y - this.r < 0) {
            this.speedY *= -1
        }
    }

    // checks if this agent intersects with another agent
    intersects(other) {
        let d = dist(this.x, this.y, other.x, other.y)
        if (d < this.r) {
            return true
        }
        return false
    }

    // others is an array of agents
    checkCollisions(others) {
        this.highlight = false
        for (let i = 0; i < others.length; i++) {
            if (this !== others[i]) {
                if (this.intersects(others[i])) {
                    this.highlight = true
                    // console.log('collision ', this, others[i])
                    this.collisionResolution(this, others[i])
                }
            }
        }
    }

    collisionResolution(mine, their) {
        /* implements in subclass */
        return
    }
}

class AgentGeneric extends Agent {
    constructor(choice, x = random(width - 20), y = random(height - 20)) {
        super(x, y)
        this.choice = choice // rock, paper, scissor
    }

    updateChoice(choice) {
        this.choice = choice
    }

    draw() {
        switch (this.choice) {
            case 'rock':
                image(rock, this.x, this.y, this.r, this.r)
                break
            case 'paper':
                image(paper, this.x, this.y, this.r, this.r)
                break
            case 'scissor':
                image(scissor, this.x, this.y, this.r, this.r)
                break
            default:
                break
        }
    }

    collisionResolution(mine, their) {
        console.log('collision resolution called in subclass ', mine, their)

        if (mine.choice === their.choice) {
            return
        }

        if (mine.choice === 'rock' && their.choice === 'paper') {
            // their wins
            console.log('paper wins')
            mine.updateChoice('paper')
        }
        return
    }
}

// these are not needed perhaps
class AgentRock extends Agent {
    draw(i) {
        if (this.highlight) {
            // fill(255, 100);
            fill('red')
        } else {
            // fill("white");
            fill('green')
        }
        rect(this.x, this.y, this.r)

        image(rock, this.x, this.y, this.r, this.r)
    }
}