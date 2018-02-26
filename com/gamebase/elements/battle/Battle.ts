module GameBase
{
    export module Battle
    {
        export class Battle extends Pk.PkElement
        {
            cars:[Car.Car, Car.Car];
            battleEnd:boolean = false;

            lastHitTime:number = 0;
            resetCarsTolerance:number = 10;
            resetCarsInterval:number = 0;

            battleCount:number = 0;

            hit1:Phaser.Sound;
            hit2:Phaser.Sound;
            hit3:Phaser.Sound;

            hitAudios:Array<Phaser.Sound> = [];
            
            constructor(game:Pk.PkGame)
            {
                super(game);

                this.hit1 	= this.game.add.audio('car-hit-1');
                this.hit1.volume = 0.3;
                this.hit2 	= this.game.add.audio('car-hit-2');
                this.hit3 	= this.game.add.audio('car-hit-3');

                this.hitAudios.push(this.hit1);
                this.hitAudios.push(this.hit2);
                this.hitAudios.push(this.hit3);
            }


            doStart(carA:Car.Car, carB:Car.Car)
            {
                this.cars = [carA, carB];
                
                console.log('construindo carros')

                this.battleCount++;

                // cria / posiciona
                if(!this.cars[0].builded)
                    this.cars[0].build(new Phaser.Point(100, this.game.world.height - 100), 1);  
                //

                if(!this.cars[1].builded)
                    this.cars[1].build(new Phaser.Point(this.game.world.width, this.game.world.height - 100), -1);
                //
                    
                // registra o evento
                this.cars[0].event.add(GameBase.Car.E.CarEvent.OnHit, (e, otherPlayer:Car.Car)=>{
                    
                    // se a batalha já terminou, foda-se o hit
                    if(this.battleEnd)
                        return;
                    //

                    // um bate no outr
                    this.carHit(this.cars[0], this.cars[1]);
                    this.carHit(this.cars[1], this.cars[0]);

                    // empurra eles em direção contraria
                    this.pushOff();
                    this.pushOff();

                    // solta o audiozinho
                    switch(this.game.rnd.integerInRange(1, 3))
                    {
                        case 1:
                            this.hitAudios[0].play('', 0, 3.3);
                            break;

                        case 2:
                            this.hitAudios[1].play('', 0, 3.3);
                            break;
                        
                        case 3:
                            this.hitAudios[2].play('', 0, 0.2);
                            break;
                    }

                    // verifica se já terminou a batalha
                    this.resolve();
                }, this);

                this.resetCarsInterval = setInterval(()=>{

                    this.lastHitTime++;

                    if(this.lastHitTime > this.resetCarsTolerance)
                    {
                        this.pushOff();
                        this.pushOff();
                        this.pushOff();
                    }

                }, 1000);
                this.lastHitTime = 0;

                // da uma empurrada
                for (var index = 0; index < 5; index++) {
                    this.pushOff();
                    this.pushOff();
                }

                // liga os MOTOREEEEESS e reseta o gaude
                for(var i in this.cars)
                {
                    if(this.cars[i].gaude)
                        this.cars[i].gaude.reset();
                    //

                    // motores
                    this.cars[i].engineOn();
                }
                    
                //
                

                // reseta a flag de termino de batalha
                this.battleEnd = false;
            }

            start(carA:Car.Car, carB:Car.Car)
            {
                var iconUp:Battle.Icon = new GameBase.Battle.Icon(this.game, 'Ready');
                iconUp.create();
                iconUp.x = this.game.world.centerX;
                iconUp.y = this.game.world.centerY;

                iconUp.go();

                setTimeout(()=>{
                    var iconUp:Battle.Icon = new GameBase.Battle.Icon(this.game, 'Set');
                    iconUp.create();
                    iconUp.x = this.game.world.centerX;
                    iconUp.y = this.game.world.centerY;

                    iconUp.go();
                }, 500);


                setTimeout(()=>{
                    var iconUp:Battle.Icon = new GameBase.Battle.Icon(this.game, 'GO!');
                    iconUp.create();
                    iconUp.x = this.game.world.centerX;
                    iconUp.y = this.game.world.centerY;

                    iconUp.go();
                }, 1000);

                // espera um pouco
                setTimeout(()=>{
                    this.doStart(carA, carB);
                }, 1500);
            }

            // empurra os carros em direção contraria
            pushOff()
            {
                for(var i in this.cars)
                    if(this.cars[i].alive)
                        this.cars[i].base.body.applyForce(400*-this.cars[i].direction, 300/2);
                //

                this.lastHitTime = 0;
            }

            resolve()
            {
                var winner:Car.Car = null; // se houve vencedor e qual
                var playerCar:Car.Car = null;

                // se terminou e quem ganhou
                for(var i in this.cars)
                {
                    if(!this.cars[i].partyBoysLeft())
                        this.battleEnd = true;
                    else
                        winner = this.cars[i];

                    //

                    if(this.cars[i].playerCar)
                        playerCar = this.cars[i];
                    // 
                }

                // se a batalha terminou, 
                if(this.battleEnd)
                {
                    console.log('Battle end');

                    // para a contage
                    clearInterval(this.resetCarsInterval);
                    
                    var deadCar:Car.Car = null;
                    for(var i in this.cars)
                    {
                        // destroi quem não é o vencedor
                        if(!winner || this.cars[i].getId() != winner.getId())
                        {
                            deadCar = this.cars[i];
                            this.cars[i].kill();
                        }
                        //

                        // desliga o motor
                        this.cars[i].engineOff();

                        // para o gaude, se houver
                        if(this.cars[i].gaude)
                            this.cars[i].gaude.stop();
                        //

                        // da uma empurrada pra tras
                        this.pushOff();
                    }

                    this.event.dispatch(GameBase.Battle.E.BattleEvent.OnEnd, winner);
                    
                }   
                    
                //
            }

            carHit(carA:Car.Car, carB:Car.Car)
            {
                // pega o critico do gaude, se for carro do jogaro
                var criticalFactor:number = 1;
                if(carA.playerCar)                
                {
                    criticalFactor = carA.gaude ? carA.gaude.hit() : 1;
                    console.log('gaude hit factor: ' + criticalFactor)
                }else{
                    // inimigo tbm tem um fator de critico, baixo
                    if(this.game.rnd.integerInRange(1, 4) == 4)
                        criticalFactor = 2;
                    //
                }

                // aplica o dano
                var damage:number = carB.applyDamage(carA.damage, criticalFactor);

                // calcula o impulso em cima do dano causado
                var forceX:number = 750 + (300 * damage);
                var forceY:number = -750 - (300 * damage);

                // empurra de acordo com o dano
                carB.base.body.applyForce(forceX*carA.direction, forceY);

                // balança a camera
                this.game.camera.shake(0.01, 100);

            }
        }

        export module E
        {
            export module BattleEvent
            {
                export const OnEnd:string = "BattleEventEnd";
            }
        }



    }
}