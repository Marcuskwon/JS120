function UserCreator(name) {
  this.name = name;
}

UserCreator.prototype.sayName = function() {
  console.log(`I'm ${this.name}`);
};

function PaidUserCreator(paidName, balance) {
  UserCreator.call(this, paidName);
  this.balance = balance;
}


PaidUserCreator.prototype.increase = function () {
  this.balance += 1;
};

console.log(PaidUserCreator.prototype.__proto__ === Object.prototype); // true
console.log(PaidUserCreator.prototype.__proto__ === UserCreator.prototype); // false
console.log(PaidUserCreator.prototype.constructor === PaidUserCreator); //true
//We want PaidUserCreator to have the access to UserCreator.prototype, but it doesn't do that right now
//'PaidUserCreator.__proto__' refereces Object.prototype

//This is how we make that happen
PaidUserCreator.prototype = Object.create(UserCreator.prototype);

console.log(PaidUserCreator.prototype.constructor === PaidUserCreator); // false
console.log(PaidUserCreator.prototype.constructor === UserCreator); // true

PaidUserCreator.prototype.constructor = PaidUserCreator; //this needs to be done after line 26

console.log(PaidUserCreator.prototype.__proto__ === Object.prototype); // false
console.log(PaidUserCreator.prototype.__proto__ === UserCreator.prototype); // true

console.log(PaidUserCreator.prototype === UserCreator.prototype); // false
//wrong way to make ths connection -> PaidUserCreator.prototype = UserCreator.prototype

//A different thing we could do, but performance 
//-> PaidUserCreator.prototype.__proto__ = UserCreator.prototype; this way you don't have to fix constructor.. but not a good idea to 

PaidUserCreator.prototype.increase = function() {
  this.balance += 1;
};

const user1 = new UserCreator("Dean");
console.log(user1.__proto__ === UserCreator.prototype); // true
//user1.increase()  error- 'user1' doesn't have the access to 'increase' method whcih belongs to 'PaidUserCreator'


const paidUser1 = new PaidUserCreator('Ryan', 3);
console.log(paidUser1.__proto__ === PaidUserCreator.prototype); //true;

paidUser1.increase();
console.log(paidUser1.balance); // print 4
paidUser1.sayName(); // pring I'm Ryan