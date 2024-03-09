import { Physics } from "phaser"

export class Slime extends Physics.Arcade.Sprite{

    constructor(scene,x,y, texture = "slime") {
        super(scene,x,y, texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.hp = 100;
        this.setBodySize(10, 8);

        scene.anims.create({
            key: "slime_run",
            repeat: -1,
            frameRate: 6,
            frames: scene.anims.generateFrameNumbers(texture,{
                start: 0,
                end: 5
            }),
        });

        this.play("slime_run");
        this.damage = 20;
    }

    takeDamage(damage) {
        this.hp -= damage;
    }
}