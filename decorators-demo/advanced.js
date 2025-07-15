// function infoDecorator(init, context) {
//   console.log(context);
//   return init;
// }

// class Test {
//   @infoDecorator
//   name = "ChatGPT";
// }

// function logInit(init, context) {
//   context.addInitializer(function () {
//     console.log("add initailizer it run during on the object creation.");
//   });

//   return function () {
//     return init;
//   };
// }

// class User {
// //// logInit internally converts into name=logInit(init,context).call(this);
//   @logInit
//   name = "Karthik";

//   @logInit
//   role = "admin";
// }

// const u = new User();

// Output:
// Initialized 'name' for User { name: 'Karthik', role: 'admin' }
// Initialized 'role' for User { name: 'Karthik', role: 'admin' }

// // multiple decorators

// function A(target,property,descriptor){
//   let original=descriptor.value;
//   console.log("A function is executing at defining.");
//   descriptor.value = function(){
//     console.log("A before");
//     original.apply(this);
//     console.log("A after");
//   }
//   return descriptor;
// }

// function B(target,property,descriptor){
//   let original=descriptor.value;
//   console.log("B function is executing at defining.");
//   descriptor.value =function(){
//     console.log("B before.");
//     original.apply(this);
//     console.log("B after.");
//   }
//   return descriptor;
// }

// class User{
  
//   @A
//   @B
//   greet(){
//     console.log("greet is executing.");
//   }
// }
// let usr=new User();
// usr.greet();

// // realtime example:

// function log(target,property,descriptor){
//   let original=descriptor.value;
//   descriptor.value=function(...args){
//     console.log("Method name is:",property);
//     console.log("Arguments are:",...args);
//     original.apply(this);
//   }
//   return descriptor;
// }

// function delay(ms){
//   return function(target,property,descriptor){
//     let original=descriptor.value;
//     descriptor.value=function(...args){
//       setTimeout(()=>{
//         console.log("delayed execution..")
//         original.apply(this);
//       },ms);
//     }
//     return descriptor;
//   };
// }

// class User{
  
//   @log
//   @delay(10000)
//   run(arg1,arg2){
//     console.log("run method is executing.");
//   }
// }
// let usr=new User();
// usr.run("karthi","2131312");

// // //meta data

import 'reflect-metadata';

// function role(access){
//   return Reflect.metadata("role",access);
// }

// function level(lvl){
//   return Reflect.metadata("level",lvl);
// }

// class User{

//     @level("fully")
//     @role("admin")
//     method(){
//       console.log("done...");
//     }
// }

// console.log(Reflect.getMetadata("role",User.prototype,"method"));
// console.log(Reflect.getMetadata("level",User.prototype,"method"));
// console.log(Reflect.getMetadata("pass",User.prototype,"method") || "there is no meta data");

// function setMetaData(metaObj){
//   console.log(metaObj);
//   return function(target,property){
//     let exist=Reflect.getMetadata("meta",target,property);
//     let newMD={...exist,...metaObj};
//     console.log(newMD);
//     return Reflect.defineMetadata("meta",newMD,target,property);
//   }
// }

// class User{
//   @setMetaData({
//     user:"normal user",
//     loglvl:"fully",
//     role:"admin"
//   })
//   method(){
//     console.log("you are verfied user to log in.");
//   }
// }

// let meta=Reflect.getMetadata("meta",new User(),"method");
// console.log(meta);

