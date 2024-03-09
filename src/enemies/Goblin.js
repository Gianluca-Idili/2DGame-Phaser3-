import { Physics } from "phaser";

export class Goblin extends Physics.Arcade.Sprite{
    constructor(scene,x,y,texture = "goblin"){
        super(scene,x,y,texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.hp = 100;
        this.setBodySize(8, 10);

        scene.anims.create({
            key: "goblin_run",
            repeat: -1,
            frameRate: 6,
            frames: scene.anims.generateFrameNumbers(texture,{
                start: 0,
                end: 5
            }),
        });

        this.play("goblin_run");
        this.damage = 20;
    }

    takeDamage(damage) {
        this.hp -= damage;
    }
}