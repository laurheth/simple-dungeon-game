import { Sprite, SpriteSource, Container } from "pixi.js"
import MapHandler from "./MapHandler"
import Interaction from "./Interaction"

export interface ThingParams {
    spriteSource: SpriteSource;
    x: number;
    y: number;
    mapHandler: MapHandler;
    entityContainer: Container;
    displayOffset?:{dx:number, dy:number};
    interactions?:Interaction[];
    thingLayer?:number;
}

// An object or entity on the map
export default class Thing {
    sprite: Sprite;
    mapHandler: MapHandler;
    thingLayer: number ;
    position: {x:number, y:number};
    displayOffset: {dx: number, dy: number};
    interactions: Interaction[];
    constructor({spriteSource, x, y, mapHandler, entityContainer, displayOffset = {dx: 0, dy:0}, interactions=[], thingLayer=0}: ThingParams) {
        // Set the sprite
        this.sprite = Sprite.from(spriteSource);
        this.sprite.pivot.set(this.sprite.width / 2, this.sprite.height / 2);
        this.displayOffset = {
            dx: displayOffset.dx + this.sprite.pivot.x,
            dy: displayOffset.dy + this.sprite.pivot.y
        };

        // Attach to the entity container
        entityContainer.addChild(this.sprite);

        // Initialize some map details
        this.position = {x, y};
        this.mapHandler = mapHandler;
        this.thingLayer = thingLayer;

        // Set up interactions
        this.interactions = interactions;
        this.interactions.forEach(interaction => interaction.setOwner(this));

        // All good, put us on the map where we want to be.
        this.placeSelfAt(x, y, true);
    }

    // A single step. Also, interact if possible.
    step(dx:number, dy:number):boolean {
        const [targetX, targetY] = [this.position.x + dx, this.position.y + dy];

        const possibleBlockingThing = this.mapHandler.getThingAtLocation(targetX, targetY, this.thingLayer);
        if (possibleBlockingThing) {
            possibleBlockingThing.interaction(this);
        }

        return this.placeSelfAt(targetX, targetY);
    }

    // Put us on the map in a specific spot
    placeSelfAt(x:number, y:number, recurse:boolean = false): boolean {
        if (this.mapHandler.place(x, y, this)) {
            return true;
        } else if (recurse) {
            // There are some cases where we might need or want to hunt for an appropriate spot.
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

    // Update sprite location
    setPosition(x:number, y:number, tileSize:number) {
        this.mapHandler.remove(this.position.x, this.position.y, this);
        this.position.x = x;
        this.position.y = y;
        this.sprite.x = x * tileSize + this.displayOffset.dx;
        this.sprite.y = y * tileSize + this.displayOffset.dy;
        this.sprite.zIndex = y;
    }

    // Be interacted with.
    interaction(performer: Thing) :boolean {
        let didAnything = false;
        this.interactions.forEach(interaction => {
            interaction.interact(performer) && (didAnything = true);
        })
        return didAnything;
    }
}