var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Composites = Matter.Composites,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Composite = Matter.Composite,
    Body = Matter.Body,
    Svg = Matter.Svg,
    Common = Matter.Common,
    Bounds = Matter.Bounds,
    Vector = Matter.Vector,
    Constraint = Matter.Constraint,
    Events = Matter.Events,
    Bodies = Matter.Bodies;

var engine, render, world, runner, ground, car, terrain;
var viewportCentre, extents, boundsScaleTarget, boundsScale, initialCarPos;
var wallTop, wallRight, wallBottom, wallLeft;

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


    // ground = new Ground(getX(0, config.canvas.width), (config.canvas.height * 0.9),
    //     config.canvas.width, 50);

    screenWidth = config.canvas.width;
    screenHeight = config.canvas.height;
    wallThikness = 50

    wallTop = new Wall(getX(0, screenWidth), (0 - wallThikness), screenWidth, wallThikness);
    wallRight = new Wall(screenWidth + (wallThikness / 2), (screenHeight / 2), wallThikness, screenHeight);
    wallBottom = new Wall(getX(0, screenWidth), (screenHeight - wallThikness / 2), screenWidth, wallThikness);
    wallLeft = new Wall(0 - (wallThikness / 2), (screenHeight / 2), wallThikness, screenHeight);

    initialCarPos = { x: getX(100, 200), y: (config.canvas.height * 0.1) };
    car = new Car(initialCarPos.x, initialCarPos.y, 200, 80, 40);

    // initialCarPos = Vector.magnitude(Vector.sub(car.getPosition(), viewportCentre))
    // fit the render viewport to the scene
    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: config.canvas.width, y: config.canvas.height }
    });
}

function draw() {
    if (keyIsDown(LEFT_ARROW)) {
        car.move("LEFT")
    }
    if (keyIsDown(RIGHT_ARROW)) {
        car.move("RIGHT")
    }
}

function getX(x, width) {
    return x + (width * 0.5);
}

window.addEventListener("resize", function () {
    config.canvas.width = window.innerWidth;
    config.canvas.height = window.innerHeight;
});

(function unloadScrollBars() {
    document.documentElement.style.overflow = 'hidden';  // firefox, chrome
    document.body.scroll = "no"; // ie only
})()