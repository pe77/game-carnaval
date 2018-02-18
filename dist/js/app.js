var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
window.onload = function () {
    var game = new GameBase.Game();
};
/// <reference path='../vendor/phaser/phaser.d.ts' />
var Pk;
(function (Pk) {
    var PkEvent = (function () {
        function PkEvent(name, target) {
            this.id = ++PkEvent.id;
            this.listeners = [];
            this.target = target;
            this.name = name;
            Pk.PkEvent.events.push(this);
        }
        PkEvent.ignoreContext = function (context) {
            for (var i = 0; i < Pk.PkEvent.events.length; i++) {
                var event = Pk.PkEvent.events[i];
                var listeners = Pk.PkEvent.events[i].listeners;
                var tmpListeners = [];
                for (var j = 0; j < listeners.length; j++) {
                    var listener = listeners[j];
                    if (!listener.context.event) {
                        tmpListeners.push(listener);
                        continue;
                    }
                    if (listener.context.event.id !== context.event.id) {
                        tmpListeners.push(listener);
                    }
                    else {
                        // console.debug('ignore context:', context)
                    }
                }
                Pk.PkEvent.events[i].listeners = tmpListeners;
            }
        };
        PkEvent.prototype.add = function (key, callBack, context) {
            var context = context || {};
            var exist = false;
            // verifica se já não foi add
            for (var i = 0; i < this.listeners.length; i++) {
                if (this.listeners[i].callBack.toString() === callBack.toString()
                    &&
                        this.listeners[i].context === context) {
                    exist = true;
                    break;
                }
            }
            ;
            if (!exist)
                this.listeners.push({ key: key, callBack: callBack, context: context });
            //
        };
        PkEvent.prototype.clear = function (key) {
            // clear all
            if (!key) {
                this.listeners = [];
            }
            else {
                var tmpListeners = [];
                for (var i = 0; i < this.listeners.length; i++) {
                    if (key != this.listeners[i].key) {
                        tmpListeners.push(this.listeners[i]);
                    }
                }
                this.listeners = tmpListeners;
                return;
            }
        };
        PkEvent.prototype.dispatch = function (key) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (this.target.name == 'Lizzard') {
                // console.debug('dispath lizzard event:', key)
            }
            for (var i = 0; i < this.listeners.length; i++) {
                if (key == this.listeners[i].key) {
                    var data = {
                        target: this.target // ho dispatch the event
                    };
                    // se houver contexto, manda pelo contexto
                    if (this.listeners[i].context) {
                        (_a = this.listeners[i].callBack).call.apply(_a, [this.listeners[i].context, data].concat(args));
                        continue;
                    }
                    // dispara sem contexto mesmo
                    (_b = this.listeners[i]).callBack.apply(_b, [data].concat(args));
                }
            }
            var _a, _b;
        };
        return PkEvent;
    }());
    PkEvent.id = 0;
    PkEvent.events = [];
    Pk.PkEvent = PkEvent;
})(Pk || (Pk = {}));
/// <reference path='../PkTransition.ts' />
var Pk;
(function (Pk) {
    var PkTransitionAnimation;
    (function (PkTransitionAnimation) {
        var Default = (function () {
            function Default() {
                this.event = new Pk.PkEvent('PkTADefault', this);
            }
            Default.prototype.start = function () {
                // animation here
                // ...
                this.event.dispatch(Pk.E.OnTransitionEndStart);
            };
            Default.prototype.end = function () {
                // animation here
                // ...
                this.event.dispatch(Pk.E.OnTransitionEndEnd);
            };
            return Default;
        }());
        PkTransitionAnimation.Default = Default;
    })(PkTransitionAnimation = Pk.PkTransitionAnimation || (Pk.PkTransitionAnimation = {}));
})(Pk || (Pk = {}));
/// <reference path='../event/PkEvent.ts' />
/// <reference path='../PkGame.ts' />
/// <reference path='PkState.ts' />
/// <reference path='transitions/Default.ts' />
var Pk;
(function (Pk) {
    var PkTransition = (function () {
        function PkTransition(state) {
            this.transitionAnimation = new Pk.PkTransitionAnimation.Default();
            // defaults
            this.clearWorld = true;
            this.clearCache = false;
            this.game = state.game;
            this.state = state;
        }
        PkTransition.prototype.change = function (to) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            this.to = to;
            this.params = args;
            this.transitionAnimation.event.add(Pk.E.OnTransitionEndStart, this.endStartAnimation, this);
            this.transitionAnimation.event.add(Pk.E.OnTransitionEndEnd, this.endStartAnimation, this);
            this.transitionAnimation.start();
        };
        // This is called when the state preload has finished and creation begins
        PkTransition.prototype.endStartAnimation = function (e) {
            var _this = this;
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            this.game.state.onStateChange.addOnce(function (state) {
                // get current state
                var currentState = _this.game.state.getCurrentState();
                _this.game.state.onCreateCallback = function () {
                    // call current state create
                    currentState.create();
                    // play transition end
                    _this.transitionAnimation.end();
                };
            });
            // change state
            (_a = this.game.state).start.apply(_a, [this.to, this.clearWorld, this.clearCache].concat(this.params));
            var _a;
        };
        return PkTransition;
    }());
    Pk.PkTransition = PkTransition;
    var E;
    (function (E) {
        E.OnTransitionEndStart = "OnTransitionEndStart";
        E.OnTransitionEndEnd = "OnTransitionEndEnd";
    })(E = Pk.E || (Pk.E = {}));
})(Pk || (Pk = {}));
/// <reference path='../vendor/phaser/phaser.d.ts' />
var Pk;
(function (Pk) {
    var PkElement = (function (_super) {
        __extends(PkElement, _super);
        function PkElement(game) {
            var _this = _super.call(this, game) || this;
            _this.id = ++PkElement.id;
            _this.tweens = [];
            _this.name = "PkElement-" + _this.id;
            // inicia gerenciador de eventos
            _this.event = new Pk.PkEvent('element-event-' + _this.id, _this);
            return _this;
        }
        PkElement.prototype.getId = function () {
            return this.id;
        };
        PkElement.prototype.addTween = function (displayObject) {
            this.tweens.push(this.game.add.tween(displayObject));
            return this.tweens[this.tweens.length - 1];
        };
        PkElement.prototype.destroy = function () {
            // stop all tweens
            for (var i = this.tweens.length - 1; i >= 0; i--)
                this.tweens[i].stop();
            //
            // clear all events propagation many-to-many
            this.event.clear();
            Pk.PkEvent.ignoreContext(this);
            _super.prototype.destroy.call(this);
        };
        return PkElement;
    }(Phaser.Group));
    PkElement.id = 0;
    Pk.PkElement = PkElement;
})(Pk || (Pk = {}));
/// <reference path='PkTransition.ts' />
/// <reference path='../element/PkElement.ts' />
/// <reference path='../vendor/phaser/phaser.d.ts' />
var Pk;
(function (Pk) {
    var PkState = (function (_super) {
        __extends(PkState, _super);
        function PkState() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.layers = [];
            _this.addLayer = function (layerName) {
                var exist = false;
                // check if already exist
                for (var i = 0; i < this.layers.length; i++) {
                    if (this.layers[i].name == layerName) {
                        exist = true;
                        break;
                    }
                }
                ;
                if (!exist) {
                    // add to layer
                    this.layers.push({
                        name: layerName,
                        total: 0,
                        group: this.game.add.group()
                    });
                }
            };
            _this.addToLayer = function (layerName, element) {
                var exist = false;
                // check if already exist
                for (var i = 0; i < this.layers.length; i++) {
                    if (this.layers[i].name == layerName) {
                        exist = true;
                        break;
                    }
                }
                ;
                // if dont exist, wharever
                if (!exist)
                    return;
                //
                // add element to layer
                this.layers[i].group.add(element);
                this.layers[i].total = this.layers[i].group.total;
                // order layers
                for (var i = 0; i < this.layers.length; i++)
                    this.game.world.bringToTop(this.layers[i].group);
                //
            };
            return _this;
        }
        PkState.prototype.getGame = function () {
            return this.game;
        };
        PkState.prototype.getLayer = function (layerName) {
            for (var i = 0; i < this.layers.length; i++)
                if (this.layers[i].name == layerName)
                    return this.layers[i];
            //
            return null;
        };
        PkState.prototype.init = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            this.transition = new Pk.PkTransition(this);
        };
        PkState.prototype.create = function () {
            // console.log('PkState create');
        };
        return PkState;
    }(Phaser.State));
    Pk.PkState = PkState;
})(Pk || (Pk = {}));
/// <reference path='vendor/phaser/phaser.d.ts' />
/// <reference path='state/PkState.ts' />
var Pk;
(function (Pk) {
    var PkGame = (function (_super) {
        __extends(PkGame, _super);
        function PkGame(pkConfig) {
            if (pkConfig === void 0) { pkConfig = new Pk.PkConfig(); }
            var _this = _super.call(this, pkConfig.canvasSize[0], pkConfig.canvasSize[1], pkConfig.renderMode, pkConfig.canvasId) || this;
            PkGame.pkConfig = pkConfig;
            // add states
            _this.state.add('PkLoaderPreLoader', PkGame.pkConfig.preLoaderState);
            // init loader
            _this.state.start('PkLoaderPreLoader');
            PkGame.game = _this;
            return _this;
        }
        return PkGame;
    }(Phaser.Game));
    Pk.PkGame = PkGame;
    var PkLoaderPreLoader = (function (_super) {
        __extends(PkLoaderPreLoader, _super);
        function PkLoaderPreLoader() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        PkLoaderPreLoader.prototype.init = function () {
            // add loader screen
            this.game.state.add('PkLoader', PkGame.pkConfig.loaderState);
        };
        PkLoaderPreLoader.prototype.preload = function () {
            // load loadingbar sprite
            this.load.image('pk-loading-bar', PkGame.pkConfig.loaderLoadingBar);
        };
        PkLoaderPreLoader.prototype.create = function () {
            // change to preloader screen*
            this.game.state.start('PkLoader');
        };
        return PkLoaderPreLoader;
    }(Pk.PkState));
    Pk.PkLoaderPreLoader = PkLoaderPreLoader;
})(Pk || (Pk = {}));
var Pk;
(function (Pk) {
    var PkConfig = (function () {
        function PkConfig() {
            this.canvasSize = [800, 600]; // width, height
            this.canvasId = 'game';
            this.renderMode = RenderMode.AUTO;
            this.initialState = ''; // initial state after loadscreen
            // loading settings
            this.loaderLoadingBar = 'assets/states/loader/images/loading-bar.png'; // loading bar
            this.loaderWaitingTime = 1000; // 1 sec
            this.loaderState = Pk.PkLoader;
            this.preLoaderState = Pk.PkLoaderPreLoader;
        }
        return PkConfig;
    }());
    Pk.PkConfig = PkConfig;
    // for remember ...    :'(     ... never forget
    var RenderMode;
    (function (RenderMode) {
        RenderMode[RenderMode["AUTO"] = Phaser.AUTO] = "AUTO";
        RenderMode[RenderMode["CANVAS"] = Phaser.CANVAS] = "CANVAS";
        RenderMode[RenderMode["WEBGL"] = Phaser.WEBGL] = "WEBGL";
        RenderMode[RenderMode["HEADLESS"] = Phaser.HEADLESS] = "HEADLESS";
    })(RenderMode = Pk.RenderMode || (Pk.RenderMode = {}));
})(Pk || (Pk = {}));
/// <reference path='state/PkState.ts' />
var Pk;
(function (Pk) {
    var PkLoader = (function (_super) {
        __extends(PkLoader, _super);
        function PkLoader() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        PkLoader.prototype.init = function () {
        };
        PkLoader.prototype.preload = function () {
            this.load.setPreloadSprite(this.add.sprite(200, 250, 'pk-loading-bar'));
        };
        PkLoader.prototype.create = function () {
            var _this = this;
            setTimeout(function () {
                // if initial state set, load
                if (Pk.PkGame.pkConfig.initialState != '')
                    _this.game.state.start(Pk.PkGame.pkConfig.initialState);
                //
            }, Pk.PkGame.pkConfig.loaderWaitingTime);
        };
        return PkLoader;
    }(Pk.PkState));
    Pk.PkLoader = PkLoader;
})(Pk || (Pk = {}));
/// <reference path='../vendor/phaser/phaser.d.ts' />
var Pk;
(function (Pk) {
    var PkUtils = (function () {
        function PkUtils() {
        }
        // check if is a empty object
        PkUtils.isEmpty = function (obj) {
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop))
                    return false;
            }
            return true && JSON.stringify(obj) === JSON.stringify({});
        };
        PkUtils.createSquareBitmap = function (game, width, height, color) {
            if (color === void 0) { color = "#000000"; }
            var bmd = game.add.bitmapData(width, height);
            bmd.ctx.beginPath();
            bmd.ctx.rect(0, 0, width, height);
            bmd.ctx.fillStyle = color;
            bmd.ctx.fill();
            return bmd;
        };
        PkUtils.createSquare = function (game, width, height, color) {
            if (color === void 0) { color = "#000000"; }
            var bmd = Pk.PkUtils.createSquareBitmap(game, width, height, color);
            return game.add.sprite(0, 0, bmd);
        };
        PkUtils.createCircle = function (game, diameter, color) {
            if (color === void 0) { color = "#000000"; }
            var circleBtm = game.add.graphics(0, 0);
            //	Shapes drawn to the Graphics object must be filled.
            circleBtm.beginFill(0xffffff);
            //	Here we'll draw a circle
            circleBtm.drawCircle(0, 0, diameter);
            return game.add.sprite(0, 0, circleBtm);
        };
        return PkUtils;
    }());
    Pk.PkUtils = PkUtils;
})(Pk || (Pk = {}));
/// <reference path='PkGame.ts' />
/// <reference path='PkConfig.ts' />
/// <reference path='PkLoader.ts' />
/// <reference path='state/PkState.ts' />
/// <reference path='state/PkTransition.ts' />
/// <reference path='state/transitions/Default.ts' />
/// <reference path='event/PkEvent.ts' />
/// <reference path='element/PkElement.ts' />
/// <reference path='utils/PkUtils.ts' /> 
/// <reference path='../pkframe/refs.ts' />
var GameBase;
(function (GameBase) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            var _this = _super.call(this, new Config()) || this;
            // add default state
            _this.state.add('Main', GameBase.Main);
            _this.state.add('Intro', GameBase.Intro);
            return _this;
        }
        return Game;
    }(Pk.PkGame));
    GameBase.Game = Game;
    var CollisionCategories;
    (function (CollisionCategories) {
        CollisionCategories.Car = 6;
        CollisionCategories.Player = 1;
        CollisionCategories.PowerUps = 2;
        CollisionCategories.Floor = 3;
        CollisionCategories.Die = 4;
        CollisionCategories.Banner = 5;
    })(CollisionCategories = GameBase.CollisionCategories || (GameBase.CollisionCategories = {}));
    var Config = (function (_super) {
        __extends(Config, _super);
        function Config() {
            var _this = _super.call(this) || this;
            // loading load screen assets (logo, loading bar, etc) [pre-preloading]
            _this.preLoaderState = GameBase.Preloader;
            // loading all* game assets
            _this.loaderState = GameBase.Loader;
            // this.canvasSize = ["100%", 720];
            _this.canvasSize = [800, 600];
            _this.initialState = 'Main';
            return _this;
        }
        return Config;
    }(Pk.PkConfig));
})(GameBase || (GameBase = {}));
/// <reference path='../pkframe/refs.ts' />
var GameBase;
(function (GameBase) {
    var IntroBox = (function (_super) {
        __extends(IntroBox, _super);
        function IntroBox(game, image, time) {
            if (time === void 0) { time = 5000; }
            var _this = _super.call(this, game) || this;
            // set img
            _this.image = image;
            _this.time = time;
            _this.image.anchor.x = .5;
            _this.image.x = _this.game.world.centerX;
            // add objs
            _this.add(_this.image);
            // "display none"
            _this.alpha = 0;
            return _this;
        }
        IntroBox.prototype.in = function (delay) {
            // anim block
            var _this = this;
            if (delay === void 0) { delay = 1500; }
            this.addTween(this).to({
                alpha: 1
            }, // props
            500, // animation time
            Phaser.Easing.Linear.None, // tween
            true, // auto start
            delay // delay 
            );
            setTimeout(function () {
                _this.event.dispatch(GameBase.E.IntroBoxEvent.OnIntroBoxEnd);
            }, this.time);
        };
        IntroBox.prototype.out = function (delay) {
            var _this = this;
            if (delay === void 0) { delay = 0; }
            // anim block
            var outTween = this.addTween(this).to({
                alpha: 0
            }, // props
            500, // animation time
            Phaser.Easing.Linear.None, // tween
            false, // auto start
            delay // delay 
            );
            // remove when anim out complete
            outTween.onComplete.add(function () {
                _this.destroy();
            }, this);
            outTween.start();
        };
        return IntroBox;
    }(Pk.PkElement));
    GameBase.IntroBox = IntroBox;
    var E;
    (function (E) {
        var IntroBoxEvent;
        (function (IntroBoxEvent) {
            IntroBoxEvent.OnIntroBoxEnd = "OnIntroBoxEnd";
        })(IntroBoxEvent = E.IntroBoxEvent || (E.IntroBoxEvent = {}));
        var IntroBoxDirection;
        (function (IntroBoxDirection) {
            IntroBoxDirection[IntroBoxDirection["LEFT"] = 0] = "LEFT";
            IntroBoxDirection[IntroBoxDirection["RIGHT"] = 1] = "RIGHT";
        })(IntroBoxDirection = E.IntroBoxDirection || (E.IntroBoxDirection = {}));
    })(E = GameBase.E || (GameBase.E = {}));
})(GameBase || (GameBase = {}));
/// <reference path='../pkframe/refs.ts' />
var GameBase;
(function (GameBase) {
    var Preloader = (function (_super) {
        __extends(Preloader, _super);
        function Preloader() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Preloader.prototype.preload = function () {
            // utils / vendor
            this.load.script('WebFont', 'com/gamebase/vendor/webfontloader.js');
            // load game loading bar
            // this.load.image('game-loading-bar', 'assets/states/loader/images/loading-bar.png');
            // load game loading logo
            // this.load.image('game-loading-logo', 'assets/states/loader/images/logo.png');
        };
        return Preloader;
    }(Pk.PkLoaderPreLoader));
    GameBase.Preloader = Preloader;
    var Loader = (function (_super) {
        __extends(Loader, _super);
        function Loader() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Loader.prototype.init = function () {
            _super.prototype.init.call(this);
        };
        Loader.prototype.preload = function () {
            // ignore preloading bar
            // super.preload();
            var _this = this;
            // creating sprites from preloadead images
            // this.logo           = this.add.sprite(0, 0, 'game-loading-logo');
            // create custom loading bar
            this.loadingBar = Pk.PkUtils.createSquare(this.game, this.game.width, 20, "#ffffff");
            // set sprite as preloading
            this.load.setPreloadSprite(this.loadingBar);
            // pos loading bar on bot
            this.loadingBar.y = this.world.height - this.loadingBar.height - 50;
            this.loadingText = this.game.add.text(0, 0, '0%', // text
            {
                font: "120px Love Story Rough",
                fill: "#ffffff"
            } // font style
            );
            this.loadingText.anchor.set(.5, .5);
            this.loadingText.x = this.world.centerX;
            this.loadingText.y = this.world.centerY;
            // fileComplete
            // this.fil
            this.game.load.onFileComplete.add(function (progress) {
                var v = Math.round((progress * 0.01) * 100);
                _this.loadingText.text = v + '%';
            }, this);
            //  ** ADDING Other things  ** //
            // scripts
            this.load.script('gray', 'assets/default/scripts/filters/Gray.js');
            // intro
            this.load.image('intro-jam', 'assets/states/intro/images/jam.png');
            this.load.image('intro-phaser', 'assets/states/intro/images/phaser.png');
            // this.load.image('cinematic-bg', 'assets/states/intro/images/cinematic-bg.jpg');
            // this.load.audio('intro-sound', 'assets/states/intro/sounds/intro.mp3');
            // this.load.spritesheet('char1-idle', 'assets/default/images/chars/heroes/1/iddle.png', 158, 263, 12);
        };
        Loader.prototype.create = function () {
            _super.prototype.create.call(this);
        };
        return Loader;
    }(Pk.PkLoader));
    GameBase.Loader = Loader;
})(GameBase || (GameBase = {}));
var GameBase;
(function (GameBase) {
    var Presentation;
    (function (Presentation_1) {
        var Presentation = (function (_super) {
            __extends(Presentation, _super);
            function Presentation(game) {
                var _this = _super.call(this, game) || this;
                _this.timee = 50; // ms
                _this.gameOver = false;
                _this.firstNote = true;
                return _this;
            }
            Presentation.prototype.create = function () {
                var _this = this;
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
                this.timeBar.event.add(GameBase.Bar.E.TimeEvent.OnEndCount, function () {
                    _this.endTimeBar();
                }, this);
                this.likometer.event.add(GameBase.Bar.E.LikometerEvent.OnOver, function () {
                    _this.endGame(false);
                }, this);
                // sempre que o pack acabar...
                this.controller.event.add(GameBase.Step.E.ControllerEvent.OnEndPack, function (e, hit, originalPackSize) {
                    console.log('END PACK');
                    if (!_this.gameOver)
                        _this.endPack(hit, originalPackSize);
                    //
                }, this);
                // sempre que o pack iniciar 
                this.controller.event.add(GameBase.Step.E.ControllerEvent.OnEndPack, function (e, hit, originalPackSize) {
                    var time = 116 - (_this.level.level * 15);
                    time = time < 50 ? 50 : time;
                    if (!_this.gameOver)
                        _this.timeBar.startCount(time);
                    //
                }, this);
                // sempre que acabar os packs do controller
                this.controller.event.add(GameBase.Step.E.ControllerEvent.OnEndAllPacks, function (e, hit, originalPackSize) {
                    console.log('TERMINOU TODOS OS PACK', hit, originalPackSize);
                    setTimeout(function () {
                        if (!_this.gameOver)
                            _this.playNextLevel(hit, originalPackSize);
                        //
                    }, 800);
                }, this);
                this.audience.pulse();
                this.updatePosition();
            };
            Presentation.prototype.start = function (level) {
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
            };
            Presentation.prototype.prepare = function () {
                // a cada level, vai diminuindo os packs
                var totalPacks = 10 - (this.level.level * 2);
                totalPacks = totalPacks < 1 ? 1 : totalPacks;
                // quanto maior o level, maior a quantidade de notas
                var totalStepInterval = [2 + this.level.level, 4 + this.level.level];
                // gera uma serie de packs
                for (var i = 0; i < totalPacks; i++)
                    this.controller.addStepPack(Step.StepPack.generateStepPack(this.game, this.game.rnd.integerInRange(totalStepInterval[0], totalStepInterval[1])));
                //
            };
            Presentation.prototype.playNextLevel = function (hit, originalPackSize) {
                if (this.level.level == 12 && hit) {
                    this.endGame(true);
                    return;
                }
                // almenta a dificuldade, se acertou
                if (hit)
                    this.level.setLevel(this.level.level + 1);
                //
                // add umas notinhas
                this.prepare();
                // toca
                this.controller.playNext();
            };
            Presentation.prototype.endTimeBar = function () {
                // se tiver alguma nota, erra remove contagem
                this.likometer.removeValue(25);
                // força o erro
                this.controller.killStep(false);
            };
            Presentation.prototype.endPack = function (hit, originalPackSize) {
                var _this = this;
                // se fechou, calcula a grana
                if (hit) {
                    var scoreVal = this.timeBar.value * originalPackSize;
                    scoreVal /= 8;
                    scoreVal = Math.floor(scoreVal * 0.1);
                    // da um bonus por level
                    scoreVal += 2 * this.level.level;
                    scoreVal = scoreVal < 2 ? 2 : scoreVal;
                    this.score.addValue(scoreVal);
                }
                else {
                    // quanto mais facil, mais dinheiro perde
                    var scoreVal = this.timeBar.value / originalPackSize;
                    scoreVal = Math.floor(scoreVal * 0.1);
                    scoreVal = scoreVal < 10 ? 10 : scoreVal;
                    this.score.removeValue(scoreVal);
                }
                // re-inicia o tempo
                this.timeBar.startCount(100);
                // espera um pouquinho
                setTimeout(function () {
                    // this.resetPacks();
                    _this.controller.playNext();
                    _this.event.dispatch(GameBase.Presentation.E.PresentationEvent.OnChangeStepPack, _this.controller.currentPack);
                }, 500);
            };
            Presentation.prototype.pressStep = function (direction) {
                // se não tem stepPack, ignora
                if (!this.controller.currentPack || this.gameOver) {
                    console.log('-- IGNORA CLICK');
                    return;
                }
                // se apertou a direção certa
                if (this.controller.playDirection(direction)) {
                    this.likometer.addValue(1);
                    this.controller.killStep(true);
                }
                else {
                    this.likometer.removeValue(30);
                    this.controller.killStep(false);
                    this.event.dispatch(GameBase.Presentation.E.PresentationEvent.OnMissStep);
                }
                // se for a primeira nota, toca eventos
                if (this.firstNote) {
                    this.event.dispatch(GameBase.Presentation.E.PresentationEvent.OnFirstNote);
                    this.firstNote = false;
                }
            };
            Presentation.prototype.updatePosition = function () {
                // posiciona as coisas
                this.controller.x = this.game.world.centerX - this.controller.width / 2;
                this.controller.y = 30;
                this.likometer.y += 80;
                this.likometer.x = this.game.world.width - this.likometer.backSprite.width - 20;
                this.timeBar.x = this.controller.x + this.controller.width;
                this.timeBar.y = this.controller.y + 27;
                // this.score.x += 20;
                this.score.y += 20;
                this.level.y = this.score.y + this.score.height + 30;
            };
            Presentation.prototype.endGame = function (win) {
                if (win === void 0) { win = false; }
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
            };
            Presentation.prototype.restart = function () {
                // volta pro level 1
                this.start(1);
            };
            return Presentation;
        }(Pk.PkElement));
        Presentation_1.Presentation = Presentation;
        var E;
        (function (E) {
            var PresentationEvent;
            (function (PresentationEvent) {
                PresentationEvent.OnFirstNote = "OnPresentationEventFirstNote";
                PresentationEvent.OnEndGame = "PresentationOnEndGame";
                PresentationEvent.OnChangeStepPack = "OnPresentationChangeStepPack";
                PresentationEvent.OnMissStep = "PresentationOnMissStep";
            })(PresentationEvent = E.PresentationEvent || (E.PresentationEvent = {}));
        })(E = Presentation_1.E || (Presentation_1.E = {}));
    })(Presentation = GameBase.Presentation || (GameBase.Presentation = {}));
})(GameBase || (GameBase = {}));
var GameBase;
(function (GameBase) {
    var Bar;
    (function (Bar) {
        var Vertical = (function (_super) {
            __extends(Vertical, _super);
            function Vertical(game, backSprite, barSprite, borderSprite) {
                var _this = _super.call(this, game) || this;
                _this.value = 100;
                _this.backSprite = backSprite;
                _this.barSprite = barSprite;
                _this.borderSprite = borderSprite;
                return _this;
            }
            Vertical.prototype.create = function () {
                // cria uma mascara do tamanho da barra
                this.maskGraph = this.game.add.graphics(0, 0);
                this.maskGraph.beginFill(0xffffff);
                this.maskGraph.lineStyle(1, 0xffd900, 1);
                console.log('this.borderSprite.width:', this.borderSprite.width);
                console.log('this.borderSprite.height:', this.borderSprite.height);
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
                this.add(this.maskGraph);
            };
            Vertical.prototype.addValue = function (value) {
                this.value += value;
                this.value = this.value > 100 ? 100 : this.value;
                this.processValue();
            };
            Vertical.prototype.removeValue = function (value) {
                this.value -= value;
                this.value = this.value < 0 ? 0 : this.value;
                this.processValue();
            };
            Vertical.prototype.setValue = function (value) {
                this.value = value;
                this.value = this.value < 0 ? 0 : this.value;
                this.value = this.value > 100 ? 100 : this.value;
                this.processValue();
            };
            Vertical.prototype.getValue = function () {
                return this.value;
            };
            Vertical.prototype.processValue = function (time) {
                if (time === void 0) { time = 500; }
                var x = this.value * 0.01;
                var v = this.maxSize - (x * this.maxSize); // - this.maxSize;
                // se houver alguma animação, pausa
                if (this.tween)
                    this.tween.stop(true);
                //
                this.tween = this.addTween(this.barSprite).to({
                    y: v
                }, time, Phaser.Easing.Back.Out, true);
            };
            return Vertical;
        }(Pk.PkElement));
        Bar.Vertical = Vertical;
    })(Bar = GameBase.Bar || (GameBase.Bar = {}));
})(GameBase || (GameBase = {}));
var GameBase;
(function (GameBase) {
    var Car;
    (function (Car_1) {
        var Car = (function (_super) {
            __extends(Car, _super);
            function Car(game) {
                var _this = _super.call(this, game) || this;
                _this.size = 50;
                _this.frequency = 3.5;
                _this.damping = 0.5;
                _this.motorTorque = 2;
                _this.motorSpeed = 50;
                _this.rideHeight = 0.5;
                _this.direction = 1;
                _this.driveJoints = [];
                _this.name = '-nome padrão-';
                return _this;
            }
            Car.prototype.create = function (position) {
                var _this = this;
                if (position === void 0) { position = new Phaser.Point(0, 0); }
                this.base = new Phaser.Sprite(this.game, 0, 0);
                this.game.physics.box2d.enable(this.base);
                this.base.body.setCircle(20);
                this.base.body.x = position.x;
                this.base.body.y = position.y;
                this.base.body.fixedRotation = true;
                this.sensor = this.base.body.addRectangle(this.size * 3, this.size, 0, this.size / 2 - this.size / 2);
                this.sensor.SetSensor(true);
                var PTM = this.size;
                var wheelBodies = [];
                wheelBodies[0] = new Phaser.Physics.Box2D.Body(this.game, null, -1 * PTM, 0.6 * -PTM);
                wheelBodies[1] = new Phaser.Physics.Box2D.Body(this.game, null, 1 * PTM, 0.6 * -PTM);
                wheelBodies[0].setCircle(0.4 * PTM);
                wheelBodies[1].setCircle(0.4 * PTM);
                this.driveJoints[0] = this.game.physics.box2d.wheelJoint(this.base.body, wheelBodies[0], -1 * PTM, this.rideHeight * PTM, 0, 0, 0, 1, this.frequency, this.damping, 0, this.motorTorque, true); // rear
                this.driveJoints[1] = this.game.physics.box2d.wheelJoint(this.base.body, wheelBodies[1], 1 * PTM, this.rideHeight * PTM, 0, 0, 0, 1, this.frequency, this.damping, 0, this.motorTorque, true); // front
                this.base.body.setCollisionCategory(GameBase.CollisionCategories.Car);
                this.base.body.element = this;
                this.base.body.setCategoryContactCallback(GameBase.CollisionCategories.Car, function (body1, body2, fixture1, fixture2, begin) {
                    if (!begin || body1.id == body2.id || !body2.element)
                        return;
                    //
                    var advCar = body2.element;
                    if (_this.name == 'Carro 1') {
                        console.log(_this.name + ' bateu no carro:', advCar.name);
                        // força aplicada no adversario
                        var forceX = 1500;
                        var forceY = -2000;
                        advCar.base.body.applyForce(forceX * _this.direction, forceY);
                        // força aplicada em si mesmo
                        _this.base.body.applyForce(forceX * -_this.direction, forceY / 2);
                        // balança a camera
                        _this.game.camera.shake(0.01, 100);
                    }
                    //
                }, this);
            };
            Car.prototype.update = function () {
                for (var i = 0; i < 2; i++) {
                    this.driveJoints[i].EnableMotor(true);
                    this.driveJoints[i].SetMotorSpeed(this.motorSpeed * this.direction);
                }
            };
            return Car;
        }(Pk.PkElement));
        Car_1.Car = Car;
    })(Car = GameBase.Car || (GameBase.Car = {}));
})(GameBase || (GameBase = {}));
var GameBase;
(function (GameBase) {
    var Floor;
    (function (Floor_1) {
        var Floor = (function (_super) {
            __extends(Floor, _super);
            function Floor(game) {
                return _super.call(this, game) || this;
            }
            Floor.prototype.create = function () {
                this.body = Pk.PkUtils.createSquare(this.game, this.game.world.width, 30);
                this.body.y = this.game.world.height - this.body.height / 2;
                this.body.x = this.game.world.centerX;
                this.game.physics.box2d.enable(this.body);
                this.body.body.static = true;
                this.body.body.setCollisionCategory(GameBase.CollisionCategories.Floor);
            };
            return Floor;
        }(Pk.PkElement));
        Floor_1.Floor = Floor;
    })(Floor = GameBase.Floor || (GameBase.Floor = {}));
})(GameBase || (GameBase = {}));
/// <reference path='../../pkframe/refs.ts' />
var GameBase;
(function (GameBase) {
    var Intro = (function (_super) {
        __extends(Intro, _super);
        function Intro() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Intro.prototype.init = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            _super.prototype.init.call(this, args); // if whant override init, you need this line!
        };
        Intro.prototype.create = function () {
            var _this = this;
            _super.prototype.create.call(this);
            // change state bg
            this.game.stage.backgroundColor = "#000";
            // prevent stop update when focus out
            this.stage.disableVisibilityChange = true;
            // audio
            this.musicBG = this.game.add.audio('intro-audiobg');
            this.musicBG.onDecoded.add(this.playSound, this); // load
            this.phaser = this.game.add.sprite(0, 0, 'intro-phaser');
            this.phaser.alpha = 0;
            this.phaser.anchor.set(.5, .5);
            this.phaser.x = this.game.world.centerX;
            this.phaser.y = this.game.world.centerY;
            this.jam = this.game.add.sprite(0, 0, 'intro-jam');
            this.jam.alpha = 0;
            this.jam.anchor.set(.5, .5);
            this.jam.x = this.game.world.centerX;
            this.jam.y = this.game.world.centerY;
            this.alphaInOut(this.phaser, function () {
                _this.alphaInOut(_this.jam, function () {
                    _this.transition.change('Main');
                });
            });
        };
        Intro.prototype.alphaInOut = function (object, callBack) {
            var _this = this;
            var tween = this.game.add.tween(object).to({
                alpha: 1
            }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(function () {
                var tween = _this.game.add.tween(object).to({
                    alpha: 0
                }, 1000, Phaser.Easing.Linear.None, true, 3000);
                tween.onComplete.add(function () {
                    callBack();
                }, _this);
            }, this);
        };
        Intro.prototype.playSound = function () {
            // play music
            // this.musicBG.play('', 0, 0.6, true);
        };
        // calls when leaving state
        Intro.prototype.shutdown = function () {
        };
        return Intro;
    }(Pk.PkState));
    GameBase.Intro = Intro;
})(GameBase || (GameBase = {}));
/// <reference path='../../pkframe/refs.ts' />
var GameBase;
(function (GameBase) {
    var Main = (function (_super) {
        __extends(Main, _super);
        function Main() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Main.prototype.init = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            _super.prototype.init.call(this, args); // if whant override init, you need this line!
        };
        Main.prototype.create = function () {
            _super.prototype.create.call(this);
            // change state bg
            this.game.stage.backgroundColor = "#938da0";
            // prevent stop update when focus out
            // this.stage.disableVisibilityChange = true;
            // Enable Box2D physics
            this.game.physics.startSystem(Phaser.Physics.BOX2D);
            this.game.physics.box2d.gravity.y = 500;
            this.game.physics.box2d.restitution = 0.3;
            this.game.physics.box2d.setBoundsToWorld();
            // chão
            this.floor = new GameBase.Floor.Floor(this.game);
            this.floor.create();
            // chão
            var car1 = new GameBase.Car.Car(this.game);
            car1.name = 'Carro 1';
            car1.motorSpeed = 100;
            car1.create(new Phaser.Point(100, 200));
            var car2 = new GameBase.Car.Car(this.game);
            car2.direction = -1;
            car2.name = 'Carro 2';
            car2.create(new Phaser.Point(this.game.world.width, 200));
        };
        Main.prototype.playSound = function () {
            // play music
        };
        Main.prototype.render = function () {
            this.game.debug.box2dWorld();
            this.game.debug.text('Main Screen', this.game.world.centerX, 35);
        };
        // calls when leaving state
        Main.prototype.shutdown = function () {
        };
        return Main;
    }(Pk.PkState));
    GameBase.Main = Main;
})(GameBase || (GameBase = {}));
/// <reference path='../../pkframe/refs.ts' />
var GameBase;
(function (GameBase) {
    var Transitions;
    (function (Transitions) {
        var Alpha = (function () {
            function Alpha(game) {
                this.event = new Pk.PkEvent('Transitions.Alpha', this);
                this.changeTime = 500; // ms
                this.game = game;
            }
            Alpha.prototype.start = function () {
                var _this = this;
                // create a full screen black retangle alpha 0
                this.retangle = Pk.PkUtils.createSquare(this.game, this.game.camera.width, this.game.camera.height, "#000000");
                this.retangle.alpha = 0;
                // create a tween animation
                // tween samples: http://phaser.io/examples/v2/category/tweens
                var t = this.game.add.tween(this.retangle).to({ alpha: 1 }, this.changeTime, "Linear");
                t.onComplete.add(function () {
                    // dispatch end transition | mandatory
                    _this.event.dispatch(Pk.E.OnTransitionEndStart);
                }, this);
                t.start(); // play tween
            };
            Alpha.prototype.end = function () {
                var _this = this;
                // create a full screen black retangle alpha 1. Revert previous transition
                var retangle = Pk.PkUtils.createSquare(this.game, this.game.camera.width, this.game.camera.height, "#000000");
                // create a tween animation
                // tween samples: http://phaser.io/examples/v2/category/tweens
                var t = this.game.add.tween(retangle).to({ alpha: 0 }, this.changeTime, "Linear");
                t.onComplete.add(function () {
                    // dispatch end transition | mandatory
                    _this.event.dispatch(Pk.E.OnTransitionEndEnd);
                }, this);
                t.start(); // play tween
            };
            return Alpha;
        }());
        Transitions.Alpha = Alpha;
    })(Transitions = GameBase.Transitions || (GameBase.Transitions = {}));
})(GameBase || (GameBase = {}));
/// <reference path='../../pkframe/refs.ts' />
var GameBase;
(function (GameBase) {
    var Transitions;
    (function (Transitions) {
        var Slide = (function () {
            function Slide(game) {
                this.event = new Pk.PkEvent('Transitions.Slide', this);
                this.changeTime = 500; // ms
                this.game = game;
            }
            Slide.prototype.start = function () {
                // create bg
                var poly = new Phaser.Polygon();
                poly.setTo([
                    new Phaser.Point((this.game.world.width / 2) * (-1), 0),
                    new Phaser.Point(this.game.world.width, 0),
                    new Phaser.Point(this.game.world.width, this.game.world.height),
                    new Phaser.Point(0, this.game.world.height) // 3
                ]);
                var bg = this.game.add.graphics(0, 0);
                bg.beginFill(0x000000);
                bg.drawPolygon(poly.points);
                bg.endFill();
                bg.x = bg.width;
                var slideTween = this.game.add.tween(bg);
                slideTween.to({
                    x: 0
                }, this.changeTime);
                slideTween.onComplete.add(function (obj) {
                    // dispatch end transition | mandatory
                    this.event.dispatch(Pk.E.OnTransitionEndStart);
                }, this);
                slideTween.start();
            };
            Slide.prototype.end = function () {
                // create bg
                var poly = new Phaser.Polygon();
                poly.setTo([
                    new Phaser.Point(0, 0),
                    new Phaser.Point(this.game.world.width, 0),
                    new Phaser.Point(this.game.world.width + (this.game.world.width / 2), this.game.world.height),
                    new Phaser.Point(0, this.game.world.height) // 3
                ]);
                var bg = this.game.add.graphics(0, 0);
                bg.beginFill(0x000000);
                bg.drawPolygon(poly.points);
                bg.endFill();
                // bg.width; // phaser
                var slideTween = this.game.add.tween(bg);
                slideTween.to({
                    x: bg.width * (-1)
                }, this.changeTime);
                slideTween.onComplete.add(function (obj) {
                    // dispatch end transition | mandatory
                    console.log('terminou animação');
                    this.event.dispatch(Pk.E.OnTransitionEndEnd);
                }, this);
                slideTween.start();
            };
            return Slide;
        }());
        Transitions.Slide = Slide;
    })(Transitions = GameBase.Transitions || (GameBase.Transitions = {}));
})(GameBase || (GameBase = {}));
var Pk;
(function (Pk) {
    var PkLayer = (function (_super) {
        __extends(PkLayer, _super);
        function PkLayer() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.distance = 1; // use for parallax effect
            return _this;
        }
        return PkLayer;
    }(Pk.PkElement));
    Pk.PkLayer = PkLayer;
})(Pk || (Pk = {}));
/// <reference path='../event/PkEvent.ts' />
/// <reference path='../PkGame.ts' />
/// <reference path='PkLayer.ts' />
var Pk;
(function (Pk) {
    var PkParallax = (function () {
        function PkParallax(state) {
            this.layers = [];
            this.state = state;
        }
        PkParallax.prototype.add = function (element, distance, cameraLock) {
            if (cameraLock === void 0) { cameraLock = true; }
            // if using TileSprite, distance is mandatary
            if (element instanceof Phaser.TileSprite && !distance)
                throw new Error("If you use TileSprite for parallax, distance param is mandatory");
            //
            if (element instanceof Pk.PkLayer && distance)
                element.distance = distance;
            //
            if (element instanceof Pk.PkLayer && distance)
                element.distance = distance;
            //
            if (element instanceof Phaser.TileSprite && cameraLock)
                element.fixedToCamera = true;
            //
            this.layers.push({
                tileElement: element instanceof Phaser.TileSprite ? element : null,
                layerElement: element instanceof Pk.PkLayer ? element : null,
                distance: element instanceof Pk.PkLayer ? element.distance : distance
            });
        };
        PkParallax.prototype.update = function () {
            for (var i in this.layers) {
                // if is tile sprite element
                if (this.layers[i].tileElement) {
                    var posX = 1 / this.layers[i].distance;
                    this.layers[i].tileElement.tilePosition.x = -this.state.game.camera.x * posX;
                    this.layers[i].tileElement.tilePosition.y = -this.state.game.camera.y * posX;
                }
                // if is layer
                if (this.layers[i].layerElement) {
                    // @todo
                }
            }
            ;
        };
        return PkParallax;
    }());
    Pk.PkParallax = PkParallax;
})(Pk || (Pk = {}));
//# sourceMappingURL=app.js.map