class Level1 extends Phaser.Scene {
    constructor() {
        super("Level1Scene");
    }

    init() {
        // variables and settings
        this.ACCELERATION = 150;
        this.DRAG = 1200;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -600;
        this.PARTICLE_VELOCITY = 50;
        this.SCALE = 2.0;
        this.myScore = 0;
        this.lr = [];
        this.dtemp = 0;
        this.secret = false;
        my.sprite.spike = [];
        this.timer = 0;
        this.seconds = 30;
        this.deathMode = false;
        my.lives.length = 0;
    }
    preload(){
        this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles')    }   
    create() {
        document.getElementById('description').innerHTML = '<h2>Carrot Hunt<br>A: left // D: right // Space: jump // R: Restart Game<br>Can you find the Secret Stage?'
        this.step = this.sound.add('step').setRate(2).setVolume(0.25);
        this.eat = this.sound.add('eat').setVolume(0.25);
        this.jump = this.sound.add('jump').setVolume(0.25);
        this.lose = this.sound.add('lose').setRate(2).setVolume(0.25);
        this.ss = this.sound.add('ss').setVolume(0.25);
        this.add.image(4500,405, "bg");

        this.map = this.add.tilemap("platformer-level-1", 18, 18, 500, 45);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage("tilemap_packed", "tilemap_tiles");
        
        this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tileset, 0, 0);

        this.animatedTiles.init(this.map);

        this.groundLayer.setCollisionByProperty({
            collides: true
        });

        this.carrot = this.map.createFromObjects("Objects", {
            name: "carrot",
            key: "tilemap_sheet",
        });

        this.wcarrot = this.map.createFromObjects("Objects", {
            name: "seclev",
            key: "tilemap_sheet",
        });
        this.rose = this.map.createFromObjects("Objects", {
            name: "rose",
            key: "tilemap_sheet",
            frame: 57
        });

        this.anims.play('grow',this.carrot);
        this.anims.play('secgrow',this.wcarrot);

        this.physics.world.setBounds(0, -100, 2700, 1015);

        this.physics.world.enable(this.carrot, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.wcarrot, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.rose, Phaser.Physics.Arcade.STATIC_BODY);
        this.carrotGroup = this.add.group(this.carrot);
        this.wcarrotGroup = this.add.group(this.wcarrot);
        this.roseGroup = this.add.group(this.rose);


        my.sprite.player = this.physics.add.sprite(45, 750, "bunny", "bunny2_stand.png").setScale(0.175);
        my.sprite.player.setCollideWorldBounds(true);

        my.sprite.spike.push(this.physics.add.sprite(1300, 380, "bunny", "spikeMan_stand.png").setScale(0.175));
        this.lr.push(true);

        my.sprite.spike.push(this.physics.add.sprite(2000, 504, "bunny", "spikeMan_stand.png").setScale(0.175));
        this.lr.push(true);

        my.sprite.spike.push(this.physics.add.sprite(2095, 702, "bunny", "spikeMan_stand.png").setScale(0.175));
        this.lr.push(true);

        my.sprite.spike.push(this.physics.add.sprite(256, 756, "bunny", "spikeMan_stand.png").setScale(0.175));
        this.lr.push(true);

        this.physics.add.collider(my.sprite.player, this.groundLayer);

        for(let spiker of my.sprite.spike){
            this.physics.add.collider(spiker, this.groundLayer);
        }

        my.text.score = this.add.text(1000, 235).setText(this.myScore + '/42').setScrollFactor(0).setColor(0xff0000);
        this.add.image(1060, 240, 'crrt').setScale(0.3).setScrollFactor(0);

        my.sprite.heart1 = this.add.sprite(375, 240, "heart").setScale(0.7).setScrollFactor(0);
        my.sprite.heart2 = this.add.sprite(395, 240, "heart").setScale(0.7).setScrollFactor(0);
        my.sprite.heart3 = this.add.sprite(415, 240, "heart").setScale(0.7).setScrollFactor(0);
        my.sprite.heart4 = this.add.sprite(435, 240, "heart").setScale(0.7).setScrollFactor(0);
        my.sprite.heart5 = this.add.sprite(455, 240, "heart").setScale(0.7).setScrollFactor(0);
        my.lives.push(0);
        my.lives.push(0);
        my.lives.push(0);

        this.physics.add.overlap(my.sprite.player, this.carrotGroup, (obj1, obj2) => {
            this.myScore+=1;
            obj2.destroy(); // remove coin on overlap
            my.text.score.setText(this.myScore + '/42');
            this.eat.play();
        });
        this.physics.add.overlap(my.sprite.player, this.wcarrotGroup, (obj1, obj2) => {
            obj2.destroy();
            this.ss.play();
            this.secret = true;
            my.text.second = this.add.text(675, 375).setText('Timer ' + this.seconds).setScrollFactor(0).setColor(0xff0000);
            my.sprite.player.x = 45;
            my.sprite.player.y = 50;
        });
        this.physics.add.overlap(my.sprite.player, this.roseGroup, (obj1, obj2) => {
            obj2.destroy();
            this.ss.play();
            my.lives.push(0);
            my.lives.push(0);
            this.softReset();
        });

        cursors = this.input.keyboard.createCursorKeys();

        this.physics.world.debugGraphic.clear()

        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.rKey = this.input.keyboard.addKey('R');
        this.enter = this.input.keyboard.addKey('ENTER');

        this.physics.world.drawDebug = false;

        my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
            frame: ['twirl_02.png', 'twirl_03.png'],
            scale: {start: 0.03, end: 0.1},
            random: true,
            lifespan: 350,
            maxAliveParticles: 8,
            alpha: {start: 1, end: 0.1}, 
            gravityY: -400,
        });

        my.vfx.jumping = this.add.particles(0, 0, "kenny-particles", {
            frame: ['muzzle_04.png', 'muzzle_05.png'],
            scale: {start: 0.03, end: 0.1},
            lifespan: 350,
            maxAliveParticles: 4,
            alpha: {start: 1, end: 0.1}, 
        });

        my.vfx.walking.stop();
        my.vfx.jumping.stop();

        this.cameras.main.setBounds(0, 360, 2700, 450);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(2);

    }

    update() {
        if (this.left.isDown) {
            my.sprite.player.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            my.vfx.walking.setParticleScale(0.5, 0.5);
            if (my.sprite.player.body.blocked.down) {
                if (!this.step.isPlaying){
                    this.step.play();
                }
                my.vfx.walking.start();
            }

        } else if(this.right.isDown) {
            my.sprite.player.setAccelerationX(this.ACCELERATION);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            my.vfx.walking.setParticleScale(0.25, 0.25);
            if (my.sprite.player.body.blocked.down) {
                if (!this.step.isPlaying){
                    this.step.play();
                }
                my.vfx.walking.start();
            }
        } else {
            // Set acceleration to 0 and have DRAG take over
            my.sprite.player.setAccelerationX(0);
            my.sprite.player.setDragX(this.DRAG);
            my.sprite.player.anims.play('idle');
            my.vfx.walking.stop();
            my.vfx.jumping.stop();
        }

        if(!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
        }

        if(Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.scene.stop('Level1Scene');
            this.scene.start('loadScene');
        }
        if(Phaser.Input.Keyboard.JustDown(this.enter)) {
            console.log(my.sprite.player.x)
            console.log(my.sprite.player.y)
        }

        if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.space)) {
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
            my.vfx.jumping.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            my.vfx.jumping.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            my.vfx.jumping.start();
            this.jump.play();
        }
        for(let spiker of my.sprite.spike){
            const i = my.sprite.spike.indexOf(spiker);
            if(this.lr[i] == true){
                spiker.setAccelerationX(-50);
                spiker.setFlip(true, false);
                spiker.anims.play('npc', true);
                if(spiker.body.blocked.left){
                    this.lr[i] = false;
                }
            }
            if(this.lr[i] == false){
                spiker.setAccelerationX(50);
                spiker.resetFlip();
                spiker.anims.play('npc', true);
                if(spiker.body.blocked.right){
                    this.lr[i] = true;
                }
            }
            if(this.collides(spiker, my.sprite.player)){
                my.sprite.player.y = 1000
            }
        }
        if(this.secret==true){
            document.getElementById('description').innerHTML = '<h2>Carrot Hunt<br>Secret Level: Collect the rose at the end to earn TWO extra lives<br>A: left // D: right // Space: jump // R: Restart Game'
            this.physics.world.setBounds(0, -100, 9000, 500);
            this.cameras.main.setBounds(0, 0, 9000, 180);
            this.cameras.main.setZoom(5);
            this.timer++;
            if (this.timer % 250 == 0){
                this.seconds -= 1;
                my.text.second.setText('Timer ' + this.seconds);
            }
            if (this.seconds == 0){
                this.softReset();
            }
        }

        if(my.sprite.player.y > 810){
            this.deathMode = true;
        }
        if(this.deathMode == true){
            this.dtemp++;
            this.lose.play();
            if(this.dtemp % 299 == 0){
                my.sprite.player.x = 45;
                my.sprite.player.y = 750;
                this.dtemp=0;
                my.lives.pop();
                this.deathMode = false
            }
        }
        if(my.lives.length == 5){
            my.sprite.heart1.visible = true;
            my.sprite.heart2.visible = true;
            my.sprite.heart3.visible = true;
            my.sprite.heart4.visible = true;
            my.sprite.heart5.visible = true;
        }
        if(my.lives.length == 4){
            my.sprite.heart1.visible = true;
            my.sprite.heart2.visible = true;
            my.sprite.heart3.visible = true;
            my.sprite.heart4.visible = true;
            my.sprite.heart5.visible = false;
        }
        if(my.lives.length == 3){
            my.sprite.heart1.visible = true;
            my.sprite.heart2.visible = true;
            my.sprite.heart3.visible = true;
            my.sprite.heart4.visible = false;
            my.sprite.heart5.visible = false;
        }
        if(my.lives.length == 2){
            my.sprite.heart1.visible = true;
            my.sprite.heart2.visible = true;
            my.sprite.heart3.visible = false;
            my.sprite.heart4.visible = false;
            my.sprite.heart5.visible = false;
        }
        if(my.lives.length == 1){
            my.sprite.heart1.visible = true;
            my.sprite.heart2.visible = false;
            my.sprite.heart3.visible = false;
            my.sprite.heart4.visible = false;
            my.sprite.heart5.visible = false;
        }
        if(my.lives.length == 0){
            this.scene.start("deathScene");
        }

        if(this.myScore == 42){
            this.scene.start("EndScene");
        }
    }
    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }
    softReset(){
        document.getElementById('description').innerHTML = '<h2>Carrot Hunt<br>A: left // D: right // Space: jump // R: Restart Game'
        this.physics.world.setBounds(0, -100, 2700, 1015);
        this.cameras.main.setBounds(0, 360, 2700, 450);
        this.cameras.main.setZoom(2);
        my.sprite.player.x = 45;
        my.sprite.player.y = 750;
        my.text.second.y = -100;
        this.secret=false;
    }
}
