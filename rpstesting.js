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


function yesOrNo(prompt) {
    console.log(prompt);
    let answer = readline.question().toLowerCase();
    
    while (true) {
      if (VALID_AGAIN_ANSWER.includes(answer)) {
        return answer === 'y' || answer === 'yes';
      } else {
        console.log('Please choose between y or n');
        answer = readline.question().toLowerCase();
      }
    }
}
  

function createRound() {
  return {
   
    winner: null,
    winnerMove: null,
    looserMove: null,
    
    determineWinner(humanMove, computerMove) {

    if (WIN_DRAWS[humanMove].includes(computerMove)) {
      this.winner = 'human';
      this.winnerMove = humanMove;
      this.looserMove = computerMove;
    } else if (humanMove === computerMove) {
      this.winner = null;
    } else {
      this.winner = 'computer';
      this.winnerMove = computerMove;
      this.looserMove = humanMove;
    }
  },
  
  displayWinner(humanMove, computerMove) {
    console.log(`Your choice is ${humanMove}`);
    console.log(`Computer choice is ${computerMove}`);
    
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
  let movePool = createComputerMovePool();
  let computerObject = {
    choose() {
      let randomIndex = Math.floor(Math.random() * movePool.pool.length);
      this.move = movePool.pool[randomIndex];
    },
  };
  
  return Object.assign(playerObject, movePool, computerObject);
}



function createComputerMovePool() {
  return {
    pool: ['rock', 'paper', 'scissors', 'lizard', 'spock'],
    
    updatePool(winner, winMove, lossMove) { // I decided to add a move when computer won with that move to increase possibility of choosing that move next game, and remove it to decrease its possibility of choosing it next game.
      if (winner === 'computer') {
        this.pool.push(winMove);
      } else if (winner === 'human') {
        if (this.pool.filter(ele => ele === lossMove).length > 1) {
          this.pool.splice(this.pool.indexOf(lossMove), 1);
        }
      }
    },
  };
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

function createHistory() { //data structure of historical moves 
  return {
   humanHistory: createMovesData(),
   computerHistory: createMovesData(),
  
  
    updateMovesData(winner, winMove, lossMove) {
      if (winner === 'human') {
        this.humanHistory.totalWins++;
        this.humanHistory.moves[winMove].win++;
        this.computerHistory.moves[lossMove].loss++;
      } else if (winner === 'computer') {
        this.computerHistory.totalWins++;
        this.computerHistory.moves[winMove].win++;
        this.humanHistory.moves[lossMove].loss++;
      }
    },
    
    displayDataHistory() {
      if (yesOrNo('Do you want to see historical moves data?')) {
      console.log('---------HUMAN HISTORY---------');
      console.log(this.humanHistory);
      console.log('--------COMPUTER HISTORY--------');
      console.log(this.computerHistory);
      }
    }
  };
}


function createMovesData() {
  return {
    totalWins: 0,
    
    moves: {
      rock: {win: 0, loss:0},
      paper: {win: 0, loss:0},
      scissors: {win: 0, loss:0},
      spock: {win: 0, loss:0},
      lizard: {win: 0, loss:0},
    },
  };
}
   

function createGrandGame() { //object of a set of grand game (5 wins)
    return {
      currentScore: {human: 0, computer: 0},
      
      updateScore(winner) { 
        if (winner) {
          this.currentScore[winner]++;
        }
      },
      
      displayScore() {
        console.log(this.currentScore);
      },
      
      gotGrandWinner() {
        return Object.values(this.currentScore).includes(GRAND_WINS);
        },
        
      displayGrandWinner() {
        console.log(`The Grand Winner is ${Object.keys(this.currentScore).find(ele => this.currentScore[ele] === GRAND_WINS)}`);
      },
      
      resetScore() {
        this.currentScore = {human: 0, computer: 0};
      }
      
      };
    }
  


//orchestration Engine
const RPSGame = {
  winLossHistory: createHistory(),
  grandGame: createGrandGame(),
  human: createHuman(),
  computer: createComputer(),
  round: createRound(),
  

  displayWelcomeMessage() {
    console.log('Welcome to RPSSL! Whoever achieves 5 wins will be a grand winner!');
  },
  
  
  playAgain() {
    let prompt = 'Would you like to play again? (y/n)';
    return yesOrNo(prompt);
  },
  
  displayGoodbyeMessage() {
    console.log('Thanks for playing RPSSL Goodbye!');
  },


  play() {
    this.displayWelcomeMessage();
      
      while (true) {//loop until if the user doesn't want to play it
        
        while (true) { //loop until 5 wins
          this.human.choose();
          this.computer.choose();
          this.round.determineWinner(this.human.move, this.computer.move);
          this.round.displayWinner(this.human.move, this.computer.move);
          this.winLossHistory.updateMovesData(this.round.winner, this.round.winnerMove, this.round.looserMove);
          this.computer.updatePool(this.round.winner, this.round.winnerMove, this.round.lossMove);
          //console.log(this.human); testing feature
          //console.log(this.computer); testing feature
          this.grandGame.updateScore(this.round.winner);
          this.grandGame.displayScore();
          if (this.grandGame.gotGrandWinner()) {
            this.grandGame.displayGrandWinner();
            this.winLossHistory.displayDataHistory();
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