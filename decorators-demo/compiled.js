"use strict";

var _class;
function _applyDecoratedDescriptor(i, e, r, n, l) { var a = {}; return Object.keys(n).forEach(function (i) { a[i] = n[i]; }), a.enumerable = !!a.enumerable, a.configurable = !!a.configurable, ("value" in a || a.initializer) && (a.writable = !0), a = r.slice().reverse().reduce(function (r, n) { return n(i, e, r) || r; }, a), l && void 0 !== a.initializer && (a.value = a.initializer ? a.initializer.call(l) : void 0, a.initializer = void 0), void 0 === a.initializer ? (Object.defineProperty(i, e, a), null) : a; }
// // basics about what is a decorator
// function add(fn){
//     return function(s){
//         let str=s+" is the best";
//         fn(str);
//     }
// }
// function print(s){  // decorated function because gfg is decorated by adding more text.
//     console.log(s);
// }
// let printFormatted=add(print);
// printFormatted("GFG");

// // ex:1 class decorator

// let variable=function(target){
//     target.age=23;
// }

// @variable
// class User1{

// }
// console.log(User1.age);

// // ex2:decorator factory ==  a function that returns a decorator 
// let variable=function(color){
// return function(target){
//     target.color="It  is "+color;
// }
// }
// @variable("blue")
// class sky{

// }
// console.log(sky.color);

// // class member decorator
// function memDecorator(target,name,descriptor){
//     console.log("target:"+target);
//     console.log("name:"+name);
//     console.log("descriptor:"+descriptor);
// }
// class gfg{

//     @memDecorator
//     greet(){
//         console.log("welcome!");
//     }
// }
// let obj=new gfg();
// obj.greet();

// // class member descriptor
// function safeLogger(target, name, descriptor) {
//     const original = descriptor.value;
//     console.log("decorator wrapped the class member.");
//     descriptor.value = function (...args){
//         console.log("Arguments:",args);
//         const result = original.apply(this, args); 
//         console.log(result);
//         return result;
//     };
//     return descriptor;
// }
// class GFG {
//     multiplier=100;   
//     constructor(multiplier) {
//         this.multiplier = multiplier;
//     }
//     @safeLogger
//     multiply(x){
//         return x * this.multiplier;
//     }
// }
// const g = new GFG(5);
// g.multiply(10);

////

// function log(target, key, descriptor) {
//   const original = descriptor.value;
//   descriptor.value = function (...args) {
//     console.log(`Calling ${key} with`, args);
//     return original.apply(this, args);
//   };
//   return descriptor;
// }

// class Example {
//   @log
//   sayHello(name) {
//     return `Hello, ${name}!`;
//   }
// }

/*      NOTE :: WHEN we define decorator it is internally converted into like the below while defining a class 
        const descriptor = Object.getOwnPropertyDescriptor(Example.prototype, 'sayHello');
        const newDescriptor = log(Example.prototype, 'sayHello', descriptor);
        Object.defineProperty(Example.prototype, 'sayHello', newDescriptor);            */

// // note: so is we change the descriptor properties it will be changed before we calling the method , so that when 
// // we call the method the decorator method is called.

// // making the class member as non writable preventing it from overridden
// let readOnly=function(target,property,descriptor){
//     descriptor.writable=false;
//     return descriptor;
// }

// class Car{
//     constructor(color){
//         this.color=color;
//     }

//     @readOnly
//     getColor(){
//         return this.color;
//     }
// }

// let car1=new Car("Black");
// console.log(car1.getColor());

// car1.getColor=function(){
//     console.log("Blue");
// }
// console.log(car1.getColor());

// // class decorators

// // function log(){
//     function decorator(gfg){
//             return  class form_gfg extends gfg{
//                         constructor(...args){
//                             console.log(`Parameters: ${args}`);
//                             super(args);
//                         }
//                     };
//         }
// // }

// @decorator  // or @log()
// class gfg {
//     constructor(name, category) {
//         this.name = name;
//         this.category = category;
//     }
// }

// const e = new gfg('geek', 'code');
// console.log(e);

// // clas member decorators (getter and setter)
// function logGetter(target, name, descriptor) {
//   const originalGet = descriptor.get;
//   descriptor.get = function () {
//     console.log(`Getting ${name}`);
//     return originalGet.call(this);
//   };
//   return descriptor;
// }

// function logSetter(target, name, descriptor) {
//   const originalSet = descriptor.set;
//   descriptor.set = function (args) {
//     console.log(`Setting ${name}`);
//     originalSet.call(this,args);
//   };
//   return descriptor;
// }

// class Example {
//   constructor() {
//     this._value = 42;
//   }
//   @logGetter
//   get value() {
//     return this._value;
//   }
//   @logSetter
//   set value(val){
//     this._value=val;
//   }
// }
// const e = new Example();
// console.log(e.value);
// e.value=123;
// console.log(e.value);

// // static method decorators
function log(target, name, descriptor) {
  console.log("Decorating:", name);
  return descriptor;
}
var Example = (_class = /*#__PURE__*/function () {
  function Example() {}
  var _proto = Example.prototype;
  _proto.greet = function greet() {
    return "hi";
  };
  Example.shout = function shout() {
    return "HEY!";
  };
  return Example;
}(), _applyDecoratedDescriptor(_class.prototype, "greet", [log], Object.getOwnPropertyDescriptor(_class.prototype, "greet"), _class.prototype), _applyDecoratedDescriptor(_class, "shout", [log], Object.getOwnPropertyDescriptor(_class, "shout"), _class), _class);
console.log(Example.shout());
console.log(new Example().greet());
