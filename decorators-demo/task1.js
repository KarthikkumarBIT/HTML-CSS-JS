function log(rules){
    return function(target,property,descriptor){
        let original=descriptor.value;
        
        descriptor.value=function(...args){
            for(let i=0;i<args.length;i++){
                let rule=rules[i];
                let val=args[i];

                if(rule.required!==undefined && (val===undefined || val==='' || val===null)){
                    throw new Error(`The Input ${val} is not matching with the valid creteria.`)
                }
                if(rule.type !==undefined && typeof val!==rule.type){
                    throw new Error(`The Input ${val} is not matching with the valid creteria.`)
                }
                
                if(rule.min!==undefined && val<rule.min){
                    throw new Error(`The Input ${val} is not matching with the valid creteria.`)
                }
            }
            return original.apply(this,args);
        }
        return descriptor;
    }
}

class cart{

    @log([ {type:'string',required:true} ,{type:'number',required:true,min:1}])
    addToCart(name,price){
        console.log(`Item ${name} with price ${price} is added to the Cart Successfully.`);
    }
}

let c=new cart();

try{
    c.addToCart("122",123);
    c.addToCart("qw",123);
    c.addToCart("null",0);
}
catch(e){
    console.log(e);
}