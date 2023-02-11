import { Container } from "pixi.js"
import Tilemap from "./Tilemap"
import { TileFacts } from "./TileType"
import { tileTypes, tileNames } from "../generators/tileTypeGenerator"
import Thing from "./Thing"
import Player from "./Player"
import Entity from "./Entity"
import Pushable from "./Pushable"

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
                const key = this.formatKey(i, j+1);
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
            const key = this.formatKey(x + dx, y + dy);
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

        const player = new Player({
            spriteSource: "assets/dude.png",
            x:0,
            y:0,
            mapHandler: this,
            entityContainer,
            displayOffset: {dx:0, dy:-8}
        });

        const pushableBox = new Entity({
            spriteSource: base.spriteSheet.textures["box"],
            x: 4,
            y: 4,
            mapHandler: this,
            entityContainer,
            interactions:[new Pushable()]
        });

        // Splat onto the screen
        base.setMap(baseMap);
        overlay.setMap(overlayMap);
    }

    getThingAtLocation(x:number, y:number, thingLayer:number): Thing {
        const key = this.formatKey(x, y);
        if (this.map[key] && this.map[key].contents) {
            return this.map[key] && this.map[key].contents[thingLayer];
        }
        return null;
    }

    canPlace(x:number, y:number, thingLayer:number): boolean {
        const key = this.formatKey(x, y);
        return this.map[key] && this.map[key].passable && (!this.map[key].contents || !this.map[key].contents[thingLayer]);
    }

    place(x:number, y:number, thing:Thing): boolean {
        if (!this.canPlace(x,y,thing.thingLayer)) {
            return false;
        }
        const key = this.formatKey(x, y);
        if (!this.map[key].contents) {
            this.map[key].contents = {};
        }
        thing.setPosition(x, y, this.tileSize);
        this.map[key].contents[thing.thingLayer] = thing;
        return true;
    }

    remove(x: number, y:number, thing:Thing) {
        const key = this.formatKey(x, y);
        if (this.map[key] && this.map[key].contents && this.map[key].contents[thing.thingLayer] === thing) {
            this.map[key].contents[thing.thingLayer] = null;
        }
    }

    formatKey(x: number, y: number): string {
        return `${x},${y}`;
    }
}

export default MapHandler;