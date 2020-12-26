import { Language } from "../../interfaces/language";

export class Equipment{
  constructor(public name: string, public amount: number, public description: string, public type: string, public properties: string) {}
}
