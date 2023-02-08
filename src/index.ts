import { Application, Assets, Spritesheet, settings, SCALE_MODES } from "pixi.js"
import Tilemap from "./classes/Tilemap"
import MapHandler from "./classes/MapHandler"

async function init() {
    const app = new Application({
        backgroundColor: 0x000000,
        autoDensity: true,
        resolution: devicePixelRatio
    });
    
    const appRoot = document.getElementById("appRoot");
    appRoot.append(app.view as HTMLCanvasElement);

    settings.SCALE_MODE = SCALE_MODES.NEAREST;
    
    const sheet:Spritesheet = await Assets.load('assets/tileset/lilDragonTileset.json');
    const baseTilemap = new Tilemap({
        spriteSheet: sheet,
        parent: app.stage,
        tileSize: 16
    });
    const overlayTilemap = new Tilemap({
        spriteSheet: sheet,
        parent: app.stage,
        tileSize: 16
    });

    app.stage.scale.set(2);

    const mapHandler = new MapHandler(baseTilemap, overlayTilemap);
}

init();