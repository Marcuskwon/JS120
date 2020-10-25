function UserCreator(name, points) {
  this.name = name;
  this.points = points;
}


UserCreator.prototype.add = function() {
  this.points += 1;
};


const user = new UserCreator('Ryan', 3);
//when using 'new', the function (UserCreator)'s prototype properties will be the prototype of 'user' by deafult.
//meaning 'UserCreator.prototype' will store all funtions that 'user' can acccess.

//confusion check
console.log(user.__proto__ === UserCreator.prototype); //true
console.log(user.__proto__ === UserCreator); //false
console.log(user.constructor === UserCreator); //true
 //so what is user's prototype ? -> it is UserCreator.prototype
 

//confusion check
//where will JS keep looking up the prototypal chain?
console.log(UserCreator.prototype.__proto__ === Object.prototype); // true 
//Not
console.log(UserCreator.__proto__ === Function.prototype); // true

//UserCreator's __proto__ is not where all functions of 'user' are kept. 
//It is User.prototype -> and its prototype chain is linked to Object.prototype at the top.

user.add();
console.log(user.points); // will log 4


