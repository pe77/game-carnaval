module GameBase
{
    export module Car
    {
        export class Platform extends Pk.PkElement
        {
            car:Car.Car

            base:Phaser.Sprite;
            
            joint:any;
            jointBody:Phaser.Physics.Box2D.Body;

            size:number = 100;

            direction:number = 1;

            death:boolean = false;

            partyBoys:Array<PartyBoy.PartyBoy> = [];
            partyBoysMax:number = 6;

            bodySprite:Phaser.Sprite;

            line:Phaser.Line;

            lineSprite:Phaser.Sprite;
            lineGraph:Phaser.Graphics;


            platformSpriteKey:string = 'car-platform';

            constructor(game:Pk.PkGame, car:Car.Car)
            {
                super(game);
                this.car = car; // referencia do carro... vai que precisa
            }

            build(direction:number, body:Phaser.Physics.Box2D.Body)
            {
                // salva a direção
                this.direction = direction;

                this.base = this.game.add.sprite(0, 0, this.platformSpriteKey);
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
                }, 1500)

                // console.log(this.joint)

                this.jointBody = body;

                

                // return this.joint; // retorna o vinculo
                if(this.car.name == 'Carro 1' || true)
                {
                    console.log('plat id: ', this.getId());


                    // var line = new Phaser.Line(0, 0, 100, 100);
                    this.lineGraph = this.game.add.graphics(0,0);
                    
                    // this.lineGraph.beginFill();
                    // this.lineGraph.lineStyle(10, 0xffd900, 1);
                    // this.lineGraph.moveTo(this.line.start.x, this.line.start.y);//moving position of graphic if you draw mulitple lines
                    // this.lineGraph.lineTo(this.line.end.y, this.line.end.y);
                    // this.lineGraph.endFill();
                    

                    // this.lineSprite = this.game.add.sprite(0, 0, graphics);
                    
                    
                }
                
            }

            addPartyBoys(partyBoy:PartyBoy.PartyBoy)
            {
                // se já bateu no maximo, retorna 
                if(partyBoy.length == this.partyBoysMax)
                    return false;
                //

                var posX:number = -this.size/2 + (20*this.partyBoys.length);

                this.partyBoys.push(partyBoy);
                partyBoy.build(posX, this.base.body);
                
                return true;
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
                this.base.body.applyForce(300*-this.direction, -400)

                setTimeout(()=>{
                    this.base.destroy(); // mata de vez
                }, 3000)
            }

            update()
            {
                this.lineGraph.clear();

                if(this.death)
                    return;
                //

                this.lineGraph.lineStyle(4, 0x383a51, 1);
                this.lineGraph.moveTo(this.base.body.x, this.base.body.y);//moving position of graphic if you draw mulitple lines
                this.lineGraph.lineTo(this.jointBody.x, this.jointBody.y);
                this.lineGraph.update();

                this.base.bringToTop();
            }


        }
    }
}