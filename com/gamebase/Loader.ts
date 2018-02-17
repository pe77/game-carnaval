/// <reference path='../pkframe/refs.ts' />

module GameBase {

    export class Preloader  extends Pk.PkLoaderPreLoader {

        preload()
        {
            // utils / vendor
            this.load.script('WebFont', 'com/gamebase/vendor/webfontloader.js');

            // load game loading bar
            // this.load.image('game-loading-bar', 'assets/states/loader/images/loading-bar.png');

            // load game loading logo
            // this.load.image('game-loading-logo', 'assets/states/loader/images/logo.png');
        }

    }
 
    export class Loader extends Pk.PkLoader implements Pk.I.Loader {

        loadingBar:Phaser.Sprite;
        logo:Phaser.Sprite;
        loadingText:Phaser.Text;
        
        init()
        {
            super.init();
        }

        preload()
        {
            // ignore preloading bar
            // super.preload();

            // creating sprites from preloadead images
            // this.logo           = this.add.sprite(0, 0, 'game-loading-logo');
            
            // create custom loading bar
            this.loadingBar = Pk.PkUtils.createSquare(this.game, this.game.width, 20, "#ffffff");

            // set sprite as preloading
            this.load.setPreloadSprite(this.loadingBar);

            // pos loading bar on bot
            this.loadingBar.y = this.world.height - this.loadingBar.height - 50;

            this.loadingText = this.game.add.text(0, 0,
				'0%', // text
				{
					font: "120px Love Story Rough",
					fill: "#ffffff"
				} // font style
			);
            this.loadingText.anchor.set(.5, .5);

            this.loadingText.x = this.world.centerX;
            this.loadingText.y = this.world.centerY;

            // fileComplete
            // this.fil
            this.game.load.onFileComplete.add((progress:number)=>{
                var v:number = Math.round((progress * 0.01) * 100);
                this.loadingText.text = v + '%';
            }, this)


            //  ** ADDING Other things  ** //

            // scripts
            this.load.script('gray', 'assets/default/scripts/filters/Gray.js')


            // intro
            this.load.image('intro-jam', 'assets/states/intro/images/jam.png');
            this.load.image('intro-phaser', 'assets/states/intro/images/phaser.png');
            
            // this.load.image('cinematic-bg', 'assets/states/intro/images/cinematic-bg.jpg');
            // this.load.audio('intro-sound', 'assets/states/intro/sounds/intro.mp3');
            // this.load.spritesheet('char1-idle', 'assets/default/images/chars/heroes/1/iddle.png', 158, 263, 12);
            
        }

        create()
        {
            super.create();
        }
    }
 
}
