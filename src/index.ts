import { Application, Assets, Spritesheet } from "pixi.js"
import Tilemap from "./classes/Tilemap"

async function init() {
    const app = new Application({
        backgroundColor: 0x000000,
        autoDensity: true,
        resolution: devicePixelRatio
    });
    
    const appRoot = document.getElementById("appRoot");
    appRoot.append(app.view as HTMLCanvasElement);
    
    const sheet:Spritesheet = await Assets.load('assets/tileset/lilDragonTileset.json');
    const map1 = new Tilemap({
        spriteSheet: sheet,
        parent: app.stage,
        tileSize: 16
    });

    map1.setMap({
        "0,0": "snowNW",
        "1,1": "snowNW",
        "2,2": "snowNW",
        "2,4": "snowSE",
    });
}

init();