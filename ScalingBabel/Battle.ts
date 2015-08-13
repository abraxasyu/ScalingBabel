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

        debugtxt: Phaser.Text;

        failtimesnap: number = 2000;
        timesnap: number = 0;

        oldtime: number = 0;

        create() {
            this.timer = this.time.create(false);
            this.timer.start();
            this.lineNPC = this.add.graphics(0, 0);
            this.lineanimNPC = this.add.graphics(0, 0);
            this.linePC = this.add.graphics(0, 0);
            this.lineanimPC = this.add.graphics(0, 0);
            this.debugtxt = this.add.text(10, 10, 'testing: '+this.timer.ms, { fontSize: '1 px', fill: 'white' });

            this.imgPointer = this.add.image(0, 0, 'Pointer');
            this.imgPointer.anchor.setTo(0.5, 0.5);
            this.imgPointer.alpha = 0;

        }

        update() {
            //this.debugtxt.setText('failtimesnap1: '+ this.failtimesnap);

            this.failtimesnap -= (this.timer.ms - this.timesnap);
            this.timesnap = this.timer.ms;

            if (this.failtimesnap <= 0) {
                //parameter should be >500
                this.failtimesnap = this.collapserandom(2000);
                this.iniattack();

                this.debugtxt.setText('failtimesnap1: ' + this.failtimesnap);
            }
            this.updatePointer();


        }

        updatePointer() {
            if (this.input.activePointer.isDown) {
                //cursor point
                this.imgPointer.alpha = 1;
                this.imgPointer.position.setTo(this.input.activePointer.x, this.input.activePointer.y);

                //cursor trail line
                if ((this.timer.ms-this.oldtime)<100){
                    var trailline = this.add.graphics(0, 0);
                    trailline.lineStyle(2, 0xccffff);
                    trailline.moveTo(this.oldinputx, this.oldinputy);
                    trailline.lineTo(this.input.activePointer.x, this.input.activePointer.y);
                    trailline.alpha = 1;
                    this.add.tween(trailline).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
                    this.time.events.add(1000, function () {
                        trailline.destroy();
                    }, this);
                }
                //time update
                this.oldtime = this.timer.ms;
                this.oldinputx = this.input.activePointer.x;
                this.oldinputy = this.input.activePointer.y;
            }
            else {
                this.imgPointer.alpha = 0;
            }
        }

        collapserandom(collapsems) {
            return Math.floor((1 - Math.pow(Math.random(),4))*(collapsems-500))+500;
        }

        iniattack() {
            var attchoice = this.getrandintrange(1, 1);
            var circlerad = 30;
            switch (attchoice) {
                case 1:
                    var tempcircle = this.add.graphics(0, 0);
                    tempcircle.lineStyle(10, 0xff0000, 0.2);
                    tempcircle.alpha = 0.2;
                    tempcircle.drawCircle(this.getrandintrange(0 + circlerad, 320 - circlerad), this.getrandintrange(0 + circlerad, 480 - circlerad), circlerad);

                    this.add.tween(tempcircle).to({ alpha: 5 }, this.failtimesnap/2, Phaser.Easing.Linear.None, true, 0, 0, false);
                    this.time.events.add(this.failtimesnap, function () {
                        tempcircle.destroy();
                    }, this);
                    break;
                case 2:
                    break;
                case 3:
                    break;
            }
        }

        getrandintrange(min, max) {
            return Math.floor((Math.random()*(max-min+1)))+min;
        }

        checkIntersect(x1i, y1i, x1, y1, x2i, y2i, x2, y2) {
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