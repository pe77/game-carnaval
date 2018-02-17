module GameBase
{
    export module Presentation
    {
        export class Presentation extends Pk.PkElement
        {
            controller:Step.Controller;
            likometer:Bar.Likometer;
            timeBar:Bar.Time;
            score:Score.Score;
            timee:number = 50; // ms
            audience:Audience.Audience;
            level:Level.Level;

            gameOver:boolean = false;

            firstNote:boolean = true;


            

            // sfx
            sfxEndGameLose:Phaser.Sound;

            constructor(game:Pk.PkGame)
            {
                super(game);
            }

            create()
            {
                // cria as coisas
                this.controller.create();
                this.audience.create();
                this.likometer.create();
                this.timeBar.create();
                this.score.create();
                this.level.create();


                this.sfxEndGameLose = this.game.add.sound('sfx-endgame-lose');

                // eventos

                // sempre que termina a contagem de tempo
                this.timeBar.event.add(Bar.E.TimeEvent.OnEndCount, ()=>{
                    this.endTimeBar();
                }, this);

                this.likometer.event.add(GameBase.Bar.E.LikometerEvent.OnOver, ()=>{
                    this.endGame(false);
                }, this);


                // sempre que o pack acabar...
                this.controller.event.add(GameBase.Step.E.ControllerEvent.OnEndPack, (e, hit, originalPackSize)=>{

                    console.log('END PACK')

                    if(!this.gameOver)
                        this.endPack(hit, originalPackSize);
                    //
                }, this);

                // sempre que o pack iniciar 
                this.controller.event.add(GameBase.Step.E.ControllerEvent.OnEndPack, (e, hit, originalPackSize)=>{
                    var time = 116 - (this.level.level * 15);
                    time = time < 50 ? 50 : time;

                    if(!this.gameOver)
                        this.timeBar.startCount(time);
                    //
                }, this);

                // sempre que acabar os packs do controller
                this.controller.event.add(GameBase.Step.E.ControllerEvent.OnEndAllPacks, (e, hit, originalPackSize)=>{
                    console.log('TERMINOU TODOS OS PACK', hit, originalPackSize)

                    setTimeout(()=>{ // bug fix - se não colocar, da tela preta

                        if(!this.gameOver)
                            this.playNextLevel(hit, originalPackSize);
                        //
                    }, 800);

                }, this);

                this.audience.pulse();

                this.updatePosition();
            }

            start(level:number)
            {
                // seta o level
                this.level.setLevel(level);

                this.score.setValue(0);

                this.likometer.setValue(80);

                this.gameOver = false;

                // reseta / para o tempo
				this.timeBar.stopCount();

                // add umas notinhas
                this.prepare();

                // começa a colocar os steps
                this.controller.playNext();

                
            }

            prepare()
            {
                // a cada level, vai diminuindo os packs
                var totalPacks:number = 10 - (this.level.level * 2);
                totalPacks = totalPacks < 1 ? 1 : totalPacks;

                // quanto maior o level, maior a quantidade de notas
                var totalStepInterval:Array<number> = [2 + this.level.level, 4 + this.level.level];

                // gera uma serie de packs
                for(var i = 0; i < totalPacks; i++)
                    this.controller.addStepPack(Step.StepPack.generateStepPack(this.game, this.game.rnd.integerInRange(totalStepInterval[0], totalStepInterval[1])));
                //
            }


            playNextLevel(hit:boolean, originalPackSize:number)
            {
                if(this.level.level == 12 && hit)
                {
                    this.endGame(true);
                    return;
                }

                // almenta a dificuldade, se acertou
                if(hit)
                    this.level.setLevel(this.level.level+1);
                //

                // add umas notinhas
                this.prepare();

                // toca
                this.controller.playNext();
            }

            private endTimeBar()
            {
                // se tiver alguma nota, erra remove contagem
                this.likometer.removeValue(25);

                // força o erro
                this.controller.killStep(false);
            }

            private endPack(hit, originalPackSize)
            {
                // se fechou, calcula a grana
				if(hit)
				{
					var scoreVal:number = this.timeBar.value * originalPackSize;
                    scoreVal /= 8;
					scoreVal = Math.floor(scoreVal * 0.1);

                    // da um bonus por level
                    scoreVal += 2 * this.level.level;

					scoreVal = scoreVal < 2 ? 2 : scoreVal;
					
					this.score.addValue(scoreVal);
					
				}else{
					// quanto mais facil, mais dinheiro perde
					var scoreVal:number = this.timeBar.value / originalPackSize;
					scoreVal = Math.floor(scoreVal * 0.1);
					scoreVal = scoreVal < 10 ? 10 : scoreVal;
					
					this.score.removeValue(scoreVal);
					
				}

				// re-inicia o tempo
                this.timeBar.startCount(100);

				// espera um pouquinho
				setTimeout(()=>{
					// this.resetPacks();
                    this.controller.playNext();

                    this.event.dispatch(GameBase.Presentation.E.PresentationEvent.OnChangeStepPack, this.controller.currentPack);
				}, 500);

            }

            pressStep(direction:Step.Direction)
            {
                // se não tem stepPack, ignora
                if(!this.controller.currentPack || this.gameOver)
                {
                    console.log('-- IGNORA CLICK')
                    return;
                }

                // se apertou a direção certa
                if(this.controller.playDirection(direction))
                {
                    this.likometer.addValue(1);
                    this.controller.killStep(true);

                }else{
                    
                    this.likometer.removeValue(30);
                    this.controller.killStep(false);

                    this.event.dispatch(GameBase.Presentation.E.PresentationEvent.OnMissStep);
                }

                // se for a primeira nota, toca eventos
                if(this.firstNote)
                {
                    this.event.dispatch(GameBase.Presentation.E.PresentationEvent.OnFirstNote);
                    this.firstNote = false;
                }
            }

            updatePosition()
            {
                // posiciona as coisas
                this.controller.x = this.game.world.centerX - this.controller.width/2;
			    this.controller.y = 30;

                this.likometer.y += 80;
			    this.likometer.x = this.game.world.width - this.likometer.backSprite.width - 20;

                this.timeBar.x = this.controller.x + this.controller.width;
			    this.timeBar.y = this.controller.y + 27;

                // this.score.x += 20;
			    this.score.y += 20;

                this.level.y = this.score.y + this.score.height + 30;

                
            }

            endGame(win:boolean = false)
            {
                this.gameOver = true;

                // para o tempo
                this.timeBar.stopCount();

                /*
                if(win)
                {
                    alert("GANHOUUU...\nScore: [Temers: "+this.score.value+']\nRecarregue para tentar novamente!(vai ser rápido, está cacheado ;) ');
                }else{
                    
                    this.sfxEndGameLose.play();
                    alert("ERRRROUU...\nScore: [Temers: "+this.score.value+']\nRecarregue para tentar novamente!(vai ser rápido, está cacheado ;) ');
                }
                */

                this.event.dispatch(GameBase.Presentation.E.PresentationEvent.OnEndGame, win);

                // this.restart();
            }

            restart()
            {
                // volta pro level 1
                this.start(1);

            }
        }

        export module E
        {
            export module PresentationEvent
            {
                export const OnFirstNote:string 	    = "OnPresentationEventFirstNote";
                export const OnEndGame:string 	        = "PresentationOnEndGame";
                export const OnChangeStepPack:string 	= "OnPresentationChangeStepPack";
                export const OnMissStep:string 	= "PresentationOnMissStep";
            }
        }

    }
}