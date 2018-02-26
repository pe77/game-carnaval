module GameBase
{
    export module Car
    {
        export class CarE extends Car
        {
            

            constructor(game:Pk.PkGame)
            {
                super(game);

                this.bodySpriteKey      = 'car-e-body';
                this.platformSpriteKey  = 'car-e-platform';
                this.tireSpriteKey      = 'car-e-tire';

                this.damage             = [1,6];
            }

        }

    }

}