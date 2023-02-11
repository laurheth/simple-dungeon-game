import { default as Thing, ThingParams } from "./Thing"

export interface EntityParams extends ThingParams {
}

export default class Entity extends Thing {
    constructor(params:EntityParams) {
        if (!params.thingLayer) {
            params.thingLayer = 2;
        }
        super(params);
    }

    step(dx: number, dy: number): boolean {
        if (dx + dy < 0) {
            this.sprite.scale.x = -1;
        } else {
            this.sprite.scale.x = 1;
        }
        return super.step(dx, dy);
    }
}