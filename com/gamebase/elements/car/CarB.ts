module GameBase
{
    export module Car
    {
        export class CarB extends Car
        {
            

            constructor(game:Pk.PkGame)
            {
                super(game);

                this.bodySpriteKey      = 'car-b-body';
                this.platformSpriteKey  = 'car-b-platform';
                this.tireSpriteKey      = 'car-b-tire';
            }

        }

    }

}