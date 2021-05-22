class Car {
    constructor(x, y, w, h, wheelRadius) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.body = this.createCarComposite(x, y, w, h, wheelRadius);
        //this.body.label = 'car';
        this.wheelA;
        this.wheelB;
        this.maxVelocityX = 3;
        Composite.add(world, this.body);
    }

    createCarComposite(xx, yy, width, height, wheelRadius) {
        var Body = Matter.Body,
            Bodies = Matter.Bodies,
            Composite = Matter.Composite,
            Constraint = Matter.Constraint;

        var group = Body.nextGroup(true),
            wheelAOffset = -width * 0.5 + wheelRadius,
            wheelBOffset = width * 0.5 - wheelRadius,
            wheelYOffset = height - height * 0.5;

        var car = Composite.create({ label: 'car' }),
            body = Bodies.rectangle(xx, yy, width, height, {
                collisionFilter: {
                    group: group
                },
                // chamfer: {
                //     radius: height * 0.5
                // },
                density: 0.0002
            });

            body.label = 'car-body';

        this.wheelA = Bodies.circle(xx + wheelAOffset, yy + wheelYOffset, wheelRadius, {
            collisionFilter: {
                group: group
            },
            friction: 0.8
        });
            this.wheelA.label = 'car-wheelA';

        this.wheelB = Bodies.circle(xx + wheelBOffset, yy + wheelYOffset, wheelRadius, {
            collisionFilter: {
                group: group
            },
            friction: 0.8
        });
        
        this.wheelB.label = 'car-wheelB';

        var axelA = Constraint.create({
            bodyB: body,
            pointB: { x: wheelAOffset, y: wheelYOffset },
            bodyA: this.wheelA,
            stiffness: 1,
            length: 0
        });

        var axelB = Constraint.create({
            bodyB: body,
            pointB: { x: wheelBOffset, y: wheelYOffset },
            bodyA: this.wheelB,
            stiffness: 1,
            length: 0
        });

        Composite.addBody(car, body);
        Composite.addBody(car, this.wheelA);
        Composite.addBody(car, this.wheelB);
        Composite.addConstraint(car, axelA);
        Composite.addConstraint(car, axelB);
        return car;
    }

    detectCollision(event){
        var pair = event.pairs;
        for (var i = 0; i < pair.length; i++) {
            var aElm = pair[i].bodyA
            var bElm = pair[i].bodyB
            if (aElm.label.startsWith('car') || bElm.label.startsWith('car')) {
                return true
            }
            else{
                return false
            }
        }
         
    }

    move(direction) {
        switch (direction) {
            case "LEFT":
                Matter.Composite.translate(this.body, { x: -this.maxVelocityX, y: 0 })
                Matter.Body.rotate(this.wheelA, -Math.PI / 36);
                Matter.Body.rotate(this.wheelB, -Math.PI / 36);
                
                break;
            case "RIGHT":
                Matter.Composite.translate(this.body, { x: this.maxVelocityX, y: 0 })
                Matter.Body.rotate(this.wheelA, Math.PI / 36);
                Matter.Body.rotate(this.wheelB, Math.PI / 36);
                break;
        }
    }

    getPosition(){
        console.log('getting car position')
        return(this.body.bodies[0].position.x)
    }

}
