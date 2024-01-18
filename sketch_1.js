// version 0.1

// let r1 = 20;
// let r2 = 20;

// function setup() {
// 	createCanvas(400, 400);
// }

// function draw() {
// 	x1 = mouseX;
// 	y1 = mouseY;
// 	x2 = height / 2;
// 	y2 = width / 2;
// 	background(220);
// 	circle(x1, y1, r1 * 2);
// 	circle(x2, y2, r2 * 2);

// 	cur_dist = dist(x1, y1, x2, y2);
// 	if (cur_dist > 0 && cur_dist < r1 + r2) {
// 		stroke("red");
//         // console.log('cur_dist (dist)', cur_dist);
// 	} else {
// 		stroke("black");
// 	}
// }

// /* calculates distance between two coordinate points */
// function distance(x1, y1, x2, y2) {
// 	return sqrt(sq(y2 - y1) + sq(x2 - x1));
// }

// ----------------------------

// function setup() {
// 	createCanvas(400, 400);
// }

// function draw() {
// 	background(220);
// 	textSize(64);
// 	textAlign(CENTER);
// 	text("📜🪨✂️", width / 2, height / 2);
// 	text("☀️🌬️🛬", width / 2, height / 2 + 100);
// }

// ----------------------------

let agents = [];
function setup() {
	rectMode(CENTER)
	createCanvas(200, 200);
	numOfAgents = 10;
	for (let i = 0; i < numOfAgents; i++) {
		agents.push(new Agent());
	}
}

function draw() {
	background(0);
	let x1 = mouseX;
	let y1 = mouseY;
	agent1 = new Agent(x1, y1);
	agent1.draw(-1);
	// agent1.highlight = true;
	for (let i = 0; i < numOfAgents; i++) {
		agents[i].draw(i);
		agents[i].move();
		agents[i].boundary();
	}
	agents[0].highlight = true

	// should this be part if agent class?
	for (let i = 0; i < numOfAgents; i++) {
		for (let j = 0; j < numOfAgents; j++) {
			if (i != j) {
				if (agent1.intersects(agents[i]) || agent1.intersects(agents[j])) {
					// console.log("intersects! agent 1", i, j);
					agent1.setHighlight(true);
				}
				// if (agents[i].intersects(agents[j])) {
				// 	console.log("intersects! ", i, j);
				// 	agents[i].highlight = true;
				// 	agents[j].highlight = true;
				// } else {
				// 	agents[i].highlight = false;
				// 	agents[j].highlight = false;

				// }
			}
		}
	}

	console.log('agent 1 at end of loop ', agent1)

}

// base class for all agents -> 🤘 📰 ✂
class Agent {
	constructor(x = random(width- 20), y = random(height- 20)) {
		this.x = x;
		this.y = y;
		this.r = 20; // gets complicated if r is exposed

		this.highlight = false;
		this.speedX = random(0.05, 1);
		this.speedY = random(0.05, 1);
	}

	setHighlight(isHighlight) {
		this.highlight = isHighlight
	}

	draw(i) {
		textSize(this.r);
        fill(255);
		if (this.highlight) {
			fill("red");
			if(i==-1) {
				console.log('drawing agent 1')
			}
		} else {
			fill("white");
		}
		text("🤘"+i, this.x, this.y, this.r);
	}
	
	move() {
		this.x += this.speedX;
		this.y += this.speedY;
		// this.x += random(-1*this.speedX*2, this.speedX);
		// this.y += random(-1*this.speedY*2, this.speedY);		
	}

	boundary() {
		// bounce off the walls
		if (this.x > width - this.r || this.x < 0) {
			this.speedX *= -1;
		}
		if (this.y > height - this.r || this.y < 0) {
			this.speedY *= -1;
		}
	}

	intersects(other) {
		let d = dist(this.x, this.y, other.x, other.y);
		if (d < this.r) {
			// because r is not exposed
			// console.log("intersects!");
			return true;
		}
		return false;
	}
}
