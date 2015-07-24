window.onload = function () {
    var game = new ScalingBabel.Game();
};
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ScalingBabel;
(function (ScalingBabel) {
    var Battle = (function (_super) {
        __extends(Battle, _super);
        function Battle() {
            _super.apply(this, arguments);
        }
        return Battle;
    })(Phaser.State);
    ScalingBabel.Battle = Battle;
})(ScalingBabel || (ScalingBabel = {}));
var ScalingBabel;
(function (ScalingBabel) {
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            _super.apply(this, arguments);
        }
        Boot.prototype.preload = function () {
            this.load.image('bgBoot', 'assets/Boot_bg.png');
        };
        Boot.prototype.create = function () {
            this.scale.pageAlignVertically = true;
            this.scale.pageAlignHorizontally = true;

            this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
            this.scale.setUserScale((window.innerHeight * 2 / 3) / 320, (window.innerHeight) / 480);
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;

            this.bgBoot = this.add.image(0, 0, 'bgBoot');
            this.bgBoot.inputEnabled = true;
            this.bgBoot.events.onInputDown.addOnce(this.startLoad, this);
        };
        Boot.prototype.update = function () {
        };
        Boot.prototype.startLoad = function () {
            this.game.state.start('Load');
        };
        return Boot;
    })(Phaser.State);
    ScalingBabel.Boot = Boot;
})(ScalingBabel || (ScalingBabel = {}));
var ScalingBabel;
(function (ScalingBabel) {
    var Load = (function (_super) {
        __extends(Load, _super);
        function Load() {
            _super.apply(this, arguments);
        }
        return Load;
    })(Phaser.State);
    ScalingBabel.Load = Load;
})(ScalingBabel || (ScalingBabel = {}));
var ScalingBabel;
(function (ScalingBabel) {
    var Map = (function (_super) {
        __extends(Map, _super);
        function Map() {
            _super.apply(this, arguments);
        }
        return Map;
    })(Phaser.State);
    ScalingBabel.Map = Map;
})(ScalingBabel || (ScalingBabel = {}));
var ScalingBabel;
(function (ScalingBabel) {
    var Menu = (function (_super) {
        __extends(Menu, _super);
        function Menu() {
            _super.apply(this, arguments);
        }
        return Menu;
    })(Phaser.State);
    ScalingBabel.Menu = Menu;
})(ScalingBabel || (ScalingBabel = {}));
///<reference path="phaser.d.ts"/>
var ScalingBabel;
(function (ScalingBabel) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            _super.call(this, 320, 480, Phaser.AUTO, 'content', null);

            this.state.add('Boot', ScalingBabel.Boot, false);
            this.state.add('Load', ScalingBabel.Load, false);
            this.state.add('Menu', ScalingBabel.Menu, false);
            this.state.add('Map', ScalingBabel.Map, false);
            this.state.add('Battle', ScalingBabel.Battle, false);

            this.state.start('Boot');
        }
        return Game;
    })(Phaser.Game);
    ScalingBabel.Game = Game;
})(ScalingBabel || (ScalingBabel = {}));
//# sourceMappingURL=ScalingBabel.js.map
