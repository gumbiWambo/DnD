import { Equipment } from "./equipment";

export class Tool extends Equipment {
  constructor(name: string, description: string) {
    super(name, 1, description, 'tool')
  }
}
export class DisguiseKit extends Tool {
  constructor() {
    super('Disguise Kit', `This pouch of cosmetices, hair dye, and small props let you create disuises that change your physical appearance. Proficiency with this kit lets you add your proficiency bonus to any ability checks you make to create a visual disguise.`);
  }
}
export class ForgeryKit extends Tool {
  constructor() {
    super('Forgery Kit', `This small box contains a variety of papers and parchments, pens and inks, seals and sealing wax, gold and silver leaf, and other supplies necessary to create convincing forgeries of physical documents. Proficiency with this kit lets you add your proficiency bonus to any ability checks you make to create a physical forgery of a document.`)
  }
}
export class GamingSet extends Tool {
  constructor() {
    super('Gaming Set', `This item encompasses a wide range of game pieces, including dice and decks of cards ( for games such as Three-Dragon Ante). A few common examples appear on the Tools table, but other kinds of gaming sets exist. If you are proficient with a gaming set, you can add your proficiency bonus to ability checks you make to play a game with that set. Each type of gaming setrequires a separate proficiency.`)
  }
}
