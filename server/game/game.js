class Player {
  /**
   * @param {string} id
   * @param {string} name
   * @param {Field.index} fieldIndex
   */
  constructor(id, name, fieldIndex) {
    this.id = id;
    this.name = name;
    this.fieldIndex = fieldIndex;
  }
}

class Field {
  /**
   * @param {number} index
   * @param {number} sleep
   * @param {number} goesTo
   */
  constructor(index, sleep, goesTo = 0) {
    this.index = index;
    this.goesTo = goesTo;
    this.sleep = sleep;
    /** @type {Player.id[]} */
    this.players = [];
  }
}

class Game {
  /**
   * @param {string} name
   * @param {Field[]} fields
   */
  constructor(name, fields) {
    this.name = name;
    this.fields = fields;
    /** @type {Player[]} */
    this.players = [];
    /** @type {number} */
    this.turnOfPlayer = 0;
  }

  /**
   * @param {string} name
   * @returns {number} id
   */
  addPlayer(name) {
    const player = new Player(name, name, 0);
    this.players.push(player);
    this.fields[0].players.push(player.id);
    return this.players.length - 1;
  }

  /**
   * @param {Player.id} playerId
   * @param {Field.index} from
   * @param {Field.index} to
   */
  movePlayer(playerId, from, to) {
    const player = this.players.find(p => p.id === playerId);
    if (to > this.fields.length - 1) return [];
    if (from === to) return [];
    if (to < 0) to = 0;
    log(`Moving ${player.name} from ${from} to ${to}`);
    const toField = this.fields[to];
    const fromField = this.fields[from];
    const stateChanges = [[playerId, from, to]];
    fromField.players.splice(fromField.players.indexOf(playerId), 1);
    toField.players.push(playerId);
    player.fieldIndex = to;
    player.sleep = toField.sleep;
    this.printState();
    if (toField.players.length > 1 && to !== 0) {
      log(`Player ${this.players.find(p => p.id === toField.players[0]).name} already on ${to}`);
      stateChanges.push(...this.movePlayer(toField.players[0], to, to - 3));
    }
    if (toField.goesTo && toField.goesTo !== from) {
      log(`Special field ${to} goes to ${toField.goesTo}`);
      stateChanges.push(...this.movePlayer(playerId, to, toField.goesTo));
    }
    return stateChanges;
  }

  turn() {
    const player = this.players[this.turnOfPlayer];
    if (player.sleep) {
      player.sleep -= 1;
      log(`New turn: ${player.name} sleeping (${player.sleep} more turns)`);
    } else {
      const rolled = Math.ceil(Math.random() * 6);
      log(`New turn: ${player.name} rolled ${rolled}`);
      this.movePlayer(player.id, player.fieldIndex, player.fieldIndex + rolled);
    }
    this.turnOfPlayer = (this.turnOfPlayer + 1) % this.players.length;
    log('---\n');
    return this.fields[this.fields.length - 1].players.length;
  }

  printState() {
    this.players.forEach(p => log(`${p.name}: \t${p.fieldIndex}`));
  }

  sendStateToAll() {}
}

const DEBUG = true;
const log = t => DEBUG && console.log(t);

// test
async function test() {
  const fields = [
    new Field(0, 0),
    new Field(1, 0),
    new Field(2, 0),
    new Field(3, 0),
    new Field(4, 0),
    new Field(5, 0, 7),
    new Field(6, 0, 13),
    new Field(7, 0),
    new Field(8, 0, 10),
    new Field(9, 0),
    new Field(10, 0),
    new Field(11, 0, 9),
    new Field(12, 0),
    new Field(13, 0),
    new Field(14, 0, 7),
    new Field(15, 0),
    new Field(16, 0),
    new Field(17, 0, 23),
    new Field(18, 0),
    new Field(19, 0),
    new Field(20, 0),
    new Field(21, 0),
    new Field(22, 0, 18),
    new Field(23, 0),
    new Field(24, 2),
    new Field(25, 0, 23),
    new Field(26, 0, 27),
    new Field(27, 0),
    new Field(28, 0, 34),
    new Field(29, 0),
    new Field(30, 0),
    new Field(31, 0),
    new Field(32, 0),
    new Field(33, 0),
    new Field(34, 0, 28),
    new Field(35, 0, 37),
    new Field(36, 0),
    new Field(37, 0),
    new Field(38, 0),
    new Field(39, 0, 36),
    new Field(40, 0),
    new Field(41, 0),
    new Field(42, 1),
    new Field(43, 0),
    new Field(44, 0, 41),
    new Field(45, 0),
    new Field(46, 0, 33),
    new Field(47, 0),
    new Field(48, 0, 45),
    new Field(49, 0, 47),
    new Field(50, 0),
  ];
  const game = new Game('Test igra', fields);
  game.addPlayer('Braca');
  game.addPlayer('Šomi');
  game.addPlayer('Duje');

  while (!game.turn()) {
    await new Promise(r => setTimeout(r, 1000));
  }
}

test();