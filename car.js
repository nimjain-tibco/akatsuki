class Car {
    constructor(x, y, w, h, wheelRadius,p1,p2) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.composite;
        this.body;
        this.wheelA;
        this.wheelB;
        this.maxVelocityX = 5;
        this.p1=p1;
        this.p2=p2;
        this.createCarComposite(x, y, w, h, wheelRadius)
        Composite.add(world, this.composite);
    }

    getPosition() {
        return this.body.position;
    }

    createCarComposite(xx, yy, width, height, wheelRadius) {
        var group = Body.nextGroup(true),
            wheelAOffset = -width * 0.5 + wheelRadius+3,
            wheelBOffset = width * 0.5 - wheelRadius-18,
            wheelYOffset = height - height * 0.5,
            seatYOffset= height,
            seatFrontOffset=-10,
            seatBackOffset=-width/3.5-3;

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
        var frontSeat,backSeat;
        if(this.p1>0){
            frontSeat = Bodies.rectangle(xx+seatFrontOffset, yy-seatYOffset, width/4, height, {
               render: {
                    sprite: {
                        texture: 'images/f'+this.p1+'.png',
                        xScale: 0.3,
                    yScale: 0.3,
                    }
                },
                density: 0.0001
            });
        }else{
            frontSeat = Bodies.rectangle(xx+seatFrontOffset, yy-seatYOffset, width/4, height, {
                render: {
                    visible:false
                },
                 density: 0.0001
             });
        }
        if(this.p2>0){
            backSeat = Bodies.rectangle(xx+seatBackOffset, yy-seatYOffset, width/4, height, {
                render: {
                    sprite: {
                        texture: 'images/f'+this.p2+'.png',
                        xScale: 0.3,
                    yScale: 0.3,
                    }
                },
                density: 0.0001
            });
        }else{
            backSeat = Bodies.rectangle(xx+seatBackOffset, yy-seatYOffset, width/4, height, {
                render: {
                    visible:false
                },
                density: 0.0001
            });
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
            stiffness: 1,
            length: 0,
            render: { visible: false } 
        });

        var axelB = Constraint.create({
            bodyB: this.body,
            pointB: { x: wheelBOffset, y: wheelYOffset },
            bodyA: this.wheelB,
            stiffness: 1,
            length: 0,
            render: { visible: false } 
        });

        var axelC = Constraint.create({
            bodyB: this.body,
            pointB: { x: seatFrontOffset, y: -seatYOffset },
            bodyA: this.frontSeat,
            stiffness: 1,
            length: 0,
            render: { visible: false } 
        });

        var axelD = Constraint.create({
            bodyB: this.body,
            pointB: { x: seatBackOffset, y: -seatYOffset },
            bodyA: this.backSeat,
            stiffness: 1,
            length: 0,
            render: { visible: false } 
        });

        var axelE = Constraint.create({
            bodyB: this.frontSeat,
            pointB: { x: seatBackOffset, y: 0 },
            bodyA: this.backSeat,
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
        Composite.addConstraint(this.composite, axelC);
        Composite.addConstraint(this.composite, axelD);
        Composite.addConstraint(this.composite, axelE);
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
                Body.rotate(this.wheelA, Math.PI / 18);
                Body.rotate(this.wheelB, Math.PI / 18);
                break;
            case "JUMP":
                Body.applyForce(this.body, this.body.position, { x: 0, y: -0.10 });
        }
    }
}
