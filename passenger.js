class Passenger {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.body = Bodies.rectangle(x, y, w, h);
        this.body.label = 'passenger';
        //Composite.add(world, this.body);
        this.show = function() {
            Composite.add(world, this.body);
        }
        
    }

    detectCollision(event){
        console.log(event)
        var pair = event.pairs;
        for (var i = 0; i < pair.length; i++) {
            var aElm = pair[i].bodyA
            var bElm = pair[i].bodyB
            if (aElm.label.startsWith('passenger') || bElm.label.startsWith('passenger')) {
                return true
            }
            else{
                return false
            }
        }
         
    }

    removePassenger(){
        World.remove(world, this.body)
    }
}

