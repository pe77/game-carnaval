/// <reference path='../pkframe/refs.ts' />
 
module GameBase {
 
    export class Game extends Pk.PkGame {
 
        constructor() {

            super(new Config()); 

            // add default state
            this.state.add('Main', GameBase.Main);
            this.state.add('Intro', GameBase.Intro);

        }
    }
 
    class Config extends Pk.PkConfig
    {

        constructor()
        {
            super();

            // loading load screen assets (logo, loading bar, etc) [pre-preloading]
            this.preLoaderState = Preloader;

            // loading all* game assets
            this.loaderState = Loader;

            // this.canvasSize = ["100%", 720];
            this.canvasSize = [800, 600];


            this.initialState = 'Intro';
        }
    }
    
 
} 