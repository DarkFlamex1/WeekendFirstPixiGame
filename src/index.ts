// stores the keydown and keyup events for easy access within the game loop
export abstract class InputHandler {
    private static keysPressed: Set<string> = new Set();

    public static register() {
        window.addEventListener('keydown', (e: KeyboardEvent) => {
            InputHandler.keysPressed.add(e.code);
        });
        window.addEventListener('keyup', (e: KeyboardEvent) => {
            InputHandler.keysPressed.delete(e.code);
        });
    }

    public static isKeyPressed(key: string): boolean {
        return InputHandler.keysPressed.has(key);
    }
}

// the colors each tile map to

import * as PIXI from 'pixi.js';
import { Player } from './player';
import { Game } from './Game';

// application class creates a renderer, creates a stage & starts the ticker
const app = new PIXI.Application();

// async function to initialize the app
async function initializeApp() {
    await app.init({ width: 950, height: 500 });

    // TODO: setup constants for size, player size, tile size!

    InputHandler.register();

    // add the canvas to the DOM
    document.body.appendChild(app.canvas);

    let game = new Game(app);
}

// Call the function to initialize the app
initializeApp().catch(err => console.error('Error initializing app:', err));


