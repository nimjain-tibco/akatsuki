class Car {
    constructor(x, y, w, h, wheelRadius) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.composite;
        this.body;
        this.wheelA;
        this.wheelB;
        this.maxVelocityX = 5;
        this.createCarComposite(x, y, w, h, wheelRadius)
        Composite.add(world, this.composite);
    }

    getPosition() {
        return this.body.position;
    }

    getHeight(){
        return this.h;
    }

    getWidth(){
        return this.w;
    }

    createCarComposite(xx, yy, width, height, wheelRadius) {
        var group = Body.nextGroup(true),
            wheelAOffset = -width * 0.5 + wheelRadius,
            wheelBOffset = width * 0.5 - wheelRadius,
            wheelYOffset = height - height * 0.5;

        this.composite = Composite.create({ label: 'car' })
        this.body = Bodies.rectangle(xx, yy, width, height, {
            collisionFilter: {
                group: group
            },
            // chamfer: {
            //     radius: height * 0.5
            // },
            density: 0.0002
        });
        this.body.label = 'car-body';
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
            bodyB: this.body,
            pointB: { x: wheelAOffset, y: wheelYOffset },
            bodyA: this.wheelA,
            stiffness: 1,
            length: 0
        });

        var axelB = Constraint.create({
            bodyB: this.body,
            pointB: { x: wheelBOffset, y: wheelYOffset },
            bodyA: this.wheelB,
            stiffness: 1,
            length: 0
        });

        Composite.addBody(this.composite, this.body);
        Composite.addBody(this.composite, this.wheelA);
        Composite.addBody(this.composite, this.wheelB);
        Composite.addConstraint(this.composite, axelA);
        Composite.addConstraint(this.composite, axelB);
    }

    detectCollision(event) {
        var pair = event.pairs;
        for (var i = 0; i < pair.length; i++) {
            var aElm = pair[i].bodyA
            var bElm = pair[i].bodyB
            if (aElm.label.startsWith('car') || bElm.label.startsWith('car')) {
                return true
            }
            else {
                return false
            }
        }

    }

    move(direction) {
        switch (direction) {
            case "LEFT":
                Composite.translate(this.composite, { x: -this.maxVelocityX, y: 0 })
                Body.rotate(this.wheelA, -Math.PI / 36);
                Body.rotate(this.wheelB, -Math.PI / 36);
                break;
            case "RIGHT":
                Composite.translate(this.composite, { x: this.maxVelocityX, y: 0 })
                Body.rotate(this.wheelA, Math.PI / 36);
                Body.rotate(this.wheelB, Math.PI / 36);
                break;
            case "JUMP":
                Body.applyForce(this.body, this.body.position, { x: 0, y: -0.10 });
        }
    }
}
