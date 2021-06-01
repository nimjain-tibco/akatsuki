class Passenger {
    constructor(id, x, y, w, h, d) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.body = Bodies.rectangle(x, y, w, h, {
            render: {
                sprite: {
                    texture: 'images/p' + max(1, id % 9) + '.png',
                    xScale: 0.6,
                    yScale: 0.6,
                }
            }
        });
        this.body.passengerId = id;
        this.body.label = 'passenger' + id;
        this.body.patience = 100;
        this.body.isInsideCar = false;
        this.body.destination = d;
        this.body.hide = function () {
            this.render.visible = false;
        }
        this.body.remove = function () {
            World.remove(world, this)
        }
        Composite.add(world, this.body);
    }
}

