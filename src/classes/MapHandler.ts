import Tilemap from "./Tilemap";
import { tileTypes, tileNames } from "../generators/tileTypeGenerator"

// Generate a map, then use the appropriate tile types to hand those details over to the tilemaps
class MapHandler {
    map: {[key:string]:tileNames}
    constructor(base: Tilemap, overlay: Tilemap) {
        this.map = {};
        for (let i=0; i<10; i++) {
            for (let j=0; j<10; j++) {
                const key = `${i},${j+1}`;
                let id:tileNames = "purpleBrickFloor";
                if (i === 0 || i === 9 || j === 0 || j === 9) {
                    id = "purpleBrickWall";
                }
                this.map[key] = id;
            }
        }

        // Generate the map
        const baseMap: {[key:string]:string} = {};
        const overlayMap: {[key:string]:string} = {};
        let x:number, y:number;
        // Define callback function
        const checkType = (dx: number, dy:number) => {
            const key = `${x + dx},${y + dy}`;
            return this.map[key];
        }
        for (const key in this.map) {
            [x, y] = key.split(',').map(x=>parseInt(x));
            const tileType = tileTypes[this.map[key]];
            const result = tileType.getTile(checkType);
            baseMap[key] = result.name;

            if (result.abovePiece) {
                const aboveKey = `${x},${y-1}`;
                overlayMap[aboveKey] = result.abovePiece;
            }
        }


        // Splat onto the screen
        base.setMap(baseMap);
        overlay.setMap(overlayMap);
    }
}

export default MapHandler;