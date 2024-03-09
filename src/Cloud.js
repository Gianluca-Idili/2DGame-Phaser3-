import { Physics } from "phaser"

export class Cloud extends Physics.Arcade.Sprite{

    constructor(scene,x,y, texture = "cloud") {
        super(scene,x,y, texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);


        scene.time.addEvent({
            delay: 1000,
            callback: ()=> this.destroy(),
        });

        scene.anims.create({
            key: "explosion",
            repeat: -1,
            frameRate: 7,
            frames: scene.anims.generateFrameNumbers(texture,{
                start: 0,
                end: 6
            }),
        });

        this.play("explosion");
    }
}