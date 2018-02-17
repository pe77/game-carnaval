module GameBase
{
    export module Bar
    {
        export class Vertical extends Pk.PkElement
        {
            backSprite:Phaser.Sprite;
            barSprite:Phaser.Sprite;
            borderSprite:Phaser.Sprite;
            maskGraph:Phaser.Graphics;
            
            value:number = 100;
            maxSize:number;
            tween:Phaser.Tween;

            constructor(game:Pk.PkGame, backSprite:Phaser.Sprite, barSprite:Phaser.Sprite, borderSprite:Phaser.Sprite)
            {
                super(game);

                this.backSprite = backSprite;
                this.barSprite = barSprite;
                this.borderSprite = borderSprite;
            }

            create()
            {
                
                // cria uma mascara do tamanho da barra
                this.maskGraph = this.game.add.graphics(0, 0);
                this.maskGraph.beginFill(0xffffff);
                this.maskGraph.lineStyle(1, 0xffd900, 1);
                console.log('this.borderSprite.width:', this.borderSprite.width)
                console.log('this.borderSprite.height:', this.borderSprite.height)
                this.maskGraph.drawRect(0, 0, this.borderSprite.width, this.borderSprite.height);
                this.maskGraph.endFill();

                // this.mask = this.maskGraph;
                this.barSprite.mask = this.maskGraph;

                // usa o tamanho da mascara como tamanho 100%
                this.maxSize = this.borderSprite.height;

                // this.barSprite.y += 100
                
                this.add(this.backSprite);
                this.add(this.barSprite);
                this.add(this.borderSprite);
                this.add(this.maskGraph)
            }

            addValue(value:number)
            {
                this.value += value;
                this.value = this.value > 100 ? 100 : this.value;

                this.processValue();
            }

            removeValue(value:number)
            {
                this.value -= value;
                this.value = this.value < 0 ? 0 : this.value;

                this.processValue();
            }

            setValue(value:number)
            {
                this.value = value;
                this.value = this.value < 0 ? 0 : this.value;
                this.value = this.value > 100 ? 100 : this.value;

                this.processValue();
            }

            getValue()
            {
                return this.value;
            }

            protected processValue(time:number = 500)
            {   
                var x = this.value * 0.01;
                var v = this.maxSize - (x * this.maxSize);// - this.maxSize;

                // se houver alguma animação, pausa
                if(this.tween)
                    this.tween.stop(true);
                //

                this.tween = this.addTween(this.barSprite).to(
                    {
                        y:v
                    }, 
                    time, 
                    Phaser.Easing.Back.Out, 
                    true
                );
            }
        }
    }
}