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
            this.failtimesnap = 1000;
            this.timesnap = 0;
            this.oldtime = 0;
            this.slashed = false;
        }
        Battle.prototype.create = function () {
            this.attackList = new Map();
            this.attackListKeys = new Array();
            this.timer = this.time.create(false);
            this.timer.start();
            this.lineNPC = this.add.graphics(0, 0);
            this.lineanimNPC = this.add.graphics(0, 0);
            this.linePC = this.add.graphics(0, 0);
            this.lineanimPC = this.add.graphics(0, 0);
            this.debugtxt = this.add.text(10, 10, 'sanity3: ' + this.timer.ms, { fontSize: '20 px', fill: 'white' });

            this.imgPointer = this.add.image(0, 0, 'Pointer');
            this.imgPointer.anchor.setTo(0.5, 0.5);
            this.imgPointer.alpha = 0;
        };

        Battle.prototype.update = function () {
            //this.debugtxt.setText('failtimesnap1: '+ this.failtimesnap);
            //this.debugtxt.setText('alkeys: ' + this.attackListKeys.length);
            this.failtimesnap -= (this.timer.ms - this.timesnap);
            this.timesnap = this.timer.ms;

            if (this.failtimesnap <= 0) {
                //parameter should be >500
                this.failtimesnap = this.collapserandom(2000);
                this.iniattack();
            }
            this.updatePointer();
        };

        Battle.prototype.updatePointer = function () {
            if (this.input.activePointer.isDown) {
                this.curx = this.input.activePointer.x;
                this.cury = this.input.activePointer.y;

                //cursor point
                this.imgPointer.alpha = 1;
                this.imgPointer.position.setTo(this.curx, this.cury);

                this.slashed = false;

                //cursor trail line
                if ((this.timer.ms - this.oldtime) < 100) {
                    this.slashed = true;
                    var trailline = this.add.graphics(0, 0);
                    trailline.lineStyle(2, 0xccffff);
                    trailline.moveTo(this.oldinputx, this.oldinputy);
                    trailline.lineTo(this.curx, this.cury);
                    trailline.alpha = 1;
                    this.add.tween(trailline).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
                    this.time.events.add(1000, function () {
                        trailline.destroy();
                    }, this);
                }
                this.checkCollision();

                //time update
                this.oldtime = this.timer.ms;
                this.oldinputx = this.curx;
                this.oldinputy = this.cury;
            } else {
                this.imgPointer.alpha = 0;
            }
        };

        Battle.prototype.collapserandom = function (collapsems) {
            return 1500;
            //fix later
            //return Math.floor((1 - Math.pow(Math.random(),4))*(collapsems-500))+500;
        };

        Battle.prototype.iniattack = function () {
            var attchoice = this.getrandintrange(1, 2);
            switch (attchoice) {
                case 1:
                    var circlerad = this.getrandintrange(20, 40);
                    var tempcircle = this.add.graphics(0, 0);
                    var tempcirclex = this.getrandintrange(0 + circlerad, 320 - circlerad);
                    var tempcircley = this.getrandintrange(0 + circlerad, 480 - circlerad);
                    tempcircle.lineStyle(10, 0xff0000, 0.2);
                    tempcircle.drawCircle(tempcirclex, tempcircley, circlerad);
                    var temppass = [tempcirclex, tempcircley, circlerad];
                    this.processattack(tempcircle, temppass); //x,y,r
                    break;
                case 2:
                    var templine = this.add.graphics(0, 0);
                    var templinex1 = this.getrandintrange(20, 300);
                    var templiney1 = this.getrandintrange(20, 460);
                    var templinex2 = this.getrandintrange(20, 300);
                    var templiney2 = this.getrandintrange(20, 460);
                    templine.lineStyle(2, 0xff0000, 0.2);
                    templine.moveTo(templinex1, templiney1);
                    templine.lineTo(templinex2, templiney2);
                    var temppass = [templinex1, templiney1, templinex2, templiney2];
                    this.processattack(templine, temppass); //x1,y1,x2,y
                case 3:
                    break;
            }
        };

        Battle.prototype.processattack = function (gobject, coordray) {
            this.attackList.set(gobject, coordray);

            //this.debugtxt.setText('length: ' + this.attackList.get(gobject).length);
            this.attackListKeys.push(gobject);
            this.add.tween(gobject).to({ alpha: 5 }, this.failtimesnap / 2, Phaser.Easing.Linear.None, true, 0, 0, false);
            this.time.events.add(this.failtimesnap, function () {
                if (this.attackListKeys.indexOf(gobject) != -1) {
                    this.takeDmg();
                }
                this.cleandestroy(gobject);
            }, this);
        };
        Battle.prototype.takeDmg = function () {
            //this.debugtxt.setText("dmg taken");
            this.dmgTaken = this.add.image(0, 0, 'dmgTaken');
            this.add.tween(this.dmgTaken).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
            this.time.events.add(1000, function () {
                this.dmgTaken.destroy();
            }, this);
        };
        Battle.prototype.doDmg = function () {
            //this.debugtxt.setText("dmg taken");
            this.dmgDone = this.add.image(0, 0, 'dmgDone');
            this.add.tween(this.dmgDone).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
            this.time.events.add(1000, function () {
                this.dmgDone.destroy();
            }, this);
        };

        Battle.prototype.cleandestroy = function (gobject) {
            if (this.attackListKeys.indexOf(gobject) != -1) {
                this.attackListKeys.splice(this.attackListKeys.indexOf(gobject), 1);
            }
            this.attackList.delete(gobject);
            gobject.destroy();
        };

        Battle.prototype.getrandintrange = function (min, max) {
            return Math.floor((Math.random() * (max - min + 1))) + min;
        };

        Battle.prototype.checkCollision = function () {
            for (var i = 0; i < this.attackListKeys.length; i++) {
                var key = this.attackListKeys[i];
                if (this.attackList.get(key).length == 3) {
                    if (this.collisionCircle(this.curx, this.cury, this.attackList.get(key)[0], this.attackList.get(key)[1], this.attackList.get(key)[2])) {
                        this.cleandestroy(key);
                        this.doDmg();
                    }
                } else if (this.attackList.get(key).length == 4) {
                    if (this.slashed == true) {
                        if (this.collisionLine(this.oldinputx, this.oldinputy, this.curx, this.cury, this.attackList.get(key)[0], this.attackList.get(key)[1], this.attackList.get(key)[2], this.attackList.get(key)[3])) {
                            this.cleandestroy(key);
                            this.doDmg();
                        }
                    }
                }
            }
        };

        Battle.prototype.collisionCircle = function (pcx, pcy, npcx, npcy, npcr) {
            return (Math.sqrt(Math.pow(pcx - npcx, 2) + Math.pow(pcy - npcy, 2)) <= npcr);
        };

        Battle.prototype.collisionLine = function (x1i, y1i, x1, y1, x2i, y2i, x2, y2) {
            //lines (x1i,y1i) to (x1,y1) vs (x2i,y2i) to (x2,y2)
            //current location is x1y1 and/or x2y2
            var m1, m2, b1, b2, px, py;
            m1 = (y1 - y1i) / (x1 - x1i);
            m2 = (y2 - y2i) / (x2 - x2i);
            b1 = (y1 - (m1 * x1));
            b2 = (y2 - (m2 * x2));

            px = (b2 - b1) / (m1 - m2);
            py = ((m2 * b1) - (m1 * b2)) / (m2 - m1);

            //check if px,py is within the domain/range of lines
            return (this.isBetween(x1i, x1, px) && this.isBetween(x2i, x2, px) && this.isBetween(y1i, y1, py) && this.isBetween(y2i, y2, py));
        };

        Battle.prototype.isBetween = function (n1, n2, checknum) {
            if (n1 > n2) {
                //if n1 is greater than n2
                return (checknum >= n2 && checknum <= n1);
            } else if (n2 > n1) {
                //if n2 is greater than n1
                return (checknum >= n1 && checknum <= n2);
            } else if (n2 == n1) {
                //if bounding #s are the same
                return (checknum == n1);
            }
        };
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
            this.load.image('Pointer', 'assets/Pointer.png');
            this.load.image('dmgTaken', 'assets/dmgTaken.png');
            this.load.image('dmgDone', 'assets/dmgDone.png');
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
            //this.game.state.start('Load');
            this.game.state.start('Battle');
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
            this.state.add('WorldMap', ScalingBabel.WorldMap, false);
            this.state.add('Battle', ScalingBabel.Battle, false);

            this.state.start('Boot');
        }
        return Game;
    })(Phaser.Game);
    ScalingBabel.Game = Game;
})(ScalingBabel || (ScalingBabel = {}));
var ScalingBabel;
(function (ScalingBabel) {
    var WorldMap = (function (_super) {
        __extends(WorldMap, _super);
        function WorldMap() {
            _super.apply(this, arguments);
        }
        return WorldMap;
    })(Phaser.State);
    ScalingBabel.WorldMap = WorldMap;
})(ScalingBabel || (ScalingBabel = {}));
//# sourceMappingURL=ScalingBabel.js.map
