module GameBase
{
    export module Battle
    {
        export class Battle extends Pk.PkElement
        {
            cars:[Car.Car, Car.Car];
            battleEnd:boolean = false;

            lastHitTime:number = 0;
            resetCarsTolerance:number = 15;
            resetCarsInterval:number = 0;

            constructor(game:Pk.PkGame)
            {
                super(game);
            }


            start(carA:Car.Car, carB:Car.Car)
            {
                this.cars = [carA, carB];
                
                
                // cria / posiciona
                this.cars[0].build(new Phaser.Point(100, this.game.world.height - 100), 1);
                this.cars[1].build(new Phaser.Point(this.game.world.width, this.game.world.height - 100), -1);

                this.cars[0].name = 'carro 1';

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
                    this.pushOff()

                    // verifica se já terminou a batalha
                    this.resolve();
                }, this);

                this.resetCarsInterval = setInterval(()=>{
                    var lastHit:number = this.game.time.totalElapsedSeconds() - this.lastHitTime;

                    if(lastHit > this.resetCarsTolerance)
                    {
                        this.pushOff();
                        this.pushOff();
                        this.pushOff();
                    }
                        
                    console.log('ultim hit>', this.game.time.totalElapsedSeconds() - this.lastHitTime);
                }, 1000);

                // da uma empurrada
                this.pushOff();
                this.pushOff();
            }

            // empurra os carros em direção contraria
            pushOff()
            {
                console.log('pushOff!')
                for(var i in this.cars)
                    if(this.cars[i].alive)
                        this.cars[i].base.body.applyForce(400*-this.cars[i].direction, 300/2);
                //
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
                    
                    for(var i in this.cars)
                    {
                        // destroi quem não é o vencedor
                        if(!winner || this.cars[i].getId() != winner.getId())
                            this.cars[i].kill();
                        //

                        // desliga o motor
                        this.cars[i].engineOff();

                        // da uma empurrada pra tras
                        this.pushOff();
                    }

                    // dispara o evento de termino
                    this.event.dispatch(GameBase.Battle.E.BattleEvent.OnEnd, winner);
                }
                    
                //
            }

            carHit(carA:Car.Car, carB:Car.Car)
            {
                this.lastHitTime = this.game.time.totalElapsedSeconds();

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