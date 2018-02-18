/// <reference path='../../pkframe/refs.ts' />

module GameBase
{

	export class Main extends Pk.PkState {
 
		enterKey:Phaser.Key;

		floor:Floor.Floor;

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
			this.game.physics.box2d.setBoundsToWorld();

			// chão
			this.floor = new Floor.Floor(this.game);
			this.floor.create();

			// chão
			var car1 = new Car.Car(this.game);
			car1.name = 'Carro 1';
			car1.motorSpeed = 100;
			car1.create(new Phaser.Point(100, 200));

			var car2 = new Car.Car(this.game);
			car2.direction = -1;
			car2.name = 'Carro 2';
			car2.create(new Phaser.Point(this.game.world.width, 200));
			
		}

		playSound()
        {
            // play music
        }


		render()
        {
			this.game.debug.box2dWorld();
            this.game.debug.text('Main Screen', this.game.world.centerX, 35);
        }
		
		
		// calls when leaving state
        shutdown()
        {
            
        }

    }

}