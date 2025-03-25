// Konfigurasi Phaser
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: "game-container",
    physics: { default: "arcade" },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// Membuat game baru
const game = new Phaser.Game(config);

// Preload assets
function preload() {
    this.load.image("grass", "assets/grass.png");  // Gambar rumput
    this.load.spritesheet("farmer", "assets/farmer.png", { frameWidth: 32, frameHeight: 48 }); // Karakter petani
}

// Membuat objek game
function create() {
    this.add.tileSprite(400, 300, 800, 600, "grass"); // Tambahkan background rumput
    
    // Tambahkan karakter petani di tengah layar
    this.player = this.physics.add.sprite(400, 300, "farmer");

    // Tambahkan kontrol keyboard
    this.cursors = this.input.keyboard.createCursorKeys();
}

// Update game loop (untuk gerakan karakter)
function update() {
    if (this.cursors.left.isDown) {
        this.player.setVelocityX(-160);
    } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(160);
    } else {
        this.player.setVelocityX(0);
    }

    if (this.cursors.up.isDown) {
        this.player.setVelocityY(-160);
    } else if (this.cursors.down.isDown) {
        this.player.setVelocityY(160);
    } else {
        this.player.setVelocityY(0);
    }
}
