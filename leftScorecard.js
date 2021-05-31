class LeftScorecard {
    constructor() {
    }

    update() {
        for (var i = 0; i < passengersInCar.length; i++) {
            passengersInCar[i].patience -= 5;
            if (passengersInCar[i].patience <= 0) {
                console.log("Game Over")
                noLoop();
            }
        }
    }

    show() {
        $('#leftDiv').html("<p>Passengers in Car: " + passengersInCar.length + "</p>")
        for (var i = 0; i < passengersInCar.length; i++) {
            $('#leftDiv').append(`<p>${passengersInCar[i].label}: ${passengersInCar[i].destination} (${passengersInCar[i].patience})`)
        }
    }
}