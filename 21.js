const readline = require('readline-sync');
const VALID_YES_OR_NO = ['y', 'n', 'yes', 'no'];


class Card {
  static SUITS = ['clubs', 'diamonds', 'hearts', 'spades'];
  static RANK = [2, 3, 4, 5, 6, 7, 8, 9, 10 , 'Jack', 'Queen', 'King', 'Ace']
  static JQK_VALUE = 10;
  static ACE_VALUE_ELEVEN = 11;
  static ACE_VALUE_ONE = 1;
  constructor(suit, rank) {
    this.suit = suit;
    this.rank = rank;
    this.hidden = false;
  }

  hide() {
    this.hidden = true;
  }

  reveal() {
    this.hidden = false;
  }

  isHidden() {
    return this.hidden;
  }

  getRank() {
    return this.rank;
  }

  getSuit() {
    return this.suit;
  }
}

class Deck {
  constructor() {
    this.reset();
  }

  dealFaceDown() {
    let card = this.cards.shift();
    card.hide();
    return card;
  }

  dealFaceUp() {
    return this.cards.shift();
  }

  reset() {
    this.cards = [];
    for (let idx = 0; idx < Card.SUITS.length; idx++) {
      for (let idx2 = 0; idx2 < Card.RANK.length; idx2++) {
        this.cards.push(new Card(Card.SUITS[idx], Card.RANK[idx2]));
      }
    }
    this.shuffle();
  }

  shuffle() {
    for (let index = this.cards.length - 1; index > 0; index--) {
      let otherIndex = Math.floor(Math.random() * (index + 1));
      [this.cards[index], this.cards[otherIndex]] =
      [this.cards[otherIndex], this.cards[index]];
    }
  }

}


class TwentyOneParticipant {
  constructor() {
    this.hand = [];
  }

  receiveOneCard(card) {
    this.hand.push(card);
  }

  resetHand() {
    this.hand = [];
  }

}


class Player extends TwentyOneParticipant {
  static INITIAL_MONEY = 5;
  static MONEY_MAX = 10;
  static MONEY_MIN = 0;

  constructor() {
    super();
    this.money = Player.INITIAL_MONEY;
  }

  updatingCoin(winner) {
    if (winner === 'player') {
      this.money++;
    } else if (winner === 'dealer') {
      this.money--;
    }
  }

  displayCoin() {
    console.log(`You have $${this.money} left`);
  }

  isBroke() {
    return this.money === Player.MONEY_MIN;
  }

  isRich() {
    return this.money === Player.MONEY_MAX;
  }
}

class Dealer extends TwentyOneParticipant {
  constructor() {
    super();
  }

}

class TwentyOneGame {
  static MAX_NUMBER = 21;
  static DEALER_MIN = 17;
  static VALID_STAY_OR_HIT = ['s', 'h', 'stay', 'hit'];

  constructor() {
    this.deck = new Deck();
    this.player = new Player();
    this.dealer = new Dealer();
    this.currentTurn = 'player';
  }

  start() {
    this.displayWelcomeMessage();
    this.wantToContinue();

    while (true) {
      this.playOneGame();
      if (this.player.isBroke() || this.player.isRich()) break;
      if (!this.playAgain()) break;
    }

    if (this.player.isBroke()) {
      console.log("You're broke!");
    } else if (this.player.isRich()) {
      console.log("You're rich!");
    }

    this.displayGoodbyeMessage();
  }

  playOneGame() {
    this.dealCards();
    this.showCardsWithClear();
    this.playerTurn();
    this.switchPlayer();
    if (!this.anyoneBusted()) {
      this.dealerTurn();
    }
    let winner = this.whoWon();
    this.displayResult(winner);
    this.player.updatingCoin(this.whoWon());
    this.player.displayCoin();
    this.resetGame();
  }

  dealCards() {
    this.player.receiveOneCard(this.deck.dealFaceUp());
    this.player.receiveOneCard(this.deck.dealFaceUp());

    this.dealer.receiveOneCard(this.deck.dealFaceUp());
    this.dealer.receiveOneCard(this.deck.dealFaceDown());
  }

  showCardsWithClear() {
    console.clear();
    console.log('dealer has:');

    if (this.currentTurn === 'player') {
      console.log([this.createCardList('dealer')[0], 'hidden card']);
      console.log(`A total of: ${this.calculatingPoint('dealer')}`);
    } else {
      console.log(this.createCardList('dealer'));
      console.log(`A total of: ${this.calculatingPoint('dealer')}`);
    }
    console.log('player has:');
    console.log(this.createCardList('player'));
    console.log(`A total of: ${this.calculatingPoint('player')}`);
  }

  createCardList(participant) {
    let cardList = [];
    this[participant].hand.forEach(card => {
      cardList.push([card.getSuit(), card.getRank()]);
    });
    return cardList;
  }

  switchPlayer() {
    if (this.currentTurn === 'player') {
      this.currentTurn = 'dealer';
    } else {
      this.currentTurn = 'player';
    }
  }

  playerTurn() {
    while (true) {
      if (this.isTwentyOne('player')) {
        console.log('Your point is 21! Lucky you');
        break;
      }
      if (this.isBusted('player')) {
        console.log('Player busted!');
        break;
      }
      let answer = this.hitOrStay();
      if (answer === 's' || answer === 'stay') break;
      if (answer === 'h' || answer === 'hit') {
        this.player.receiveOneCard(this.deck.dealFaceUp());
      }
      this.showCardsWithClear();
    }
  }

  hitOrStay() {
    console.log('Do you want to hit or stay?');
    let answer = readline.question().toLowerCase();
    while (!TwentyOneGame.VALID_STAY_OR_HIT.includes(answer)) {
      console.log("Not valid. Please choose '(h)it' or '(s)tay'");
      answer = readline.question().toLowerCase();
    }
    return answer;
  }

  dealerTurn() {
    this.dealer.hand[1].reveal();

    while (true) {
      this.showCardsWithClear();
      if (this.isBusted('dealer')) {
        console.log('Dealer busted!');
        break;
      }
      if (this.isTwentyOne('dealer')) {
        break;
      }
      if (this.isBiggerThanMin('dealer')) {
        break;
      }
      this.wantToContinue();
      this.dealer.receiveOneCard(this.deck.dealFaceUp());
    }

  }

  anyoneBusted() {
    return this.isBusted('player');
  }

  displayWelcomeMessage() {
    console.log(`Welcome to 21! You have $${Player.INITIAL_MONEY}.00! Each game costs $1.00. The game ends your balance reahces $0.00 or $10.00`);
  }

  displayGoodbyeMessage() {
    console.log('Thank you for playing 21!');
  }

  wantToContinue() {
    readline.question("Press Return to continue...");
  }

  whoWon() {
    if (this.anyoneBusted()) {
      return this.isBusted('dealer') ? 'player' : 'dealer';
    } else if ((TwentyOneGame.MAX_NUMBER - this.calculatingPoint('player')) <
              (TwentyOneGame.MAX_NUMBER - this.calculatingPoint('dealer'))) {
      return 'player';
    } else if ((TwentyOneGame.MAX_NUMBER - this.calculatingPoint('player')) >
              (TwentyOneGame.MAX_NUMBER - this.calculatingPoint('dealer'))) {
      return 'dealer';
    }
    return null;

  }


  isBusted(participant) {
    return this.calculatingPoint(participant) > TwentyOneGame.MAX_NUMBER;
  }

  isTwentyOne(participant) {
    return this.calculatingPoint(participant) === TwentyOneGame.MAX_NUMBER;
  }

  isBiggerThanMin(participant) {
    return this.calculatingPoint(participant) >= TwentyOneGame.DEALER_MIN;
  }

  calculatingPoint(participant) {
    let total = 0;

    for (let index = 0; index < this[participant].hand.length; index++) {
      if (!this[participant].hand[index].isHidden()) {
        if (!isNaN(Number(this[participant].hand[index].getRank()))) {
          total += Number(this[participant].hand[index].getRank());
        }
        if ((isNaN(Number(this[participant].hand[index].getRank()))) &&
      (this[participant].hand[index].getRank() !== 'Ace')) {
          total += Card.JQK_VALUE;
        }
        if (this[participant].hand[index].getRank() === 'Ace') {
          continue;
        }
      }
    }

    total += this.decidingAceValue(this[participant].hand, total);
    return total;
  }

  decidingAceValue(hand, total) {
    let aceValTotal = 0;
    for (let index = 0; index < hand.length; index++) {
      if (!hand[index].isHidden()) {
        if (hand[index].getRank() === 'Ace') {
          if (total + Card.ACE_VALUE_ELEVEN <= TwentyOneGame.MAX_NUMBER) {
            aceValTotal += Card.ACE_VALUE_ELEVEN;
          } else {
            aceValTotal += Card.ACE_VALUE_ONE;
          }
        }
      }
    }
    return aceValTotal;
  }


  displayResult(winner) {
    if (winner) {
      console.log(`Winner is ${winner}!!`);
    } else {
      console.log('How boring.. It is a tie');
    }
  }

  playAgain() {
    console.log('Do you want to play again?');
    let answer = readline.question().toLowerCase();

    while (!VALID_YES_OR_NO.includes(answer)) {
      console.log("Not valid. Please choose '(y)es' or '(n)o' ");
      answer = readline.question().toLowerCase();
    }

    return answer === 'y' || answer === 'yes';
  }

  resetGame() {
    this.player.resetHand();
    this.dealer.resetHand();
    this.switchPlayer();
    this.deck.reset();
  }

}

let game = new TwentyOneGame();
game.start();