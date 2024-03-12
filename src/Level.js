import { Scene, Math } from "phaser";
import { Player } from "./Player.js";
import { Fly } from "./enemies/Fly.js";
import { Goblin } from "./enemies/Goblin.js";
import { Slime } from "./enemies/Slime.js";
import { Cloud } from "./Cloud.js";
import { Door } from "./Door.js";
export class Level extends Scene{
    hp1;
    hp2;
    startAnimation;
	targetPosStartAnimation = 64;
	door;
    player;
    enemiesList = [
        () => new Slime(this,Math.Between(0,640),Math.Between(0,360)),
        () => new Goblin(this,Math.Between(0,640),Math.Between(0,360)),
        () => new Fly(this,Math.Between(0,640),Math.Between(0,360)),
    ];
    enemies = [];
    attacks = [];
    immune = false; 
    immuneDuration = 1000; 
    lastCollisionTime = 0;
    

    //serve per inizializzare i dati del livello
    init(){
        this.startAnimation = true
        this.enemies = [];
        this.attacks = [];
    }

    //serve per caricare gli assets uttilizzati in questo livello
    preload(){
        this.load.spritesheet("knight_idle","assets/knight_idle_spritesheet.png", { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet("knight_run","assets/knight_run_spritesheet.png", { frameWidth: 16, frameHeight: 16 });

        this.load.spritesheet("fly","assets/fly_anim_spritesheet.png", { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet("goblin","assets/goblin_run_spritesheet.png", { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet("slime","assets/slime_run_spritesheet.png", { frameWidth: 16, frameHeight: 16 });
        
        this.load.spritesheet("sword","assets/slash_effect_anim_spritesheet.png", { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet("cloud","assets/explosion_anim_spritesheet.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("door", "assets/door.png", { frameWidth: 32, frameHeight: 32 })

		this.load.tilemapTiledJSON("tilemap", "assets/Map.json")
		this.load.image("shooter", "assets/tilesheet.png")
    }

    //serve per costruire il livello
    create(){    
        this.map = this.make.tilemap({ key: "tilemap" })
		this.map.addTilesetImage("shooter")
		this.map.createLayer("Floor", "shooter")
		let wallLayer = this.map.createLayer("Walls", "shooter")
		wallLayer.setCollisionBetween(1, wallLayer.tilesTotal)
		this.map.createLayer("Decorations", "shooter")

		this.player = new Player(this, 320, 0, "player_idle");
        let hp = this.player.hp;
        this.player.setOrigin(0.5, 0.5);
        this.player.setBodySize(8, 10);    
        
        // crea i rettangoli
        const graphics = this.add.graphics()
        this.hp1 = graphics.fillStyle(0x808080).fillRoundedRect(150 * this.cameras.main.zoom, 10 * this.cameras.main.zoom, 50 * this.cameras.main.zoom, 5 * this.cameras.main.zoom, 2).setDepth(0);
        this.hp2 = graphics.fillStyle(0x00ff00).fillRoundedRect(150 * this.cameras.main.zoom, 10 * this.cameras.main.zoom, 50 * this.cameras.main.zoom, 5 * this.cameras.main.zoom, 2).setDepth(1);
    
        // Aggiorna la posizione dei rettangoli in base alla posizione della telecamera e allo zoom
        const cameraX = this.cameras.main.scrollX + 150 * this.cameras.main.zoom;
        const cameraY = this.cameras.main.scrollY + 20 * this.cameras.main.zoom;
        

        // Aggiorna la posizione dei rettangoli
        this.hp1.setPosition(cameraX, cameraY);
        this.hp2.setPosition(cameraX, cameraY);

		this.door = new Door(this, 320, 16, "door");
        
        this.cameras.main.setZoom(2).startFollow(this.player);

        this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => {
                let enemy = this.enemiesList[Math.Between(0,this.enemiesList.length - 1)]()
                this.enemies.push(enemy);

            },
        });

        this.physics.add.collider(this.player, wallLayer);
		this.physics.add.collider(this.player, this.door);
    }


    //rappresenta il game loop
    update(){

        this.updateHPBarWidth(this.player.hp);

        if (this.startAnimation) {
			this.physics.moveTo(this.player, this.player.x, this.targetPosStartAnimation, this.player.speed)
			if (this.player.y >= this.targetPosStartAnimation) {
				this.player.setVelocity(0)
				this.startAnimation = false
				this.player.play("idle")
				this.door.play("door");
			}
		}

        this.enemies.forEach((enemy) => {
            this.physics.moveToObject(enemy, this.player,30);
            if(enemy.x > this.player.x){
                enemy.setFlipX(true);
            }else{
                enemy.setFlipX(false);
            }
        });

        // Controllo dell'immunità dopo la collisione
        if (this.immune && this.time.now > this.lastCollisionTime + this.immuneDuration) {
            // Disabilita l'immunità quando scade la durata
            this.immune = false; 
        }
        
        this.physics.add.collider(this.player, this.enemies, (player, enemy) => {
            if (!this.immune) {
                // Attiva l'immunità dopo la collisione
                this.immune = true; 
                // Aggiorna il tempo dell'ultima collisione
                this.lastCollisionTime = this.time.now; 

                player.takeDamage(enemy.damage);

                this.hp2.width = this.player.hp * this.cameras.main.zoom;
                
                if (this.immune) {
                    this.enemies.forEach(enemy => {
                        enemy.setVelocity(0); 
                    });
                }
                if (player.hp <= 0) {
                    this.scene.restart();
                }
            }
        });

        

        this.physics.add.collider(this.attacks, this.enemies, (attack, enemy) => {
            // Infliggi danni al nemico usando la funzione takeDamage()
            enemy.takeDamage(attack.damage);
        
            // Controlla se il nemico è morto dopo aver subito danni
            if (enemy.hp <= 0) {
                // Se il nemico è morto, crea un effetto visivo (come 'Cloud') e distruggi il nemico
                new Cloud(this, enemy.x, enemy.y);
                enemy.destroy();
        
                // Rimuovi il nemico dalla lista degli avversari
                this.enemies.splice(this.enemies.indexOf(enemy), 1);
            }
        
            // Distruggi l'attacco  dopo la collisione
            attack.destroy();
        
            // Rimuovi l'attacco dalla lista degli attacchi
            this.attacks.splice(this.attacks.indexOf(attack), 1);
        });

        // Impostazione della velocità dei nemici a zero quando il giocatore è immune alla collisione
        if (this.immune) {
            this.enemies.forEach(enemy => {
                enemy.setVelocity(0); 
            });
        }
    }

    // Funzione per aggiornare le dimensioni del rettangolo hp2 in base all'HP del giocatore
    updateHPBarWidth(playerHP) {
        const cameraX = this.cameras.main.scrollX + 10 * this.cameras.main.zoom;
        const cameraY = this.cameras.main.scrollY + 40 * this.cameras.main.zoom;

        const barWidth = 100 * this.cameras.main.zoom;
        
        // Calcola la larghezza della barra HP in base all'HP attuale del giocatore
        const newWidth = (playerHP / 100) * barWidth ;
        const lunghezza = newWidth / 3;

        // Aggiorna le dimensioni e la posizione del rettangolo hp2
        this.hp2.clear();
        this.hp2.fillStyle(0x00ff00);
        this.hp2.fillRoundedRect(cameraX, cameraY, lunghezza, 5 * this.cameras.main.zoom, 5); 
    }
}