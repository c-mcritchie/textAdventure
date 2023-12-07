import {Action, newAction} from './Action';
import {ActionJSON, RoomJSON} from './types';

export class Room {
  name: string;
  description: string;
  private actions: Action[];
  private flags: Flag[];

  constructor(RoomJSON: RoomJSON) {
    this.name = RoomJSON.name;
    this.description = RoomJSON.description;
    this.actions = [];
    this.flags = [];
  }

  /**
   * Adds an action to the room.
   * @param {Action} action
   * postcondition: action is added to actions
   */
  addAction(actionJSON: ActionJSON): void {
    const action = newAction(actionJSON);
    action.setFlags(
      this.getFlags(actionJSON.requiredFlags),
      this.getFlags(actionJSON.flagsToSet)
    );
    this.actions.push(action);
  }

  /**
   * Adds a flag to the room.
   * @param {Flag} flag
   * postcondition: flag is added to flags
   */
  addFlag(name: string): void {
    const flag = new Flag(name);
    this.flags.push(flag);
  }

  getFlags(flagJSON: string[]): Flag[] {
    return flagJSON.map(flag => {
      const foundFlag = this.getFlag(flag);

      return foundFlag;
    });
  }

  /**
   * Checks if all flags are set.
   * @param {string[]} flagNames
   * @returns {boolean}
   */
  checkFlags(flagNames: string[]): boolean {
    return !flagNames.some(flag => {
      const foundFlag = this.getFlag(flag);

      // If the flag is not set, return true
      return !foundFlag.value;
    });
  }

  getFlag(name: string): Flag {
    const flag = this.flags.find(flag => flag.name === name);
    if (!flag) {
      throw new Error(`Error: Flag ${name} not found in room ${this.name}`);
    }
    return flag;
  }

  getAction(input: string): Action | undefined {
    return this.actions.find(action => action.name === input);
  }
}

export class Flag {
  name: string;
  value: boolean;
  constructor(name: string) {
    this.name = name;
    this.value = false;
  }
}
