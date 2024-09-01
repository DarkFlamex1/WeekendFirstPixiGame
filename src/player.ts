//import * as PIXI from 'pixi.js';
import { Graphics, ObservablePoint, Point, Bounds } from 'pixi.js';
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

    velocity: Point;

    elapsedTime: number;

    constructor(playerSize: number) {
        // create the new graphics object representing the player at 0,0 w/ a defined size
        this.graphicsObj = new Graphics().rect(0, 0, playerSize, playerSize).fill(PLAYER_COLOR);
        this.point = new Point(0,0);
        this.velocity = new Point(0,0);
        this.elapsedTime = 0;
    }

    // update - registered to the update loop in the game
    update(deltaTime: number)
    { 
        // poll the input
        if(InputHandler.isKeyPressed('ArrowDown')){
            this.velocity.y += 5;
        }
        if(InputHandler.isKeyPressed('ArrowUp')){
            this.velocity.y -= 50;
        }
        if(InputHandler.isKeyPressed('ArrowRight')){
            this.velocity.x += 5;
        }
        if(InputHandler.isKeyPressed('ArrowLeft')){
            this.velocity.x -= 5;
        }
        
        // example gravity implementation - TODO
        this.elapsedTime += deltaTime;
        
        if(this.velocity.y >= 0){
            this.velocity.y += 2 * deltaTime;
        }

        // adjusts based of the level
        let success = this.collisionDetection();

        console.log(this.velocity, success);
        let newPos = new Point(this.point.x + this.velocity.x * deltaTime, this.point.y + this.velocity.y * deltaTime);

        this.graphicsObj.position = newPos;
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
        let success = false;
        Game.LevelEntities.forEach(element => {
            success = success || this.intersectBounds(element);
        });

        return success;
    }

    intersectBounds(object:Graphics){
        
        let bounds = object.getBounds();      
        let playerBounds = this.graphicsObj.getBounds();
        //new Bounds(this.point.x, this.point.y, this.point.x + this.graphicsObj.width, this.point.y + this.graphicsObj.height);

        // 
        
        // bounds of a tile:
        // bottom_
        // left | | right
        // top   _
        
        //if(playerBounds.x < bounds1.right && playerBounds.right > bounds1.x)

        // check the top:
        // we want to reset if we're clipped into the inside of an object
        // as long as some part of the square on the x side is within the y that should count as a hit
        // check if the playerbounds.bottom is between bounds.top & bounds.bottom

        // ISSUE: we are hitting no collision detected which leaves us applying gravity

        // playerBounds is not accurate as it hasn't been adjusted for the new frame movement
        // could we just calculate new bounds?

        if(playerBounds.left < bounds.right && playerBounds.left > bounds.left && playerBounds.top > bounds.top && playerBounds.top < bounds.bottom){
            console.log("hit on the left", this.elapsedTime);
            this.point.x = bounds.right;
            this.velocity.x = 0;
            return true;

        }
        else if(playerBounds.right > bounds.left && playerBounds.right < bounds.right && playerBounds.top > bounds.top && playerBounds.top < bounds.bottom){
            console.log("hit on the right edge");
            this.point.x = bounds.left - bounds.width;
            this.velocity.x = 0;
            return true;

        }
        else if(playerBounds.bottom > bounds.top && playerBounds.bottom < bounds.bottom && playerBounds.left < bounds.right && playerBounds.right > bounds.left){
            console.log("hit", this.elapsedTime);
            //console.log("plBottom: %d, b.top: %d, b.bottom: %d", playerBounds.bottom, bounds.top, bounds.bottom);
            this.point.y = bounds.top - bounds.width;           
            this.velocity.y = 0; 
            return true;
        }
        return false;
        // check the right side - NOT WORKING
       /*  if(this.graphicsObj.bounds.left < bounds.right && this.graphicsObj.bounds.left > bounds.left && this.graphicsObj.bounds.top > bounds.bottom && this.graphicsObj.bounds.top < bounds.top){
            console.log("hit right");
            this.point.x = bounds.right;
        } */


        // collision detection on the top 
        /* else if(this.point.y > bounds.top - 50 && this.point.x < bounds.right && this.point.x < bounds.left && this.point.y < bounds.bottom)
        {
            console.log("top hit" + bounds.top + " " + bounds.right + " " +bounds.left + " " + bounds.bottom)
            this.point.y = bounds.top - 50;
        } */
    }

    // process the input and perform collision checks with the entities of the world
}

