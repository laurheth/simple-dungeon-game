import Interaction from "./Interaction";

export default class Scorable extends Interaction {
    static flag: string = "ScoreSpot";
    static scoreThingLayer: number = 0;
    scored: boolean = false;
    interact(): boolean {
        // Check if there's something to score with
        this.scored = false;
        const maybeScoreThing = this.owner.mapHandler.getThingAtLocation(this.owner.position.x, this.owner.position.y, Scorable.scoreThingLayer);
        if (maybeScoreThing && maybeScoreThing.flags.has(Scorable.flag)) {
            this.scored = true;
        }
        console.log("scored:", this.scored);
        // This isn't really, on its own, an action.
        return false;
    }
}