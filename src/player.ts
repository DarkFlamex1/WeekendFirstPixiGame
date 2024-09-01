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

        this.velocity.x = 0;
        // poll the input
        if(InputHandler.isKeyPressed('ArrowDown')){
            this.velocity.y += 5;
        }
        if(InputHandler.isKeyPressed('ArrowUp')){
            this.velocity.y -= 5;
        }
        if(InputHandler.isKeyPressed('ArrowRight')){
            this.velocity.x = 5;
        }
        if(InputHandler.isKeyPressed('ArrowLeft')){
            this.velocity.x = -5;
        }
        
        // example gravity implementation
        this.elapsedTime += deltaTime;
        
        // apply gravity
        if(this.velocity.y >= 0){
            this.velocity.y += 2 * deltaTime;
        }

        // even though we're adjusting for the collision, when we check for a collision we're using the OLD position
        // so we should check against this point instead
        let newPos = new Point(
            this.point.x + this.velocity.x * deltaTime,
            this.point.y + this.velocity.y * deltaTime
        );
        
        // adjust the velocity based on the collision
        let position = this.collisionDetection(newPos);

        this.point = position;
        this.graphicsObj.position = position;
    }

    // level collision detection w/ all entities against the new position
    collisionDetection(position: Point){

        console.log("position.x: %d, position.y: %d", position.x, position.y);
        // collision detection for the level
        if(position.y > 450){
            position.y = 450;
            this.velocity.y = 0;
        }
        if(this.point.y < 0){
            position.y = 0;
            this.velocity.y = 0;
        }
        if(this.point.x < 0){
            position.x = 0;
            this.velocity.x = 0;
        }
        if(this.point.x > 900){
            position.x = 900;
            this.velocity.x = 0;
        }

        // check if the bounds of the objects intersect (simple algo, we should do broad phase first using segmentation through a quadtree)
        Game.LevelEntities.forEach(element => {
            position = this.intersectBounds(element, position);
        });

        console.log("Post detection: position.x: %d, position.y: %d", position.x, position.y);
        return position;
    }

    intersectBounds(object:Graphics, playerPos: Point){
        
        let bounds = object.getBounds();      
        let playerBounds = new Bounds(playerPos.x, playerPos.y, playerPos.x + this.graphicsObj.width, playerPos.y + this.graphicsObj.height);

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
            playerPos.x = bounds.right;
            this.velocity.x = 0;
            return playerPos;
        }
        else if(playerBounds.right > bounds.left && playerBounds.right < bounds.right && playerBounds.top > bounds.top && playerBounds.top < bounds.bottom){
            console.log("hit on the right edge");
            playerPos.x = bounds.left - bounds.width;
            this.velocity.x = 0;
            return playerPos;
        }
        else if(playerBounds.bottom > bounds.top && playerBounds.bottom < bounds.bottom && playerBounds.left < bounds.right && playerBounds.right > bounds.left){
            //console.log("hit", this.elapsedTime);
            playerPos.y = bounds.top - bounds.height;
            //console.log("plBottom: %d, b.top: %d, b.bottom: %d, playerPos.y: %d", playerBounds.bottom, bounds.top, bounds.bottom, playerPos.y);
            this.velocity.y = 0; 
            return playerPos;
        }
       
        return playerPos;
    }
}

