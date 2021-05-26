var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    World = Matter.World,
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
var passangersInCar = [];


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

    Events.on(engine, 'collisionStart', function (event) {
        if (car.detectCollision(event)) {
            var pair = event.pairs;
            console.log('collision start with pair count:', pair.length)
            for (var i = 0; i < pair.length; i++) {
                var bodyALabel = pair[i].bodyA.label
                var bodyBLabel = pair[i].bodyB.label
                var passanger;
                if (bodyALabel.startsWith('passenger')) {
                    passanger = pair[i].bodyA
                }
                if (bodyBLabel.startsWith('passenger')) {
                    passanger = pair[i].bodyB
                }
                if (typeof passanger === 'undefined') {
                    continue;
                }
                if (passangersInCar.length < 3) {
                    console.log("Number of passengers in car before:", passangersInCar.length)
                    console.log("Adding passenger to car")
                    passangersInCar.push(passanger)
                    passanger.isInsideCar = true
                    // passanger.hide()
                    passanger.remove()
                    console.log("Number of passengers in car after:", passangersInCar.length)
                    break;
                } else {
                    console.log('Taxi full. No more passengers allowed. Please drop existing passengers first')
                }
            }
        }
    });
}

function keyPressed() {
    // display passengers upon DOWN_ARROW key press
    if (keyIsDown(DOWN_ARROW)) {
        console.log("Creating new passenger")
        getCarPositionX = car.getPosition()
        new Passenger(getCarPositionX + random(100, 300), 450, 70, 70);
    }
    // drop passengers upon UP_ARROW key press
    if (keyIsDown(UP_ARROW)) {
        console.log("Number of passengers in car:", passangersInCar.length)
        // check if passenger exists and display passeneger on screen for 2 seconds and disappear after wards. 
        if (passangersInCar.length > 0) {
            console.log("Dropping passenger now")
            // TODO: change position of existing passenger from car to ground
            // TODO: also remove the passanger from world
            // passangersInCar[0].remove()
            console.log("Number of passengers in car before:", passangersInCar.length)
            passangersInCar.shift()
            console.log("Number of passengers in car after:", passangersInCar.length)
        } else {
            console.log('no passengers found in taxi')
        }
    }
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
