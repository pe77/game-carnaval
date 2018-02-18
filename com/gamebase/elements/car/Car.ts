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

            hitSensor:Phaser.Sprite;
            sensor:any;

            driveJoints:Array<any> = [];

            name:string = '-nome padrão-';

            constructor(game:Pk.PkGame)
            {
                super(game);
            }

            create(position:Phaser.Point = new Phaser.Point(0, 0))
            {
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
                wheelBodies[0] = new Phaser.Physics.Box2D.Body(this.game, null, -1*PTM, 0.6*-PTM);
                wheelBodies[1] = new Phaser.Physics.Box2D.Body(this.game, null,  1*PTM, 0.6*-PTM);
                wheelBodies[0].setCircle(0.4*PTM);
                wheelBodies[1].setCircle(0.4*PTM);
                
                this.driveJoints[0] = this.game.physics.box2d.wheelJoint(this.base.body, wheelBodies[0], -1*PTM, this.rideHeight*PTM, 0,0, 0,1, this.frequency, this.damping, 0, this.motorTorque, true ); // rear
	            this.driveJoints[1] = this.game.physics.box2d.wheelJoint(this.base.body, wheelBodies[1],  1*PTM, this.rideHeight*PTM, 0,0, 0,1, this.frequency, this.damping, 0, this.motorTorque, true ); // front

                this.base.body.setCollisionCategory(GameBase.CollisionCategories.Car);

                this.base.body.element = this;
                this.base.body.setCategoryContactCallback(GameBase.CollisionCategories.Car, (body1, body2, fixture1, fixture2, begin)=>{
                    
                    if (!begin || body1.id == body2.id || !body2.element)
                        return;
                    //

                    var advCar:Car.Car = <Car.Car>body2.element;

                    if(this.name == 'Carro 1')
                    {
                        console.log(this.name+ ' bateu no carro:', advCar.name);
                        // força aplicada no adversario
                        var forceX:number = 1500;
                        var forceY:number = -2000;
                        advCar.base.body.applyForce(forceX*this.direction, forceY);

                        // força aplicada em si mesmo
                        this.base.body.applyForce(forceX*-this.direction, forceY/2);

                        // balança a camera
                        this.game.camera.shake(0.01, 100);
                    }
                        
                    //
                }, this);

            }

            update()
            {
                    
                    for (var i = 0; i < 2; i++) {
                        this.driveJoints[i].EnableMotor(true);
                        this.driveJoints[i].SetMotorSpeed(this.motorSpeed * this.direction);
                    }
            }
        }

    }

}