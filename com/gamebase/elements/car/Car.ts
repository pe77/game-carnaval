module GameBase
{
    export module Car
    {
        export class Car extends Pk.PkElement
        {
            base:Phaser.Sprite;

            size:number = 50;
            
            frequency:number = 3.5;
            damping:number = 0.5;	
            motorTorque:number = 3;
            motorSpeed:number = 50;
            rideHeight:number = 0.8;
            direction:number = 1;

            damage:[number, number] = [1, 6];

            hitSensor:Phaser.Sprite;
            sensor:any;

            driveJoints:Array<any> = [];

            name:string = '-nome padrão-';

            // plataformas
            platforms:Array<Car.Platform> = [];

            partyBoys:Array<PartyBoy.PartyBoy> = [];


            bodySprite:Phaser.Sprite;

            constructor(game:Pk.PkGame)
            {
                super(game);
            }

            build(position:Phaser.Point = new Phaser.Point(0, 0), direction:number = 1)
            {
                this.direction = direction;

                this.base = new Phaser.Sprite(this.game, 0, 0);

                this.bodySprite = this.game.add.sprite(0, 0, 'car-1-body');
                this.bodySprite.scale.x *= -this.direction;
                this.bodySprite.anchor.set(.5, .5);
                
                this.game.physics.box2d.enable(this.base);
                this.base.body.setCircle(20);
                

                this.base.body.x = position.x;
                this.base.body.y = position.y;

                this.base.body.fixedRotation = true;

                this.sensor = this.base.body.addRectangle(this.size * 3, this.size, 0, this.size / 2 - this.size / 2);
                this.sensor.SetSensor(true);
                
                
                
                var PTM = this.size;

                // var tireSprite:Phaser.Sprite = new Phaser.Sprite(this.game, 0, 0, 'car-1-tire');
                var tireSprite1:Phaser.Sprite = this.game.add.sprite(0, 500, 'car-1-tire');
                var tireSprite2:Phaser.Sprite = this.game.add.sprite(0, 500, 'car-1-tire');

                this.game.physics.box2d.enable(tireSprite1);
                this.game.physics.box2d.enable(tireSprite2);

                var wheelBodies = [];
                wheelBodies[0] = tireSprite1.body;
                wheelBodies[1] = tireSprite2.body;
                wheelBodies[0].setCircle(0.4*PTM);
                wheelBodies[1].setCircle(0.4*PTM);
                
                this.driveJoints[0] = this.game.physics.box2d.wheelJoint(this.base.body, wheelBodies[0], -1*PTM, this.rideHeight*PTM, 0,0, 0,1, this.frequency, this.damping, 0, this.motorTorque, true ); // rear
	            this.driveJoints[1] = this.game.physics.box2d.wheelJoint(this.base.body, wheelBodies[1],  1*PTM, this.rideHeight*PTM, 0,0, 0,1, this.frequency, this.damping, 0, this.motorTorque, true ); // front



                // add plataformas
                var platform:Car.Platform = new GameBase.Car.Platform(this.game, this)
                platform.build(this.direction, this.base.body);
                this.platforms.push(platform);

                var platform2:Car.Platform = new GameBase.Car.Platform(this.game, this)
                platform2.build(-this.direction, platform.base);
                this.platforms.push(platform2);

                var platform3:Car.Platform = new GameBase.Car.Platform(this.game, this)
                platform3.build(this.direction, platform2.base);
                this.platforms.push(platform3);

                // add foliões
                var total:number = 6;
                for(var i in this.platforms)
                {
                    var partyBoys:Array<PartyBoy.PartyBoy> = [];
                    for (var j = 0; j < total; j++) 
                    {
                        var pb:PartyBoy.PartyBoy = new PartyBoy.PartyBoy(this.game);
                        pb.spriteKey = 'partyboy-' + this.game.rnd.integerInRange(1, 6);
                        partyBoys.push(pb);
                        this.partyBoys.push(pb);
                    }

                    this.platforms[i].setPartyBoys(partyBoys);
                }
                

                // colisão
                this.base.body.setCollisionCategory(GameBase.CollisionCategories.Car);

                this.base.body.element = this;
                this.base.body.setCategoryContactCallback(GameBase.CollisionCategories.Car, (body1, body2, fixture1, fixture2, begin)=>{
                    
                    if (!begin || body1.id == body2.id || !body2.element)
                        return;
                    //

                    setTimeout(()=>{
                        // console.log('DestroyJoint >>> ')
                        // platform.kill();
                    }, 100)
                    
                    var advCar:Car.Car = <Car.Car>body2.element;

                    this.event.dispatch(GameBase.Car.E.CarEvent.OnHit, advCar);
                }, this);

                // drag
                // this.game.input.onDown.add(this.mouseDragStart, this);
                // this.game.input.addMoveCallback(this.mouseDragMove, this);
                // this.game.input.onUp.add(this.mouseDragEnd, this);


                for (let i = 0; i < 2; i++) {
                    this.driveJoints[i].EnableMotor(true);
                    this.driveJoints[i].SetMotorSpeed(this.motorSpeed * this.direction);
                }

                
            }

            mouseDragStart() {
                
                this.game.physics.box2d.mouseDragStart(this.game.input.mousePointer);
                
            }

            mouseDragMove() {
                
                this.game.physics.box2d.mouseDragMove(this.game.input.mousePointer);
                
            }

            mouseDragEnd() {
                
                this.game.physics.box2d.mouseDragEnd();
                
            }

            kill()
            {
                // dispara o evento de morte
                this.event.dispatch(GameBase.Car.E.CarEvent.OnKill);
            }

            applyDamage(damageRange:[number, number]):number
            {
                // randomiza o dano
                var damage:number = this.game.rnd.integerInRange(damageRange[0], damageRange[1]);

                // anima
                var iconUp:Icon.Icon = new Icon.Icon(this.game, '-' + damage);
                iconUp.create();
                iconUp.x = this.base.body.x - this.base.width / 2;
                iconUp.y = this.base.body.y - 50;

                iconUp.go();

                // mata um partyboy, se houver
                if(this.partyBoys.length)
                {
                    var pb:PartyBoy.PartyBoy = this.partyBoys.pop();
                    pb.kill();
                }
                

                return damage;
            }

            update()
            {
                    
                // console.log('update', this.base.body.x, this.base.body.y)

                this.bodySprite.x = this.base.body.x;
                this.bodySprite.y = this.base.body.y;
            }
        }


        export module E
        {
            export module CarEvent
            {
                export const OnHit:string = "CarEventOnHit";
                export const OnKill:string = "CarEventOnKill";
            }
        }

    }

}