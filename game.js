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

const game = new Phaser.Game(config);

function preload() {
    this.load.image("grass", "assets/grass.png");
    this.load.spritesheet("farmer", "assets/farmer.png", { frameWidth: 32, frameHeight: 48 });
    this.load.image("seed", "assets/seed.png");       // Benih tanaman
    this.load.image("sprout", "assets/sprout.png");   // Tanaman muda
    this.load.image("carrot", "assets/carrot.png");   // Tanaman siap panen
}

function create() {
    this.add.tileSprite(400, 300, 800, 600, "grass");
    
    this.player = this.physics.add.sprite(400, 300, "farmer");
    this.cursors = this.input.keyboard.createCursorKeys();
    
    this.plantedCrops = [];  // Array untuk menyimpan tanaman yang ditanam

    // Klik kiri untuk menanam benih
    this.input.on('pointerdown', (pointer) => {
        plantSeed(this, pointer.x, pointer.y);
    });
}

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

// Fungsi untuk menanam benih
function plantSeed(scene, x, y) {
    const seed = scene.add.image(x, y, "seed");

    // Tumbuh menjadi tunas setelah 3 detik
    setTimeout(() => {
        seed.setTexture("sprout");
    }, 3000);

    // Tumbuh menjadi wortel setelah 6 detik
    setTimeout(() => {
        seed.setTexture("carrot");

        // Tambahkan event klik untuk panen
        seed.setInteractive();
        seed.on("pointerdown", () => {
            seed.destroy(); // Hapus dari game setelah dipanen
        });
    }, 6000);

    scene.plantedCrops.push(seed);
}
