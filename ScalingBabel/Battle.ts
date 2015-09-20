module ScalingBabel {
    export class Battle extends Phaser.State {
        lineNPC: Phaser.Graphics;
        lineanimNPC: Phaser.Graphics;
        linePC: Phaser.Graphics;
        lineanimPC: Phaser.Graphics;
        timer: Phaser.Timer;

        imgPointer: Phaser.Image;
        oldinputx: number;
        oldinputy: number;
        curx: number;
        cury: number;

        dmgTaken: Phaser.Image;
        dmgDone: Phaser.Image;

        debugtxt: Phaser.Text;

        failtimesnap: number =1000;
        timesnap: number = 0;

        oldtime: number = 0;

        slashed: boolean = false;

        attackList:Map<Phaser.Graphics,number[]>;
        attackListKeys: Phaser.Graphics[];

        create() {
            this.attackList = new Map<Phaser.Graphics, number[]>();
            this.attackListKeys = new Array<Phaser.Graphics>();
            this.timer = this.time.create(false);
            this.timer.start();
            this.lineNPC = this.add.graphics(0, 0);
            this.lineanimNPC = this.add.graphics(0, 0);
            this.linePC = this.add.graphics(0, 0);
            this.lineanimPC = this.add.graphics(0, 0);
            //this.debugtxt = this.add.text(10, 10, 'sanity3: '+this.timer.ms, { fontSize: '20 px', fill: 'white' });

            this.imgPointer = this.add.image(0, 0, 'Pointer');
            this.imgPointer.anchor.setTo(0.5, 0.5);
            this.imgPointer.alpha = 0;

        }

        update() {
            this.failtimesnap -= (this.timer.ms - this.timesnap);
            this.timesnap = this.timer.ms;

            if (this.failtimesnap <= 0) {
                //parameter should be >500
                this.failtimesnap = this.collapserandom(2000);
                this.iniattack();
            }
            this.updatePointer();
            

        }

        updatePointer() {
            if (this.input.activePointer.isDown) {
                this.curx = this.input.activePointer.x;
                this.cury = this.input.activePointer.y;
                //cursor point
                this.imgPointer.alpha = 1;
                this.imgPointer.position.setTo(this.curx,this.cury);

                this.slashed = false;
                //cursor trail line
                if ((this.timer.ms-this.oldtime)<100){
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
            }
            else {
                this.imgPointer.alpha = 0;
            }
        }

        collapserandom(collapsems) {
            return 1500;    
            //fix later
            //return Math.floor((1 - Math.pow(Math.random(),4))*(collapsems-500))+500;
        }

        iniattack() {
            var attchoice = this.getrandintrange(1, 2);
            switch (attchoice) {
                case 1: //circleattack
                    var circlerad = this.getrandintrange(20,40);
                    var tempcircle = this.add.graphics(0, 0);
                    var tempcirclex = this.getrandintrange(0 + circlerad, 320 - circlerad);
                    var tempcircley = this.getrandintrange(0 + circlerad, 480 - circlerad);
                    tempcircle.lineStyle(10, 0xff0000, 0.2);
                    tempcircle.drawCircle(tempcirclex, tempcircley, circlerad);
                    var temppass=[tempcirclex,tempcircley,circlerad]
                    this.processattack(tempcircle,temppass);//x,y,r
                    break;
                case 2: //lineattack
                    var templine = this.add.graphics(0, 0);
                    var templinex1 = this.getrandintrange(20, 300);
                    var templiney1 = this.getrandintrange(20, 460);
                    var templinex2 = this.getrandintrange(20, 300);
                    var templiney2 = this.getrandintrange(20, 460);
                    templine.lineStyle(2, 0xff0000, 0.2);
                    templine.moveTo(templinex1,templiney1);
                    templine.lineTo(templinex2, templiney2);
                    var temppass = [templinex1, templiney1, templinex2, templiney2];
                    this.processattack(templine, temppass);//x1,y1,x2,y
                case 3:
                    break;
            }
        }

        processattack(gobject, coordray) {
            this.attackList.set(gobject, coordray);
            this.attackListKeys.push(gobject);
            this.add.tween(gobject).to({ alpha: 5 }, this.failtimesnap / 2, Phaser.Easing.Linear.None, true, 0, 0, false);
            this.time.events.add(this.failtimesnap, function () {
                if (this.attackListKeys.indexOf(gobject) != -1) { this.takeDmg(); }
                this.cleandestroy(gobject);
            }, this);
        }
        takeDmg() {
            //this.debugtxt.setText("dmg taken");
            this.dmgTaken = this.add.image(0, 0, 'dmgTaken');
            this.add.tween(this.dmgTaken).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
            this.time.events.add(1000, function () {
                this.dmgTaken.destroy();
            }, this);
        }
        doDmg() {
            //this.debugtxt.setText("dmg done");
            this.dmgDone = this.add.image(0, 0, 'dmgDone');
            this.add.tween(this.dmgDone).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
            this.time.events.add(1000, function () {
                this.dmgDone.destroy();
            }, this);
        }

        cleandestroy(gobject) {
            if (this.attackListKeys.indexOf(gobject) != -1) {
                this.attackListKeys.splice(this.attackListKeys.indexOf(gobject), 1);
            }
            this.attackList.delete(gobject);
            gobject.destroy();
        }

        getrandintrange(min, max) {
            return Math.floor((Math.random()*(max-min+1)))+min;
        }

        checkCollision() {
            for (var i = 0; i < this.attackListKeys.length;i++) {
                var key = this.attackListKeys[i];
                if (this.attackList.get(key).length == 3) { //circle
                    if (this.collisionCircle(this.curx, this.cury, this.attackList.get(key)[0], this.attackList.get(key)[1], this.attackList.get(key)[2])) {
                        this.cleandestroy(key);
                        this.doDmg();
                    }
                }
                else if (this.attackList.get(key).length == 4) { //line
                    if (this.slashed == true) {
                        if (this.collisionLine(this.oldinputx, this.oldinputy, this.curx, this.cury, this.attackList.get(key)[0], this.attackList.get(key)[1], this.attackList.get(key)[2], this.attackList.get(key)[3])) {
                            this.cleandestroy(key);
                            this.doDmg();
                        }
                    }
                }
            }
            

        }

        collisionCircle(pcx, pcy, npcx, npcy, npcr) {
            return (Math.sqrt(Math.pow(pcx - npcx, 2) + Math.pow(pcy - npcy, 2)) <= npcr);
        }

        collisionLine(x1i, y1i, x1, y1, x2i, y2i, x2, y2) {
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
        }

        isBetween(n1, n2, checknum) {
            if (n1 > n2) {
                //if n1 is greater than n2
                return (checknum >= n2 && checknum <= n1);
            }
            else if (n2 > n1) {
                //if n2 is greater than n1
                return (checknum >= n1 && checknum <= n2);
            }
            else if (n2 == n1) {
                //if bounding #s are the same
                return (checknum == n1);
            }
        }
    }
}