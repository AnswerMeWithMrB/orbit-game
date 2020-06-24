var gameScreen = 0;

var starSize = 20;
var starColor;

var asteroidSize = 10;
var asteroidColor;

var stars = [];
var asteroids = [];

var launchPoint;
var launcherMoveSpeed = 5;

var G = 0.667;

function setup() {
  var canvas = createCanvas(750, 750);
  canvas.parent('sketch-holder');
  
  starColor = color(255, 255, 0);
  asteroidColor = color(255, 255, 255);
  
  launchPoint = createVector(width/2, height - 10);
}

function draw() {
  if (gameScreen == 0) {
    // Home screen 
    initScreen();
  } else if (gameScreen == 1) {
    // Game screen
    gamePlayScreen();
  }
}

function initScreen() {
  background(236, 240, 241);
  textAlign(CENTER);
  fill(52, 73, 94);
  textSize(70);
  text("Orbit Game", width/2, height/2);
  textSize(15);
  text("Click to start", width/2, height-30);
}

function gamePlayScreen() {
  background(52, 73, 94);
  moveLauncher();
  calculateGravity();
  drawStars();
  drawAsteroids();
  drawLauncher();
  drawScore();
}

// Events

function mousePressed() {
  if (gameScreen == 0) {
    startGame();
  } else if (gameScreen == 1) {
    // place star
    placeStar(mouseX, mouseY);
  }
}

function moveLauncher() {
  if (keyIsDown(65)) {
    launchPoint.x = constrain(launchPoint.x - launcherMoveSpeed, 10, width-10); 
  }
  if (keyIsDown(68)) {
    launchPoint.x = constrain(launchPoint.x + launcherMoveSpeed, 10, width-10);   
  }
}

function keyPressed() {
  if (keyCode === 87) {
    // Fire asteroid
    fireAsteroid();
  }
}

function startGame() {
  gameScreen = 1; 
}

function placeStar(x, y) {
  stars.push(createVector(x, y));
}

function fireAsteroid() {
  console.log("fire asteroid");
  //asteroids.push(createVector(launchPoint.x, launchPoint.y));
  asteroids.push(new Asteroid(10, launchPoint.x, launchPoint.y));
}

function calculateGravity() {
  // F = G(mM)/r^2
  for (var i = 0; i < stars.length; i++) {
    for (var j = 0; j < asteroids.length; j++) {
      
      //var r = sqrt(pow(abs(stars[i].x-asteroids[j].x), 2) + pow(abs(stars[i].y-asteroids[j].y), 2));
      //console.log(r);
      //var F = G * (starSize * asteroidSize) / pow(r, 2);
      //console.log(F);
      
      
      var difference = p5.Vector.sub(stars[i], asteroids[j].position);
      //console.log(stars[i], asteroids[j].position);
      var dist = difference.magSq();
      if (sqrt(dist) <= starSize/2+asteroidSize/2) {
        asteroids[j].dead = true;
      }
      //console.log(sqrt(dist));
      
      var gravityDirection = difference.normalize();
      
      var gravity = 6.7 * (starSize * asteroidSize) / dist;
      //console.log(gravity);
      //console.log(gravityDirection);
      var gravityVector = p5.Vector.mult(gravityDirection, gravity);
      
      asteroids[j].applyForce(gravityVector);
      //asteroids[j].applyForce(createVector(0, -0.1));
      
      //console.log(gravityVector);
      //drawArrow(stars[i], gravityVector, 'red');
      
      let v1 = stars[i];
      let v2 = asteroids[j];
      
      let v3 = p5.Vector.add(v1, v2);
      
      //asteroids[j].lerp(v3, F);
      //console.log(v1, v2);
      //drawArrow(v1, v2, 'red');
      //let v3 = p5.Vector.add(v1, v2);
      //drawArrow(v1, v3, 'purple');
      
      
    }
  }
}

function drawArrow(base, vec, myColor) {
  push();
  stroke(myColor);
  strokeWeight(3);
  fill(myColor);
  translate(base.x, base.y);
  line(0, 0, vec.x, vec.y);
  rotate(vec.heading());
  let arrowSize = 7;
  translate(vec.mag() - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
}

// Draw Functions

function drawStars() {
  for (var i = 0; i < stars.length; i++) {
    fill(starColor);
    noStroke();
    ellipse(stars[i].x, stars[i].y, starSize, starSize); 
  }
}

function drawAsteroids() {
  for (var i = 0; i < asteroids.length; i++) {
    asteroids[i].update();
    asteroids[i].display(); 
  }
}

function drawLauncher() {
  fill(asteroidColor);
  noStroke();
  ellipse(launchPoint.x, launchPoint.y, asteroidSize, asteroidSize);
}

function drawScore() { 
  let score = "";
  for (var i = 0; i < asteroids.length; i++) {
    score = asteroids[i].velocity.mag();
  }
  textAlign(LEFT);
  text(Math.floor(score* 100) / 100 + " ms-1", 10, 20);
} 

function Asteroid(m, x, y) {
  this.mass = m;
  this.position = createVector(x, y);
  this.velocity = createVector(0, 0);
  this.acceleration = createVector(0, 0);
  this.dead = false;
}

Asteroid.prototype.applyForce = function(force) {
  let f = p5.Vector.div(force, this.mass);
  this.acceleration.add(f);
};

Asteroid.prototype.update = function() {
  if (this.dead) {
    return; 
  }
  // Velocity changes according to acceleration
  this.velocity.add(this.acceleration);
  // position changes by velocity
  this.position.add(this.velocity);
  // We must clear acceleration each frame
  this.acceleration.mult(0);
};

Asteroid.prototype.display = function() {
  if (this.dead) {
    return; 
  }
  stroke(0);
  strokeWeight(2);
  fill(255,127);
  ellipse(this.position.x, this.position.y, this.mass, this.mass);
};