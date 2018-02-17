/// <reference path='../../pkframe/refs.ts' />

module GameBase
{

	export class Main extends Pk.PkState {
 
		enterKey:Phaser.Key;



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
            this.stage.disableVisibilityChange = true;
			
			
		}

		playSound()
        {
            // play music
        }


		render()
        {
             this.game.debug.text('Main Screen', this.game.world.centerX, 35);
        }
		
		
		// calls when leaving state
        shutdown()
        {
            
        }

    }

}