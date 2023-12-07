import {Item} from './Item';

export class Inventory {
  private items: Item[];

  constructor() {
    this.items = [];
  }

  public getItems(): Item[] {
    return this.items;
  }

  public addItem(item: Item): void {
    this.items.push(item);
  }

  public removeItem(itemName: string): void {
    this.items = this.items.filter(item => item.name !== itemName);
  }

  public getItem(itemName: string): Item | undefined {
    return this.items.find(item => item.name === itemName);
  }

  public hasItem(itemName: string): boolean {
    return this.items.some(item => item.name === itemName);
  }

  printInventory() {
    console.log('Inventory:');
    for (const item of this.items) {
      console.log(`${item.name} - ${item.description}`);
    }
  }
}
