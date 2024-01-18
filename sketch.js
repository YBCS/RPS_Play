// version 0.2

/*
Goals:
    - [x] use rectangle instead of text
    - [] try to use color
    - [] detect collision correctly
    - [] use image
*/

let agents = [];
let rocks = [];
let papers = [];
let scissors = [];
let rock;
let paper;
let scissor;
let rock_sound;
let paper_sound;
let scissor_sound;

function preload() {
	rock = loadImage("assets/rock.png");
	paper = loadImage("assets/paper.png");
	scissor = loadImage("assets/scissor.png");
    rock_sound = loadSound("assets/rock_effect.wav");
    paper_sound = loadSound("assets/paper_effect.wav");
    scissor_sound = loadSound("assets/scissor_effect.mp3");
}

function setup() {
	rectMode(CENTER);
    imageMode(CENTER);
	createCanvas(200, 200);
	numOfAgents = 3;
	for (let i = 0; i < numOfAgents; i++) {
        rocks.push(new AgentRock());
        papers.push(new AgentPaper());
        // scissors.push(new AgentScissor());
	}
}

function draw() {
	background(0);
	// let x1 = mouseX;
	// let y1 = mouseY;
	// agent1 = new Agent(width/2, height/2);
	// agent1.checkCollisions(agents);
	// agent1.draw(-1); // order matters

	// for (let i = 0; i < numOfAgents; i++) {
	// 	agents[i].checkCollisions(agents);
	// 	agents[i].draw(i);
	// 	agents[i].move();
	// 	agents[i].boundary();
	// }

    // for (let i = 0; i < numOfAgents; i++) {
	// 	rocks[i].checkCollisions(papers);
	// 	rocks[i].draw();
	// 	rocks[i].move();
	// 	rocks[i].boundary();
    //     // papers[i].checkCollisions(rocks);
	// 	papers[i].draw();
	// 	papers[i].move();
	// 	papers[i].boundary();
	// }

    agentRock = new AgentRock(mouseX, mouseY);
    
    agentPaper = new AgentPaper(width/2, height/2);
    
    agentRock.checkCollisions([agentPaper]);
    agentPaper.checkCollisions([agentRock]);
    agentRock.draw(1)
    agentPaper.draw(2)
}

// base class for all agents -> 🤘 📰 ✂
class Agent {
	constructor(x = random(width - 20), y = random(height - 20)) {
		this.x = x;
		this.y = y;
		this.r = 20; // gets complicated if r is exposed

		this.highlight = false;
		this.speedX = random(0.05, 1);
		this.speedY = random(0.05, 1);
	}

	setHighlight(isHighlight) {
		this.highlight = isHighlight;
	}

	draw(i) {
		if (this.highlight) {
			fill(255, 100);
		} else {
			fill("white");
		}
		rect(this.x, this.y, this.r);
		stroke("black");
		text("✂️", this.x, this.y); // order matters
	}

	move() {
		this.x += this.speedX;
		this.y += this.speedY;
	}

	boundary() {
		// bounce off the walls

		if (this.x > width - this.r || this.x - this.r < 0) {
			this.speedX *= -1;
		}
		if (this.y > height - this.r || this.y - this.r < 0) {
			this.speedY *= -1;
		}
	}

	//
	intersects(other) {
		let d = dist(this.x, this.y, other.x, other.y);
		if (d < this.r) {
			return true;
		}
		return false;
	}

	// others is an array of agents
	checkCollisions(others) {
		this.highlight = false;
		for (let i = 0; i < others.length; i++) {
			if (this !== others[i]) {
				if (this.intersects(others[i])) {
					this.highlight = true;
                    console.log('collision ', this, others[i])
				}
			}
		}
	}
}

class AgentRock extends Agent {

    draw(i) {
		if (this.highlight) {
			// fill(255, 100);
            fill('red')
		} else {
			// fill("white");
			fill("green");
		}
		rect(this.x, this.y, this.r);

        image(rock, this.x, this.y, this.r, this.r);
    }
}
class AgentPaper extends Agent {

    draw(i) {
        if (this.highlight) {
            // make some noise 😁
        }
        image(paper, this.x, this.y, this.r, this.r);
    }
}
class AgentScissor extends Agent {

    draw(i) {
        if (this.highlight) {
            // make some noise 😁
        }
        image(scissor, this.x, this.y, this.r, this.r);
    }
}
