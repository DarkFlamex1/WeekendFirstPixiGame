//import * as PIXI from 'pixi.js';
import { Graphics, ObservablePoint, Point } from 'pixi.js';
import { PLAYER_COLOR } from './constants';
import { InputHandler } from '.';
import { Game } from './Game';

// represents a player in the game
export class Player{

    graphicsObj: Graphics;

    // represents the world position for the simulation
    //worldPosision: ObservablePoint;

    // represents the movement information for the player
    // velocity
    // acceleration
    point: Point;

    constructor(playerSize: number) {
        // create the new graphics object representing the player at 0,0 w/ a defined size
        this.graphicsObj = new Graphics().rect(0, 0, playerSize, playerSize).fill(PLAYER_COLOR);
        this.point = new Point(0,0);
    }

    // update - registered to the update loop in the game
    update(deltaTime: number)
    { 
        // poll the input
        if(InputHandler.isKeyPressed('ArrowDown')){
            this.point.y += 5;
        }
        if(InputHandler.isKeyPressed('ArrowUp')){
            this.point.y -= 50;
        }
        if(InputHandler.isKeyPressed('ArrowRight')){
            this.point.x += 5;
        }
        if(InputHandler.isKeyPressed('ArrowLeft')){
            this.point.x -= 5;
        }
        
        // example gravity implementation - TODO
        this.point.y += 2 * deltaTime;

        // adjusts based of the level
        this.collisionDetection();

        this.graphicsObj.position = this.point;
    }

    // level collision detection
    collisionDetection(){
        // collision detection for the level
        if(this.point.y > 450){
            this.point.y = 450;
        }
        if(this.point.y < 0){
            this.point.y = 0;
        }
        if(this.point.x < 0){
            this.point.x = 0;
        }
        if(this.point.x > 900){
            this.point.x = 900;
        }

        // check if the bounds of the objects intersect (simple algo, we should do broad phase first using segmentation through a quadtree)
        Game.LevelEntities.forEach(element => {
            this.intersectBounds(element);
        });
    }

    intersectBounds(object:Graphics){


        let bounds = object.getBounds();      
        
        
        // check the right side - NOT WORKING
        if(this.graphicsObj.bounds.left < bounds.right && this.graphicsObj.bounds.left > bounds.left && this.graphicsObj.bounds.top > bounds.bottom && this.graphicsObj.bounds.top < bounds.top){
            console.log("hit right");
            this.point.x = bounds.right;
        }
        // collision detection on the top
        else if(this.point.y > bounds.top - 50 && this.point.x < bounds.right && this.point.x < bounds.left && this.point.y < bounds.bottom)
        {
            console.log("top hit")
            this.point.y = bounds.top - 50;
        }
    }

    // process the input and perform collision checks with the entities of the world
}

