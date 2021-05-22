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


var engine, render, world, runner, ground, car, passenger, collisionCount=true, passengerCount=0;

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

        if (car.detectCollision(event) && passenger.detectCollision(event) ){
            console.log('collision start')
            // remove passenger if passengerCount is not equal to 3
            if (passengerCount != 3){
                console.log('removing passenger')
                passenger.removePassenger()
                passengerCount+=1
            }
            else{
                console.log('Taxi full. No more passengers allowed. Please drop existing passengers first')
            }

        }
});
}

function keyPressed(){
    // // display passengers upon SPACEBAR key press
     if (keyIsDown(32)) {
        console.log("SPACE")
        getCarPositionX = car.getPosition()
        passenger = new Passenger(getCarPositionX + 500,450,100,100);
        passenger.show()       
        return true
    }
    // drop passengers upon DOWN_ARROW key press
    else if (keyIsDown(DOWN_ARROW)) {
        console.log("dropping passenger")
        // check if passenger exists and display passeneger on screen for 2 seconds and disappear after wards. 
        if (passengerCount>0){
            passengerCount-=1
            passenger = new Passenger(getCarPositionX + 100,450,100,100);
            passenger.show()
            setTimeout(() => {  passenger.removePassenger(); }, 2000);
        }
        else{
            console.log('no passengers found in taxi')
        }
        
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

