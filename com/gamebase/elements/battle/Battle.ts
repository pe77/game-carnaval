module GameBase
{
    export module Battle
    {
        export class Battle extends Pk.PkElement
        {
            cars:[Car.Car, Car.Car];

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

                // registra o evento
                this.cars[0].event.add(GameBase.Car.E.CarEvent.OnHit, (e, otherPlayer:Car.Car)=>{
                    // console.log('carro 1 bateu');
                    this.carHit(this.cars[0], this.cars[1]);
                }, this);

                this.cars[1].event.add(GameBase.Car.E.CarEvent.OnHit, (e, otherPlayer:Car.Car)=>{
                    // console.log('carro 2 bateu');
                    this.carHit(this.cars[1], this.cars[0]);
                }, this);

            }

            carHit(carA:Car.Car, carB:Car.Car)
            {
                // aplica o dano
                var damage:number = carB.applyDamage(carA.damage);

                // calcula o impulso em cima do dano causado
                var forceX:number = 750 + (300 * damage);
                var forceY:number = -750 - (300 * damage);


                carB.base.body.applyForce(forceX*carA.direction, forceY);

                // uma base força aplicada em si mesmo
                carA.base.body.applyForce(200*-carA.direction, 200/2);

                

                // balança a camera
                this.game.camera.shake(0.01, 100);
            }
        }

    }
}