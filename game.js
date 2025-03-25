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

let money = 20;
let seedsOwned = 0;
let selectedTool = "hand";
let isRaining = false; // Status cuaca

function preload() {
    this.load.image("grass", "assets/grass.png");
    this.load.spritesheet("farmer", "assets/farmer.png", { frameWidth: 32, frameHeight: 48 });
    this.load.image("seed", "assets/seed.png");  
    this.load.image("sprout", "assets/sprout.png");  
    this.load.image("carrot", "assets/carrot.png");  
    this.load.image("shop", "assets/shop.png");
    this.load.image("coin", "assets/coin.png");
    this.load.image("watering_can", "assets/watering_can.png"); 
    this.load.image("raindrop", "assets/raindrop.png"); // Gambar tetesan air
}

function create() {
    this.add.tileSprite(400, 300, 800, 600, "grass");

    this.player = this.physics.add.sprite(400, 300, "farmer");
    this.cursors = this.input.keyboard.createCursorKeys();

    this.plantedCrops = [];

    // Toko
    this.shop = this.physics.add.sprite(700, 100, "shop");
    this.shop.setInteractive();
    this.shop.on("pointerdown", openShop.bind(this));

    // Uang & benih pemain
    this.moneyText = this.add.text(20, 20, `💰 Uang: ${money}`, { fontSize: "20px", fill: "#fff" });
    this.seedText = this.add.text(20, 50, `🌱 Benih: ${seedsOwned}`, { fontSize: "20px", fill: "#fff" });

    // Alat penyiram
    this.wateringCan = this.add.image(750, 50, "watering_can").setScale(0.5);
    this.wateringCan.setInteractive();
    this.wateringCan.on("pointerdown", () => {
        selectedTool = "watering_can";
    });

    // Cuaca (hujan)
    this.weatherText = this.add.text(600, 20, "☀️ Cerah", { fontSize: "20px", fill: "#fff" });

    this.raindrops = this.add.group();

    startRainCycle(this); // Mulai siklus hujan

    // Klik di tanah untuk menanam benih atau menyiram
    this.input.on("pointerdown", (pointer) => {
        if (selectedTool === "hand") {
            plantSeed(this, pointer.x, pointer.y);
        } else if (selectedTool === "watering_can") {
            waterCrops(this, pointer.x, pointer.y);
        }
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

// Fungsi untuk membeli benih di toko
function openShop() {
    if (money >= 5) {
        money -= 5;
        seedsOwned += 1;
        this.moneyText.setText(`💰 Uang: ${money}`);
        this.seedText.setText(`🌱 Benih: ${seedsOwned}`);
    } else {
        alert("💰 Uang tidak cukup untuk membeli benih!");
    }
}

// Fungsi untuk menanam benih
function plantSeed(scene, x, y) {
    if (seedsOwned > 0) {
        seedsOwned -= 1;
        scene.seedText.setText(`🌱 Benih: ${seedsOwned}`);

        const seed = scene.add.image(x, y, "seed");
        seed.growthStage = 0;
        seed.isWatered = false;

        seed.timer = setTimeout(() => {
            if (!seed.isWatered) {
                seed.setTexture("carrot");
                scene.plantedCrops.push(seed);
            }
        }, 6000);

        scene.plantedCrops.push(seed);
    } else {
        alert("🌱 Kamu tidak punya benih! Beli di toko!");
    }
}

// Fungsi untuk menyiram tanaman
function waterCrops(scene, x, y) {
    scene.plantedCrops.forEach((crop) => {
        if (Phaser.Math.Distance.Between(crop.x, crop.y, x, y) < 30 && crop.growthStage === 0) {
            crop.isWatered = true;
            crop.setTexture("sprout");

            setTimeout(() => {
                crop.setTexture("carrot");
                crop.growthStage = 1;
            }, 3000);
        }
    });
}

// Fungsi untuk menjual hasil panen
function sellCrops() {
    let earnings = this.plantedCrops.length * 10;
    money += earnings;
    this.moneyText.setText(`💰 Uang: ${money}`);
    this.plantedCrops = [];
}

// Fungsi untuk memulai siklus hujan
function startRainCycle(scene) {
    let timeUntilRain = Phaser.Math.Between(20000, 40000); // Hujan setiap 20-40 detik

    setTimeout(() => {
        startRain(scene);
        setTimeout(() => stopRain(scene), 5000); // Hujan berlangsung selama 5 detik
        startRainCycle(scene);
    }, timeUntilRain);
}

// Fungsi untuk memulai hujan
function startRain(scene) {
    isRaining = true;
    scene.weatherText.setText("🌧️ Hujan");

    // Efek hujan
    for (let i = 0; i < 50; i++) {
        let drop = scene.raindrops.create(Phaser.Math.Between(0, 800), Phaser.Math.Between(-100, 0), "raindrop");
        scene.physics.add.existing(drop);
        drop.setVelocityY(300);
    }

    // Menyiram otomatis
    scene.plantedCrops.forEach((crop) => {
        if (crop.growthStage === 0) {
            crop.isWatered = true;
            crop.setTexture("sprout");

            setTimeout(() => {
                crop.setTexture("carrot");
                crop.growthStage = 1;
            }, 3000);
        }
    });
}

// Fungsi untuk menghentikan hujan
function stopRain(scene) {
    isRaining = false;
    scene.weatherText.setText("☀️ Cerah");
    scene.raindrops.clear(true, true);
}
