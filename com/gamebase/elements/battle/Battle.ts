module GameBase
{
    export module Battle
    {
        export class Battle extends Pk.PkElement
        {
            cars:[Car.Car, Car.Car];
            gaude:Gaude.Gaude;

            constructor(game:Pk.PkGame)
            {
                super(game);
            }

            setCars(carA:Car.Car, carB:Car.Car)
            {
                // se já existe algum carro, destroi
                if(this.cars && this.cars.length)
                    for(var i in this.cars)
                        this.cars[i].kill();
                //

                this.cars = [carA, carB];
            }

            start()
            {
                // se não houver carros, dropa
                if(!this.cars.length)
                    return false;
                //
                
                // cria / posiciona
                this.cars[0].build(new Phaser.Point(100, this.game.world.height - 100), 1);
                this.cars[1].build(new Phaser.Point(this.game.world.width, this.game.world.height - 100), -1);

                this.cars[0].name = 'carro 1';

                // registra o evento
                this.cars[0].event.add(GameBase.Car.E.CarEvent.OnHit, (e, otherPlayer:Car.Car)=>{
                    // console.log('carro 1 bateu');
                    this.carHit(this.cars[0], this.cars[1]);
                }, this);

                this.cars[1].event.add(GameBase.Car.E.CarEvent.OnHit, (e, otherPlayer:Car.Car)=>{
                    // console.log('carro 2 bateu');
                    this.carHit(this.cars[1], this.cars[0]);
                }, this);
                

                // barra de clique
                setTimeout(()=>{
                    this.gaude = new Gaude.Gaude(this.game);
                this.gaude.build();
                }, 1000)
                

            }

            carHit(carA:Car.Car, carB:Car.Car)
            {
                // pega o critico do gaude, se for carro do jogaro
                var criticalFactor:number = 1;
                if(carA.playerCar)                
                {
                    criticalFactor = this.gaude.hit();
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


                carB.base.body.applyForce(forceX*carA.direction, forceY);

                // uma base força aplicada em si mesmo
                carA.base.body.applyForce(300*-carA.direction, 300/2);


                // balança a camera
                this.game.camera.shake(0.01, 100);
            }
        }

    }
}