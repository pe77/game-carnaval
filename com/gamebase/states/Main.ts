/// <reference path='../../pkframe/refs.ts' />

module GameBase
{

	export class Main extends Pk.PkState {
 
		enterKey:Phaser.Key;

		floor:Floor.Floor;

		battle:Battle.Battle;

		playerCar:Car.Car;
		enemies:Array<Car.Car> = [];

		musicBG:Phaser.Sound;


		audioWin:Phaser.Sound;
		audioLose:Phaser.Sound;


		upgradeScreen:UpgradeScreen.UpgradeScreen


		init(...args:any[])
		{
			super.init(args); // if whant override init, you need this line!
		}

    	create()
    	{
			super.create();

    		// change state bg
            this.game.stage.backgroundColor = "#938da0";

			// prevent stop update when focus out
            // this.stage.disableVisibilityChange = true;

			// bg
			var bg:Phaser.Sprite = this.game.add.sprite(0, 0, 'main-bg')
			console.log('bg:', bg.width, bg.height)
			console.log('gamwww:', this.game.world.width, this.game.world.height)
			// bg.y -= 30;

			// Enable Box2D physics
			this.game.physics.startSystem(Phaser.Physics.BOX2D);
			this.game.physics.box2d.gravity.y = 500;
			this.game.physics.box2d.restitution = 0.3;
			
			this.game.physics.box2d.debugDraw.joints = true;
			this.game.physics.box2d.setBoundsToWorld();

			// chão
			this.floor = new Floor.Floor(this.game);
			this.floor.create();

			// gerenciador da batalha
			this.battle = new Battle.Battle(this.game);

			// carro do jogador
			this.playerCar = new Car.CarE(this.game);
			this.playerCar.playerCar = true;
			this.playerCar.name = 'Carro 1';
			// this.playerCar.damage = [100, 100];

			// inimigos
			var enemy0 = new Car.CarA(this.game);
			enemy0.direction = -1;
			enemy0.name = 'Inimigo 0';

			var enemy1 = new Car.CarB(this.game);
			enemy1.direction = -1;
			enemy1.name = 'Inimigo 1';

			var enemy2 = new Car.CarC(this.game);
			enemy2.direction = -1;
			enemy2.name = 'Inimigo 2';

			var enemy3 = new Car.CarD(this.game);
			enemy3.direction = -1;
			enemy3.name = 'Inimigo 3';

			this.enemies.push(enemy0);
			this.enemies.push(enemy1);
			this.enemies.push(enemy2);
			this.enemies.push(enemy3);



			// particulas
			// scene particles
			var front_emitter = this.game.add.emitter(this.game.world.width, -32, 600);
			front_emitter.makeParticles(['particle-1', 'particle-3', 'particle-2']);
			front_emitter.maxParticleScale = 0.4;
			front_emitter.minParticleScale = 0.2;
			front_emitter.setYSpeed(20, 160);
			front_emitter.setXSpeed(-20, -100);
			front_emitter.gravity = 0;
			front_emitter.width = this.game.world.width * 1.5;
			front_emitter.minRotation = 5;
			front_emitter.maxRotation = 40;

			front_emitter.start(false, 14000, 20);

			// evento de fim de batalha
			this.battle.event.add(Battle.E.BattleEvent.OnEnd, (e, winner:Car.Car)=>{
				
				if(winner)
					console.log('O vencedor foi o carro ', winner.name);
				else
					console.log('Empate')
				//

				// se o jogador ganhou, começa a proxima batalha
				if(winner && winner.getId() == this.playerCar.getId())
				{
					// se ainda houver inimigo
					if(this.getNextEnemy())
					{
						// abre o seletor de upgrade
						this.upgradeScreen.open();
					}else{
						this.win();
					}
					
					
				}
				else
				{
					this.lose();
				}
					
				//	

			}, this);

			// musica de fundo 
			this.musicBG = this.game.add.audio('audio-battle-bg');

			// registra os sfx
			this.audioWin 	= this.game.add.audio('audio-battle-win');
			this.audioLose 	= this.game.add.audio('audio-battle-lose');

			this.upgradeScreen = new UpgradeScreen.UpgradeScreen(this.game);
			this.upgradeScreen.create();
			this.upgradeScreen.event.add(GameBase.UpgradeScreen.E.UpgradeEvent.OnSelect, (e, data)=>{

				// aplica o upgrade no carro 
				switch(data)
				{
					case 1:
						console.log('UPGRADE ATAQUE')
						this.playerCar.upgradeAttack(); 
						break;

					case 2:
						console.log('UPGRADE DEFESA')
						this.playerCar.upgradeDefense(); 
						break;

					case 3:
						console.log('UPGRADE MINIONS')
						this.playerCar.upgradeHealth();
						break;
				}

				// espera um pouco e toca o proximo
				this.nextBattle();
				
			}, this);

			// começa as paradas
			this.nextBattle();
		}

		nextBattle()
		{
			console.log('-- NEXT BATTLE -- ');

			// pega o carro do jogador + p proximo inimigo vivo
			var nextEnemy:Car.Car = this.getNextEnemy();

			// se existir outro inimigo
			if(nextEnemy)
				this.battle.start(this.playerCar, nextEnemy); // começa
			//

			
			// se a musica de fundo não estiver rolando, roda
			if(!this.musicBG.isPlaying)
				this.musicBG.play('', 0, 1.0, true);
			//
		}

		getNextEnemy():Car.Car
		{
			// pega o carro do jogador + p proximo inimigo vivo
			var nextEnemy:Car.Car;
			for(var i in this.enemies)
			{
				if(!this.enemies[i].alive)
					continue;
				//

				nextEnemy = this.enemies[i];

				break;
			}

			return nextEnemy;
		}

		win()
		{
			this.musicBG.fadeOut(200);
			this.audioWin.play('', 0, 1);

			// 
			console.log('WIN SCREEN')

			var endScreen:Phaser.Sprite = this.game.add.sprite(0, 0, 'game-end-win');
			endScreen.anchor.set(0.5, 0.5);

			endScreen.x = this.game.world.centerX;
			endScreen.y = this.game.world.centerY;

			this.game.add.tween(endScreen).from(
				{
					y:endScreen.y-800
				}, 
				2500, 
				Phaser.Easing.Bounce.Out, 
				true
			).onComplete.add(()=>{
				console.log('END TWEEN WIN SCREEN')
			}, this);

		}

		lose()
		{
			this.musicBG.fadeOut(200);
			this.audioLose.play('', 0, 1);

			var endScreen:Phaser.Sprite = this.game.add.sprite(0, 0, 'game-end-lose');
			endScreen.anchor.set(0.5, 0.5);

			endScreen.x = this.game.world.centerX;
			endScreen.y = this.game.world.centerY;

			this.game.add.tween(endScreen).from(
				{
					y:endScreen.y-800
				}, 
				2500, 
				Phaser.Easing.Bounce.Out, 
				true
			).onComplete.add(()=>{
				console.log('END TWEEN WIN SCREEN')
			}, this);

			endScreen.inputEnabled = true;
            endScreen.input.useHandCursor = true;

			endScreen.events.onInputDown.add(()=>{
				window.location.reload();
			}, this);

		}

		playSound()
        {
            // play music
        }


		render()
        {
			// this.game.debug.box2dWorld();
            this.game.debug.text('Já bebeu agua hoje?', this.game.world.centerX, 35);
			
        }
		
		
		// calls when leaving state
        shutdown()
        {
            
        }

    }

}