//creating with constructor 'Dog'
function Dog(name, breed, weight) {
  this.name = name;
  this.breed = breed;
  this.weight = weight;
}

Dog.prototype.bark = function() {
    console.log(this.weight > 20 ? 'Woof!' : 'Yip!');
};

let maxi = new Dog('Maxi', 'German Shepherd', 32);

maxi.bark(); // 'Woof!'
console.log(Object.getPrototypeOf(maxi)); 
// will log Dog { bark: [Function] } -> maxi's prototype is the same as Dog's prototype.
console.log(Dog.prototype); 
// will log Dog { bark: [Function] } -> checking again the prototype of 'maxi' and 'Dog' are the same
console.log(Object.getPrototypeOf(maxi) === Dog.prototype);
//will log true.. checking the two statemtens above again

//////////////////////////////////////////////////////
//creating with a factory function 'dog'
function dog(name, breed, weight) {
  let obj = {
  name,
  breed,
  weight
  };
return obj;
}

dog.prototype.bark = function() {
    console.log(this.weight > 20 ? 'Woof!' : 'Yip!');
};

let eddy = dog('eddy', 'lab', 5);

eddy.bark(); 
// error - eddy.bark is not a function -> 'eddy' and 'bark' don't share any prototype
console.log(Object.getPrototypeOf(eddy)); 
// will log '{}'' -> checking the prototype of 'eddy' is the deafult prototype, not linked with dog.prototype
console.log(dog.prototype); 
// will log dog { bark: [Function] } -> 'dog.prototype' does contain bark funtion but its prototype not linked to 'eddy' at all
console.log(Object.getPrototypeOf(eddy) === dog.prototype);
//will log false.. checking the two statemtens above again

