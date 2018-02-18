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

    export module CollisionCategories
    {
        export const Car:number = 6;
        export const Player:number = 1;
        export const PowerUps:number = 2;
        export const Floor:number = 3;
        export const Die:number = 4;
        export const Banner:number = 5;
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


            this.initialState = 'Main';
        }
    }
    
 
} 