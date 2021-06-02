class Wall {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        var options = {
            isStatic: true,
            render: { fillStyle: '#2d3436' }
        }
        this.body = Bodies.rectangle(x, y, w, h, options);
        this.body.label = 'ground';

        Composite.add(world, this.body);
    }
}