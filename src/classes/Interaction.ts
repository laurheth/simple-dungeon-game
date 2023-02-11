import Thing from './Thing';

export default abstract class Interaction {
    owner: Thing;
    
    setOwner(owner: Thing) {
        this.owner = owner;
    }

    abstract interact(performer:Thing): boolean;
}