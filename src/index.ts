import * as PIXI from 'pixi.js';

// application class creates a renderer, creates a stage & starts the ticker
const app = new PIXI.Application();

// async function to initialize the app
async function initializeApp() {
    await app.init({ width: 960, height: 520 });

    // add the canvas to the DOM
    document.body.appendChild(app.canvas);

    // create the player using the graphics API
    let graphicsRect = new PIXI.Graphics().rect(0, 0, 50, 50).fill(0xff0000);

    // add the sprite to the stage
    app.stage.addChild(graphicsRect);

    // oscillate the square
    let elapsed = 0.0;
    app.ticker.add((ticker) => {
        elapsed += ticker.deltaTime;
        graphicsRect.x = 100.0 + Math.sin(elapsed / 20) * 100.0;
    });
}

// Call the function to initialize the app
initializeApp().catch(err => console.error('Error initializing app:', err));
