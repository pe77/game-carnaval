module GameBase
{
    export module UpgradeScreen
    {
        export class UpgradeScreen extends Pk.PkElement
        {
            addAttack:UpgradeScreen.Button;
            addDefense:UpgradeScreen.Button;
            addHealth:UpgradeScreen.Button;

            header:Phaser.Sprite;

            constructor(game:Pk.PkGame)
            {
                super(game);
            }

            create()
            {
                this.header = this.game.add.sprite(0, 0, 'upg-header');
                this.add(this.header);

                // pos
                this.header.anchor.x = 0.5;
                this.header.x = this.game.world.centerX;
                this.header.y = this.game.world.centerY - this.header.height - 100;
                this.add(this.header);
                
                this.addAttack = new GameBase.UpgradeScreen.Button(this.game)
                this.addAttack.key = 'upg-btn-attack';
                this.addAttack.create();
                this.addAttack.x = 50;
                this.addAttack.y = this.header.y + this.header.height + 50;
                this.addAttack.event.add(GameBase.UpgradeScreen.E.UpgradeButtonEvent.OnClick, (e)=>{
                    this.select(1)
                }, this);
                this.add(this.addAttack);

                this.addDefense = new GameBase.UpgradeScreen.Button(this.game)
                this.addDefense.key = 'upg-btn-defense';
                this.addDefense.create();
                this.addDefense.x = this.game.world.centerX - this.addDefense.width / 2;
                this.addDefense.y = this.header.y + this.header.height + 150;
                this.addDefense.event.add(GameBase.UpgradeScreen.E.UpgradeButtonEvent.OnClick, (e)=>{
                    this.select(2)
                }, this);
                this.add(this.addDefense);

                this.addHealth = new GameBase.UpgradeScreen.Button(this.game)
                this.addHealth.key = 'upg-btn-health';
                this.addHealth.create();
                this.addHealth.x = this.game.world.width - this.addHealth.width - 50;
                this.addHealth.y = this.header.y + this.header.height + 50;
                this.addHealth.event.add(GameBase.UpgradeScreen.E.UpgradeButtonEvent.OnClick, (e)=>{
                    this.select(3)
                }, this);
                this.add(this.addHealth);

                this.addAttack.visible = false;
                this.addDefense.visible = false;
                this.addHealth.visible = false;
                this.header.visible = false;
            }

            select(data:any)
            {
                this.event.dispatch(GameBase.UpgradeScreen.E.UpgradeEvent.OnSelect, data);
                this.close();
            }

            open()
            {
                for(let i in this.children)
                {
                    this.children[i].visible = true;

                    // header
                    this.addTween(this.children[i]).from(
                        {
                            y:this.children[i].y - 100,
                            alpha:0
                        }, 
                        300, 
                        Phaser.Easing.Circular.Out, 
                        true,
                        200 * parseInt(i)
                    ).onComplete.add(()=>{
                        // this.destroy();
                    }, this);
                }

            }

            close()
            {

                // header
                this.addTween(this).from(
                    {
                        alpha:100
                    }, 
                    100, 
                    Phaser.Easing.Linear.None, 
                    true
                ).onComplete.add(()=>{
                    for(let i in this.children)
                        this.children[i].visible = false;
                    //
                }, this);

            }
        }

        export module E
        {
            export module UpgradeEvent
            {
                export const OnSelect:string = "UpgradeEventOnSelect";
            }
        }

    }

}