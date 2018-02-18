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
            motorTorque:number = 2;
            motorSpeed:number = 50;
            rideHeight:number = 0.5;
            direction:number = 1;

            damage:[number, number] = [1, 6];

            hitSensor:Phaser.Sprite;
            sensor:any;

            driveJoints:Array<any> = [];

            name:string = '-nome padrão-';

            constructor(game:Pk.PkGame)
            {
                super(game);
            }

            build(position:Phaser.Point = new Phaser.Point(0, 0), direction:number = 1)
            {
                this.direction = direction;

                this.base = new Phaser.Sprite(this.game, 0, 0);

                this.game.physics.box2d.enable(this.base);
                this.base.body.setCircle(20);

                this.base.body.x = position.x;
                this.base.body.y = position.y;

                this.base.body.fixedRotation = true;

                this.sensor = this.base.body.addRectangle(this.size * 3, this.size, 0, this.size / 2 - this.size / 2);
                this.sensor.SetSensor(true);
                
                var PTM = this.size;

                var wheelBodies = [];
                wheelBodies[0] = new Phaser.Physics.Box2D.Body(this.game, null, 0, 500);
                wheelBodies[1] = new Phaser.Physics.Box2D.Body(this.game, null, 0, 500);
                wheelBodies[0].setCircle(0.4*PTM);
                wheelBodies[1].setCircle(0.4*PTM);
                
                this.driveJoints[0] = this.game.physics.box2d.wheelJoint(this.base.body, wheelBodies[0], -1*PTM, this.rideHeight*PTM, 0,0, 0,1, this.frequency, this.damping, 0, this.motorTorque, true ); // rear
	            this.driveJoints[1] = this.game.physics.box2d.wheelJoint(this.base.body, wheelBodies[1],  1*PTM, this.rideHeight*PTM, 0,0, 0,1, this.frequency, this.damping, 0, this.motorTorque, true ); // front


                 // plataforma
                var platform2 = new Phaser.Physics.Box2D.Body(this.game, null, 0, 0, 2);
                platform2.setRectangle(100, 20, 0, 0, 0);
                
                // this.game.physics.box2d.enable(platform2);

                // bodyA, bodyB, axisX, axisY, ax, ay, bx, by, motorSpeed, motorForce, motorEnabled, lowerLimit, upperLimit, limitEnabled
                // this.game.physics.box2d.prismaticJoint(this.base.body, platform2, 0, -1, 0, -20, 0, 0, 1500, 200, true, 0, 50, true);
                

                // bodyA, bodyB, ax, ay, bx, by, frequency, damping
                this.game.physics.box2d.weldJoint(this.base.body, platform2, 0, -30, 20 * this.direction, 20, 3, 0.3);

                // colisão
                this.base.body.setCollisionCategory(GameBase.CollisionCategories.Car);

                this.base.body.element = this;
                this.base.body.setCategoryContactCallback(GameBase.CollisionCategories.Car, (body1, body2, fixture1, fixture2, begin)=>{
                    
                    if (!begin || body1.id == body2.id || !body2.element)
                        return;
                    //

                    var advCar:Car.Car = <Car.Car>body2.element;

                    this.event.dispatch(GameBase.Car.E.CarEvent.OnHit, advCar);
                }, this);

                // drag
                this.game.input.onDown.add(this.mouseDragStart, this);
                this.game.input.addMoveCallback(this.mouseDragMove, this);
                this.game.input.onUp.add(this.mouseDragEnd, this);

                
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

                return damage;
            }

            update()
            {
                    
                    for (var i = 0; i < 2; i++) {
                        this.driveJoints[i].EnableMotor(true);
                        this.driveJoints[i].SetMotorSpeed(this.motorSpeed * this.direction);
                    }
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