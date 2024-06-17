// base class for all agents -> 🤘 📰 ✂
class Agent {
    constructor(x = random(width - 20), y = random(height - 20)) {
        this.r = 20 // gets complicated if r is exposed

        this.highlight = false
        this.position = createVector(x, y)
        this.velocity = createVector(random(-0.5, 0.5), random(-0.5, 0.5))

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

    jitter() {
        let jitter = createVector(random(-1, 1), random(-1, 1));
        this.position.add(jitter);
        this.position.x = constrain(this.position.x, this.r/2, width - (this.r/2))
        this.position.y = constrain(this.position.y, this.r/2, height - (this.r/2))
    }

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

    // others is an array of agents; no longer in use
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
        this.choice = choice
        this.choice_code = this.getChoiceCode(choice)
    }

    getChoiceCode(choice) {
        // rock 0, paper 1, scissor 2, unknown: -1
        return choice === 'rock'
            ? 0
            : choice === 'paper'
            ? 1
            : choice === 'scissor'
            ? 2
            : -1
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

    // not in use
    findClosestAgents(others) {
        let closest_rock
        let closest_paper
        let closest_scissor
        let closest_rock_dist = width
        let closest_paper_dist = width
        let closest_scissor_dist = width

        for (let i = 0; i < others.length; i++) {
            let item = others[i].userData
            let d = dist(
                this.position.x,
                this.position.y,
                item.position.x,
                item.position.y
            )
            if (item.choice_code === 0 && this.choice_code !== 0) {
                // rock
                if (this.choice_code === 0)
                    if (d < closest_rock_dist) {
                        closest_rock_dist = d
                        closest_rock = others[i]
                    }
            } else if (item.choice_code === 1 && this.choice_code !== 1) {
                // paper
                if (d < closest_paper_dist) {
                    closest_paper_dist = d
                    closest_paper = others[i]
                }
            } else if (item.choice_code === 2 && this.choice_code !== 2) {
                // scissor
                if (d < closest_scissor_dist) {
                    closest_scissor_dist = d
                    closest_scissor = others[i]
                }
            }
        }

        return {
            closest_rock,
            closest_paper,
            closest_scissor,
            closest_rock_dist,
            closest_paper_dist,
            closest_scissor_dist,
        }
    }

    // todo : can I use a function so that DRY ?
    checkCollisionsAndDrawLine(others) {
        let closest_rock_from_paper
        let closest_scissor_from_paper
        let closest_rock_from_scissor
        let closest_paper_from_scissor
        let closest_paper_from_rock
        let closest_scissor_from_rock
        let closest_rock_from_paper_dist = max(width, height)
        let closest_rock_from_scissor_dist = max(width, height)
        let closest_paper_from_scissor_dist = max(width, height)
        let closest_paper_from_rock_dist = max(width, height)
        let closest_scissor_from_rock_dist = max(width, height)
        let closest_scissor_from_paper_dist = max(width, height)

        for (let i = 0; i < others.length; i++) {
            let item = others[i].userData
            if (this.choice_code !== item.choice_code) {
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
                    // rock meets paper -> rock becomes paper
                    if (item.choice_code == 1) {
                        if (d < closest_paper_from_rock_dist) {
                            closest_paper_from_rock = others[i]
                            closest_paper_from_rock_dist = d
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
                                this.collisionResolution(others[i])
                            }
                        }
                    }
                    // paper meets scissor -> paper becomes scissor
                    if (item.choice_code == 2) {
                        if (d < closest_scissor_from_paper_dist) {
                            closest_scissor_from_paper = others[i]
                            closest_scissor_from_paper_dist = d
                            if (d < this.r) {
                                // intersects
                                this.collisionResolution(others[i])
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
                                this.collisionResolution(others[i])
                            }
                        }
                    }
                    // scissor meets rock -> scissor becomes rock
                    if (item.choice_code === 0) {
                        if (d < closest_rock_from_scissor_dist) {
                            closest_rock_from_scissor = others[i]
                            closest_rock_from_scissor_dist = d
                            if (d < this.r) {
                                // intersects
                                this.collisionResolution(others[i])
                            }
                        }
                    }
                }
            }
        }

        this.moveTowardsTarget(closest_scissor_from_rock, "red")
        this.moveTowardsTarget(closest_paper_from_rock, "blue")
        this.moveTowardsTarget(closest_scissor_from_paper, "orange")
        this.moveTowardsTarget(closest_rock_from_paper, "white")
        this.moveTowardsTarget(closest_rock_from_scissor, "brown")
        this.moveTowardsTarget(closest_paper_from_scissor, "green")
    }

    moveTowardsTarget(closest_dst_from_src, color) {
        if (closest_dst_from_src) {
            debug ? this.drawLineUtil(
                closest_dst_from_src.userData, color) : null
            let direction = p5.Vector.sub(
                closest_dst_from_src.userData.position, this.position);
            direction.setMag(1)
            this.position.add(direction)
            // I think something should happen to the velocity here too
            // like target should inherit velocity of source ???
        }        
    }

    // alternate version; not working
    checkCollisionsAndDrawLineAlt(others) {
        // let rock, paper, scissor, rock_d, paper_d, scissor_d = this.findClosestAgents(others)
        // print('called ', rock, paper, scissor, rock_d, paper_d, scissor_d)
        let data = this.findClosestAgents(others)
        // print('called ', data)

        if (data.closest_rock && data.closest_rock_dist < this.r) {
            this.collisionResolution(data.closest_rock)
        }
        if (data.closest_paper && data.closest_paper_dist < this.r) {
            this.collisionResolution(data.closest_paper)
        }
        if (data.closest_scissor && data.closest_scissor_dist < this.r) {
            this.collisionResolution(data.closest_scissor)
        }

        // for a source agent, I have calculated the nearest target
        if (debug) {
            if (data.closest_rock) {
                this.drawLineUtil(this, data.closest_rock.userData, 'red')
            }
            if (data.closest_paper) {
                this.drawLineUtil(this, data.closest_paper.userData, 'green')
            }
            if (data.closest_scissor) {
                this.drawLineUtil(this, data.closest_scissor.userData, 'yellow')
            }
        }
    }

    drawLineUtil(destination, color) {
        stroke(color)
        line(
            this.position.x,
            this.position.y,
            destination.position.x,
            destination.position.y
        )
    }

    collisionResolution(other) {
        let item = other.userData
        if (this.choice_code === item.choice_code) {
            return
        }

        if (debug) {
            // highlights the two boxes which are meeting
            stroke('green')
            rect(this.position.x, this.position.y, this.r, this.r)
            stroke('red')
            rect(item.position.x, item.position.y, item.r, item.r)
            // noLoop()
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
