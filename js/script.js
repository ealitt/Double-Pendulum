let pendulumA,
pendulumB,
buffer,
previousX,
previousY;

let gravity = 2;

class Pendulum {
    constructor(cx, cy, angle = Math.random()*PI) {
        this.mass = 50;
        this.length = 200;
        this.cx = cx;
        this.cy = cy;
        this.angle = angle;
        this.posX = this.length * cos(this.angle)+cx;
        this.posY = this.length * sin(this.angle)+cy;
        this.velocity = Math.random()*0.0001;
        this.acceleration = 0;
    }
}

function setup() {
    pendulumA = new Pendulum(windowWidth/2,windowHeight/2);
    pendulumB = new Pendulum(pendulumA.posX,pendulumA.posY);
    
    createCanvas(windowWidth, windowHeight);
    buffer = createGraphics(windowWidth, windowHeight);
    buffer.background(100);
}

function draw() {
    drawBackground();
    drawPendulum();

    let acceleration = calculateAcceleration();
    updatePendulum(acceleration);
    drawPendulumPath();
}

function drawBackground() {
    background(127);
    strokeWeight(10);
    imageMode(CORNER);
    image(buffer, 0, 0, windowWidth, windowHeight);
}

function drawPendulum() {
    line(pendulumA.cx, pendulumA.cy, pendulumA.posX, pendulumA.posY);
    line(pendulumB.cx, pendulumB.cy, pendulumB.posX, pendulumB.posY);
    
    ellipse(pendulumA.posX, pendulumA.posY, pendulumA.mass, pendulumA.mass);
    ellipse(pendulumB.posX, pendulumB.posY, pendulumB.mass, pendulumB.mass);
}

function calculateAcceleration() {
    let numeratorPendulumA = -gravity*(2*pendulumA.mass+pendulumB.mass)*sin(pendulumA.angle)-
    pendulumB.mass*gravity*sin(pendulumA.angle-2*pendulumB.angle)-
    2*sin(pendulumA.angle-pendulumB.angle)*pendulumB.mass*
    (Math.pow(pendulumB.velocity,2)*pendulumB.length+Math.pow(pendulumA.velocity,2)*pendulumA.length*
    cos(pendulumA.angle-pendulumB.angle));

    let numeratorPendulumB = 2*sin(pendulumA.angle-pendulumB.angle)*
    (Math.pow(pendulumA.velocity,2)*pendulumA.length*(pendulumA.mass+pendulumB.mass)+gravity*(pendulumA.mass+pendulumB.mass)*
    cos(pendulumA.angle)+Math.pow(pendulumB.velocity,2)*pendulumB.length*pendulumB.mass*cos(pendulumA.angle-pendulumB.angle));
    
    let denominator = 2*pendulumA.mass+pendulumB.mass-pendulumB.mass*cos(2*pendulumA.angle-2*pendulumB.angle)
    let accelA = numeratorPendulumA/(pendulumA.length*denominator);
    let accelB = numeratorPendulumB/(pendulumB.length*denominator);
    return [accelA, accelB];
}

function updatePendulum(updatedAcceleration) {
    let accelA = updatedAcceleration[0],
    accelB = updatedAcceleration[1];

    pendulumA.posX = pendulumA.cx + pendulumA.length * sin(pendulumA.angle);
    pendulumA.posY = pendulumA.cy + pendulumA.length * cos(pendulumA.angle);

    pendulumB.cx = pendulumA.posX;
    pendulumB.cy = pendulumA.posY;

    pendulumB.posX = pendulumB.cx + pendulumB.length * sin(pendulumB.angle);
    pendulumB.posY = pendulumB.cy + pendulumB.length * cos(pendulumB.angle);

    pendulumA.velocity += accelA;
    pendulumB.velocity += accelB;

    pendulumA.angle += pendulumA.velocity;
    pendulumB.angle += pendulumB.velocity;

    pendulumA.velocity *= 0.9999;
    pendulumB.velocity *= 0.9999;
}

function drawPendulumPath() {
    buffer.strokeWeight(2);
    buffer.line(previousX, previousY, pendulumB.posX, pendulumB.posY);

    previousX = pendulumB.posX;
    previousY = pendulumB.posY;
}