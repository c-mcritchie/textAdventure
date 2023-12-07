export type GameJSON = {
  startText: string;
  endText: string;
  startingRoom: string;
  rooms: RoomJSON[];
  items: ItemJSON[];
};

export type RoomJSON = {
  name: string;
  description: string;
  actions: ActionJSON[];
  flags: string[];
};

export type ActionJSON = {
  //Required for all actions
  name: string; //NAMES MUST BE LOWERCASE AND UNIQUE
  afterText: string;
  failedText: string;
  requiredFlags: string[];
  flagsToSet: string[];
  type: string;

  //Required for action subclasses
  item?: string;
  room?: string;
};

export type ItemJSON = {
  name: string;
  description: string;
};
