/// <reference path='../../pkframe/refs.ts' />

module GameBase
{

	export class Main extends Pk.PkState {
 
		enterKey:Phaser.Key;

		floor:Floor.Floor;

		battle:Battle.Battle;

		playerCar:Car.Car;
		enemies:Array<Car.Car> = [];

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
			this.playerCar = new Car.CarA(this.game);
			this.playerCar.playerCar = true;
			this.playerCar.name = 'Carro 1';
			// this.playerCar.damage = [100, 100];

			// inimigos
			var enemy1 = new Car.CarB(this.game);
			enemy1.direction = -1;
			enemy1.name = 'Inimigo 1';

			var enemy2 = new Car.CarC(this.game);
			enemy2.direction = -1;
			enemy2.name = 'Inimigo 2';

			var enemy3 = new Car.CarD(this.game);
			enemy3.direction = -1;
			enemy3.name = 'Inimigo 3';

			this.enemies.push(enemy1);
			this.enemies.push(enemy2);
			this.enemies.push(enemy3);

			// evento de fim de batalha
			this.battle.event.add(Battle.E.BattleEvent.OnEnd, (e, winner:Car.Car)=>{
				
				if(winner)
					console.log('O vencedor foi o carro ', winner.name);
				else
					console.log('Empate')
				//

				// se o jogador ganhou, começa a proxima batalha
				if(winner && winner.getId() == this.playerCar.getId())
					this.nextBattle();
				//

			}, this);

			// começa as paradas
			this.nextBattle()
		}

		nextBattle()
		{
			console.log('-- NEXT BATTLE -- ');

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

			// se existir outro inimigo
			if(nextEnemy)
			{
				console.log(this.playerCar.name, ':: x ::', this.enemies[i].name);
				this.battle.start(this.playerCar, nextEnemy);
			}else{
				alert('GANHOU, SEU LINDO!')
			}
			
			
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