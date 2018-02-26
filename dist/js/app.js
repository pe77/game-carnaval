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
            _this.canvasSize = [1024, 768];
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
            for (var i = 0; i < 14; i++) {
                var index = (i + 1);
                index = index < 10 ? '0' + index : index;
                this.load.image('partyboy-' + (i + 1), 'assets/default/car/Foliao_' + index + '.png');
            }
            //
            // gaude
            this.load.image('gaude-bg', 'assets/default/gaude/gaude-bg.png');
            this.load.image('gaude-mark', 'assets/default/gaude/gaude-mark.png');
            this.load.image('gaude-button', 'assets/default/gaude/gaude-button.png');
            // car parts
            this.load.image('car-tire', 'assets/default/car/tire.png');
            this.load.image('car-body', 'assets/default/car/body.png');
            this.load.image('car-platform', 'assets/default/car/platform.png');
            // A
            this.load.image('car-a-tire', 'assets/default/car/a/tire.png');
            this.load.image('car-a-body', 'assets/default/car/a/body.png');
            this.load.image('car-a-platform', 'assets/default/car/a/platform.png');
            // B
            this.load.image('car-b-tire', 'assets/default/car/b/tire.png');
            this.load.image('car-b-body', 'assets/default/car/b/body.png');
            this.load.image('car-b-platform', 'assets/default/car/b/platform.png');
            // C
            this.load.image('car-c-tire', 'assets/default/car/a/tire.png');
            this.load.image('car-c-body', 'assets/default/car/a/body.png');
            this.load.image('car-c-platform', 'assets/default/car/a/platform.png');
            // D
            this.load.image('car-d-tire', 'assets/default/car/d/tire.png');
            this.load.image('car-d-body', 'assets/default/car/d/body.png');
            this.load.image('car-d-platform', 'assets/default/car/d/platform.png');
            // E
            this.load.image('car-e-tire', 'assets/default/car/e/tire.png');
            this.load.image('car-e-body', 'assets/default/car/e/body.png');
            this.load.image('car-e-platform', 'assets/default/car/e/platform.png');
            // car hit
            this.load.audio('car-sfx-hit', 'assets/default/car/sfx/hit.mp3');
            this.load.audio('audio-battle-bg', 'assets/states/main/audio/bg.mp3');
            this.load.audio('audio-battle-lose', 'assets/states/main/audio/lose.mp3');
            this.load.audio('audio-battle-win', 'assets/states/main/audio/win.mp3');
            // scene
            this.load.image('main-bg', 'assets/states/main/bg.jpg');
            this.load.image('upg-header', 'assets/default/upgrade/header.png');
            this.load.image('upg-btn-attack', 'assets/default/upgrade/attack.png');
            this.load.image('upg-btn-defense', 'assets/default/upgrade/defense.png');
            this.load.image('upg-btn-health', 'assets/default/upgrade/health.png');
            this.load.image('game-end-win', 'assets/states/main/images/end-victory.png');
            this.load.image('game-end-lose', 'assets/states/main/images/end-lose.png');
            // particula
            this.load.image('particle-1', 'assets/states/main/images/particles/p1.png');
            this.load.image('particle-2', 'assets/states/main/images/particles/p2.png');
            this.load.image('particle-3', 'assets/states/main/images/particles/p3.png');
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
                this.timeBar.event.add(Bar.E.TimeEvent.OnEndCount, function () {
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
    var Battle;
    (function (Battle_1) {
        var Battle = (function (_super) {
            __extends(Battle, _super);
            function Battle(game) {
                var _this = _super.call(this, game) || this;
                _this.battleEnd = false;
                _this.lastHitTime = 0;
                _this.resetCarsTolerance = 10;
                _this.resetCarsInterval = 0;
                _this.battleCount = 0;
                return _this;
            }
            Battle.prototype.doStart = function (carA, carB) {
                var _this = this;
                this.cars = [carA, carB];
                console.log('construindo carros');
                this.battleCount++;
                // cria / posiciona
                if (!this.cars[0].builded)
                    this.cars[0].build(new Phaser.Point(100, this.game.world.height - 100), 1);
                //
                if (!this.cars[1].builded)
                    this.cars[1].build(new Phaser.Point(this.game.world.width, this.game.world.height - 100), -1);
                //
                // registra o evento
                this.cars[0].event.add(GameBase.Car.E.CarEvent.OnHit, function (e, otherPlayer) {
                    // se a batalha já terminou, foda-se o hit
                    if (_this.battleEnd)
                        return;
                    //
                    // um bate no outr
                    _this.carHit(_this.cars[0], _this.cars[1]);
                    _this.carHit(_this.cars[1], _this.cars[0]);
                    // empurra eles em direção contraria
                    _this.pushOff();
                    _this.pushOff();
                    // verifica se já terminou a batalha
                    _this.resolve();
                }, this);
                this.resetCarsInterval = setInterval(function () {
                    _this.lastHitTime++;
                    if (_this.lastHitTime > _this.resetCarsTolerance) {
                        _this.pushOff();
                        _this.pushOff();
                        _this.pushOff();
                    }
                }, 1000);
                this.lastHitTime = 0;
                // da uma empurrada
                for (var index = 0; index < 5; index++) {
                    this.pushOff();
                    this.pushOff();
                }
                // liga os MOTOREEEEESS e reseta o gaude
                for (var i in this.cars) {
                    if (this.cars[i].gaude)
                        this.cars[i].gaude.reset();
                    //
                    // motores
                    this.cars[i].engineOn();
                }
                //
                // reseta a flag de termino de batalha
                this.battleEnd = false;
            };
            Battle.prototype.start = function (carA, carB) {
                var _this = this;
                var iconUp = new GameBase.Battle.Icon(this.game, 'Ready');
                iconUp.create();
                iconUp.x = this.game.world.centerX;
                iconUp.y = this.game.world.centerY;
                iconUp.go();
                setTimeout(function () {
                    var iconUp = new GameBase.Battle.Icon(_this.game, 'Set');
                    iconUp.create();
                    iconUp.x = _this.game.world.centerX;
                    iconUp.y = _this.game.world.centerY;
                    iconUp.go();
                }, 500);
                setTimeout(function () {
                    var iconUp = new GameBase.Battle.Icon(_this.game, 'GO!');
                    iconUp.create();
                    iconUp.x = _this.game.world.centerX;
                    iconUp.y = _this.game.world.centerY;
                    iconUp.go();
                }, 1000);
                // espera um pouco
                setTimeout(function () {
                    _this.doStart(carA, carB);
                }, 1500);
            };
            // empurra os carros em direção contraria
            Battle.prototype.pushOff = function () {
                for (var i in this.cars)
                    if (this.cars[i].alive)
                        this.cars[i].base.body.applyForce(400 * -this.cars[i].direction, 300 / 2);
                //
                this.lastHitTime = 0;
            };
            Battle.prototype.resolve = function () {
                var winner = null; // se houve vencedor e qual
                var playerCar = null;
                // se terminou e quem ganhou
                for (var i in this.cars) {
                    if (!this.cars[i].partyBoysLeft())
                        this.battleEnd = true;
                    else
                        winner = this.cars[i];
                    //
                    if (this.cars[i].playerCar)
                        playerCar = this.cars[i];
                    // 
                }
                // se a batalha terminou, 
                if (this.battleEnd) {
                    console.log('Battle end');
                    // para a contage
                    clearInterval(this.resetCarsInterval);
                    var deadCar = null;
                    for (var i in this.cars) {
                        // destroi quem não é o vencedor
                        if (!winner || this.cars[i].getId() != winner.getId()) {
                            deadCar = this.cars[i];
                            this.cars[i].kill();
                        }
                        //
                        // desliga o motor
                        this.cars[i].engineOff();
                        // para o gaude, se houver
                        if (this.cars[i].gaude)
                            this.cars[i].gaude.stop();
                        //
                        // da uma empurrada pra tras
                        this.pushOff();
                    }
                    this.event.dispatch(GameBase.Battle.E.BattleEvent.OnEnd, winner);
                }
                //
            };
            Battle.prototype.carHit = function (carA, carB) {
                // pega o critico do gaude, se for carro do jogaro
                var criticalFactor = 1;
                if (carA.playerCar) {
                    criticalFactor = carA.gaude ? carA.gaude.hit() : 1;
                    console.log('gaude hit factor: ' + criticalFactor);
                }
                else {
                    // inimigo tbm tem um fator de critico, baixo
                    if (this.game.rnd.integerInRange(1, 4) == 4)
                        criticalFactor = 2;
                    //
                }
                // aplica o dano
                var damage = carB.applyDamage(carA.damage, criticalFactor);
                // calcula o impulso em cima do dano causado
                var forceX = 750 + (300 * damage);
                var forceY = -750 - (300 * damage);
                // empurra de acordo com o dano
                carB.base.body.applyForce(forceX * carA.direction, forceY);
                // balança a camera
                this.game.camera.shake(0.01, 100);
            };
            return Battle;
        }(Pk.PkElement));
        Battle_1.Battle = Battle;
        var E;
        (function (E) {
            var BattleEvent;
            (function (BattleEvent) {
                BattleEvent.OnEnd = "BattleEventEnd";
            })(BattleEvent = E.BattleEvent || (E.BattleEvent = {}));
        })(E = Battle_1.E || (Battle_1.E = {}));
    })(Battle = GameBase.Battle || (GameBase.Battle = {}));
})(GameBase || (GameBase = {}));
var GameBase;
(function (GameBase) {
    var Battle;
    (function (Battle) {
        var Icon = (function (_super) {
            __extends(Icon, _super);
            function Icon(game, message) {
                var _this = _super.call(this, game) || this;
                _this.message = message;
                return _this;
            }
            Icon.prototype.create = function () {
                this.text = this.game.add.text(0, 0, this.message, // text
                {
                    font: "48px Love Story Rough",
                    fill: "#202020"
                } // font style
                );
                this.text.anchor.x = 0.5;
                this.add(this.text);
            };
            Icon.prototype.go = function () {
                var _this = this;
                this.addTween(this).from({
                    alpha: 0
                }, 500, Phaser.Easing.Circular.Out, true).onComplete.add(function () {
                    _this.destroy();
                }, this);
                this.addTween(this.scale).from({
                    x: 0
                }, 490, Phaser.Easing.Circular.Out, true).onComplete.add(function () {
                }, this);
            };
            return Icon;
        }(Pk.PkElement));
        Battle.Icon = Icon;
    })(Battle = GameBase.Battle || (GameBase.Battle = {}));
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
                _this.motorTorque = 3;
                _this.motorSpeed = 50;
                _this.rideHeight = 0.8;
                _this.direction = 1;
                _this.alive = true;
                _this.damage = [1, 2];
                _this.driveJoints = [];
                _this.name = '-nome padrão-';
                // plataformas
                _this.platforms = [];
                _this.platformsTotal = 2;
                _this.bodySpriteKey = 'car-body';
                _this.tireSpriteKey = 'tire-body';
                _this.platformSpriteKey = 'platform-body';
                // se é um carro do jogador
                _this.playerCar = false;
                // se já esta montado
                _this.builded = false;
                _this.defense = 1;
                return _this;
            }
            Car.prototype.build = function (position, direction) {
                var _this = this;
                if (position === void 0) { position = new Phaser.Point(0, 0); }
                if (direction === void 0) { direction = 1; }
                this.direction = direction;
                this.builded = true;
                this.base = new Phaser.Sprite(this.game, 0, 0);
                this.bodySprite = this.game.add.sprite(0, 0, this.bodySpriteKey);
                this.bodySprite.scale.x *= -this.direction;
                this.bodySprite.anchor.set(.5, .5);
                this.game.physics.box2d.enable(this.base);
                this.base.body.setCircle(20);
                this.base.body.x = position.x;
                this.base.body.y = position.y;
                this.base.body.fixedRotation = true;
                this.sensor = this.base.body.addRectangle(this.size * 3, this.size, 0, this.size / 2 - this.size / 2);
                this.sensor.SetSensor(true);
                var PTM = this.size;
                this.tireSprite1 = this.game.add.sprite(0, 500, this.tireSpriteKey);
                this.tireSprite2 = this.game.add.sprite(0, 500, this.tireSpriteKey);
                this.game.physics.box2d.enable(this.tireSprite1);
                this.game.physics.box2d.enable(this.tireSprite2);
                var wheelBodies = [];
                wheelBodies[0] = this.tireSprite1.body;
                wheelBodies[1] = this.tireSprite2.body;
                wheelBodies[0].setCircle(0.4 * PTM);
                wheelBodies[1].setCircle(0.4 * PTM);
                this.driveJoints[0] = this.game.physics.box2d.wheelJoint(this.base.body, wheelBodies[0], -1 * PTM, this.rideHeight * PTM, 0, 0, 0, 1, this.frequency, this.damping, 0, this.motorTorque, true); // rear
                this.driveJoints[1] = this.game.physics.box2d.wheelJoint(this.base.body, wheelBodies[1], 1 * PTM, this.rideHeight * PTM, 0, 0, 0, 1, this.frequency, this.damping, 0, this.motorTorque, true); // front
                // add plataformas
                for (var i_1 = 0; i_1 < this.platformsTotal; i_1++) {
                    // cria a plataforma
                    var platform = new GameBase.Car.Platform(this.game, this);
                    platform.platformSpriteKey = this.platformSpriteKey;
                    // seleciona o anexo
                    var anex;
                    if (!i_1)
                        anex = this.base.body; // carro
                    else
                        anex = this.platforms[i_1 - 1].base;
                    //
                    // direção, even/odd
                    var direction = i_1 % 2 == 0 ? this.direction : -this.direction;
                    platform.build(direction, anex);
                    this.platforms.push(platform);
                }
                // add foliões
                for (var i in this.platforms) {
                    for (var j = 0; j < this.platforms[i].partyBoysMax; j++) {
                        var pb = new GameBase.PartyBoy.PartyBoy(this.game);
                        pb.spriteKey = 'partyboy-' + this.game.rnd.integerInRange(1, 6);
                        // add
                        this.platforms[i].addPartyBoys(pb);
                    }
                }
                // colisão
                this.base.body.setCollisionCategory(GameBase.CollisionCategories.Car);
                this.base.body.element = this;
                this.base.body.setCategoryContactCallback(GameBase.CollisionCategories.Car, function (body1, body2, fixture1, fixture2, begin) {
                    if (!begin || body1.id == body2.id || !body2.element)
                        return;
                    //
                    var advCar = body2.element;
                    _this.event.dispatch(GameBase.Car.E.CarEvent.OnHit, advCar);
                }, this);
                // drag
                // this.game.input.onDown.add(this.mouseDragStart, this);
                // this.game.input.addMoveCallback(this.mouseDragMove, this);
                // this.game.input.onUp.add(this.mouseDragEnd, this);
                // barra de clique
                setTimeout(function () {
                    if (_this.playerCar) {
                        _this.gaude = new GameBase.Gaude.Gaude(_this.game);
                        _this.gaude.build();
                    }
                }, 300);
                for (var i_2 = 0; i_2 < 2; i_2++) {
                    this.driveJoints[i_2].EnableMotor(true);
                    this.driveJoints[i_2].SetMotorSpeed(this.motorSpeed * this.direction);
                }
                // audio hit
                this.audioHit = this.game.add.audio('car-sfx-hit');
            };
            Car.prototype.mouseDragStart = function () {
                this.game.physics.box2d.mouseDragStart(this.game.input.mousePointer);
            };
            Car.prototype.mouseDragMove = function () {
                this.game.physics.box2d.mouseDragMove(this.game.input.mousePointer);
            };
            Car.prototype.mouseDragEnd = function () {
                this.game.physics.box2d.mouseDragEnd();
            };
            Car.prototype.engineOn = function () {
                for (var i in this.driveJoints)
                    this.driveJoints[i].EnableMotor(true);
                //
            };
            Car.prototype.engineOff = function () {
                for (var i in this.driveJoints)
                    this.driveJoints[i].EnableMotor(false);
                //
            };
            Car.prototype.kill = function () {
                var _this = this;
                // desliga os motores
                this.engineOff();
                // marca morto
                this.alive = false;
                var _loop_1 = function (i) {
                    setTimeout(function () {
                        console.log('desliga plat ' + i);
                        _this.platforms[i].kill();
                    }, 400 * parseInt(i));
                };
                // destroi as plataformas
                for (var i in this.platforms) {
                    _loop_1(i);
                }
                var _loop_2 = function (j) {
                    setTimeout(function () {
                        console.log('desliga roda ' + j);
                        _this.game.physics.box2d.world.DestroyJoint(_this.driveJoints[j]);
                        _this.tireSprite1.body.sensor = true;
                        _this.tireSprite2.body.sensor = true;
                        _this.base.body.sensor = true;
                    }, 200 * parseInt(j));
                };
                // destroi as rodas                
                for (var j in this.driveJoints) {
                    _loop_2(j);
                }
                this.addTween(this.bodySprite).to({
                    alpha: 0
                }, 5000, Phaser.Easing.Circular.Out, true).onComplete.add(function () {
                    // some com as peças de vez
                    _this.base.destroy();
                    _this.bodySprite.destroy();
                    _this.tireSprite1.destroy();
                    _this.tireSprite2.destroy();
                    // dispara o evento de morte
                    _this.event.dispatch(GameBase.Car.E.CarEvent.OnKill);
                }, this);
            };
            Car.prototype.applyDamage = function (damageRange, criticalFactor) {
                if (criticalFactor === void 0) { criticalFactor = 1; }
                // randomiza o dano
                var damage = this.game.rnd.integerInRange(damageRange[0], damageRange[1]);
                damage *= criticalFactor; // critico
                // subtrai a defesa
                // 10-(0.3 * 10)
                console.log('DAMAGE A', damage, this.defense);
                damage = damage - ((this.defense * 0.1) * damage);
                damage = parseInt(damage.toString());
                // garante ao menos um de dano no caso de não crit x 0
                if (criticalFactor > 0 && damage <= 0)
                    damage = 1;
                //
                console.log('DAMAGE B', damage);
                var iconUp = new GameBase.Icon.Icon(this.game, '-' + damage);
                iconUp.create();
                iconUp.x = this.base.body.x - this.base.width / 2;
                iconUp.y = this.base.body.y - 50;
                iconUp.go();
                // mata DAMAGE partyboy, se houver algum
                for (var j = 0; j < damage; j++) {
                    for (var i = this.platforms.length - 1; i >= 0; i--) {
                        if (this.platforms[i].partyBoys.length) {
                            var pb = this.platforms[i].direction == -1 ? this.platforms[i].partyBoys.pop() : this.platforms[i].partyBoys.shift();
                            pb.kill();
                            break;
                        }
                    }
                }
                if (!this.playerCar)
                    this.audioHit.play('', 0, 0.5);
                //
                return damage;
            };
            Car.prototype.partyBoysLeft = function () {
                var total = 0;
                for (var i in this.platforms)
                    total += this.platforms[i].partyBoys.length;
                //
                return total;
            };
            Car.prototype.update = function () {
                if (!this.bodySprite)
                    return;
                //
                this.bodySprite.x = this.base.body.x;
                this.bodySprite.y = this.base.body.y;
                this.bodySprite.bringToTop();
            };
            Car.prototype.upgradeAttack = function (value) {
                if (value === void 0) { value = 1; }
                this.damage = [this.damage[0] + value, this.damage[1] + value];
                console.log('this.damage:', this.damage);
            };
            Car.prototype.upgradeDefense = function (value) {
                if (value === void 0) { value = 2; }
                this.defense += value;
                console.log('this.defense:', this.defense);
            };
            Car.prototype.upgradeHealth = function (value) {
                if (value === void 0) { value = 3; }
                // seleciona uma plataforma que tenha espaço pra folião
                for (var i = this.platforms.length - 1; i >= 0; i--) {
                    // espaço disponivel
                    var slot = this.platforms[i].partyBoysMax - this.platforms[i].partyBoys.length;
                    if (value <= 0)
                        return;
                    //
                    if (slot > 0) {
                        var countTotal = value;
                        for (var j = 0; j < slot; j++) {
                            var pb = new GameBase.PartyBoy.PartyBoy(this.game);
                            pb.spriteKey = 'partyboy-' + this.game.rnd.integerInRange(1, 6);
                            // add
                            this.platforms[i].addPartyBoys(pb);
                            value--;
                            if (value <= 0)
                                return;
                            //
                        }
                    }
                }
            };
            return Car;
        }(Pk.PkElement));
        Car_1.Car = Car;
        var E;
        (function (E) {
            var CarEvent;
            (function (CarEvent) {
                CarEvent.OnHit = "CarEventOnHit";
                CarEvent.OnKill = "CarEventOnKill";
            })(CarEvent = E.CarEvent || (E.CarEvent = {}));
        })(E = Car_1.E || (Car_1.E = {}));
    })(Car = GameBase.Car || (GameBase.Car = {}));
})(GameBase || (GameBase = {}));
var GameBase;
(function (GameBase) {
    var Car;
    (function (Car) {
        var CarA = (function (_super) {
            __extends(CarA, _super);
            function CarA(game) {
                var _this = _super.call(this, game) || this;
                _this.bodySpriteKey = 'car-a-body';
                _this.platformSpriteKey = 'car-a-platform';
                _this.tireSpriteKey = 'car-a-tire';
                _this.damage = [1, 1];
                return _this;
            }
            return CarA;
        }(Car.Car));
        Car.CarA = CarA;
    })(Car = GameBase.Car || (GameBase.Car = {}));
})(GameBase || (GameBase = {}));
var GameBase;
(function (GameBase) {
    var Car;
    (function (Car) {
        var CarB = (function (_super) {
            __extends(CarB, _super);
            function CarB(game) {
                var _this = _super.call(this, game) || this;
                _this.bodySpriteKey = 'car-b-body';
                _this.platformSpriteKey = 'car-b-platform';
                _this.tireSpriteKey = 'car-b-tire';
                _this.defense = 2;
                return _this;
            }
            return CarB;
        }(Car.Car));
        Car.CarB = CarB;
    })(Car = GameBase.Car || (GameBase.Car = {}));
})(GameBase || (GameBase = {}));
var GameBase;
(function (GameBase) {
    var Car;
    (function (Car) {
        var CarC = (function (_super) {
            __extends(CarC, _super);
            function CarC(game) {
                var _this = _super.call(this, game) || this;
                _this.bodySpriteKey = 'car-c-body';
                _this.platformSpriteKey = 'car-c-platform';
                _this.tireSpriteKey = 'car-c-tire';
                _this.platformsTotal = 1;
                _this.defense = 3;
                _this.damage = [3, 3];
                return _this;
            }
            return CarC;
        }(Car.Car));
        Car.CarC = CarC;
    })(Car = GameBase.Car || (GameBase.Car = {}));
})(GameBase || (GameBase = {}));
var GameBase;
(function (GameBase) {
    var Car;
    (function (Car) {
        var CarD = (function (_super) {
            __extends(CarD, _super);
            function CarD(game) {
                var _this = _super.call(this, game) || this;
                _this.bodySpriteKey = 'car-d-body';
                _this.platformSpriteKey = 'car-d-platform';
                _this.tireSpriteKey = 'car-d-tire';
                _this.platformsTotal = 4;
                _this.defense = 3;
                _this.damage = [1, 4];
                return _this;
            }
            return CarD;
        }(Car.Car));
        Car.CarD = CarD;
    })(Car = GameBase.Car || (GameBase.Car = {}));
})(GameBase || (GameBase = {}));
var GameBase;
(function (GameBase) {
    var Car;
    (function (Car) {
        var CarE = (function (_super) {
            __extends(CarE, _super);
            function CarE(game) {
                var _this = _super.call(this, game) || this;
                _this.bodySpriteKey = 'car-e-body';
                _this.platformSpriteKey = 'car-e-platform';
                _this.tireSpriteKey = 'car-e-tire';
                _this.damage = [1, 6];
                return _this;
            }
            return CarE;
        }(Car.Car));
        Car.CarE = CarE;
    })(Car = GameBase.Car || (GameBase.Car = {}));
})(GameBase || (GameBase = {}));
var GameBase;
(function (GameBase) {
    var Car;
    (function (Car) {
        var Platform = (function (_super) {
            __extends(Platform, _super);
            function Platform(game, car) {
                var _this = _super.call(this, game) || this;
                _this.size = 100;
                _this.direction = 1;
                _this.death = false;
                _this.partyBoys = [];
                _this.partyBoysMax = 6;
                _this.platformSpriteKey = 'car-platform';
                _this.car = car; // referencia do carro... vai que precisa
                return _this;
            }
            Platform.prototype.build = function (direction, body) {
                var _this = this;
                // salva a direção
                this.direction = direction;
                this.base = this.game.add.sprite(0, 0, this.platformSpriteKey);
                this.base.scale.x *= -this.direction;
                this.base.anchor.set(.5, .5);
                this.game.physics.box2d.enable(this.base);
                this.base.body.setRectangle(this.size, 10, 0, 0, 0);
                // bodyA, bodyB, ax, ay, bx, by, frequency, damping
                this.joint = this.game.physics.box2d.weldJoint(body, this.base.body, 0, 0, 40 * direction, 80, 8, 0.5);
                this.base.body.fixedRotation = true;
                setTimeout(function () {
                    // this.joint = this.game.physics.box2d.weldJoint(body, this.base, 0, -20, 40 * direction, 80, 5, 0.0);
                    _this.base.body.fixedRotation = false;
                }, 1500);
                // console.log(this.joint)
                this.jointBody = body;
                // return this.joint; // retorna o vinculo
                if (this.car.name == 'Carro 1' || true) {
                    console.log('plat id: ', this.getId());
                    // var line = new Phaser.Line(0, 0, 100, 100);
                    this.lineGraph = this.game.add.graphics(0, 0);
                    // this.lineGraph.beginFill();
                    // this.lineGraph.lineStyle(10, 0xffd900, 1);
                    // this.lineGraph.moveTo(this.line.start.x, this.line.start.y);//moving position of graphic if you draw mulitple lines
                    // this.lineGraph.lineTo(this.line.end.y, this.line.end.y);
                    // this.lineGraph.endFill();
                    // this.lineSprite = this.game.add.sprite(0, 0, graphics);
                }
            };
            Platform.prototype.addPartyBoys = function (partyBoy) {
                // se já bateu no maximo, retorna 
                if (partyBoy.length == this.partyBoysMax)
                    return false;
                //
                var posX = -this.size / 2 + (20 * this.partyBoys.length);
                this.partyBoys.push(partyBoy);
                partyBoy.build(posX, this.base.body);
                return true;
            };
            Platform.prototype.kill = function () {
                var _this = this;
                // se já matou.. não mata
                if (this.death)
                    return;
                //
                this.death = true; // salva que já matou
                // remove o vinculo
                this.game.physics.box2d.world.DestroyJoint(this.joint);
                // joga pra cima
                this.base.body.applyForce(300 * -this.direction, -400);
                this.base.body.sensor = true;
                setTimeout(function () {
                    _this.base.destroy(); // mata de vez
                }, 3000);
            };
            Platform.prototype.update = function () {
                this.lineGraph.clear();
                if (this.death)
                    return;
                //
                this.lineGraph.lineStyle(4, 0x383a51, 1);
                this.lineGraph.moveTo(this.base.body.x, this.base.body.y); //moving position of graphic if you draw mulitple lines
                this.lineGraph.lineTo(this.jointBody.x, this.jointBody.y);
                this.lineGraph.update();
                this.base.bringToTop();
            };
            return Platform;
        }(Pk.PkElement));
        Car.Platform = Platform;
    })(Car = GameBase.Car || (GameBase.Car = {}));
})(GameBase || (GameBase = {}));
var GameBase;
(function (GameBase) {
    var Gaude;
    (function (Gaude_1) {
        var Gaude = (function (_super) {
            __extends(Gaude, _super);
            function Gaude(game) {
                var _this = _super.call(this, game) || this;
                _this.padding = 10;
                _this.pushForce = -100;
                _this.locked = false;
                _this.lockSpeed = 3;
                _this.run = true;
                return _this;
            }
            Gaude.prototype.build = function () {
                var _this = this;
                this.bg = this.game.add.sprite(0, 0, 'gaude-bg');
                this.add(this.bg);
                this.mark = this.game.add.sprite(0, 0, 'gaude-mark');
                this.add(this.mark);
                this.bgTimer = Pk.PkUtils.createSquare(this.game, 5, this.bg.height, "#69a53c");
                this.add(this.bgTimer);
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
                this.button.events.onInputDown.add(function () {
                    _this.push();
                }, this);
                this.game.physics.box2d.enable(this.mark);
                this.mark.body.fixedRotation = true;
                this.mark.body.setRectangle(this.mark.width, this.mark.height, this.mark.width / 2 - 10, this.mark.height / 2 - 5, 0);
                this.mark.body.x += this.mark.width;
                this.mark.body.y += 150;
                var graber = this.game.add.sprite(0, 0, '');
                this.add(graber);
                this.game.physics.box2d.enable(graber);
                graber.body.setCircle(5);
                graber.body.x = this.mark.body.x;
                graber.body.y = -this.padding;
                graber.body.static = true;
                // bodyA, bodyB, axisX, axisY, ax, ay, bx, by, motorSpeed, motorForce, motorEnabled, lowerLimit, upperLimit, limitEnabled
                this.game.physics.box2d.prismaticJoint(graber, this.mark, 0, 1, 0, 0, 0, 0, 0, 0, false, 0, this.bg.height + 10, true);
                this.x = this.padding;
                this.y = this.padding;
            };
            Gaude.prototype.push = function () {
                if (!this.locked)
                    this.mark.body.applyForce(0, this.pushForce);
                //
            };
            Gaude.prototype.hit = function () {
                var hitValue = 0;
                var posValue = this.mark.body.y;
                // de-até, valor
                var ranges = new Array();
                ranges.push([18, 34, 5]);
                ranges.push([69, 104, 3]);
                ranges.push([105, 164, 2]);
                ranges.push([165, 250, 1]);
                for (var i in ranges) {
                    if (posValue >= ranges[i][0] && posValue <= ranges[i][1]) {
                        hitValue = ranges[i][2];
                        break;
                    }
                }
                // empurra pro final
                this.mark.body.applyForce(0, 2000);
                // anima
                var iconUp = new GameBase.Gaude.Icon(this.game, 'X' + hitValue);
                iconUp.create();
                iconUp.x = this.x + this.mark.width / 2;
                iconUp.y = this.mark.body.y;
                iconUp.go();
                this.unlock();
                return hitValue;
            };
            Gaude.prototype.update = function () {
                if (this.bgTimer.height <= 0 || !this.run)
                    return;
                //
                this.bgTimer.height -= this.lockSpeed;
                if (this.bgTimer.height <= 0)
                    this.lock();
                //
            };
            Gaude.prototype.stop = function () {
                this.run = false;
            };
            Gaude.prototype.reset = function () {
                console.log('Gaude Reset');
                this.run = true;
                this.unlock();
                this.push();
            };
            Gaude.prototype.unlock = function () {
                this.locked = false;
                this.bgTimer.height = this.timeInitialHeight;
                this.mark.body.gravityScale = 1;
            };
            Gaude.prototype.lock = function () {
                this.locked = true;
                // this.mark.body.
                var a;
                this.mark.body.velocity.y = 0;
                this.mark.body.gravityScale = 0;
                // anima
                var iconUp = new GameBase.Gaude.Icon(this.game, '* Lock *');
                iconUp.create();
                iconUp.x = this.x + this.mark.width / 2;
                iconUp.y = this.mark.body.y;
                iconUp.go();
            };
            return Gaude;
        }(Pk.PkElement));
        Gaude_1.Gaude = Gaude;
    })(Gaude = GameBase.Gaude || (GameBase.Gaude = {}));
})(GameBase || (GameBase = {}));
var GameBase;
(function (GameBase) {
    var Gaude;
    (function (Gaude) {
        var Icon = (function (_super) {
            __extends(Icon, _super);
            function Icon(game, message) {
                var _this = _super.call(this, game) || this;
                _this.message = message;
                return _this;
            }
            Icon.prototype.create = function () {
                this.text = this.game.add.text(0, 0, this.message, // text
                {
                    font: "28px Love Story Rough",
                    fill: "#202020"
                } // font style
                );
                this.add(this.text);
            };
            Icon.prototype.go = function () {
                var _this = this;
                this.addTween(this).to({
                    y: this.y - 20,
                    x: this.x + 200,
                }, 2000, Phaser.Easing.Circular.Out, true).onComplete.add(function () {
                    _this.destroy();
                }, this);
            };
            return Icon;
        }(Pk.PkElement));
        Gaude.Icon = Icon;
    })(Gaude = GameBase.Gaude || (GameBase.Gaude = {}));
})(GameBase || (GameBase = {}));
var GameBase;
(function (GameBase) {
    var Icon;
    (function (Icon_1) {
        var Icon = (function (_super) {
            __extends(Icon, _super);
            function Icon(game, message) {
                var _this = _super.call(this, game) || this;
                _this.message = message;
                return _this;
            }
            Icon.prototype.create = function () {
                this.text = this.game.add.text(0, 0, this.message, // text
                {
                    font: "28px Love Story Rough",
                    fill: "#202020"
                } // font style
                );
                this.add(this.text);
            };
            Icon.prototype.go = function () {
                var _this = this;
                this.addTween(this).to({
                    y: this.y - 100
                }, 1000, Phaser.Easing.Circular.Out, true).onComplete.add(function () {
                    _this.destroy();
                }, this);
            };
            return Icon;
        }(Pk.PkElement));
        Icon_1.Icon = Icon;
    })(Icon = GameBase.Icon || (GameBase.Icon = {}));
})(GameBase || (GameBase = {}));
var GameBase;
(function (GameBase) {
    var PartyBoy;
    (function (PartyBoy_1) {
        var PartyBoy = (function (_super) {
            __extends(PartyBoy, _super);
            function PartyBoy(game) {
                var _this = _super.call(this, game) || this;
                _this.spriteKey = 'partyboy-1';
                _this.death = false;
                return _this;
            }
            PartyBoy.prototype.build = function (position, platformBody) {
                this.base = this.game.add.sprite(platformBody.x, 10, this.spriteKey);
                // this.base.width = 20;
                // this.base.height = 40;
                this.game.physics.box2d.enable(this.base);
                this.body = this.base.body;
                this.body.sensor = true;
                this.body.mass = 0.1;
                this.joint = this.game.physics.box2d.weldJoint(platformBody, this.body, position, -(this.base.height / 2) + 13, 0, this.base.height / 2, 3, 0.3);
            };
            PartyBoy.prototype.kill = function () {
                var _this = this;
                // se já matou.. não mata
                if (this.death)
                    return;
                //
                this.death = true; // salva que já matou
                // remove o vinculo
                this.game.physics.box2d.world.DestroyJoint(this.joint);
                // chuta uma direção
                var direction = 1;
                if (this.game.rnd.integerInRange(0, 1))
                    direction = -1;
                //
                // joga pra cima
                // this.base.body.applyForce(2 * direction, -100)
                // this.base.body.rotation = 90;
                setTimeout(function () {
                    _this.game.physics.box2d.world.DestroyJoint(_this.joint); // remove do carro
                    _this.base.body.applyForce(20 * direction, -30);
                }, 100);
                setTimeout(function () {
                    _this.base.destroy(); // mata de vez
                }, 10000);
            };
            return PartyBoy;
        }(Pk.PkElement));
        PartyBoy_1.PartyBoy = PartyBoy;
    })(PartyBoy = GameBase.PartyBoy || (GameBase.PartyBoy = {}));
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
                this.body.alpha = 0;
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
var GameBase;
(function (GameBase) {
    var UpgradeScreen;
    (function (UpgradeScreen) {
        var Button = (function (_super) {
            __extends(Button, _super);
            function Button(game) {
                return _super.call(this, game) || this;
            }
            Button.prototype.create = function () {
                var _this = this;
                this.base = this.game.add.sprite(0, 0, this.key);
                this.add(this.base);
                // config btn
                this.base.inputEnabled = true;
                this.base.input.useHandCursor = true;
                this.base.events.onInputDown.add(function () {
                    _this.event.dispatch(GameBase.UpgradeScreen.E.UpgradeButtonEvent.OnClick);
                }, this);
            };
            return Button;
        }(Pk.PkElement));
        UpgradeScreen.Button = Button;
        var E;
        (function (E) {
            var UpgradeButtonEvent;
            (function (UpgradeButtonEvent) {
                UpgradeButtonEvent.OnClick = "UpgradeButtonEventOnClick";
            })(UpgradeButtonEvent = E.UpgradeButtonEvent || (E.UpgradeButtonEvent = {}));
        })(E = UpgradeScreen.E || (UpgradeScreen.E = {}));
    })(UpgradeScreen = GameBase.UpgradeScreen || (GameBase.UpgradeScreen = {}));
})(GameBase || (GameBase = {}));
var GameBase;
(function (GameBase) {
    var UpgradeScreen;
    (function (UpgradeScreen_1) {
        var UpgradeScreen = (function (_super) {
            __extends(UpgradeScreen, _super);
            function UpgradeScreen(game) {
                return _super.call(this, game) || this;
            }
            UpgradeScreen.prototype.create = function () {
                var _this = this;
                this.header = this.game.add.sprite(0, 0, 'upg-header');
                this.add(this.header);
                // pos
                this.header.anchor.x = 0.5;
                this.header.x = this.game.world.centerX;
                this.header.y = this.game.world.centerY - this.header.height - 100;
                this.add(this.header);
                this.addAttack = new GameBase.UpgradeScreen.Button(this.game);
                this.addAttack.key = 'upg-btn-attack';
                this.addAttack.create();
                this.addAttack.x = 50;
                this.addAttack.y = this.header.y + this.header.height + 50;
                this.addAttack.event.add(GameBase.UpgradeScreen.E.UpgradeButtonEvent.OnClick, function (e) {
                    _this.select(1);
                }, this);
                this.add(this.addAttack);
                this.addDefense = new GameBase.UpgradeScreen.Button(this.game);
                this.addDefense.key = 'upg-btn-defense';
                this.addDefense.create();
                this.addDefense.x = this.game.world.centerX - this.addDefense.width / 2;
                this.addDefense.y = this.header.y + this.header.height + 150;
                this.addDefense.event.add(GameBase.UpgradeScreen.E.UpgradeButtonEvent.OnClick, function (e) {
                    _this.select(2);
                }, this);
                this.add(this.addDefense);
                this.addHealth = new GameBase.UpgradeScreen.Button(this.game);
                this.addHealth.key = 'upg-btn-health';
                this.addHealth.create();
                this.addHealth.x = this.game.world.width - this.addHealth.width - 50;
                this.addHealth.y = this.header.y + this.header.height + 50;
                this.addHealth.event.add(GameBase.UpgradeScreen.E.UpgradeButtonEvent.OnClick, function (e) {
                    _this.select(3);
                }, this);
                this.add(this.addHealth);
                this.addAttack.visible = false;
                this.addDefense.visible = false;
                this.addHealth.visible = false;
                this.header.visible = false;
            };
            UpgradeScreen.prototype.select = function (data) {
                this.event.dispatch(GameBase.UpgradeScreen.E.UpgradeEvent.OnSelect, data);
                this.close();
            };
            UpgradeScreen.prototype.open = function () {
                for (var i in this.children) {
                    this.children[i].visible = true;
                    // header
                    this.addTween(this.children[i]).from({
                        y: this.children[i].y - 100,
                        alpha: 0
                    }, 300, Phaser.Easing.Circular.Out, true, 200 * parseInt(i)).onComplete.add(function () {
                        // this.destroy();
                    }, this);
                }
            };
            UpgradeScreen.prototype.close = function () {
                var _this = this;
                // header
                this.addTween(this).from({
                    alpha: 100
                }, 100, Phaser.Easing.Linear.None, true).onComplete.add(function () {
                    for (var i in _this.children)
                        _this.children[i].visible = false;
                    //
                }, this);
            };
            return UpgradeScreen;
        }(Pk.PkElement));
        UpgradeScreen_1.UpgradeScreen = UpgradeScreen;
        var E;
        (function (E) {
            var UpgradeEvent;
            (function (UpgradeEvent) {
                UpgradeEvent.OnSelect = "UpgradeEventOnSelect";
            })(UpgradeEvent = E.UpgradeEvent || (E.UpgradeEvent = {}));
        })(E = UpgradeScreen_1.E || (UpgradeScreen_1.E = {}));
    })(UpgradeScreen = GameBase.UpgradeScreen || (GameBase.UpgradeScreen = {}));
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
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.enemies = [];
            return _this;
        }
        Main.prototype.init = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            _super.prototype.init.call(this, args); // if whant override init, you need this line!
        };
        Main.prototype.create = function () {
            var _this = this;
            _super.prototype.create.call(this);
            // change state bg
            this.game.stage.backgroundColor = "#938da0";
            // prevent stop update when focus out
            // this.stage.disableVisibilityChange = true;
            // bg
            var bg = this.game.add.sprite(0, 0, 'main-bg');
            console.log('bg:', bg.width, bg.height);
            console.log('gamwww:', this.game.world.width, this.game.world.height);
            // bg.y -= 30;
            // Enable Box2D physics
            this.game.physics.startSystem(Phaser.Physics.BOX2D);
            this.game.physics.box2d.gravity.y = 500;
            this.game.physics.box2d.restitution = 0.3;
            this.game.physics.box2d.debugDraw.joints = true;
            this.game.physics.box2d.setBoundsToWorld();
            // chão
            this.floor = new GameBase.Floor.Floor(this.game);
            this.floor.create();
            // gerenciador da batalha
            this.battle = new GameBase.Battle.Battle(this.game);
            // carro do jogador
            this.playerCar = new GameBase.Car.CarE(this.game);
            this.playerCar.playerCar = true;
            this.playerCar.name = 'Carro 1';
            // this.playerCar.damage = [100, 100];
            // inimigos
            var enemy0 = new GameBase.Car.CarA(this.game);
            enemy0.direction = -1;
            enemy0.name = 'Inimigo 0';
            var enemy1 = new GameBase.Car.CarB(this.game);
            enemy1.direction = -1;
            enemy1.name = 'Inimigo 1';
            var enemy2 = new GameBase.Car.CarC(this.game);
            enemy2.direction = -1;
            enemy2.name = 'Inimigo 2';
            var enemy3 = new GameBase.Car.CarD(this.game);
            enemy3.direction = -1;
            enemy3.name = 'Inimigo 3';
            this.enemies.push(enemy0);
            this.enemies.push(enemy1);
            this.enemies.push(enemy2);
            this.enemies.push(enemy3);
            // particulas
            // scene particles
            var front_emitter = this.game.add.emitter(this.game.world.width, -32, 600);
            front_emitter.makeParticles(['particle-1', 'particle-3', 'particle-2']);
            front_emitter.maxParticleScale = 0.4;
            front_emitter.minParticleScale = 0.2;
            front_emitter.setYSpeed(20, 160);
            front_emitter.setXSpeed(-20, -100);
            front_emitter.gravity = 0;
            front_emitter.width = this.game.world.width * 1.5;
            front_emitter.minRotation = 5;
            front_emitter.maxRotation = 40;
            front_emitter.start(false, 14000, 20);
            // evento de fim de batalha
            this.battle.event.add(GameBase.Battle.E.BattleEvent.OnEnd, function (e, winner) {
                if (winner)
                    console.log('O vencedor foi o carro ', winner.name);
                else
                    console.log('Empate');
                //
                // se o jogador ganhou, começa a proxima batalha
                if (winner && winner.getId() == _this.playerCar.getId()) {
                    // se ainda houver inimigo
                    if (_this.getNextEnemy()) {
                        // abre o seletor de upgrade
                        _this.upgradeScreen.open();
                    }
                    else {
                        _this.win();
                    }
                }
                else {
                    _this.lose();
                }
                //	
            }, this);
            // musica de fundo 
            this.musicBG = this.game.add.audio('audio-battle-bg');
            // registra os sfx
            this.audioWin = this.game.add.audio('audio-battle-win');
            this.audioLose = this.game.add.audio('audio-battle-lose');
            this.upgradeScreen = new GameBase.UpgradeScreen.UpgradeScreen(this.game);
            this.upgradeScreen.create();
            this.upgradeScreen.event.add(GameBase.UpgradeScreen.E.UpgradeEvent.OnSelect, function (e, data) {
                // aplica o upgrade no carro 
                switch (data) {
                    case 1:
                        console.log('UPGRADE ATAQUE');
                        _this.playerCar.upgradeAttack();
                        break;
                    case 2:
                        console.log('UPGRADE DEFESA');
                        _this.playerCar.upgradeDefense();
                        break;
                    case 3:
                        console.log('UPGRADE MINIONS');
                        _this.playerCar.upgradeHealth();
                        break;
                }
                // espera um pouco e toca o proximo
                _this.nextBattle();
            }, this);
            // começa as paradas
            this.nextBattle();
        };
        Main.prototype.nextBattle = function () {
            console.log('-- NEXT BATTLE -- ');
            // pega o carro do jogador + p proximo inimigo vivo
            var nextEnemy = this.getNextEnemy();
            // se existir outro inimigo
            if (nextEnemy)
                this.battle.start(this.playerCar, nextEnemy); // começa
            //
            // se a musica de fundo não estiver rolando, roda
            if (!this.musicBG.isPlaying)
                this.musicBG.play('', 0, 1.0, true);
            //
        };
        Main.prototype.getNextEnemy = function () {
            // pega o carro do jogador + p proximo inimigo vivo
            var nextEnemy;
            for (var i in this.enemies) {
                if (!this.enemies[i].alive)
                    continue;
                //
                nextEnemy = this.enemies[i];
                break;
            }
            return nextEnemy;
        };
        Main.prototype.win = function () {
            this.musicBG.fadeOut(200);
            this.audioWin.play('', 0, 1);
            // 
            console.log('WIN SCREEN');
            var endScreen = this.game.add.sprite(0, 0, 'game-end-win');
            endScreen.anchor.set(0.5, 0.5);
            endScreen.x = this.game.world.centerX;
            endScreen.y = this.game.world.centerY;
            this.game.add.tween(endScreen).from({
                y: endScreen.y - 800
            }, 2500, Phaser.Easing.Bounce.Out, true).onComplete.add(function () {
                console.log('END TWEEN WIN SCREEN');
            }, this);
        };
        Main.prototype.lose = function () {
            this.musicBG.fadeOut(200);
            this.audioLose.play('', 0, 1);
            var endScreen = this.game.add.sprite(0, 0, 'game-end-lose');
            endScreen.anchor.set(0.5, 0.5);
            endScreen.x = this.game.world.centerX;
            endScreen.y = this.game.world.centerY;
            this.game.add.tween(endScreen).from({
                y: endScreen.y - 800
            }, 2500, Phaser.Easing.Bounce.Out, true).onComplete.add(function () {
                console.log('END TWEEN WIN SCREEN');
            }, this);
            endScreen.inputEnabled = true;
            endScreen.input.useHandCursor = true;
            endScreen.events.onInputDown.add(function () {
                window.location.reload();
            }, this);
        };
        Main.prototype.playSound = function () {
            // play music
        };
        Main.prototype.render = function () {
            // this.game.debug.box2dWorld();
            this.game.debug.text('Já bebeu agua hoje?', this.game.world.centerX, 35);
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