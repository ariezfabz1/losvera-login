document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("game-background");

    if (!canvas) return;

    const context = canvas.getContext("2d", {
        alpha: false
    });

    if (typeof cef === "undefined" || !cef.screen) {
        console.error("omp-cef screen capture is not available.");
        return;
    }

    cef.screen.start(function (frame) {
        if (canvas.width !== frame.width || canvas.height !== frame.height) {
            canvas.width = frame.width;
            canvas.height = frame.height;
        }

        const pixels = new Uint8ClampedArray(frame.data);

        context.putImageData(
            new ImageData(pixels, frame.width, frame.height),
            0,
            0
        );
    }, 640, 360, 15);

    window.addEventListener("beforeunload", function () {
        cef.screen.stop();
    }, { once: true });
});
