module GameBase
{
    export module Gaude
    {
        export class Icon extends Pk.PkElement
        {
            text:Phaser.Text;
            
            message:string;

            constructor(game:Pk.PkGame, message:string)
            {
                super(game);

                this.message = message;
            }

            create()
            {
                this.text = this.game.add.text(0, 0,
                    this.message, // text
                    {
                        font: "28px Love Story Rough",
                        fill: "#202020"
                    } // font style
                );

                this.add(this.text);

            }

            go()
            {
                this.addTween(this).to(
                    {
                        y:this.y - 20,
                        x:this.x + 200,
                        // alpha:0
                    }, 
                    2000, 
                    Phaser.Easing.Circular.Out, 
                    true
                ).onComplete.add(()=>{
                    this.destroy();
                }, this);

            }

        }

        export module E
        {
            export module IconEvent
            {
                // export const OnOverScore:string = "ScoreEventOnOverScore";
            }
        }
        
    }
}