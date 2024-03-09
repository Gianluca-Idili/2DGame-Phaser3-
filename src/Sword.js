import { Physics } from "phaser"

export class Sword extends Physics.Arcade.Sprite{

    constructor(pointer, scene,x,y, texture = "sword") {
        super(scene,x,y, texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        scene.physics.moveTo(this ,pointer.worldX, pointer.worldY);

        scene.time.addEvent({
            delay: 3000,
            callback: ()=> this.destroy(),
        });

        scene.anims.create({
            key: "attack",
            repeat: -1,
            frameRate: 3,
            frames: scene.anims.generateFrameNumbers(texture,{
                start: 0,
                end: 2
            }),
        });

        this.play("attack");

        this.damage = 50;
    }
}