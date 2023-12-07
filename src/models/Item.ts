import {ItemJSON} from './types';

export class Item {
  name: string;
  description: string;

  constructor(itemJSON: ItemJSON) {
    this.name = itemJSON.name;
    this.description = itemJSON.description;
  }
}
