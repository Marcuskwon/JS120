
const userFunctions = {
  add: function() {this.points += 1},
  login: function() {console.log("You're loggedin")}
};

function userCreator(name, points) {
  const newUser = Object.create(userFunctions);
  newUser.name = name;
  newUser.points = points;
  return newUser;
}

const user = userCreator('Ryan', 3);



console.log(user.__proto__ === userFunctions); //true
//line 8 Object.creat automatically sets this to userFunctions

console.log(user.constructor === Object); //true
//user's constructor is 'Object'

console.log(userFunctions.__proto__ === Object.prototype); // true
//plain object's prototype is Object.prototype

console.log(userFunctions.constructor === Object);//true
//plain object's constuctor is 'Object'



/*
confusion with prototype here
 1. prototype property on either object here? 
  -> no ! only functions get 'prototype' property
 2. still refer to userFunctions as the prtotoype of user 
  -> what prottoype of 'user' is pointing is userFunctions, but it is different from having 'prototype' property
*/

user.add();
console.log(user.points); // log 4

