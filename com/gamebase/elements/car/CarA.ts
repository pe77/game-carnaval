module GameBase
{
    export module Car
    {
        export class CarA extends Car
        {
            

            constructor(game:Pk.PkGame)
            {
                super(game);

                this.bodySpriteKey      = 'car-a-body';
                this.platformSpriteKey  = 'car-a-platform';
                this.tireSpriteKey      = 'car-a-tire';

                this.damage             = [1,1];
            }

        }

    }

}