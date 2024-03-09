import { Physics } from "phaser";
import { Sword } from "./Sword";

export class Player extends Physics.Arcade.Sprite{
    speed = 60;


    constructor(scene,x,y, texture = "knight_idle") {
        super(scene,x,y, texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.hp = 100;
        
    

        scene.anims.create({
            key: 'player_idle',
            frameRate: 6,
            repeat: -1,
            frames: scene.anims.generateFrameNumbers("knight_idle",{
                start: 0,
                end: 5
            })
        });

        scene.anims.create({
            key: 'player_run',
            frameRate: 12,
            repeat: -1,
            frames: scene.anims.generateFrameNumbers("knight_run",{
                start: 0,
                end: 5
            })
        });

        this.play("player_idle");

        
        // giu
        scene.input.keyboard.on('keydown-S',()=>{
            this.setVelocityY(this.speed);
            this.updateAnimation();
        });
        scene.input.keyboard.on('keyup-S',()=>{
            this.setVelocityY(0);
            this.updateAnimation();
        });

        // su
        scene.input.keyboard.on('keydown-W',()=>{
            this.setVelocityY(-this.speed);
            this.updateAnimation();
        });
        scene.input.keyboard.on('keyup-W',()=>{
            this.setVelocityY(0);
            this.updateAnimation();
        });

        // sinistra
        scene.input.keyboard.on('keydown-A',()=>{
            this.setVelocityX(-this.speed);
            this.updateAnimation();
            this.setFlipX(true);
        });
        scene.input.keyboard.on('keyup-A',()=>{
            this.setVelocityX(0);
            this.updateAnimation();
            this.setFlipX(false);
        });

         // destra
         scene.input.keyboard.on('keydown-D',()=>{
            this.setVelocityX(this.speed);
            this.updateAnimation();
            this.setFlipX(false);
        });
        scene.input.keyboard.on('keyup-D',()=>{
            this.setVelocityX(0);
            this.updateAnimation();
        });

         //attacco
         scene.input.on('pointerdown',(pointer)=>{
          let attack = new Sword(pointer ,scene, this.x, this.y);
          scene.attacks.push(attack);
        });
    }

    updateAnimation(){
        if(this.body.velocity.x != 0 || this.body.velocity.y != 0){
            this.play("player_run", true);
        }else{
            this.play("player_idle", true);
        }
    }

    takeDamage(damage) {
        this.hp -= damage;
        console.log(this.hp);
    }
}