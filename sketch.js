// version 0.2

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

let agentRock
let agentPaper
function setup() {
  rectMode(CENTER)
  imageMode(CENTER)
  createCanvas(400, 400)
  numOfAgents = 9
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
  if (agents.every((agent) => agent.choice === agents[0].choice)) {
    // console.log(`GAME OVER !!! ${agents[0].choice} WINS.`)
    alert(`GAME OVER !!! ${agents[0].choice} WINS.`)
    noLoop()
  }
}

// base class for all agents -> 🤘 📰 ✂
class Agent {
  constructor(x = random(width - 20), y = random(height - 20)) {
    this.r = 20 // gets complicated if r is exposed
    this.x = x
    this.y = y

    if (y < this.r) {
      // too close to the top panel
      this.y = y + this.r
    }
    if (x < this.r) {
      // too close to the left panel
      this.x = x + this.r
    }
    if (y > height - this.r) {
      // too close to the bottom panel
      this.y = y - this.r
    }
    if (x > height - this.r) {
      // too close to the right panel
      this.x = x - this.r
    }

    this.highlight = false
    let random_number = random([random(-2, -1), random(1, 2)])
    this.speedX = random_number
    this.speedY = random_number
  }

  draw(i) {
    if (this.highlight) {
      fill(255, 100)
    } else {
      fill('white')
    }
    rect(this.x, this.y, this.r)
    stroke('black')
    text(str(i), this.x, this.y) // order matters
  }

  move() {
    this.x += this.speedX
    this.y += this.speedY
  }

  boundary() {
    // bounce off the walls

    if (this.x > width - this.r / 2 || this.x - this.r / 2 < 0) {
      this.speedX *= -1
    }
    if (this.y > height - this.r / 2 || this.y - this.r / 2 < 0) {
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
          this.collisionResolution(others[i])
        }
      }
    }
  }

  collisionResolution(other) {
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
        image(mask, this.x, this.y, this.r, this.r)
        break
    }
  }

  // I am sure there is a better way to do this
  collisionResolution(other) {
    let item = other.userData
    if (this.choice === item.choice) {
      return
    }

    if (this.choice === 'rock' && item.choice === 'paper') {
      // other wins
      this.updateChoice('paper')
    } else if (this.choice === 'paper' && item.choice === 'rock') {
      // mine wins
      item.updateChoice('paper')
    } else if (this.choice === 'rock' && item.choice === 'scissor') {
      // mine wins
      item.updateChoice('rock')
    } else if (this.choice === 'scissor' && item.choice === 'rock') {
      // other wins
      this.updateChoice('rock')
    } else if (this.choice === 'paper' && item.choice === 'scissor') {
      // other wins
      this.updateChoice('scissor')
    } else if (this.choice === 'scissor' && item.choice === 'paper') {
      // mine wins
      item.updateChoice('scissor')
    }
    return
  }
}

/* for debugging */
// function mouseClicked() {
//     agents.push(new AgentGeneric('mask', mouseX, mouseY))
// }
