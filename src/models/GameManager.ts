import {Inventory} from './Inventory';
import {Room} from './Room';
import {readFile} from 'fs/promises';
import {Item} from './Item';
import type {GameJSON} from './types';
import * as PS from 'prompt-sync';
import {Action} from './Action';
import * as console from 'console';

const GAME_JSON_PATH = 'src/res/game.json';
const prompt = PS();

export class GameManager {
  private items: Item[];
  inventory: Inventory;
  private rooms: Room[];
  currentRoom: Room;
  private static _instance: GameManager;
  gameRunning = true;
  private startText = '';
  private endText = '';

  /**
   * Returns the GameManager instance.
   * @returns {GameManager}
   */
  public static get instance(): GameManager {
    if (!GameManager._instance) {
      GameManager._instance = new GameManager();
    }
    return GameManager._instance;
  }

  constructor() {
    if (GameManager._instance) {
      throw new Error(
        'Error: Instantiation failed: Use GameManager.instance instead of new.'
      );
    }
    this.inventory = new Inventory();
    this.rooms = [];
    this.items = [];

    //Add a blank room bc typescript is dumb
    this.currentRoom = new Room({
      name: '',
      description: '',
      actions: [],
      flags: [],
    });

    (async () => {
      await this.generateGame();

      this.startGame();
    })();
  }
  async generateGame() {
    console.log('Generating game...');
    if (this.rooms.length > 0) {
      throw new Error('Error: Game already generated.');
    }

    const json: GameJSON | undefined = JSON.parse(
      await readFile(GAME_JSON_PATH, {
        encoding: 'utf-8',
      })
    );

    if (!json) {
      throw new Error('Error: Could not read game.json.');
    }

    this.startText = json.startText;
    this.endText = json.endText;

    // Create items.
    for (const jsonItem of json.items) {
      this.items.push(new Item(jsonItem));
    }
    // Create rooms.
    for (const roomJSON of json.rooms) {
      //Create the room.
      const room = new Room(roomJSON);
      // Add all flags for the room
      for (const flagName of roomJSON.flags) {
        room.addFlag(flagName);
      }
      // Add all actions for the room
      for (const jsonAction of roomJSON.actions) {
        room.addAction(jsonAction);
      }
      this.rooms.push(room);
    }

    this.currentRoom = this.getRoom(json.startingRoom);
    console.log('Game generated.');
  }

  startGame() {
    console.log(this.startText);

    while (this.gameRunning) {
      this.play();
    }

    console.log(this.endText);
  }

  private play() {
    const input = prompt('').toLowerCase();

    const action = this.getAction(input);

    if (action === true || action === false) {
      return;
    }

    if (action === undefined) {
      console.log('I dont understand what you are trying to do.');
      return;
    }

    action.call();
  }

  getRoom(name: string): Room {
    const room = this.rooms.find(room => room.name === name);
    if (!room) {
      throw new Error(`Error: Room ${name} not found.`);
    }
    return room;
  }

  getItem(name: string): Item {
    const item = this.items.find(item => item.name === name);
    if (!item) {
      throw new Error(`Error: Item ${name} not found.`);
    }
    return item;
  }

  private getAction(input: string): Action | boolean | undefined {
    //Default actions
    switch (input) {
      case 'inventory':
        this.inventory.printInventory();
        return false;
      case 'help':
        this.printHelp();
        return false;
      case 'quit':
        this.gameRunning = false;
        return false;
      case 'look':
        console.log(this.currentRoom.description);
        return false;
      default:
        return this.currentRoom.getAction(input);
    }
  }

  printHelp() {
    console.log('help');
  }

  moveRoom(room: string) {
    this.currentRoom = this.getRoom(room);
  }
}
