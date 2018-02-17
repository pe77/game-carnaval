/// <reference path='../../pkframe/refs.ts' />

module GameBase
{

	export class Intro extends Pk.PkState {
 
		enterKey:Phaser.Key;

        jam:Phaser.Sprite;
        phaser:Phaser.Sprite;
        henrique:Phaser.Sprite;
        magrao:Phaser.Sprite;
        andrezito:Phaser.Sprite;

		musicBG:Phaser.Sound;

		init(...args:any[])
		{
			super.init(args); // if whant override init, you need this line!
		}

    	create()
    	{
			super.create();

    		// change state bg
            this.game.stage.backgroundColor = "#000";

			// prevent stop update when focus out
            this.stage.disableVisibilityChange = true;

			// audio
            this.musicBG = this.game.add.audio('intro-audiobg');
            this.musicBG.onDecoded.add(this.playSound, this); // load

            this.phaser = this.game.add.sprite(0, 0, 'intro-phaser');
            this.phaser.alpha = 0;

            this.phaser.anchor.set(.5, .5);
            this.phaser.x = this.game.world.centerX;
            this.phaser.y = this.game.world.centerY;

            this.jam = this.game.add.sprite(0, 0, 'intro-jam');
            this.jam.alpha = 0;

            this.jam.anchor.set(.5, .5);
            this.jam.x = this.game.world.centerX;
            this.jam.y = this.game.world.centerY;

            this.alphaInOut(this.phaser, ()=>{
                this.alphaInOut(this.jam, ()=>{
                    this.transition.change('Main');
                });
            });

		}


        alphaInOut(object, callBack:Function)
        {
            var tween:Phaser.Tween = this.game.add.tween(object).to(
                {
                    alpha:1
                }, 
                1000, 
                Phaser.Easing.Linear.None, true
            );

            tween.onComplete.add(()=>{
                
              var tween:Phaser.Tween = this.game.add.tween(object).to(
                    {
                        alpha:0
                    }, 
                    1000, 
                    Phaser.Easing.Linear.None, true, 3000
              );  

              tween.onComplete.add(()=>{
                  callBack();
              }, this);

            }, this);
        }

		playSound()
        {
            // play music
			// this.musicBG.play('', 0, 0.6, true);
        }

		// calls when leaving state
        shutdown()
        {
        }

    }

}