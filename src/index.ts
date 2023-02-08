import { Application, Assets, Spritesheet, settings, SCALE_MODES, Container } from "pixi.js"
import Tilemap from "./classes/Tilemap"
import MapHandler from "./classes/MapHandler"
import FPSCounter from "./classes/FPSCounter"

async function init() {
    const app = new Application({
        backgroundColor: 0x000000,
        autoDensity: true,
        resolution: devicePixelRatio
    });

    const gameplayContainer = new Container();
    gameplayContainer.scale.set(2);
    app.stage.addChild(gameplayContainer);
    
    const appRoot = document.getElementById("appRoot");
    appRoot.append(app.view as HTMLCanvasElement);

    settings.SCALE_MODE = SCALE_MODES.NEAREST;
    
    const sheet:Spritesheet = await Assets.load('assets/tileset/lilDragonTileset.json');
    const baseTilemap = new Tilemap({
        spriteSheet: sheet,
        parent: gameplayContainer,
        tileSize: 16
    });
    const overlayTilemap = new Tilemap({
        spriteSheet: sheet,
        parent: gameplayContainer,
        tileSize: 16
    });

    const mapHandler = new MapHandler(baseTilemap, overlayTilemap);

    const fpsCounter = new FPSCounter(app.stage, app);
}

init();