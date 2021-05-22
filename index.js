var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    World = Matter.World,
    Composites = Matter.Composites,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Composite = Matter.Composite,
    Body = Matter.Body,
    Events = Matter.Events,
    Bodies = Matter.Bodies;


var engine, render, world, runner, ground, car, passenger, collisionCount=true;

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

    // create bodies
    ground = new Ground(getX(0, config.canvas.width), (config.canvas.height - 100),
        config.canvas.width, 50);
    car = new Car(getX(100, 200), 300, 200, 80, 40);
    passenger = new Passenger(500, 300, 50, 50);

    // fit the render viewport to the scene
    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: config.canvas.width, y: config.canvas.height }
    });


    Events.on(engine, 'collisionStart', function(event) {
        if (collisionCount){
            console.log(event)
            collisionCount=false
        }

        if (car.detectCollision(event) && passenger.detectCollision(event) ){
            console.log('collision start')
            // remove passenger
                console.log('removing passenger')
                passenger.removePassenger()               
                  
        }
});
}

function keyPressed(){
     if (keyIsDown(32)) {
        console.log("SPACE")
        getCarPositionX = car.getPosition()
        passenger = new Passenger(getCarPositionX + 500,450,100,100);
        passenger.show()       
        return true
    }
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

