///<reference path="phaser.d.ts"/>

module ScalingBabel {

    export class Game extends Phaser.Game {

        constructor() {


            super(320, 480, Phaser.AUTO, 'content', null);

            this.state.add('Boot', Boot, false);
            this.state.add('Load', Load, false);
            this.state.add('Menu', Menu, false);
            this.state.add('Map', Map, false);
            this.state.add('Battle', Battle, false);

            this.state.start('Boot');



        }

    }

}  