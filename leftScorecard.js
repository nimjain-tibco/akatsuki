class LeftScorecard {
    constructor() {
        this.prevLength = passengersInCar.length;
    }

    update() {
        for (var i = 0; i < passengersInCar.length; i++) {
            passengersInCar[i].patience -= 1;
            if (passengersInCar[i].patience <= 0) {
                console.log("Game Over")
                noLoop();
            }
        }
    }

    animateFrindsInCar() {
        $("#friendsInCar").addClass("animate__flash");
    }

    show() {
        var html = `
        <div class="row animate__animated my-1" id="friendsInCar">
            <div class="col-6">Friends in Car:</div>
            <div class="col-6 text-right">${passengersInCar.length} / 2</div>
        </div>`;

        if (passengersInCar.length > 0) {
            html += `<div class="my-1">Next Destinations:</div>`;
        }
        for (var i = 0; i < passengersInCar.length; i++) {
            html += `
            <div class="row my-1">
                <div class="col-4 mr-1">${passengersInCar[i].destination}</div>
                <div class="col-6 per-parent">
                    <div class="per-wrapper" style="width: ${passengersInCar[i].patience}%">&nbsp;</div>
                </div>
                <div class="col-1">${passengersInCar[i].patience}</div>
            </div>`;
        }
        $('#leftDiv').html(html);
        if (leftScorecard.prevLength != passengersInCar.length) {
            leftScorecard.prevLength = passengersInCar.length;
            leftScorecard.animateFrindsInCar();
        }
    }
}