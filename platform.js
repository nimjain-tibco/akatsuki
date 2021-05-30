class Platform {
    constructor(i, x, y, w, h, d) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        //platform will have no gravity effect
        this.body = Bodies.rectangle(x, y, w, h, { isStatic: true });
        this.body.label = 'platform#' + i;
        this.body.location = d;
        Composite.add(world, this.body);
    }

}

