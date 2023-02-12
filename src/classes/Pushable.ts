import Interaction from "./Interaction";
import Thing from "./Thing";

export default class Pushable extends Interaction {
    static flag: string = "CanPush";
    interact(performer: Thing): boolean {
        // Verify that the performer is able to push
        if (!performer.flags.has(Pushable.flag)) {
            return false;
        }
        // Get the direction to push the owner
        const dx = this.owner.position.x - performer.position.x;
        const dy = this.owner.position.y - performer.position.y;

        // Make sure they're actually adjacent, and not directly on top of one another
        if (Math.abs(dx) > 1 || Math.abs(dy) > 1 || (Math.abs(dx) === 0 && Math.abs(dy) === 0)) {
            return false;
        }

        // Do a push
        return this.owner.step(dx, dy);
    }
}