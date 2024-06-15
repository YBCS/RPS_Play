// base class for all agents -> 🤘 📰 ✂
class Agent {
    constructor(x = random(width - 20), y = random(height - 20)) {
        this.r = 20 // gets complicated if r is exposed

        this.highlight = false
        this.position = createVector(x, y)
        this.velocity = createVector(random(0.5,2.5), random(0.5,2.5))

        // too close to one of the edges
        this.position.x = constrain(this.position.x, this.r, width-this.r);
        this.position.y = constrain(this.position.y, this.r, height-this.r);
    }

    draw(i) {
        if (this.highlight) {
            fill(255, 100)
        } else {
            fill('white')
        }
        rect(this.position.x, this.position.y, this.r)
        stroke('green')
        if (i) {
            text(
                `pos: (${int(this.position.x)}, ${int(this.position.y)}) ${str(
                    i
                )}`,
                this.position.x,
                this.position.y
            ) // order matters
        }
    }

    move() {
        this.position.add(this.velocity)
    }

    // jitter() {
    //     this.x += random([-this.speedX, this.speedX])
    //     this.y += random([-this.speedY, this.speedY])
    //     // needs that bound check --> its weird here because of rectMode(CENTER)
    // }

    boundary() {
        // bounce off the walls

        if (
            this.position.x > width - this.r / 2 ||
            this.position.x - this.r / 2 < 0
        ) {
            this.velocity.x *= -1
        }
        if (
            this.position.y > height - this.r / 2 ||
            this.position.y - this.r / 2 < 0
        ) {
            this.velocity.y *= -1
        }
    }

    // checks if this agent intersects with another agent
    intersects(other) {

        let d = dist(this.position.x, this.position.y, other.x, other.y)
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
                    this.highlight = true // okay a self fulfilling prophecy ?
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

    draw(i) {
        // super.draw(i) // for debugging
        switch (this.choice) {
            case 'rock':
                image(rock, this.position.x, this.position.y, this.r, this.r)
                break
            case 'paper':
                image(paper, this.position.x, this.position.y, this.r, this.r)
                break
            case 'scissor':
                image(scissor, this.position.x, this.position.y, this.r, this.r)
                break
            default:
                image(mask, this.position.x, this.position.y, this.r, this.r)
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
