class End extends Phaser.Scene {
    constructor() {
        super("EndScene");
    }
    create(){
        document.getElementById('description').innerHTML = '<h2>Carrot Hunt<br>YOU WIN'
        this.add.image(720,450, "win");
        this.rKey = this.input.keyboard.addKey('R');
    }
    update(){
        if(Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.scene.start("loadScene");
        }
    }
}