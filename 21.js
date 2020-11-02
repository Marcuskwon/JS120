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
  }
}

class Deck {
  constructor() {
    this.reset();
  }

  pickOneCard() {
    return this.cards[0];
  }

  removeOneCard() {
    this.cards.shift();
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
    this.point = 0;
    this.bust = false;
  }

  receiveOneCard(card) {
    this.hand.push(card);
  }

  bustUpdate() {
    if (this.getPoint() > TwentyOneGame.MAX_NUMBER) {
      this.bust = true;
    }
  }

  isBusted() {
    return this.bust;
  }

  isTwentyOne() {
    return this.getPoint() === TwentyOneGame.MAX_NUMBER;
  }

  updatingPoint() {
    let total = 0;

    for (let index = 0; index < this.hand.length; index++) {
      if (!isNaN(Number(this.hand[index].rank))) {
        total += Number(this.hand[index].rank);
      }
      if ((isNaN(Number(this.hand[index].rank))) &&
      (this.hand[index].rank !== 'Ace')) {
        total += Card.JQK_VALUE;
      }
      if (this.hand[index].rank === 'Ace') {
        continue;
      }
    }

    total += this.decidingAceValue(this.hand, total);
    this.point = total;
  }

  decidingAceValue(arr, total) {
    let aceValTotal = 0;
    for (let index = 0; index < arr.length; index++) {
      if (arr[index].rank === 'Ace') {
        if (total + Card.ACE_VALUE_ELEVEN <= TwentyOneGame.MAX_NUMBER) {
          aceValTotal += Card.ACE_VALUE_ELEVEN;
        } else {
          aceValTotal += Card.ACE_VALUE_ONE;
        }
      }
    }
    return aceValTotal;
  }

  getPoint() {
    return this.point;
  }

  resetAll() {
    this.resetHand();
    this.resetPoint();
    this.resetBust();
  }

  resetHand() {
    this.hand = [];
  }

  resetPoint() {
    this.point = 0;
  }

  resetBust() {
    this.bust = false;
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

  isBiggerThanMin() {
    return this.getPoint() >= TwentyOneGame.DEALER_MIN;
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
    this.displayResult();
    this.player.updatingCoin(this.whoWon());
    this.player.displayCoin();
    this.resetGame();
  }

  dealCards() {
    this.player.receiveOneCard(this.deck.pickOneCard());
    this.deck.removeOneCard();
    this.player.receiveOneCard(this.deck.pickOneCard());
    this.deck.removeOneCard();
    this.player.updatingPoint();

    this.dealer.receiveOneCard(this.deck.pickOneCard());
    this.deck.removeOneCard();
    this.dealer.updatingPoint();
    this.dealer.receiveOneCard(this.deck.pickOneCard());
    this.deck.removeOneCard();
  }

  showCardsWithClear() {
    console.clear();
    console.log('dealer has:');

    if (this.currentTurn === 'player') {
      console.log([this.createCardList(this.dealer)[0], 'hidden card']);
      console.log(`A total of: ${this.dealer.getPoint()}`);
    } else {
      console.log(this.createCardList(this.dealer));
      console.log(`A total of: ${this.dealer.getPoint()}`);
    }
    console.log('player has:');
    console.log(this.createCardList(this.player));
    console.log(`A total of: ${this.player.getPoint()}`);
  }

  createCardList(participant) {
    let cardList = [];
    participant.hand.forEach(card => {
      cardList.push([card.suit, card.rank]);
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
      if (this.player.isTwentyOne()) {
        console.log('Your point is 21! Lucky you');
        break;
      }
      if (this.player.isBusted()) {
        console.log('Player busted!');
        break;
      }

      console.log('Do you want to hit or stay?');
      let answer = readline.question().toLowerCase();

      while (!TwentyOneGame.VALID_STAY_OR_HIT.includes(answer)) {
        console.log("Not valid. Please choose '(h)it' or '(s)tay'");
        answer = answer = readline.question().toLowerCase();
      }

      if (answer === 's' || answer === 'stay') break;
      if (answer === 'h' || answer === 'hit') {
        this.player.receiveOneCard(this.deck.pickOneCard());
        this.deck.removeOneCard();
        this.player.updatingPoint();
        this.player.bustUpdate();
      }
      this.showCardsWithClear();
    }
  }

  dealerTurn() {
    this.dealer.updatingPoint();

    while (true) {
      this.showCardsWithClear();
      if (this.dealer.isBusted()) {
        console.log('Dealer busted!');
        break;
      }
      if (this.dealer.isTwentyOne()) {
        break;
      }
      if (this.dealer.isBiggerThanMin()) {
        break;
      }

      this.wantToContinue();
      this.dealer.receiveOneCard(this.deck.pickOneCard());
      this.deck.removeOneCard();
      this.dealer.updatingPoint();
      this.dealer.bustUpdate();
    }

  }

  anyoneBusted() {
    return this.player.isBusted() === true || this.dealer.isBusted() === true;
  }

  displayWelcomeMessage() {
    console.log(`Weclome to 21! You have $${Player.INITIAL_MONEY}.00! Each game costs $1.00`);
  }

  displayGoodbyeMessage() {
    console.log('Thank you for playing 21!');
  }

  wantToContinue() {
    readline.question("Press Return to continue...");
  }

  whoWon() {
    if (this.anyoneBusted()) {
      return this.dealer.isBusted() ? 'player' : 'dealer';
    } else if ((TwentyOneGame.MAX_NUMBER - this.player.getPoint()) < (TwentyOneGame.MAX_NUMBER - this.dealer.getPoint())) {
      return 'player';
    } else if ((TwentyOneGame.MAX_NUMBER - this.player.getPoint()) > (TwentyOneGame.MAX_NUMBER - this.dealer.getPoint())) {
      return 'dealer';
    } else if ((TwentyOneGame.MAX_NUMBER - this.player.getPoint()) === (TwentyOneGame.MAX_NUMBER - this.dealer.getPoint())) {
      return null;
    }
  }

  displayResult() {
    if (this.whoWon()) {
      console.log(`Winner is ${this.whoWon()}!!`);
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

    if (answer === 'y' || answer === 'yes') {
      return true;
    } else {
      return false;
    }
  }


  resetGame() {
    this.player.resetAll();
    this.dealer.resetAll();
    this.switchPlayer();
    this.deck.reset();
  }

}

let game = new TwentyOneGame();
game.start();