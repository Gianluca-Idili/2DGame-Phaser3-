import { Physics } from "phaser";

export class Door extends Physics.Arcade.Sprite {

	constructor(scene, x, y, texture) {
		super(scene, x, y, texture);
        this.setFrame(13)
		scene.add.existing(this);
		scene.physics.add.existing(this);
        this.setPushable(false)
        

		if (!scene.anims.exists("door")) {
			scene.anims.create({
				key: "door",
				frames: scene.anims.generateFrameNumbers(texture, {
					start: 13,
					end: 0,
				}),
				frameRate: 13,
			});
		}

	}
}