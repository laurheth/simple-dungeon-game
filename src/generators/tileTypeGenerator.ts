import { default as TileType, TileFacts, TILE_NEIGHBOUR } from "../classes/TileType";

// Simple tile with no variants.
function simpleTile(name: string, tileFacts:TileFacts) {
    return new TileType({
        name: name,
        options: [{
            name: name,
            neighbourMask: 0
        }],
        tileFacts: tileFacts
    })
}

export type tileNames = "purpleBrickWall" | "purpleBrickFloor";

// Constant containing several objects for various tile types, to simplify their use
export const tileTypes = {
    purpleBrickWall: new TileType({
        name: "purpleBrickWall",
        options: [
            {
                name: "purpleWall",
                neighbourMask: 0
            },
            {
                name: "purpleWallESoloFront",
                neighbourMask: TILE_NEIGHBOUR.LEFT,
                abovePiece: 'purpleWallESoloOverlap'
            },
            {
                name: "purpleWallWSoloFront",
                neighbourMask: TILE_NEIGHBOUR.RIGHT,
                abovePiece: 'purpleWallWSoloOverlap'
            },
            {
                name: "purpleWallN",
                neighbourMask: TILE_NEIGHBOUR.LEFT | TILE_NEIGHBOUR.RIGHT,
                abovePiece: 'purpleWallOverlapN'
            },
            {
                name: "purpleWallSSoloFront",
                neighbourMask: TILE_NEIGHBOUR.UP
            },
            {
                name: "purpleWallNSolo",
                neighbourMask: TILE_NEIGHBOUR.DOWN
            },
            {
                name: "purpleWallNSolo",
                neighbourMask: TILE_NEIGHBOUR.UP | TILE_NEIGHBOUR.DOWN
            },
            {
                name: "purpleWallNW",
                neighbourMask: TILE_NEIGHBOUR.RIGHT | TILE_NEIGHBOUR.DOWN,
                abovePiece: 'purpleWallOverlapNW'
            },
            {
                name: "purpleWallNE",
                neighbourMask: TILE_NEIGHBOUR.LEFT | TILE_NEIGHBOUR.DOWN,
                abovePiece: 'purpleWallOverlapNE'
            },
            {
                name: "purpleWallSW",
                neighbourMask: TILE_NEIGHBOUR.DOWN_RIGHT | TILE_NEIGHBOUR.DOWN
            },
            {
                name: "purpleWallSE",
                neighbourMask: TILE_NEIGHBOUR.DOWN_LEFT | TILE_NEIGHBOUR.DOWN
            },
            {
                name: "purpleWallSWFront",
                neighbourMask: TILE_NEIGHBOUR.UP | TILE_NEIGHBOUR.RIGHT
            },
            {
                name: "purpleWallSEFront",
                neighbourMask: TILE_NEIGHBOUR.UP | TILE_NEIGHBOUR.LEFT
            },
        ],
        tileFacts: {passable: false, seeThrough: false}
    }),
    purpleBrickFloor: simpleTile("purpleBrickFloor", {passable:true, seeThrough:true})
}