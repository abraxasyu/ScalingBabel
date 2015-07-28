module ScalingBabel {
    export class Boot extends Phaser.State {
        bgBoot: Phaser.Image;
        preload() {
            this.load.image('bgBoot', 'assets/Boot_bg.png');
        }
        create() {

            this.scale.pageAlignVertically = true;
            this.scale.pageAlignHorizontally = true;

            this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
            this.scale.setUserScale((window.innerHeight * 2 / 3) / 320, (window.innerHeight) / 480);
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;

            this.bgBoot = this.add.image(0, 0, 'bgBoot');
            this.bgBoot.inputEnabled = true;
            this.bgBoot.events.onInputDown.addOnce(this.startLoad, this);

        }
        update() {
        }
        startLoad() {
            this.game.state.start('Load');
        }
    }
}
