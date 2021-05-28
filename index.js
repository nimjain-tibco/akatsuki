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
    setNumPassenger(0);
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
            background : "#87CEEB"
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
    car = new Car(initialCarPos.x, initialCarPos.y, 200, config.car.width, config.car.height);

    // initialCarPos = Vector.magnitude(Vector.sub(car.getPosition(), viewportCentre))
    // fit the render viewport to the scene
    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: config.canvas.width, y: config.canvas.height }
    });

    Events.on(engine, 'collisionStart', function (event) {
        if (!car.detectCollision(event)) {
            return;
        }
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
                setNumPassenger(passangersInCar.length)
                passanger.isInsideCar = true
                // passanger.hide()
                passanger.remove()
                console.log("Number of passengers in car after:", passangersInCar.length)
                break;
            } else {
                console.log('Taxi full. No more passengers allowed. Please drop existing passengers first')
            }
        }
    });

    textSize(width / 3);
    textAlign(CENTER, CENTER);
}

function draw() {
    background(0);
    text("Hello", 100, 100, 70, 80);
    if (keyIsDown(LEFT_ARROW)) {
        car.move("LEFT")
    }
    if (keyIsDown(RIGHT_ARROW)) {
        car.move("RIGHT")
    }
    if (keyIsDown(32)) {
        car.move("JUMP")
    }
}

function keyPressed() {
    // display passengers upon DOWN_ARROW key press
    if (keyIsDown(DOWN_ARROW)) {
        console.log("Creating new passenger")
        new Passenger(car.getPosition().x + random(300, 500), 450, 70, 70);
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
            setNumPassenger(passangersInCar.length)
            var tempP = new Passenger(car.getPosition().x + random(100, 200), car.getPosition().y, 70, 70);
            tempP.body.label = "droppedPassenger";
            setTimeout(function () { tempP.body.remove(); }, 1000);
            console.log("Number of passengers in car after:", passangersInCar.length)
        } else {
            console.log('no passengers found in taxi')
        }
    }
    
    //calculations for platform area
    var yMax = config.canvas.height - wallBottom.h - 20;
    var yBufferThreshold = 20 + car.h;
    var yLevel = config.platform.yLevel + 1
    var yPartition = yMax / yLevel;
    while(yPartition < yBufferThreshold && yLevel > 1){
        yLevel--;
        yPartition = yPartition/yLevel;
    }
    yPartition += 10;
    var xMax = config.canvas.width;
    var xBufferThreshold = 20 + car.w;
    var xLevel = config.platform.xLevel + 1
    var xPartition = xMax / xLevel;
    while(xPartition < xBufferThreshold){
        xLevel--;
        xPartition = xPartition/xLevel;
    }
    //xPartition -= 5; 
    if (keyIsDown(49) || keyIsDown(97)) {
        // platform 1:   on keyPress 1 
        var p = isPlatformPresent(1);
        if (typeof p !== 'undefined') {
            World.remove(world, p);
        } else {
            console.log("Creating platform 1")
            new Platform(1, xPartition + config.platform.xCap, (yPartition * ( yLevel - 1 )), config.platform.width, config.platform.height);
        }
    }
    if (keyIsDown(50) || keyIsDown(98)) {
        // platform 2:   on keyPress 2  
        var p = isPlatformPresent(2);
        if (typeof p !== 'undefined') {
            World.remove(world, p);
        } else {
            console.log("Creating platform 2")
            new Platform(2, (xPartition * 2 + config.platform.xCap), (yPartition * ( yLevel - 1 )), config.platform.width, config.platform.height);
        }
    }
    if (keyIsDown(51) || keyIsDown(99)) {
        // platform 3:   on keyPress 3  
        var p = isPlatformPresent(3);
        if (typeof p !== 'undefined') {
            World.remove(world, p);
        } else {
            console.log("Creating platform 3")
            new Platform(3, (xPartition * 3 + config.platform.xCap), (yPartition * ( yLevel - 1 )), config.platform.width, config.platform.height);
        }
    }
    if (keyIsDown(52) || keyIsDown(100)) {
        // platform 4:   on keyPress 4
        var p = isPlatformPresent(4);
        if (typeof p !== 'undefined') {
            World.remove(world, p);
        } else {
            console.log("Creating platform 4")
            new Platform(4, xPartition + config.platform.xCap, ((yPartition * ( yLevel - 2 )) + config.platform.yCap), config.platform.width, config.platform.height);
        }
    }
    if (keyIsDown(53) || keyIsDown(101)) {
        // platform 5:   on keyPress 5
        var p = isPlatformPresent(5);
        if (typeof p !== 'undefined') {
            World.remove(world, p);
        } else {
            console.log("Creating platform 5")
            new Platform(5, (xPartition * 2 + config.platform.xCap), ((yPartition * ( yLevel - 2 )) + config.platform.yCap), config.platform.width, config.platform.height);
        }
    }
    if (keyIsDown(54) || keyIsDown(102)) {
        // platform 6:   on keyPress 6
        var p = isPlatformPresent(6);
        if (typeof p !== 'undefined') {
            World.remove(world, p);
        } else {
            console.log("Creating platform 6")
            new Platform(6, (xPartition * 3 + config.platform.xCap), ((yPartition * ( yLevel - 2 )) + config.platform.yCap), config.platform.width, config.platform.height);
        }
    }
    if (keyIsDown(55) || keyIsDown(103)) {
        // platform 7:   on keyPress 7
        var p = isPlatformPresent(7);
        if (typeof p !== 'undefined') {
            World.remove(world, p);
        } else {
            console.log("Creating platform 7")
            new Platform(7, xPartition + config.platform.xCap, ((yPartition * ( yLevel - 3 )) + 2 * config.platform.yCap), config.platform.width, config.platform.height);
            
        }
    }
    if (keyIsDown(56) || keyIsDown(104)) {
        // platform 8:   on keyPress 8
        var p = isPlatformPresent(8);
        if (typeof p !== 'undefined') {
            World.remove(world, p);
        } else {
            console.log("Creating platform 8")
            new Platform(8, (xPartition * 2 + config.platform.xCap), ((yPartition * ( yLevel - 3 )) + 2 * config.platform.yCap), config.platform.width, config.platform.height);
        }
    }
    if (keyIsDown(57) || keyIsDown(105)) {
        // platform 9:   on keyPress 9
        var p = isPlatformPresent(9);
        if (typeof p !== 'undefined') {
            World.remove(world, p);
        } else {
            console.log("Creating platform 9")
            new Platform(9, (xPartition * 3 + config.platform.xCap), ((yPartition * ( yLevel - 3 )) + 2 * config.platform.yCap), config.platform.width, config.platform.height);
        }
    }
}

function getX(x, width) {
    return x + (width * 0.5);
}

function isPlatformPresent(i) {
    for (var j = 0; j < world.bodies.length; j++) {
        if (world.bodies[j].label == ('platform#' + i)) {
            return world.bodies[j];
        }
    }
    return;
}

window.addEventListener("resize", function () {
    config.canvas.width = window.innerWidth;
    config.canvas.height = window.innerHeight;
});

(function unloadScrollBars() {
    document.documentElement.style.overflow = 'hidden';  // firefox, chrome
    document.body.scroll = "no"; // ie only
})()
