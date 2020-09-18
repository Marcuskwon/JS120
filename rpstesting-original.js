const readline = require('readline-sync');
const GRAND_WINS = 5;
const VALID_CHOICES = {
  rock: ['rock', 'r'],
  paper: ['paper', 'p'],
  scissors: ['scissors'],
  spock: ['spock'],
  lizard: ['lizard', 'l']
};

const WIN_DRAWS = {
  rock: ['lizard', 'scissors'],
  paper: ['rock', 'spock'],
  scissors: ['paper', 'lizard'],
  spock: ['rock', 'scissors'],
  lizard: ['spock', 'paper']
};
const VALID_AGAIN_ANSWER = ['y', 'n', 'yes', 'no'];


function createRound() {
  return {
    human: createHuman(),
    computer: createComputer(),
    winner: null,
  
    
    determineWinner() {
    let humanMove = this.human.move;
    let computerMove = this.computer.move;

    if (WIN_DRAWS[humanMove].includes(computerMove)) {
      this.winner = 'human';
    } else if (humanMove === computerMove) {
      this.winner = null;
    } else {
      this.winner = 'computer';
    }
  },
  
  displayWinner() {
    console.log(`Your choice is ${this.human.move}`);
    console.log(`Computer choice is ${this.computer.move}`);
    
    if (this.winner) {
    console.log(`This round winner is ${this.winner}`);
  } else {
    console.log('It is a tie!');
  }
  }
    
  };
}

function createComputer() {
  let playerObject = createPlayer();

  let computerObject = {
    choose() {
      const choices = ['rock', 'paper', 'scissors', 'lizard', 'spock'];
      let randomIndex = Math.floor(Math.random() * choices.length);
      this.move = choices[randomIndex];
    },
  };
  
  return Object.assign(playerObject, computerObject);
}



function createHuman() {
  let playerObject = createPlayer();

  let humanObject = {
    choose() {
      let choice;
      while (true) {
        console.log('Please choose rock, paper, scissors, spock, or lizard');
        choice = readline.question();
        if (Object.values(VALID_CHOICES).some(ele => ele.includes(choice))) {
        choice = Object.keys(VALID_CHOICES).find(ele => VALID_CHOICES[ele].includes(choice));
        break;
        }
        console.log("Sorry, invalid choice. You must enter the full name for 'spock' and 'scissors'" );
      }

      this.move = choice;
    },
  };

  return Object.assign(playerObject, humanObject);
}

function createPlayer() {
  return {
    move: null,
  };
}

function createWinsHistory() {
  return {
    rock: 0,
    paper: 0,
    scissors: 0,
    spock: 0,
    lizard: 0,
  };
}


function createGrandGame() {
    return {
      currentScore: {human: 0, computer: 0}, //creating the score board for the whole game
      
      updateScore(winner) { //updating the score board
        if (winner) {
          this.currentScore[winner]++;
        }
      },
      
      displayScore() { //displaying the current score
        console.log(this.currentScore);
      },
      
      gotGrandWinner() { //verify if we got the grand winner
        return Object.values(this.currentScore).includes(GRAND_WINS);
        },
        
      displayGrandWinner() { //display grand winner 
        console.log(`The Grand Winner is ${Object.keys(this.currentScore).find(ele => this.currentScore[ele] === GRAND_WINS)}`);
      },
      
      resetScore() { // reset the score board
        this.currentScore = {human: 0, computer: 0};
      }
      
      };
    }
  


//orchestration Engine
const RPSGame = {
  grandGame: createGrandGame(),
  round: createRound(),

  displayWelcomeMessage() {
    console.log('Welcome to RPSSL! Whoever achieves 5 wins will be a grand winner!');
  },
  
  playAgain() {
    console.log('Would you like to play again? (y/n)');
    let answer = readline.question().toLowerCase();
    
    while (true) {
      if (VALID_AGAIN_ANSWER.includes(answer)) {
        return answer === 'y' || answer === 'yes';
      } else {
        console.log('Please choose between y or n');
        answer = readline.question().toLowerCase();
      }
    }
  },
  
  displayGoodbyeMessage() {
    console.log('Thanks for playing RPSSL Goodbye!');
  },


  play() {
    this.displayWelcomeMessage();
      
      while (true) { // will loop until say no in play again
  
        while (true) { // will loop until 5 wins
          this.round.human.choose();
          this.round.computer.choose();
          this.round.determineWinner();
          this.round.displayWinner();
          this.grandGame.updateScore(this.round.winner);
          this.grandGame.displayScore();
          if (this.grandGame.gotGrandWinner()) {
            this.grandGame.displayGrandWinner();
            break;
          }
        }
        
      this.grandGame.resetScore();
      if (!this.playAgain()) break;
    }

    this.displayGoodbyeMessage();
  },
};


//engine interface
RPSGame.play();