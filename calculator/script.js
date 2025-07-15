const value=document.querySelector(".display-inp");

value.addEventListener("keydown", (event) => {
    const allowedKeys = "0123456789+-*/().";
    const controlKeys = ["Backspace", "Enter", "Delete", "ArrowLeft", "ArrowRight"];

    if (allowedKeys.includes(event.key) || controlKeys.includes(event.key)) {
        if (event.key === "Enter") {
            event.preventDefault();
            calculate();
        }
    } 
    else if (event.ctrlKey && ["a", "c", "v", "x"].includes(event.key.toLowerCase())) {
        return;
    }
    else {
        event.preventDefault();
    }
});

function appendDisplay(val){
    if( value.value ==='0' || value.value == "error"){
        value.value=val;
    }
    else{
        value.value+=val;
    }
    value.scrollLeft = value.scrollWidth;
}

function clearDisplay(){
    value.value='0';
}

function deleteLast(){
    let len=value.value.length;
    value.value=value.value.substring(0,len-1);
    if(value.value==='') value.value='0';
}

function calculate(){
    try{
        let exp=value.value;
        console.log(exp);
        const operands=[],operators=[];

        function precedence(op){
            if(op=='+' || op=='-') return 1;
            if(op=='*' || op=='/') return 2;
            return 0;
        }

        function applyOperator(op){
            if (operands.length < 2) throw "invalid expression";

            const b=operands.pop(),a=operands.pop();
            switch(op){
                case '+':operands.push(a+b);break;
                case '-':operands.push(a-b);break;
                case '*':operands.push(a*b);break;
                case '/':operands.push(a/b);break;
            }
        }

        let i=0;
        while(i<exp.length){
            if(!isNaN(exp[i]) || exp[i] === '.'){
                let numStr='',dotcount=0;
                while(i<exp.length && /[0-9.]/.test(exp[i])){
                    if(exp[i] === '.') dotcount++;
                    if(dotcount>1) throw "Invalid floating point number"
                    numStr +=exp[i];
                    i++;
                }

                const num = parseFloat(numStr);
                // note:parse float method is converting the string 777.12.12331 => 777.12
                console.log(num);
                if(isNaN(num)) throw "Invaild number, give the number in correct format."
                operands.push(num);
                continue;
            }

            if(exp[i]=='('){
                operators.push('(');
            }

            else if(exp[i]==')'){
                while( operators.length>0 && operators[operators.length-1]!='('){
                    applyOperator(operators.pop());
                }
                if(operators.length==0) throw "Parenthesis Mismatched";
                operators.pop();
            }

            else if('+-/*'.includes(exp[i])){
                while(operators.length>0 && 
                    precedence(operators[operators.length-1])>=precedence(exp[i])){
                    applyOperator(operators.pop());
                }
                operators.push(exp[i]);
            }

            i++;

        }

        while(operators.length>0) applyOperator(operators.pop());
        
        if(operands.length!=1) throw "Invalid expression";

        let result = operands.pop();
        value.value = parseFloat(result.toFixed(10)).toString();
    }
    catch(err){
        value.value="error";
    }
}