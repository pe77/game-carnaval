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

                this.platformsTotal     = 1;
                this.defense            = 3;
                this.damage             = [3,3];
            }

        }

    }

}