module GameBase
{
    export module Battle
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
                        font: "48px Love Story Rough",
                        fill: "#202020"
                    } // font style
                );
                this.text.anchor.x = 0.5;


                this.add(this.text);

            }

            go()
            {
                this.addTween(this).from(
                    {
                        alpha:0
                    }, 
                    500, 
                    Phaser.Easing.Circular.Out, 
                    true
                ).onComplete.add(()=>{
                    this.destroy();
                }, this);

                this.addTween(this.scale).from(
                    {
                        x:0
                    }, 
                    490, 
                    Phaser.Easing.Circular.Out, 
                    true
                ).onComplete.add(()=>{
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