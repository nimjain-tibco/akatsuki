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
var passengersInCar = [];
var destinationsAvailable = ["Mumbai", "Pune", "Hyderabad", "Chennai", "Bangalore", "Delhi", "Rajasthan", "Kolkata", "Punjab"];
var destinationsAllocated = [];
var dropSwitch = false;

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
            background: "#87CEEB"
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
            if (passengersInCar.length < 3) {
                console.log("Number of passengers in car before:", passengersInCar.length)
                console.log("Adding passenger to car")
                passengersInCar.push(passanger)
                setNumPassenger(passengersInCar.length)
                passanger.isInsideCar = true
                // passanger.hide()
                passanger.remove()
                console.log("Number of passengers in car after:", passengersInCar.length)
                break;
            } else {
                console.log('Taxi full. No more passengers allowed. Please drop existing passengers first')
            }
        }
    });

    Events.on(engine, 'collisionActive', function (event) {
        if (!dropSwitch || !car.detectCollision(event)) {
            return;
        }

        console.log("switch is ONNNNNNNNNNNNNNNNNN");
        var pair = event.pairs;
        console.log('collision start with pair count:', pair.length)

        for (var i = 0; i < pair.length; i++) {
            var bodyALabel = pair[i].bodyA.label
            var bodyBLabel = pair[i].bodyB.label
            var platform = null;

            if (bodyALabel.startsWith('platform')) {
                platform = pair[i].bodyA
            }
            if (bodyBLabel.startsWith('platform')) {
                platform = pair[i].bodyB
            }
            if(platform != null && platform.destination != null && platform.destination !== undefined){
                for(var index = 0; index < passengersInCar.length; index++){
                    if(platform.destination == passengersInCar[i].destination){
                        //makeAvailableDestination(platform.destination);
                        console.log("Number of passengers in car before:", passengersInCar.length)
                        passengersInCar.splice(i,1)
                        console.log("FOund Destination " + platform.destination);
                        setNumPassenger(passengersInCar.length)
                        platform.destination = null;  
                        console.log("Number of passengers in car after:", passengersInCar.length)
                        // reset the switch
                        dropSwitch = false;
                        console.log("switch is OFFFFFFFFFFFFFFFF");
                        break; 
                    }
                }
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
        var randomDestination = getRandomFromList(destinationsAvailable);
        destinationsAllocated.push(randomDestination);
        new Passenger(car.getPosition().x + random(300, 500), 450, 70, 70, randomDestination);
    }
    // drop passengers upon UP_ARROW key press
    if (keyIsDown(UP_ARROW)) {
        console.log("Number of passengers in car:", passengersInCar.length)
        // check if passenger exists and display passeneger on screen for 2 seconds and disappear after wards. 
        if (passengersInCar.length > 0) {
            console.log("Dropping passenger now")
            // TODO: change position of existing passenger from car to ground
            // TODO: also remove the passanger from world
            // passangersInCar[0].remove()
            //commented the shift as removing logic is in collisionActive event.
            //passangersInCar.shift()
            //setNumPassenger(passengersInCar.length)
            //toggling switch ON to detect collisionActive event for car and platform 
            dropSwitch = true;
            var tempP = new Passenger(car.getPosition().x + random(100, 200), car.getPosition().y, 70, 70, null);
            tempP.body.label = "droppedPassenger";
            setTimeout(function () { tempP.body.remove(); }, 1000);
        } else {
            console.log('no passengers found in taxi')
        }
    }

    //calculations for platform area
    var yMax = config.canvas.height - wallBottom.h - 20;
    var yLevel = config.platform.yLevel + 1
    var yPartition = yMax / yLevel;
    var xMax = config.canvas.width;
    var xLevel = config.platform.xLevel
    var xPartition = xMax / xLevel;
    var platformWidth = xPartition - (xPartition * config.platform.xMarginFactor);

    if (keyIsDown(49) || keyIsDown(97)) {
        // platform 1:   on keyPress 1 
        var p = isPlatformPresent(1);
        if (typeof p !== 'undefined') {
            //makeAvailableDestination(p.destination); 
            World.remove(world, p);
        } else {
            console.log("Creating platform 1")
            // var allocatedDestToPassenger = getRandomFromList(destinationsAllocated)
            new Platform(1, getX((xPartition * 0), xPartition), (yPartition * (yLevel - 1)), platformWidth, config.platform.height, "Kolkata");
        }
    }
    if (keyIsDown(50) || keyIsDown(98)) {
        // platform 2:   on keyPress 2  
        var p = isPlatformPresent(2);
        if (typeof p !== 'undefined') {
            //makeAvailableDestination(p.destination); 
            World.remove(world, p);
        } else {
            console.log("Creating platform 2")
            // var allocatedDestToPassenger = getRandomFromList(destinationsAllocated)
            new Platform(2, getX((xPartition * 1), xPartition), (yPartition * (yLevel - 1)), platformWidth, config.platform.height, "Chennai");
        }
    }
    if (keyIsDown(51) || keyIsDown(99)) {
        // platform 3:   on keyPress 3  
        var p = isPlatformPresent(3);
        if (typeof p !== 'undefined') {
            //makeAvailableDestination(p.destination); 
            World.remove(world, p);
        } else {
            console.log("Creating platform 3")
            // var allocatedDestToPassenger = getRandomFromList(destinationsAllocated)
            new Platform(3, getX((xPartition * 2), xPartition), (yPartition * (yLevel - 1)), platformWidth, config.platform.height, "Hyderabad");
        }
    }
    if (keyIsDown(52) || keyIsDown(100)) {
        // platform 4:   on keyPress 4
        var p = isPlatformPresent(4);
        if (typeof p !== 'undefined') {
            //makeAvailableDestination(p.destination); 
            World.remove(world, p);
        } else {
            console.log("Creating platform 4")
            // var allocatedDestToPassenger = getRandomFromList(destinationsAllocated)
            new Platform(4, getX((xPartition * 0), xPartition), (yPartition * (yLevel - 2)), platformWidth, config.platform.height, "Mumbai");
        }
    }
    if (keyIsDown(53) || keyIsDown(101)) {
        // platform 5:   on keyPress 5
        var p = isPlatformPresent(5);
        if (typeof p !== 'undefined') {
            //makeAvailableDestination(p.destination); 
            World.remove(world, p);
        } else {
            console.log("Creating platform 5")
            // var allocatedDestToPassenger = getRandomFromList(destinationsAllocated)
            new Platform(5, getX((xPartition * 1), xPartition), (yPartition * (yLevel - 2)), platformWidth, config.platform.height, "Pune");
        }
    }
    if (keyIsDown(54) || keyIsDown(102)) {
        // platform 6:   on keyPress 6
        var p = isPlatformPresent(6);
        if (typeof p !== 'undefined') {
            //makeAvailableDestination(p.destination); 
            World.remove(world, p);
        } else {
            console.log("Creating platform 6")
            // var allocatedDestToPassenger = getRandomFromList(destinationsAllocated)
            new Platform(6, getX((xPartition * 2), xPartition), (yPartition * (yLevel - 2)), platformWidth, config.platform.height, "Bangalore");
        }
    }
    if (keyIsDown(55) || keyIsDown(103)) {
        // platform 7:   on keyPress 7
        var p = isPlatformPresent(7);
        if (typeof p !== 'undefined') {
            //makeAvailableDestination(p.destination); 
            World.remove(world, p);
        } else {
            console.log("Creating platform 7")
            // var allocatedDestToPassenger = getRandomFromList(destinationsAllocated)
            new Platform(7, getX((xPartition * 0), xPartition), (yPartition * (yLevel - 3)), platformWidth, config.platform.height, "Rajasthan");
        }
    }
    if (keyIsDown(56) || keyIsDown(104)) {
        // platform 8:   on keyPress 8
        var p = isPlatformPresent(8);
        if (typeof p !== 'undefined') {
            //makeAvailableDestination(p.destination); 
            World.remove(world, p);
        } else {
            console.log("Creating platform 8")
            // var allocatedDestToPassenger = getRandomFromList(destinationsAllocated)
            new Platform(8, getX((xPartition * 1), xPartition), (yPartition * (yLevel - 3)), platformWidth, config.platform.height, "Delhi");
        }
    }
    if (keyIsDown(57) || keyIsDown(105)) {
        // platform 9:   on keyPress 9
        var p = isPlatformPresent(9);
        if (typeof p !== 'undefined') {
            //makeAvailableDestination(p.destination); 
            World.remove(world, p);
        } else {
            console.log("Creating platform 9")
            // var allocatedDestToPassenger = getRandomFromList(destinationsAllocated)
            new Platform(9, getX((xPartition * 2), xPartition), (yPartition * (yLevel - 3)), platformWidth, config.platform.height, "Punjab");
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

function getRandomFromList(list){
    var index = Math.floor(Math.random() * list.length);
    return list.splice(index, 1)[0];
}

function makeAvailableDestination(dest){
    var index = destinationsAllocated.indexOf(dest);
    if (index !== -1) {
        destinationsAllocated.splice(index, 1);
        var indexAva = destinationsAvailable.indexOf(dest)
        if(indexAva !== -1)
            destinationsAvailable.push(dest);
    }

}

window.addEventListener("resize", function () {
    config.canvas.width = window.innerWidth;
    config.canvas.height = window.innerHeight;
});

(function unloadScrollBars() {
    document.documentElement.style.overflow = 'hidden';  // firefox, chrome
    document.body.scroll = "no"; // ie only
})()
