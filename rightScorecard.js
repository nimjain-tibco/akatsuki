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
        rightScorecard.animateScore();
        rightScorecard.animateHappyPassengers();
    }

    addSadPassenger() {
        this.sadPassengers += 1;
        rightScorecard.animateSadPassengers();
    }

    pickPassenger() {
        this.score += 30;
        rightScorecard.animateScore();
    }

    show() {
        var html = `
        <div class="my-1">
            <div class="row animate__animated my-1" id="score">
                <div class="col-6">Score:</div>
                <div class="col-6 text-right">${this.score}</div>
            </div>
            <div class="row animate__animated my-1" id="happy-passengers">
                <div class="col-6">Visited Places:</div>
                <div class="col-6 text-right">${this.happyPassengers}</div>
            </div>
            <div class="row animate__animated my-1" id="sad-passengers">
                <div class="col-6">Missed Places:</div>
                <div class="col-6 text-right">${this.sadPassengers}</div>
            </div>
        </div>
        `;
        $('#rightDiv').html(html);
    }

    animateScore() {
        $("#score").addClass("animate__flash");
    }

    animateHappyPassengers() {
        $("#happy-passengers").addClass("animate__flash");
    }

    animateSadPassengers() {
        $("#sad-passengers").addClass("animate__flash");
    }
}