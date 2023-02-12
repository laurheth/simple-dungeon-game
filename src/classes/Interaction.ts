import Thing from './Thing';

export default abstract class Interaction {
    owner: Thing;
    static flag: string = "Generic";
    setOwner(owner: Thing) {
        this.owner = owner;
    }

    abstract interact(performer:Thing): boolean;
}