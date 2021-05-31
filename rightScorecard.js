class RightScorecard {
    constructor() {
        this.score = 0;
        this.happyPassengers = 0;
        this.sadPassengers = 0;
    }

    updatePassengerDropped(passenger) {
        if (passenger.patience > 0) {
            this.addHappyPassenger();
            return;
        }
        this.addSadPassenger();
    }

    addHappyPassenger() {
        this.score += 70;
        this.happyPassengers += 1;
    }

    addSadPassenger() {
        this.sadPassengers += 1;
    }

    pickPassenger() {
        this.score += 30;
    }

    show() {
        $('#rightDiv').html(`<p>Score: ${this.score}</p>`)
        $('#rightDiv').append(`<p>Happy Passengers: ${this.happyPassengers}</p>`)
        $('#rightDiv').append(`<p>Sad Passengers: ${this.sadPassengers}</p>`)

    }

}