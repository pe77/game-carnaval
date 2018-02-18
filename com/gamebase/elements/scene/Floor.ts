module GameBase
{
    export module Floor
    {
        export class Floor extends Pk.PkElement
        {
            body:Phaser.Sprite;

            constructor(game:Pk.PkGame)
            {
                super(game);
            }

            create()
            {
                this.body = Pk.PkUtils.createSquare(this.game, this.game.world.width, 30);

                this.body.y = this.game.world.height - this.body.height / 2;
                this.body.x = this.game.world.centerX;

                this.game.physics.box2d.enable(this.body);
                this.body.body.static = true;
                this.body.body.setCollisionCategory(GameBase.CollisionCategories.Floor);
            }
        }

    }

}