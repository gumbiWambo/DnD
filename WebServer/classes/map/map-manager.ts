let mapManager: MapManager;
export class MapManager {
  private map: string[][] = [['']];
  constructor(){}
  public static getInstance(): MapManager {
    if(!mapManager) {
      mapManager = new MapManager();
    }
    return mapManager
  }
  
  public addConnection() {}
}