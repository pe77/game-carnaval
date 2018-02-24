module GameBase
{
    export module Car
    {
        export class CarC extends Car
        {
            

            constructor(game:Pk.PkGame)
            {
                super(game);

                this.bodySpriteKey      = 'car-c-body';
                this.platformSpriteKey  = 'car-c-platform';
                this.tireSpriteKey      = 'car-c-tire';
            }

        }

    }

}