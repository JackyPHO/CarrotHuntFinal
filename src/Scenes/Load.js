class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }
    preload() {

        this.load.setPath("./assets/");

        // Load characters spritesheet
        this.load.atlas("bunny", "bunny.png", "bunny.json");

        // Load tilemap information
        this.load.image("tilemap_tiles", "tilemap_packed.png");                         // Packed tilemap
        this.load.image("bg", "bg.png");
        this.load.image("sbg", "sbg.png");
        this.load.image("win", "over.png");
        this.load.image("crrt", "carrot.png");
        this.load.image("heart", "heart.png");
        this.load.image("Title", "title.png");
        this.load.image("deathscreen", "death.png");
        this.load.tilemapTiledJSON("platformer-level-1", "platformer-level-1.tmj");   // Tilemap in JSON
        this.load.tilemapTiledJSON("secret-level", "secret-level.tmj");

        // Load the tilemap as a spritesheet
        this.load.spritesheet("tilemap_sheet", "tilemap_packed.png", {
            frameWidth: 18,
            frameHeight: 18
        });

        this.load.bitmapFont("MCtext", "Minecraftia_0.png", "Minecraftia.fnt");
        this.load.audio('step', ["step.ogg"]);
        this.load.audio('eat', ["powerUp2.ogg"]);
        this.load.audio('ss', ["powerUp3.ogg"]);
        this.load.audio('jump', ["phaseJump1.ogg"]);
        this.load.audio('lose', ["lowDown.ogg"]);
        this.load.audio('lose', ["lowDown.ogg"]);

        // Oooh, fancy. A multi atlas is a texture atlas which has the textures spread
        // across multiple png files, so as to keep their size small for use with
        // lower resource devices (like mobile phones).
        // kenny-particles.json internally has a list of the png files
        // The multiatlas was created using TexturePacker and the Kenny
        // Particle Pack asset pack.
        this.load.multiatlas("kenny-particles", "kenny-particles.json");

    }

    create() {
        document.getElementById('description').innerHTML = '<h2>Carrot Hunt<br>Collect all the carrots to win the game'
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('bunny', {
                prefix: "bunny2_walk",
                start: 1,
                end: 2,
                suffix:".png"
            }),
            frameRate: 15,
            repeat: -1
        });
        this.anims.create({
            key: 'npc',
            frames: this.anims.generateFrameNames('bunny', {
                prefix: "spikeMan_walk",
                start: 1,
                end: 2,
                suffix:".png"
            }),
            frameRate: 15,
            repeat: -1
        });


        this.anims.create({
            key: 'idle',
            defaultTextureKey: "bunny",
            frames: [
                { frame: "bunny2_stand.png" }
            ],
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            defaultTextureKey: "bunny",
            frames: [
                { frame: "bunny2_jump.png" }
            ],
        });

        this.anims.create({
            key: 'grow',
            frames: this.anims.generateFrameNumbers('tilemap_sheet', { frames: [56, 72]}),
            frameRate: 2,
            repeat: -1
        });
        this.anims.create({
            key: 'secgrow',
            frames: this.anims.generateFrameNumbers('tilemap_sheet', { frames: [42, 43]}),
            frameRate: 2,
            repeat: -1
        });
        this.enter = this.input.keyboard.addKey('ENTER');
        this.add.image(720,450, "Title");
    }
    update() {
        if(Phaser.Input.Keyboard.JustDown(this.enter)) {
            this.scene.start("Level1Scene");
        }
    }
}