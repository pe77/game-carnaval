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

            for (var i = 0; i < 6; i++)
                this.load.image('partyboy-' + (i+1), 'assets/default/car/f'+(i+1)+'.png');    
            //

            // gaude
            this.load.image('gaude-bg', 'assets/default/gaude/gaude-bg.png');
            this.load.image('gaude-mark', 'assets/default/gaude/gaude-mark.png');
            this.load.image('gaude-button', 'assets/default/gaude/gaude-button.png');

            // car parts
            this.load.image('car-tire', 'assets/default/car/tire.png');
            this.load.image('car-body', 'assets/default/car/body.png');
            this.load.image('car-platform', 'assets/default/car/platform.png');

            // A
            this.load.image('car-a-tire', 'assets/default/car/a/tire.png');
            this.load.image('car-a-body', 'assets/default/car/a/body.png');
            this.load.image('car-a-platform', 'assets/default/car/a/platform.png');

            // B
            this.load.image('car-b-tire', 'assets/default/car/b/tire.png');
            this.load.image('car-b-body', 'assets/default/car/b/body.png');
            this.load.image('car-b-platform', 'assets/default/car/b/platform.png');

            // C
            this.load.image('car-c-tire', 'assets/default/car/a/tire.png');
            this.load.image('car-c-body', 'assets/default/car/a/body.png');
            this.load.image('car-c-platform', 'assets/default/car/a/platform.png');

            // D
            this.load.image('car-d-tire', 'assets/default/car/d/tire.png');
            this.load.image('car-d-body', 'assets/default/car/d/body.png');
            this.load.image('car-d-platform', 'assets/default/car/d/platform.png');

            
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
