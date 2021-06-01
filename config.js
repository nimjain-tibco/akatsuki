const config = {
    canvas: {
        width: window.innerWidth,
        height: window.innerHeight,
        margin: 0
    },
    car: {
        width: 280,
        height: 60,
        wheelRadius: 30,
        maxVelocity: 5,
        seats: {
            yOffset: 60,
            w: 70,
            h: 60
        },
        frontSeat: {
            xOffset: -10
        },
        backSeat: {
            xOffset: -77
        }
    },
    platform: {
        yLevel: 3,
        xLevel: 3,
        height: 20,
        xMarginFactor: 0.20,
        destinations: ["Bangalore", "Hyderabad", "Chennai", "Mumbai", "Pune", "Kolkata", "Jaipur", "Delhi", "Gangtok"]
    },
    passenger: {
        w: 70,
        h: 150
    },
    debug: false
}
