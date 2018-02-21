module GameBase
{
    export module Car
    {
        export class Platform extends Pk.PkElement
        {
            car:Car.Car

            base:Phaser.Sprite;
            // base:Phaser.Physics.Box2D.Body;
            joint:any;

            size:number = 100;

            direction:number = 1;

            death:boolean = false;

            partyBoys:Array<PartyBoy.PartyBoy> = [];

            bodySprite:Phaser.Sprite;

            constructor(game:Pk.PkGame, car:Car.Car)
            {
                super(game);
                this.car = car; // referencia do carro... vai que precisa
            }

            build(direction:number, body:Phaser.Physics.Box2D.Body)
            {
                // salva a direção
                this.direction = direction;

                this.base = this.game.add.sprite(0, 0, 'car-1-platform');
                this.base.scale.x *= -this.direction;
                this.base.anchor.set(.5, .5);

                this.game.physics.box2d.enable(this.base);
                this.base.body.setRectangle(this.size, 10, 0, 0, 0);

                // bodyA, bodyB, ax, ay, bx, by, frequency, damping
                this.joint = this.game.physics.box2d.weldJoint(body, this.base.body, 0, 0, 40 * direction, 80, 8, 0.5);
                

                this.base.body.fixedRotation = true;
                setTimeout(()=>{
                    // this.joint = this.game.physics.box2d.weldJoint(body, this.base, 0, -20, 40 * direction, 80, 5, 0.0);
                    this.base.body.fixedRotation = false;
                }, 500)

                // return this.joint; // retorna o vinculo
            }

            setPartyBoys(partyBoys:Array<PartyBoy.PartyBoy>)
            {
                this.partyBoys = partyBoys;
                var total:number = this.partyBoys.length;
                for(var i = 0; i < total; i++)
                {
                    var posX:number = -(this.size / 2) + ((this.size / (total-1)) * i) ;
                    
                    this.partyBoys[i].build(posX, this.base.body);
                    
                }
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

                // joga pra cima
                this.base.applyForce(300*-this.direction, -400)
                this.base.rotation = 90;

                setTimeout(()=>{
                    this.base.destroy(); // mata de vez
                }, 3000)
            }

            update()
            {
                // this.bodySprite.x = this.base.x;
                // this.bodySprite.y = this.base.y;
            }

        }
    }
}