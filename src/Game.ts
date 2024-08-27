// this includes helper functions & classes that represent the entire game loop
// Game hooks into the pixi renderer and handles setting objects to the necessary positions, running the game systems(physics etc.)

import { Player } from "./player";
import { Application } from "pixi.js";
import { Graphics } from "pixi.js";

    // represents a tile
    enum Tile {
        Space,
        Ground,
        Lava,
        Wall,
    }

export class Game{

    // list of all entities in the game - just the player at this point
    Entities: Array<Player>;
    App: Application;
    public static LevelEntities: Array<Graphics>;

    constructor(app: Application) {
        this.Entities = new Array<Player>();
        this.App = app;
        Game.LevelEntities = new Array<Graphics>();

        // register the update loop
        app.ticker.add((ticker) => {
            this.update(ticker.deltaTime)
        });

        // generate the level based on array
        this.generateLevel();

        // create the player
        this.Entities[0] = (this.spawnPlayer());
    }

    spawnPlayer(){
        let player = new Player(50);

        // register the player's obj with the stage - should this just be passed into constructor?
        this.App.stage.addChild(player.graphicsObj);

        return player;
    }

    generateLevel(){
        // setting up the level system - stored as a simple array
        let levelMatrix: Tile[][] = [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        ];

        // generate the level by indicies
        for(let y = 0; y < levelMatrix.length; y++){
            for(let x = 0; x < levelMatrix[y].length; x++){
                if(levelMatrix[y][x] == 1){
                    let tile = new Graphics().rect(x * 50, y * 50, 50, 50).fill(0x505050);

                    Game.LevelEntities.push(tile);
                    this.App.stage.addChild(tile);
                }

            }
        }
    }

    // registered into the Ticker, all entities can register to update to perform their actions
    update(deltaTime: number){
        //console.log("one tick");

        // tick the player
        this.Entities.forEach(player => {
            player.update(deltaTime);
        });
    }
    
}