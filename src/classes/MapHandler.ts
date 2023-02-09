import { Container } from "pixi.js"
import Tilemap from "./Tilemap"
import { TileFacts } from "./TileType"
import { tileTypes, tileNames } from "../generators/tileTypeGenerator"
import Thing from "./Thing"

interface MapHandlerParams {
    base: Tilemap;
    overlay: Tilemap;
    tileSize: number;
    entityContainer: Container;
}

// Generate a map, then use the appropriate tile types to hand those details over to the tilemaps
class MapHandler {
    map: {[key:string]:TileFacts};
    tileSize: number;
    constructor({base, overlay, tileSize, entityContainer}:MapHandlerParams) {
        this.map = {};
        this.tileSize = tileSize;

        // Temporary map object to use with generating the map
        const mapForGeneration:{[key:string]:tileNames} = {};

        for (let i=0; i<10; i++) {
            for (let j=0; j<10; j++) {
                const key = `${i},${j+1}`;
                let id:tileNames = "purpleBrickFloor";
                if (i === 0 || i === 9 || j === 0 || j === 9) {
                    id = "purpleBrickWall";
                }
                mapForGeneration[key] = id;
            }
        }

        // Generate the map
        const baseMap: {[key:string]:string} = {};
        const overlayMap: {[key:string]:string} = {};
        let x:number, y:number;
        // Define callback function
        const checkType = (dx: number, dy:number) => {
            const key = `${x + dx},${y + dy}`;
            return mapForGeneration[key];
        }
        for (const key in mapForGeneration) {
            [x, y] = key.split(',').map(x=>parseInt(x));
            const tileType = tileTypes[mapForGeneration[key]];
            const result = tileType.getTile(checkType);
            baseMap[key] = result.name;
            this.map[key] = {...tileType.tileFacts};
            if (result.abovePiece) {
                const aboveKey = `${x},${y-1}`;
                overlayMap[aboveKey] = result.abovePiece;
            }
        }

        const player = new Thing({
            spriteSource: "assets/dude.png",
            x:0,
            y:0,
            mapHandler: this,
            entityContainer,
            displayOffset: {dx:0, dy:-8}
        });

        // Splat onto the screen
        base.setMap(baseMap);
        overlay.setMap(overlayMap);
    }

    canPlace(x:number, y:number, thingLayer:number): boolean {
        const key = `${x},${y}`;
        console.log(key);
        return this.map[key] && this.map[key].passable && (!this.map[key].contents || !this.map[key].contents[thingLayer]);
    }

    place(x:number, y:number, thing:Thing): boolean {
        if (!this.canPlace(x,y,thing.thingLayer)) {
            return false;
        }
        const key = `${x},${y}`;
        console.log(key);
        if (!this.map[key].contents) {
            this.map[key].contents = {};
        }
        this.map[key].contents[thing.thingLayer] = thing;
        thing.setPosition(x, y, this.tileSize);
        return true;
    }

    remove(x: number, y:number, thing:Thing) {
        const key = `${x},${y}`;
        if (this.map[key].contents[thing.thingLayer] === thing) {
            this.map[key].contents[thing.thingLayer] = null;
        }
    }
}

export default MapHandler;