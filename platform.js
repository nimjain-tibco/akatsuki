class Platform {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        //platform will habe no gravity effect
        this.body = Bodies.rectangle(x, y, w, h, { isStatic: true }); 
        this.body.label = 'platform';

        Composite.add(world, this.body);
        
    }

}

