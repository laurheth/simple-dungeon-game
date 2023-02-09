import { Sprite, SpriteSource, Container } from "pixi.js"
import MapHandler from "./MapHandler"

interface ThingParams {
    spriteSource: SpriteSource;
    x: number;
    y: number;
    mapHandler: MapHandler;
    entityContainer: Container;
    displayOffset?:{dx:number, dy:number}
}

// An object or entity on the map
export default class Thing {
    sprite: Sprite;
    mapHandler: MapHandler;
    thingLayer: number = 0;
    position: {x:number, y:number};
    displayOffset: {dx: number, dy: number};
    constructor({spriteSource, x, y, mapHandler, entityContainer, displayOffset = {dx: 0, dy:0}}: ThingParams) {
        this.sprite = Sprite.from(spriteSource);
        entityContainer.addChild(this.sprite);
        this.position = {x, y};
        this.mapHandler = mapHandler;
        this.displayOffset = displayOffset;
        this.placeSelfAt(x, y, true);
    }

    placeSelfAt(x:number, y:number, recurse:boolean = false): boolean {
        if (this.mapHandler.place(x, y, this)) {
            return true;
        } else if (recurse) {
            let dist = 1;
            let succeeded = false;
            while(dist <= 10 && !succeeded) {
                for (let dx=-dist; dx <= dist; dx++) {
                    for (let dy=-dist; dy <= dist; dy++) {
                        succeeded = this.mapHandler.place(x + dx, y + dy, this);
                        if (succeeded) {
                            break;
                        }
                    }
                    if (succeeded) {
                        break;
                    }
                }
                dist++;
            }
        }
        return false;
    }

    setPosition(x:number, y:number, tileSize:number) {
        this.position.x = x;
        this.position.y = y;
        this.sprite.x = x * tileSize + this.displayOffset.dx;
        this.sprite.y = y * tileSize + this.displayOffset.dy;
    }
}