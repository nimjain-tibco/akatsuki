const config = {
    canvas: {
        width: window.innerWidth,
        height: window.innerHeight,
        margin: 10
    },
    debug: true
}

window.addEventListener("resize", function () {
    config.canvas.width = window.innerWidth;
    config.canvas.height = window.innerHeight;
});