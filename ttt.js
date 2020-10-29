let readline = require("readline-sync");
const VALID_YES_OR_NO = ['y', 'n', 'yes', 'no'];

class Square {
  static UNUSED_SQUARE = " ";
  static HUMAN_MARKER = "X";
  static COMPUTER_MARKER = "O";

  constructor(marker = Square.UNUSED_SQUARE) {
    this.marker = marker;
  }

  setMarker(marker) {
    this.marker = marker;
  }

  getMarker() {
    return this.marker;
  }

  isUnused() {
    return this.marker === Square.UNUSED_SQUARE;
  }

  toString() {
    return this.marker;
  }

}

class Board {
  static CENTER_SQUARE = '5';

  constructor() {
    this.reset();
  }

  reset() {
    this.squares = {};
    for (let counter = 1; counter <= 9; ++counter) {
      this.squares[String(counter)] = new Square();
    }
  }

  display() {
    console.log("");
    console.log("     |     |");
    console.log(`  ${this.squares["1"]}  |  ${this.squares["2"]}  |  ${this.squares["3"]}`);
    console.log("     |     |");
    console.log("-----+-----+-----");
    console.log("     |     |");
    console.log(`  ${this.squares["4"]}  |  ${this.squares["5"]}  |  ${this.squares["6"]}`);
    console.log("     |     |");
    console.log("-----+-----+-----");
    console.log("     |     |");
    console.log(`  ${this.squares["7"]}  |  ${this.squares["8"]}  |  ${this.squares["9"]}`);
    console.log("     |     |");
    console.log("");
  }

  markSquareAt(key, marker) {
    this.squares[key].setMarker(marker);
  }

  isFull() {
    return this.unusedSquares().length === 0;
  }

  unusedSquares() {
    let keys = Object.keys(this.squares);
    return keys.filter(key => this.isUnusedSquare(key));
  }

  isUnusedSquare(key) {
    return this.squares[key].isUnused();
  }


  countMarkersFor(player, keys) {
    let markers = keys.filter(key => {
      return this.squares[key].getMarker() === player.getMarker();
    });

    return markers.length;
  }

  displayWithClear() {
    console.clear();
    console.log("");
    console.log("");
    this.display();
  }
}

class Player {
  constructor(marker) {
    this.marker = marker;
  }

  getMarker() {
    return this.marker;
  }
}

class Human extends Player {
  constructor() {
    super(Square.HUMAN_MARKER);
  }
}

class Computer extends Player {
  constructor() {
    super(Square.COMPUTER_MARKER);
  }
}

class Scoreboard {
  static GRAND_WINS_REQUIARED = 3;

  constructor() {
    this.human = 0;
    this.computer = 0;
  }

  reset() {
    return {
      human: 0,
      computer: 0
    };
  }

  displayScore() {
    console.log(this);
  }

  increaseScore(player) {
    if (player in this) this[player]++;
  }

  displayGrandWinner() {
    console.log(`The Grand Winner is ${this.detectGrandWinner()}!!`);
  }

  detectGrandWinner() {
    return Object.keys(this).find(key => this[key] === 3);
  }

  gotGrandWinner() {
    return !!this.detectGrandWinner();
  }
}

class TTTGame {
  static POSSIBLE_WINNING_ROWS = [
    [ "1", "2", "3" ],            // top row of board
    [ "4", "5", "6" ],            // center row of board
    [ "7", "8", "9" ],            // bottom row of board
    [ "1", "4", "7" ],            // left column of board
    [ "2", "5", "8" ],            // middle column of board
    [ "3", "6", "9" ],            // right column of board
    [ "1", "5", "9" ],            // diagonal: top-left to bottom-right
    [ "3", "5", "7" ],            // diagonal: bottom-left to top-right
  ];

  static joinOr(arr, split = ', ', lastWord = 'or') {
    if (arr.length <= 2) {
      return arr.join(` ${lastWord} `);
    }

    return arr.slice(0, arr.length - 1).join(split) + split + lastWord + ` ${arr[arr.length - 1]} `;
  }

  constructor() {
    this.scoreboard = new Scoreboard();
    this.board = new Board();
    this.human = new Human();
    this.computer = new Computer();
    this.firstPlayer = this.human;
  }

  play() {
    this.displayWelcomeMessage();
    this.displayWinsRequired();

    while (true) {
      this.onePlay();
      this.scoreboard.increaseScore(this.detectWinner());
      this.scoreboard.displayScore();
      if (this.scoreboard.gotGrandWinner()) break;
      if (!this.playAgain()) break;
      this.firstPlayer = this.togglePlayer(this.firstPlayer);
    }

    this.scoreboard.displayGrandWinner();
    this.displayGoodbyeMessage();
  }


  onePlay() {
    let currentPlayer = this.firstPlayer;
    this.board.reset();
    this.board.display();

    while (true) {
      this.playerMoves(currentPlayer);
      if (this.gameOver()) break;

      this.board.displayWithClear();
      currentPlayer = this.togglePlayer(currentPlayer);
    }

    this.board.displayWithClear();
    this.displayResults();
  }

  displayWelcomeMessage() {
    console.clear();
    console.log("Welcome to Tic Tac Toe!");
    console.log("");
  }

  displayGoodbyeMessage() {
    console.log("Thanks for playing Tic Tac Toe! Goodbye!");
  }

  displayWinsRequired() {
    console.log(`Whoever first achieves ${Scoreboard.GRAND_WINS_REQUIARED} wins will be The Grand Winner!`);
  }

  displayResults() {
    if (this.isWinner(this.human)) {
      console.log("You won! Congratulations!");
    } else if (this.isWinner(this.computer)) {
      console.log("I won! I won! Take that, human!");
    } else {
      console.log("A tie game. How boring.");
    }
  }

  togglePlayer(player) {
    return player === this.human ? this.computer : this.human;
  }

  playerMoves(currentPlayer) {
    if (currentPlayer === this.computer) {
      this.computerMoves();
    } else {
      this.humanMoves();
    }
  }

  humanMoves() {
    let choice;

    while (true) {
      let validChoices = this.board.unusedSquares();
      const prompt = `Choose a square (${TTTGame.joinOr(validChoices)}): `;
      choice = readline.question(prompt);

      if (validChoices.includes(choice)) break;

      console.log("Sorry, that's not a valid choice.");
      console.log("");
    }

    this.board.markSquareAt(choice, this.human.getMarker());
  }


  computerMoves() {
    let choice = this.offensiveCompMove();
    if (!choice) {
      choice = this.defensiveCompMove();
    }

    if (!choice) {
      choice = this.pickCenterSquare();
    }

    if (!choice) {
      let validChoices = this.board.unusedSquares();
      do {
        choice = Math.floor((9 * Math.random()) + 1).toString();
      } while (!validChoices.includes(choice));
    }

    this.board.markSquareAt(choice, this.computer.getMarker());
  }

  pickCenterSquare() {
    return this.board.isUnusedSquare(Board.CENTER_SQUARE) ?
      Board.CENTER_SQUARE : null;
  }

  offensiveCompMove() {
    return this.findAtRiskSquare(this.computer);
  }

  defensiveCompMove() {
    return this.findAtRiskSquare(this.human);
  }

  findAtRiskSquare(player) {
    let riskRow = TTTGame.POSSIBLE_WINNING_ROWS.find(row => {
      return this.board.countMarkersFor(player, row) === 2 &&
      row.some(square => this.board.isUnusedSquare(square));
    });

    if (!riskRow) return null;
    return riskRow.find(square => this.board.isUnusedSquare(square));
  }

  gameOver() {
    return this.board.isFull() || this.someoneWon();
  }

  someoneWon() {
    return this.detectWinner();
  }


  detectWinner() {
    if (this.isWinner(this.human)) {
      return 'human';
    }
    if (this.isWinner(this.computer)) {
      return 'computer';
    } else {
      return null;
    }
  }

  isWinner(player) {
    return TTTGame.POSSIBLE_WINNING_ROWS.some(row => {
      return this.board.countMarkersFor(player, row) === 3;
    });
  }

  playAgain() {
    console.log("Play again (y/n)?");
    let answer = readline.question().toLowerCase();
    while (!VALID_YES_OR_NO.includes(answer)) {
      console.log('Please choose yes or no');
      answer = readline.question().toLowerCase();
    }
    console.clear();
    return (answer === "y" || answer === "yes");
  }

}

let game = new TTTGame();
game.play();