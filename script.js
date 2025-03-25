document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    canvas.width = 800;
    canvas.height = 600;

    // Gambar Background
    const background = new Image();
    background.src = "assets/images/rumput.png";

    // Karakter
    const player = {
        x: 400,
        y: 300,
        width: 32,
        height: 32,
        color: "blue",
        speed: 5
    };

    const keys = {
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false,
        w: false,
        a: false,
        s: false,
        d: false
    };

    window.addEventListener("keydown", (e) => {
        if (keys.hasOwnProperty(e.key)) keys[e.key] = true;
    });

    window.addEventListener("keyup", (e) => {
        if (keys.hasOwnProperty(e.key)) keys[e.key] = false;
    });

    function movePlayer() {
        if (keys.ArrowUp || keys.w) player.y -= player.speed;
        if (keys.ArrowDown || keys.s) player.y += player.speed;
        if (keys.ArrowLeft || keys.a) player.x -= player.speed;
        if (keys.ArrowRight || keys.d) player.x += player.speed;

        // Batas layar (agar tidak keluar)
        player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
        player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));
    }

    function drawBackground() {
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    }

    function drawPlayer() {
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }

    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBackground();
        movePlayer();
        drawPlayer();
        requestAnimationFrame(update);
    }

    background.onload = () => {
        update();
    };
});
