import { Text, Container, Renderer, Application } from "pixi.js";

export default class FPSCounter {
    text:Text;
    app: Application;
    parent: Container;
    constructor(parent: Container, app: Application) {
        this.text = new Text("FPS: ##", {
            fontFamily: ['Source Code Pro', 'monospace'],
            fontSize: 30,
            fill: "white",
            strokeThickness: 1
        });
        this.parent = parent;
        this.parent.addChild(this.text);
        this.app = app;
        app.ticker.add(()=>this.update());
        this.update();
    }

    update() {
        this.text.text = `FPS : ${this.app.ticker.FPS.toFixed(1)}`;
        this.text.x = this.app.renderer.width / this.parent.scale.x - this.text.width;
        this.text.y = 0;
    }
}