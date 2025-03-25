document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    canvas.width = 800;
    canvas.height = 600;

    // Karakter
    const player = {
        x: 400,
        y: 300,
        width: 32,
        height: 32,
        color: "blue"
    };

    function drawPlayer() {
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }

    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPlayer();
        requestAnimationFrame(update);
    }

    update();
});
