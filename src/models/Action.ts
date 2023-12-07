import {Flag} from './Room';
import {ActionJSON} from './types';
import {GameManager} from './GameManager';
import {Item} from './Item';
import * as console from 'console';

/**
 * An action that can be performed in a room.
 * @param name The text required to perform the action.
 * @param afterText The text that is displayed after the action is performed.
 * @param requiredFlags The flags that must be set for the action to be performed.
 * @param flagsToSet The flags that are set after the action is performed.
 */
export class Action {
  name: string;
  afterText: string;
  failedText: string;
  private requiredFlags: Flag[];
  private flagsToSet: Flag[];

  constructor(actionJSON: ActionJSON) {
    this.name = actionJSON.name;
    this.afterText = actionJSON.afterText;
    this.failedText = actionJSON.failedText;
    this.requiredFlags = [];
    this.flagsToSet = [];
  }

  flipFlags(): void {
    this.flagsToSet.forEach(flag => {
      flag.value = !flag.value;
    });
  }

  checkFlags(): boolean {
    return !this.requiredFlags.some(flag => {
      return !flag.value;
    });
  }

  setFlags(requiredFlags: Flag[], flagsToSet: Flag[]): void {
    this.requiredFlags = requiredFlags;
    this.flagsToSet = flagsToSet;
  }

  call() {
    if (!this.checkFlags()) {
      console.log(this.failedText);
      return;
    }
    this.flipFlags();
    console.log(this.afterText);
  }
}

export enum ActionType {
  ACTION = 'action', //Update flags and print text
  DROP = 'drop', //Remove item from inventory
  TAKE = 'take', //Add item to inventory
  USE = 'use', //Check if item is in inventory to use
  MOVE = 'move', //Move to a different room
}

//create the appropriate action based on the type
export const newAction = (actionJSON: ActionJSON): Action => {
  switch (actionJSON.type) {
    case ActionType.MOVE:
      return new MoveAction(actionJSON);
    case ActionType.USE:
      return new UseAction(actionJSON);
    case ActionType.DROP:
      return new DropAction(actionJSON);
    case ActionType.TAKE:
      return new TakeAction(actionJSON);
    case ActionType.ACTION:
      return new Action(actionJSON);
    default:
      return new Action(actionJSON);
  }
};

export class TakeAction extends Action {
  item: Item;
  constructor(actionJSON: ActionJSON) {
    super(actionJSON);
    if (!actionJSON.item) {
      throw new Error('TakeAction requires an item');
    }
    this.item = GameManager.instance.getItem(actionJSON.item);
  }

  call() {
    if (!this.checkFlags()) {
      console.log(this.failedText);
      return;
    }
    this.flipFlags();
    GameManager.instance.inventory.addItem(this.item);
    console.log(this.afterText);
  }
}

export class DropAction extends Action {
  item: Item;
  constructor(actionJSON: ActionJSON) {
    super(actionJSON);
    if (!actionJSON.item) {
      throw new Error('DropAction requires an item');
    }
    this.item = GameManager.instance.getItem(actionJSON.item);
  }

  call() {
    if (!this.checkFlags()) {
      console.log(this.failedText);
      return;
    }
    this.flipFlags();
    GameManager.instance.inventory.removeItem(this.item.name);
    console.log(this.afterText);
  }
}

export class UseAction extends Action {
  item: Item;
  constructor(actionJSON: ActionJSON) {
    super(actionJSON);
    if (!actionJSON.item) {
      throw new Error('UseAction requires an item');
    }
    this.item = GameManager.instance.getItem(actionJSON.item);
  }

  call() {
    if (
      !this.checkFlags() ||
      !GameManager.instance.inventory.hasItem(this.item.name)
    ) {
      console.log(this.failedText);
      return;
    }
    this.flipFlags();
    console.log(this.afterText);
  }
}

export class MoveAction extends Action {
  room: string;
  constructor(actionJSON: ActionJSON) {
    super(actionJSON);
    if (!actionJSON.room) {
      throw new Error('MoveAction requires a room');
    }
    this.room = actionJSON.room;
  }

  call() {
    if (!this.checkFlags()) {
      console.log(this.failedText);
      return;
    }
    this.flipFlags();
    GameManager.instance.moveRoom(this.room);
    console.log(this.afterText);
  }
}
