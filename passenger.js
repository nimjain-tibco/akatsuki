class Passenger {
    constructor(x, y, w, h, d) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.body = Bodies.rectangle(x, y, w, h);
        this.body.label = 'passenger';
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

