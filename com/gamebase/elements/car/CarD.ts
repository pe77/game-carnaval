module GameBase
{
    export module Car
    {
        export class CarD extends Car
        {
            

            constructor(game:Pk.PkGame)
            {
                super(game);

                this.bodySpriteKey      = 'car-d-body';
                this.platformSpriteKey  = 'car-d-platform';
                this.tireSpriteKey      = 'car-d-tire';
                this.platformsTotal     = 4;

                this.defense = 3;
                this.damage = [1, 4];
            }

        }

    }

}