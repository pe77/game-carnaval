module GameBase
{
    export module PartyBoy
    {
        export class PartyBoy extends Pk.PkElement
        {
            car:Car.Car;
            base:Phaser.Sprite;
            body:Phaser.Physics.Box2D.Body;
            joint:any;

            spriteKey:string = 'partyboy-1';
            death:boolean = false;

            constructor(game:Pk.PkGame)
            {
                super(game);
            }

            build(position:number, platformBody:Phaser.Physics.Box2D.Body)
            {
                this.base = this.game.add.sprite(platformBody.x, 10, this.spriteKey);
                // this.base.width = 20;
                // this.base.height = 40;
                
                this.game.physics.box2d.enable(this.base);
                this.body = this.base.body;
                
                this.body.sensor = true;
                this.body.mass = 0.1;
                
                this.joint = this.game.physics.box2d.weldJoint(platformBody, this.body, position, -(this.base.height/2) + 10, 0, this.base.height / 2, 3, 0.3);
            }

            kill()
            {
                // se já matou.. não mata
                if(this.death)
                    return;
                //

                this.death = true; // salva que já matou

                // remove o vinculo
                this.game.physics.box2d.world.DestroyJoint(this.joint);

                // chuta uma direção
                var direction:number = 1;
                if(this.game.rnd.integerInRange(0, 1))
                    direction = -1
                //


                // joga pra cima
                // this.base.body.applyForce(2 * direction, -100)
                // this.base.body.rotation = 90;

                setTimeout(()=>{
                    this.game.physics.box2d.world.DestroyJoint(this.joint); // remove do carro
                    this.base.body.applyForce(20 * direction, -30)
                }, 100);

                setTimeout(()=>{
                    this.base.destroy(); // mata de vez
                }, 10000);

            }
        }
    }
}