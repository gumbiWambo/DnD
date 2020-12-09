import { Language } from "../../interfaces/language";

export class Equipment{
  constructor(public name: string, public amount: number, public description: string, public type: string) {}
}
export class Scroll extends Equipment {
  constructor(public name: string, public amount: number, public description: string, public language: Language) {
    super(name, amount, description, 'scroll');
  }
}
export class Ration extends Equipment {
  constructor(amount: number) {
    super('Ration', amount, 'Food and Water for one day', 'Ration');
  }
}
export class Backpack extends Equipment{
  constructor() {
    super('Backpack', 1 , 'You can put things in it.', 'thing')
  }
}
export class Dagger extends Equipment {
  constructor(amount: number) {
    super('Dagger', amount, '1d4 piercing; Finesse, light, thrown (rage20/60)', 'weapon');
  }
}
export class Net extends Equipment {
  constructor(amount: number) {
    super('Net', amount, 'A Large or smaller creature hit by a net is restrained until it is freed. A net has no effect on creatures that are formless, or creatures that are Huge or larger. A creature can use its action to make a DC 10 Strength check, freeing itself or another creature within its reach on a success. Dealing 5 slashing damage to the net (AC 10) also frees the creature without harming it, ending the effect and destroying the net. When you use an action, bonus action, or reaction regardless of the number of attacks you can normally make.', 'Special Weapon');
  }
}
export class Rope extends Equipment {
  constructor(length: number) {
    super('Rope', length, 'Rope, whether made of hemp or silk, has 2 hit points and can be burst with a DC 17 Strength check.', 'consumable');
  }
}
export class SendingStone extends Equipment {
  constructor(amount: number) {
    super('Sending-Stone', amount, 'Sends sounds to the paired sending stone.', 'thing');
  }
}