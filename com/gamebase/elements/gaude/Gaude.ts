module GameBase
{
    export module Gaude
    {
        export class Gaude extends Pk.PkElement
        { 

            bg:Phaser.Sprite;
            mark:Phaser.Sprite;
            button:Phaser.Sprite;

            padding:number = 10;
            pushForce:number = -100;
            
            bgTimer:Phaser.Sprite;
            timeInitialHeight:number;
            locked:boolean = false;
            lockSpeed:number = 5;

            constructor(game:Pk.PkGame)
            {
                super(game);
            }

            build()
            {
                this.bg = this.game.add.sprite(0, 0, 'gaude-bg');
                this.add(this.bg);

                this.mark = this.game.add.sprite(0, 0, 'gaude-mark');
                this.add(this.mark);

                this.bgTimer = Pk.PkUtils.createSquare(this.game, 5, this.bg.height, "#69a53c")
                this.add(this.bgTimer)

                this.bgTimer.anchor.set(0, 1);
                this.bgTimer.y += this.bgTimer.height;
                this.timeInitialHeight = this.bgTimer.height;

                this.button = this.game.add.sprite(0, 0, 'gaude-button');
                this.add(this.button);
                this.button.anchor.x = 0.5;
                this.button.x = this.bg.width / 2;
                this.button.y = this.bg.height - 5;
                
                // config btn
                this.button.inputEnabled = true;
                this.button.input.useHandCursor = true;

                this.button.events.onInputDown.add(()=>{
                    this.push();
                }, this);


                this.game.physics.box2d.enable(this.mark);
                this.mark.body.fixedRotation = true;
                this.mark.body.setRectangle(this.mark.width, this.mark.height, this.mark.width/2 - 10, this.mark.height/2-5, 0);
                this.mark.body.x += this.mark.width;
                this.mark.body.y += 150;

                var graber:Phaser.Sprite = this.game.add.sprite(0, 0, '');
                this.add(graber);
                this.game.physics.box2d.enable(graber);
                graber.body.setCircle(5);
                graber.body.x = this.mark.body.x;
                graber.body.y = -this.padding;
                graber.body.static = true;
                

                // bodyA, bodyB, axisX, axisY, ax, ay, bx, by, motorSpeed, motorForce, motorEnabled, lowerLimit, upperLimit, limitEnabled
                this.game.physics.box2d.prismaticJoint(graber, this.mark, 0, 1, 0, 0, 0, 0, 0, 0, false, 0, this.bg.height+10, true);


                this.x = this.padding;
                this.y = this.padding;

            }

            push()
            {
                if(!this.locked)
                    this.mark.body.applyForce(0, this.pushForce);
                //
            }

            hit():number
            {
                var hitValue:number = 0;
                var posValue:number = this.mark.body.y;

                // de-até, valor
                var ranges:Array<[number, number, number]> = new Array();
                
                ranges.push([18,   34,  5]); 
                ranges.push([69,   104, 3]); 
                ranges.push([105,  164, 2]); 
                ranges.push([165,  250, 1]); 


                for(var i in ranges)
                {
                    if(posValue >= ranges[i][0] && posValue <= ranges[i][1])
                    {
                        hitValue = ranges[i][2];
                        break;
                    }
                        
                }
                
                // empurra pro final
                this.mark.body.applyForce(0, 2000);

                // anima
                var iconUp:Gaude.Icon = new GameBase.Gaude.Icon(this.game, 'X' + hitValue);
                iconUp.create();
                iconUp.x = this.x + this.mark.width / 2;
                iconUp.y = this.mark.body.y;

                iconUp.go();

                this.unlock();

                return hitValue;
            }

            update()
            {
                if(this.bgTimer.height <= 0)
                    return;
                //

                this.bgTimer.height -= this.lockSpeed;

                if(this.bgTimer.height <= 0)
                    this.lock();
                //
            }

            unlock()
            {
                this.locked = false;

                this.bgTimer.height = this.timeInitialHeight;
                this.mark.body.gravityScale = 1;
            }

            lock()
            {
                this.locked = true;

                // this.mark.body.
                var a:Phaser.Physics.Box2D.Body;

                this.mark.body.velocity.y = 0;
                this.mark.body.gravityScale = 0;

                // anima
                var iconUp:Gaude.Icon = new GameBase.Gaude.Icon(this.game, '* Lock *');
                iconUp.create();
                iconUp.x = this.x + this.mark.width / 2;
                iconUp.y = this.mark.body.y;

                iconUp.go();

                
            }

        }
    }
}