// Jacky Ho
// Created: 5/28/2024
// Phaser: 3.70.0
//
// Carrot Hunt
//
// Game 4 Final
// 

// debug with extreme prejudice
"use strict"

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    width: 1440,
    height: 900,
    scene: [Load, Level1, End, Death]
}

var cursors;
const SCALE = 2.0;
var my = {sprite: {}, text: {}, vfx: {}, lives:[]};

const game = new Phaser.Game(config);