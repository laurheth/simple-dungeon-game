export const TILE_NEIGHBOUR = {
    UP_LEFT: 0x00000001,
    UP: 0x00000010,
    UP_RIGHT: 0x00000100, //
    LEFT: 0x00001000, //
    RIGHT: 0x00010000, //
    DOWN_LEFT: 0x00100000,
    DOWN: 0x01000000,
    DOWN_RIGHT: 0x10000000
};

const MASK_ITERATOR = [
    {mask: TILE_NEIGHBOUR.UP_LEFT, x:-1, y:-1},
    {mask: TILE_NEIGHBOUR.UP, x:0, y:-1},
    {mask: TILE_NEIGHBOUR.UP_RIGHT, x:1, y:-1},
    {mask: TILE_NEIGHBOUR.LEFT, x:-1, y:0},
    {mask: TILE_NEIGHBOUR.RIGHT, x:1, y:0},
    {mask: TILE_NEIGHBOUR.DOWN_LEFT, x:-1, y:1},
    {mask: TILE_NEIGHBOUR.DOWN, x:0, y:1},
    {mask: TILE_NEIGHBOUR.DOWN_RIGHT, x:1, y:1}
];

interface TileOption {
    name: string;
    abovePiece?: string;
    neighbourMask: number;
}

interface TileTypeParams {
    name: string;
    options: TileOption[];
}

// Class the define a type of tile, and figure out which tile to actually show on the screen
class TileType {
    name: string;
    options: TileOption[];

    constructor({name, options}:TileTypeParams) {
        this.name = name;
        this.options = options;
    }

    getTile(getTileCallback:(x:number,y:number)=>string): TileOption {
        let matches = 0x00000000;
        // Check every neighbour to get the total matches
        MASK_ITERATOR.forEach(mask => {
            if (getTileCallback(mask.x, mask.y) === this.name) {
                matches |= mask.mask;
            }
        });

        // Find the best match
        let tileToReturn = this.options[0];
        for (let i=1; i<this.options.length; i++) {
            if ((this.options[i].neighbourMask & matches) === this.options[i].neighbourMask) {
                tileToReturn = this.options[i];
            }
        }
        return tileToReturn;
    }
}

export default TileType;