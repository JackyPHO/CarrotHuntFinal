class Death extends Phaser.Scene {
    constructor() {
        super("deathScene");
    }
    create(){
        document.getElementById('description').innerHTML = '<h2>Carrot Hunt<br>GAME OVER'
        this.add.image(720,450, "deathscreen");
        this.rKey = this.input.keyboard.addKey('R');
    }
    update(){
        if(Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.scene.start("loadScene");
        }
    }
}