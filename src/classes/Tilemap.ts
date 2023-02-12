import { Container, ParticleContainer, Sprite, Spritesheet } from "pixi.js"

interface TilemapParams {
    spriteSheet: Spritesheet;
    parent: Container;
    tileSize: number;
}

interface SetMapParams {
    [key: string]: string;
}

interface Map {
    [key: string]: Sprite;
}

class Tilemap {
    spriteSheet: Spritesheet;
    container: Container;
    map: Map;
    tileSize: number;
    constructor({spriteSheet, parent, tileSize}:TilemapParams) {
        this.spriteSheet = spriteSheet;
        this.container = new ParticleContainer();
        this.map = {};
        this.tileSize = tileSize;
        parent.addChild(this.container);
    }

    clear() {
        this.container.children.forEach(child => {
            this.container.removeChild(child);
            child.destroy();
        });
        this.map = {};
    }

    setMap(newMap:SetMapParams) {
        this.clear();
        for (const key in newMap) {
            // Get the sprite we want
            const newSprite = Sprite.from(this.spriteSheet.textures[newMap[key]]);
            // Parse the coordinates
            const coordinates = this.parseKey(key);
            this.container.addChild(newSprite);
            newSprite.x = coordinates.x * this.tileSize;
            newSprite.y = coordinates.y * this.tileSize;

            this.map[key] = newSprite;
        }
    }

    parseKey(key:string): {x:number, y:number} {
        const splitKey = key.split(',');
        return {
            x: parseInt(splitKey[0]),
            y: parseInt(splitKey[1])
        }
    }
};

export default Tilemap;