class Car {
    constructor(x, y, w, h, wheelRadius, passenger1Id, passenger2Id) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.composite;
        this.body;
        this.wheelA;
        this.wheelB;
        this.maxVelocityX = config.car.maxVelocity;
        this.passenger1Id = passenger1Id;
        this.passenger2Id = passenger2Id;
        this.createCarComposite(x, y, w, h, wheelRadius)
        Composite.add(world, this.composite);
    }

    getPosition() {
        return this.body.position;
    }

    createCarComposite(xx, yy, width, height, wheelRadius) {
        var group = Body.nextGroup(true),
            wheelAOffset = -width * 0.5 + wheelRadius + 3,
            wheelBOffset = width * 0.5 - wheelRadius - 18,
            wheelYOffset = height - height * 0.5,
            frontSeatXOffset = config.car.frontSeat.xOffset,
            backSeatXOffset = config.car.backSeat.xOffset,
            seatsYOffset = config.car.seats.yOffset;
        this.composite = Composite.create({ label: 'car' })
        this.body = Bodies.rectangle(xx, yy, width, height, {
            collisionFilter: {
                group: group
            },
            // chamfer: {
            //     radius: height * 0.5
            // },
            render: {
                sprite: {
                    texture: 'images/car.png',
                    xScale: 0.8,
                    yScale: 0.8,
                }
            },
            density: 0.0002
        });
        var frontSeat, backSeat, optsSeatHidden;
        optsSeatHidden = {
            render: {
                visible: false
            },
            density: 0.0001
        };
        if (this.passenger1Id > 0) {
            frontSeat = Bodies.rectangle(xx + frontSeatXOffset, yy - seatsYOffset, config.car.seats.w, config.car.seats.h, {
                render: {
                    visible: true,
                    sprite: {
                        texture: 'images/f' + max(1, this.passenger1Id % 9) + '.png',
                        xScale: 0.3,
                        yScale: 0.3,
                    },
                },
                density: 0.0001
            })
        } else {
            frontSeat = Bodies.rectangle(xx + frontSeatXOffset, yy - seatsYOffset, config.car.seats.w, config.car.seats.h, optsSeatHidden);
        }
        if (this.passenger2Id > 0) {
            backSeat = Bodies.rectangle(xx + backSeatXOffset, yy - seatsYOffset, config.car.seats.w, config.car.seats.h, {
                render: {
                    visible: true,
                    sprite: {
                        texture: 'images/f' + max(1, this.passenger2Id % 9) + '.png',
                        xScale: 0.3,
                        yScale: 0.3,
                    }
                },
                density: 0.0001
            });
        } else {
            backSeat = Bodies.rectangle(xx + backSeatXOffset, yy - seatsYOffset, config.car.seats.w, config.car.seats.h, optsSeatHidden);
        }
        this.body.label = 'car-body';
        frontSeat.label = 'car-frontSeat';
        backSeat.label = 'car-backSeat';

        this.wheelA = Bodies.circle(xx + wheelAOffset, yy + wheelYOffset, wheelRadius, {
            collisionFilter: {
                group: group
            },
            friction: 0.8,
            render: {
                sprite: {
                    texture: 'images/w1.png',
                    xScale: 0.67,
                    yScale: 0.67,
                }
            },
            density: 0.00081
        }
        );
        this.wheelA.label = 'car-wheelA';

        this.wheelB = Bodies.circle(xx + wheelBOffset, yy + wheelYOffset, wheelRadius, {
            collisionFilter: {
                group: group
            },
            render: {
                sprite: {
                    texture: 'images/w1.png',
                    xScale: 0.67,
                    yScale: 0.67,
                }
            },
            friction: 0.8,
            density: 0.00109
        });
        this.wheelB.label = 'car-wheelB';

        var axelA = Constraint.create({
            bodyB: this.body,
            pointB: { x: wheelAOffset, y: wheelYOffset },
            bodyA: this.wheelA,
            stiffness: 0.3,
            length: 1,
            render: { visible: false }
        });

        var axelB = Constraint.create({
            bodyB: this.body,
            pointB: { x: wheelBOffset, y: wheelYOffset },
            bodyA: this.wheelB,
            stiffness: 0.3,
            length: 1,
            render: { visible: false }
        });

        var constraintFrontSeat = Constraint.create({
            bodyB: this.body,
            pointB: { x: frontSeatXOffset, y: -seatsYOffset },
            bodyA: frontSeat,
            stiffness: 1,
            length: 0,
            render: { visible: false }
        });

        var constraintBackSeat = Constraint.create({
            bodyB: this.body,
            pointB: { x: backSeatXOffset, y: -seatsYOffset },
            bodyA: backSeat,
            stiffness: 1,
            length: 0,
            render: { visible: false }
        });

        var axelE = Constraint.create({
            bodyB: frontSeat,
            pointB: { x: backSeatXOffset, y: 0 },
            bodyA: backSeat,
            stiffness: 1,
            length: 0,
            render: { visible: false }
        });

        Composite.addBody(this.composite, this.body);
        Composite.addBody(this.composite, frontSeat);
        Composite.addBody(this.composite, backSeat);
        Composite.addBody(this.composite, this.wheelA);
        Composite.addBody(this.composite, this.wheelB);
        Composite.addConstraint(this.composite, axelA);
        Composite.addConstraint(this.composite, axelB);
        Composite.addConstraint(this.composite, constraintFrontSeat);
        Composite.addConstraint(this.composite, constraintBackSeat);
        Composite.addConstraint(this.composite, axelE);
    }

    detectCollision(event) {
        var pair = event.pairs;
        for (var i = 0; i < pair.length; i++) {
            var aElm = pair[i].bodyA;
            var bElm = pair[i].bodyB;
            if (aElm.label.startsWith('car') || bElm.label.startsWith('car')) {
                return true;
            }
        }
        return false;
    }

    remove() { Composite.remove(world, this.composite); }

    addPassenger(passenger) {
        if (this.passenger1Id > 0 && this.passenger2Id > 0) {
            console.log("Cannot fit more than 2 passengers in Car!");
            return
        }
        var tempCar;
        this.remove();
        if (this.passenger2Id == 0) {
            tempCar = new Car(this.getPosition().x, this.getPosition().y, config.car.width, config.car.height, config.car.wheelRadius, this.passenger1Id, passenger.passengerId);
        } else {
            tempCar = new Car(this.getPosition().x, this.getPosition().y, config.car.width, config.car.height, config.car.wheelRadius, passenger.passengerId, this.passenger2Id);
        }
        Matter.Body.setAngle(tempCar.body, car.body.angle)
        Matter.Body.setAngle(tempCar.wheelA, car.wheelA.angle)
        Matter.Body.setAngle(tempCar.wheelB, car.wheelB.angle)
        Matter.Body.applyForce(tempCar.body, this.getPosition(), car.body.force)
        car = tempCar;
    }

    dropPassenger(passenger) {
        var tempCar;
        this.remove();
        if (this.passenger2Id == passenger.passengerId) {
            tempCar = new Car(this.getPosition().x, this.getPosition().y, config.car.width, config.car.height, config.car.wheelRadius, this.passenger1Id, 0);
        } else {
            tempCar = new Car(this.getPosition().x, this.getPosition().y, config.car.width, config.car.height, config.car.wheelRadius, 0, this.passenger2Id);
        }
        Matter.Body.setAngle(tempCar.body, car.body.angle)
        Matter.Body.setAngle(tempCar.wheelA, car.wheelA.angle)
        Matter.Body.setAngle(tempCar.wheelB, car.wheelB.angle)
        Matter.Body.applyForce(tempCar.body, this.getPosition(), car.body.force)
        car = tempCar;
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
                Body.rotate(this.wheelA, Math.PI / 18);
                Body.rotate(this.wheelB, Math.PI / 18);
                break;
            case "JUMP":
                Body.applyForce(this.body, this.body.position, { x: 0, y: -0.325 });
        }
    }
}
