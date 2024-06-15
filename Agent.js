// base class for all agents -> 🤘 📰 ✂
class Agent {
    constructor(x = random(width - 20), y = random(height - 20)) {
        this.r = 20 // gets complicated if r is exposed

        this.highlight = false
        this.position = createVector(x, y)
        this.velocity = createVector(random(0.5, 2.5), random(0.5, 2.5))

        // too close to one of the edges
        this.position.x = constrain(this.position.x, this.r, width - this.r)
        this.position.y = constrain(this.position.y, this.r, height - this.r)
    }

    draw(i) {
        if (this.highlight) {
            fill(255, 100)
        } else {
            fill('white')
        }
        rect(this.position.x, this.position.y, this.r)
        stroke('green')
        if (i && debug) {
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
    //     this.position.x += random([-this.speedX, this.speedX])
    //     this.position.y += random([-this.speedY, this.speedY])
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
        this.choice = choice // rock 0, paper 1, scissor 2, unknown: -1
        this.choice_code = choice === 'rock' ? 0 : choice === 'paper' ? 1 : choice === 'scissor' ? 2 : -1
    }

    updateChoice(choice, choice_code) {
        this.choice = choice
        this.choice_code = choice_code
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

    // todo : remaining half and why is it needed in the first place ?
    checkCollisionsAndDrawLine(others) {
        let closest_rock_from_paper
        let closest_paper_from_scissor
        let closest_scissor_from_rock
        let closest_rock_from_paper_dist = max(width, height)
        let closest_paper_from_scissor_dist = max(width, height)
        let closest_scissor_from_rock_dist = max(width, height)

        // intersects and collision resolution is now buit in this function
        for (let i = 0; i < others.length; i++) {
            let item = others[i].userData
            if (this !== others[i] && this.choice !== item.choice) {
                let d = dist(
                    this.position.x,
                    this.position.y,
                    item.position.x,
                    item.position.y
                )
                if (this.choice_code === 0) {
                    // rock
                    // get the closest scissor
                    if (item.choice_code == 2) {
                        if (d < closest_scissor_from_rock_dist) {
                            closest_scissor_from_rock = others[i]
                            closest_scissor_from_rock_dist = d
                            if (d < this.r) {
                                // intersects
                                this.collisionResolution(others[i])
                            }
                        }
                    }
                }
                if (this.choice_code === 1) {
                    // paper
                    // get the closest rock
                    if (item.choice_code == 0) {
                        if (d < closest_rock_from_paper_dist) {
                            closest_rock_from_paper = others[i]
                            closest_rock_from_paper_dist = d
                            if (d < this.r) {
                                // intersects
                                // this.collisionResolution(others[i])
                            }
                        }
                    }
                }
                if (this.choice_code === 2) {
                    // scissor
                    // get the closest paper
                    if (item.choice_code == 1) {
                        if (d < closest_paper_from_scissor_dist) {
                            closest_paper_from_scissor = others[i]
                            closest_paper_from_scissor_dist = d
                            if (d < this.r) {
                                // intersects
                                // this.collisionResolution(others[i])
                            }
                        }
                    }
                    // todo : handle this opposing cases for all of them
                    // todo : can I use a function so that DRY ?
                    // scissor meets rock -> scissor becomes rock
                    if (item.choice_code === 0) {
                        if (d < closest_paper_from_scissor_dist) {
                            closest_paper_from_scissor = others[i]
                            closest_paper_from_scissor_dist = d
                            if (d < this.r) {
                                // intersects
                                // this.collisionResolution(others[i])
                            }
                        }                        
                    }
                }
            }
        }

        // for a source agent, I have calculated the nearest target
        if (debug) {
            if (closest_scissor_from_rock) {
                this.drawLineUtil(this, closest_scissor_from_rock.userData, 'red')
            }
            if (closest_rock_from_paper) {
                this.drawLineUtil(this, closest_rock_from_paper.userData, 'green')
            }
            if (closest_paper_from_scissor) {
                this.drawLineUtil(this, closest_paper_from_scissor.userData, 'yellow')
            }
        }
    }

    drawLineUtil(source, destination, color) {
        stroke(color)
        line(
            source.position.x,
            source.position.y,
            destination.position.x,
            destination.position.y
        )
    }

    // I am sure there is a better way to do this
    collisionResolution(other) {
        let item = other.userData
        if (this.choice_code === item.choice_code) {
            return
        }
        if (debug) { // highlights the two boxes which are meeting
            stroke('green')
            rect(this.position.x, this.position.y, this.r, this.r)
            stroke('red')
            rect(item.position.x, item.position.y, item.r, item.r)
            noLoop()
        }

        if (this.choice_code === 0 && item.choice_code === 1) {
            // other wins
            this.updateChoice('paper', 1)
        } else if (this.choice_code === 1 && item.choice_code === 0) {
            // mine wins
            item.updateChoice('paper', 1)
        } else if (this.choice_code === 0 && item.choice_code === 2) {
            // mine wins
            item.updateChoice('rock', 0)
        } else if (this.choice_code === 2 && item.choice_code === 0) {
            // other wins
            this.updateChoice('rock', 0)
        } else if (this.choice_code === 1 && item.choice_code === 2) {
            // other wins
            this.updateChoice('scissor', 2)
        } else if (this.choice_code === 2 && item.choice_code === 1) {
            // mine wins
            item.updateChoice('scissor', 2)
        }
        return
    }
}
