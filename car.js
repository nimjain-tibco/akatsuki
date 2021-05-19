class Car {
    constructor(x, y, w, h, wheelRadius) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.body = this.createCarComposite(x, y, w, h, wheelRadius);
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

        var car = Composite.create({ label: 'Car' }),
            body = Bodies.rectangle(xx, yy, width, height, {
                collisionFilter: {
                    group: group
                },
                // chamfer: {
                //     radius: height * 0.5
                // },
                density: 0.0002
            });

        this.wheelA = Bodies.circle(xx + wheelAOffset, yy + wheelYOffset, wheelRadius, {
            collisionFilter: {
                group: group
            },
            friction: 0.8
        });

        this.wheelB = Bodies.circle(xx + wheelBOffset, yy + wheelYOffset, wheelRadius, {
            collisionFilter: {
                group: group
            },
            friction: 0.8
        });

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
}
