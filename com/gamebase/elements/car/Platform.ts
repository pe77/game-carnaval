module GameBase
{
    export module Car
    {
        export class Platform extends Pk.PkElement
        {
            car:Car.Car

            // base:Phaser.Sprite;
            base:Phaser.Physics.Box2D.Body;
            joint:any;

            size:number = 100;

            direction:number = 1;

            death:boolean = false;

            partyBoys:Array<PartyBoy.PartyBoy> = [];

            constructor(game:Pk.PkGame, car:Car.Car)
            {
                super(game);
                this.car = car; // referencia do carro... vai que precisa
            }

            build(direction:number, body:Phaser.Physics.Box2D.Body)
            {
                // salva a direção
                this.direction = direction;

                // cria a plataforma
                this.base = new Phaser.Physics.Box2D.Body(this.game, null, 0, 0, 2);
                this.base.setRectangle(this.size, 10, 0, 0, 0);

                this.base.x = body.x;//direction == 1 ? 100 : 600;
                // this.base.x = body.y - 200;

                var partyBoys:Array<Phaser.Sprite> = [];

                

                // console.log('body position', body.x, body.y);

                // var platform2:box2d.b2Fixture = this.base.addRectangle(this.size, 10, 0, -50, 0);
                // this.base.addRectangle(this.size, 10, 0, -100, 0);
                
                // var platform2:Phaser.Physics.Box2D.Body = new Phaser.Physics.Box2D.Body(this.game, null, 200, 200, 2);
                // platform2.
                /*
                var platform2 = new Phaser.Sprite(this.game, body.x, 0);
                this.game.physics.box2d.enable(platform2);
                platform2.body.setRectangle(this.size, 10, 0, 0, 0);


                var platform3 = new Phaser.Sprite(this.game, body.x, 0);
                this.game.physics.box2d.enable(platform3);
                platform3.body.setRectangle(this.size, 10, 0, 0, 0);
                
                
                // direction = 1;
                // cria o vinculo
                // bodyA, bodyB, ax, ay, bx, by, frequency, damping

                setTimeout(()=>{
                    // platform2.SetRestitution(3);
                    // platform2.Destroy()
                    console.log('foiii')
                    // this.base.removeFixture(platform2);
                    // this.base.clearFixtures()
                    this.game.physics.box2d.weldJoint(this.base, platform2, 0, 0, 40 * -direction, 80, 5, 0.0);

                    this.game.physics.box2d.weldJoint(platform2, platform3, 0, 0, 40 * direction, 80, 5, 0.0);
                }, 1000);
                */

                

                // bodyA, bodyB, ax, ay, bx, by, frequency, damping
                this.joint = this.game.physics.box2d.weldJoint(body, this.base, 0, 0, 40 * direction, 80, 8, 0.5);
                
                var positions:Array<number> = [
                    -50,
                    -25,
                    0,
                    25,
                    50
                ];

                /*
                var total:number = 8;
                for(var i = 0; i < total; i++)
                {
                    var posX:number = -(this.size / 2) + ((this.size / (total-1)) * i) ;
                    
                    var partyboy:PartyBoy.PartyBoy = new PartyBoy.PartyBoy(this.game);
                    partyboy.spriteKey = 'partyboy-' + this.game.rnd.integerInRange(1, 6);
                    partyboy.build(posX, this.base);
                    
                }
                */

                this.base.fixedRotation = true;
                setTimeout(()=>{
                    // this.joint = this.game.physics.box2d.weldJoint(body, this.base, 0, -20, 40 * direction, 80, 5, 0.0);
                    this.base.fixedRotation = false;
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
                    
                    this.partyBoys[i].build(posX, this.base);
                    
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

        }
    }
}