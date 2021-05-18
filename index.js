var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Composites = Matter.Composites,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Composite = Matter.Composite,
    Body = Matter.Body,
    Bodies = Matter.Bodies;

var engine, render, world, runner, ground, car;

function setup() {
    noCanvas();
    config.canvas.width = windowWidth - config.canvas.margin;
    config.canvas.height = windowHeight - config.canvas.margin;

    // create engine
    engine = Engine.create();
    world = engine.world;

    // create renderer
    render = Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: config.canvas.width,
            height: config.canvas.height,
            showAngleIndicator: config.debug,
            showCollisions: config.debug,
            wireframes: config.debug,
        }
    });

    Render.run(render);

    // create runner
    runner = Runner.create();
    Runner.run(runner, engine);


    ground = Bodies.rectangle(getX(0, config.canvas.width), (config.canvas.height - 400), config.canvas.width, 25, { isStatic: true });

    car = new Car(getX(100, 200), 300, 200, 80, 40);

    Composite.add(world, [ground, car.body]);

    // fit the render viewport to the scene
    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: config.canvas.width, y: config.canvas.height }
    });
}

function draw() {
    if (keyIsDown(LEFT_ARROW)) {
        console.log("moving LEFT")
        car.move("LEFT")
    } else if (keyIsDown(RIGHT_ARROW)) {
        console.log("moving RIGHT")
        car.move("RIGHT")
    }
}

function getX(x, width) {
    return x + (width * 0.5);
}