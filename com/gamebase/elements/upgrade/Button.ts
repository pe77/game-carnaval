module GameBase
{
    export module UpgradeScreen
    {
        export class Button extends Pk.PkElement
        {
            base:Phaser.Sprite;
            key:string;
            data:any;

            constructor(game:Pk.PkGame)
            {
                super(game);
            }

            create()
            {
                this.base = this.game.add.sprite(0, 0, this.key);
                this.add(this.base);

                // config btn
                this.base.inputEnabled = true;
                this.base.input.useHandCursor = true;


                this.base.events.onInputDown.add(()=>{
                    this.event.dispatch(GameBase.UpgradeScreen.E.UpgradeButtonEvent.OnClick);
                }, this);
                
            }
            
        }

        export module E
        {
            export module UpgradeButtonEvent
            {
                export const OnClick:string = "UpgradeButtonEventOnClick";
            }
        }

    }

}