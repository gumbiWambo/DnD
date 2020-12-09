import { Equipment } from "./equipment";

export class DevilFriut extends Equipment {
  constructor(name: string, description: string) {
    super(name, 1, description, 'devil friut');
  }
}
 export class FinsterFrucht extends DevilFriut {
   constructor() {
     super('Finster-Frucht', `Die Finster-Frucht erlaubt ihrem Nutzer völlige Dunkelheit zu sein.
     Die Dunkelheit verschlingt auf Wunsch des Nutzers Gegenstände, Kreaturen und sogar Gebäude.
     Die Finsterniss der Frucht kann Teufelsfruchtnutzer anziehen und deren Kräfte aufheben. Der Schaden,
     den der Nutzer der Frucht erleidet multipliziert sich mit 10.`)
   }
 }
 export class SwimSwimFriut extends DevilFriut {
   constructor () {
     super('Schwimm-Schwimm-Frucht', `Erlaubt dem Nutzer in festem Material zu schwimmen und abzutauchen. Allerdings kann der Nutzer in festen Material nicht atmen.`);
   }
 }
 export class TrennTrennFrucht extends DevilFriut {
   constructor() {
     super('Trenn-Trenn-Frucht', `Erlaubt dem Nutzer in beliebig viele Teile zu zerlegen und diese Teile unabhängig von einander herum fliegen zu lassen.
      Der Nutzer der Trenn-Trenn-Frucht kann maximal einen Fuß fliegen lassen. Ein Fuß muss mindestens einen festen Stand im getrennten Zustand.
      Die Teile können in einer 20-feet Sphäre verteilt/bewegt werden.`)
   }
 }
 export class GiraffenFrucht extends DevilFriut {
   constructor() {
     super('Giraffen-Frucht', `Erlaubt dem Nutzer sich in eine Giraffe oder eine Zwischenform zur Giraffe zu verwandeln.`);
   }
 }
 export class PhoenixFrucht extends DevilFriut {
   constructor() {
     super('Phoenix-Frucht', `Erlaubt dem Nutzer sich in einen Phönix oder einer Zwischnform zum Phönix zu verwandeln. Der Nutzer kann sich und eine Kreatur, die sich in einem Radius von 10 feet befindet, jede Runde auf die maxiamlen Hitpoints heilen.`);
   }
 }
 export class MantelFrucht extends DevilFriut {
   constructor() {
     super('Mantel-Frucht', `Erlaubt dem Nutzer einen Stein (faustgroß) in einen Mantel oder ein anderes Kleidungsstück.`);
   }
 }
 export class ParamesiaFrucht extends DevilFriut {
   constructor() {
     super('Paramesia-Frucht', `Eine geheimnisvolle Frucht, die dem Nutzer eine Fähigkeit verleiht.`);
   }
 }