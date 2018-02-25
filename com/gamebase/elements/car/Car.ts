module GameBase
{
    export module Car
    {
        export class Car extends Pk.PkElement
        {
            base:Phaser.Sprite;
            tireSprite1:Phaser.Sprite;
            tireSprite2:Phaser.Sprite;

            size:number = 50;
            
            frequency:number = 3.5;
            damping:number = 0.5;	
            motorTorque:number = 3;
            motorSpeed:number = 50;
            rideHeight:number = 0.8;
            direction:number = 1;
            alive:boolean = true;

            damage:[number, number] = [1, 2];

            hitSensor:Phaser.Sprite;
            sensor:any;

            driveJoints:Array<any> = [];

            name:string = '-nome padrão-';

            // plataformas
            platforms:Array<Car.Platform> = [];
            platformsTotal:number = 2;

            bodySpriteKey:string = 'car-body';
            tireSpriteKey:string = 'tire-body';
            platformSpriteKey:string = 'platform-body';
            bodySprite:Phaser.Sprite;

            // se é um carro do jogador
            playerCar:boolean = false;

            // barrinha de critico
            gaude:Gaude.Gaude;

            constructor(game:Pk.PkGame)
            {
                super(game);
            }

            build(position:Phaser.Point = new Phaser.Point(0, 0), direction:number = 1)
            {
                this.direction = direction;

                this.base = new Phaser.Sprite(this.game, 0, 0);

                this.bodySprite = this.game.add.sprite(0, 0, this.bodySpriteKey);
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

                this.tireSprite1 = this.game.add.sprite(0, 500, this.tireSpriteKey);
                this.tireSprite2 = this.game.add.sprite(0, 500, this.tireSpriteKey);

                this.game.physics.box2d.enable(this.tireSprite1);
                this.game.physics.box2d.enable(this.tireSprite2);

                var wheelBodies = [];
                wheelBodies[0] = this.tireSprite1.body;
                wheelBodies[1] = this.tireSprite2.body;
                wheelBodies[0].setCircle(0.4*PTM);
                wheelBodies[1].setCircle(0.4*PTM);
                
                this.driveJoints[0] = this.game.physics.box2d.wheelJoint(this.base.body, wheelBodies[0], -1*PTM, this.rideHeight*PTM, 0,0, 0,1, this.frequency, this.damping, 0, this.motorTorque, true ); // rear
	            this.driveJoints[1] = this.game.physics.box2d.wheelJoint(this.base.body, wheelBodies[1],  1*PTM, this.rideHeight*PTM, 0,0, 0,1, this.frequency, this.damping, 0, this.motorTorque, true ); // front




                // add plataformas
                for (let i = 0; i < this.platformsTotal; i++)
                {
                    // cria a plataforma
                    var platform:Car.Platform = new GameBase.Car.Platform(this.game, this)
                    platform.platformSpriteKey = this.platformSpriteKey;

                    // seleciona o anexo
                    var anex:any;
                    if(!i) // se não tem plartaforma anterior, anexa ao carro
                        anex = this.base.body; // carro
                    else
                        anex = this.platforms[i-1].base;
                    //

                    // direção, even/odd
                    var direction = i % 2 == 0 ? this.direction : -this.direction ;

                    platform.build(direction, anex);
                    this.platforms.push(platform);
                }

                // add foliões
                for(var i in this.platforms)
                {
                    for (var j = 0; j < this.platforms[i].partyBoysMax; j++) 
                    {
                        var pb:PartyBoy.PartyBoy = new PartyBoy.PartyBoy(this.game);
                        pb.spriteKey = 'partyboy-' + this.game.rnd.integerInRange(1, 6);

                        // add
                        this.platforms[i].addPartyBoys(pb)
                    }
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

                 // barra de clique
                setTimeout(()=>{ 
                    if(this.playerCar) // só cria se for carro de jogador
                    {
                        this.gaude = new Gaude.Gaude(this.game);
                        this.gaude.build();
                    }
                }, 1000)



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

            engineOn()
            {
                for(var i in this.driveJoints)
                    this.driveJoints[i].EnableMotor(true);
                //
            }

            engineOff()
            {
                for(var i in this.driveJoints)
                    this.driveJoints[i].EnableMotor(false);
                //
            }

            kill()
            {
                // desliga os motores
                this.engineOff();

                // marca morto
                this.alive = false;

                // destroi as plataformas
                for(let i in this.platforms)
                {
                    setTimeout(()=>{
                        console.log('desliga plat ' + i)
                        this.platforms[i].kill()
                    }, 400*parseInt(i));
                }

                // destroi as rodas                
                for(let j in this.driveJoints)
                {
                    setTimeout(()=>{
                        console.log('desliga roda ' + j)
                        this.game.physics.box2d.world.DestroyJoint(this.driveJoints[j]);
                    }, 200*parseInt(j));
                }

                this.addTween(this.bodySprite).to(
                    {
                        alpha:0
                    }, 
                    5000, 
                    Phaser.Easing.Circular.Out, 
                    true
                ).onComplete.add(()=>{
                    // some com as peças de vez
                    this.base.destroy();
                    this.bodySprite.destroy();
                    this.tireSprite1.destroy();
                    this.tireSprite2.destroy();
                }, this);



                // dispara o evento de morte
                this.event.dispatch(GameBase.Car.E.CarEvent.OnKill);
            }

            applyDamage(damageRange:[number, number], criticalFactor:number = 1):number
            {
                // randomiza o dano
                var damage:number = this.game.rnd.integerInRange(damageRange[0], damageRange[1]);
                
                // damage *= criticalFactor; // critico

                // anima, se for não for jogador
                if(!this.playerCar || true) // deixa pra lá
                {
                    var iconUp:Icon.Icon = new Icon.Icon(this.game, '-' + damage);
                    iconUp.create();
                    iconUp.x = this.base.body.x - this.base.width / 2;
                    iconUp.y = this.base.body.y - 50;

                    iconUp.go();
                }

                // mata DAMAGE partyboy, se houver algum
                for (let j = 0; j < damage; j++) {
                    for(let i = this.platforms.length - 1; i >=0 ;i--)
                    {    
                        if(this.platforms[i].partyBoys.length) // se tem partyboy
                        {
                            var pb:PartyBoy.PartyBoy = this.platforms[i].direction == -1 ? this.platforms[i].partyBoys.pop() : this.platforms[i].partyBoys.shift();
                            pb.kill();
                            break;
                        }
                    }
                }
               

                return damage;
            }

            partyBoysLeft():number
            {
                var total:number = 0;

                for(var i in this.platforms)
                    total += this.platforms[i].partyBoys.length;
                //

                return total;
            }

            update()
            {
                this.bodySprite.x = this.base.body.x;
                this.bodySprite.y = this.base.body.y;

                this.bodySprite.bringToTop();
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