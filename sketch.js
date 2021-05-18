var Engine = Matter.Engine,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;

// create an engine
var engine;
var runner;
var world;
var boxA;
var width = windowWidth - 20;
var height = windowHeight - 20;
function setup() {
    createCanvas(windowWidth - 20, windowHeight - 20);
    engine = Engine.create();
    runner = Runner.create();
    world = engine.world;
    // create two boxes and a ground
    boxA = Bodies.rectangle(400, 200, 80, 80);
    // walls
    Composite.add(world, [
        // top
        Bodies.rectangle(10, 10, 800, 50, { isStatic: true, render: { fillStyle: '#060a19' } }),
        // right
        Bodies.rectangle(width, 10, 50, height, { isStatic: true, render: { fillStyle: '#060a19' } }),
        // bottom
        Bodies.rectangle(10, width, width, 50, { isStatic: true, render: { fillStyle: '#060a19' } }),
        // left
        Bodies.rectangle(10, 10, 50, height, { isStatic: true, render: { fillStyle: '#060a19' } })
    ]);
    Runner.run(runner, engine);
    Composite.add(world, boxA)
}

function draw() {
    background(51);
    rect(boxA.position.x, boxA.position.y, 80, 80);
}