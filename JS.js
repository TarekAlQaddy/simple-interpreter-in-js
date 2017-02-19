/**
 * Created by Tarek Alqaddy on 3/27/2016.
 */
// implementation of the Stack
function Stack(size){
    this.top = 0;
    this.elements = new Array(size);
    this.push = function(No){
        this.elements[this.top++] = No;
    };
    this.pop = function(){
        return this.elements[--this.top];
    };
    this.isEmpty = function (){
        return this.top === 0;
    };
    this.isFull = function(){
        return this.top === this.elements.length;
    }
}


var vars = {};
var text = document.getElementById("input");
var msg = text.nextElementSibling;


//normal calculation of postFix

function calcPostfix(str){
    var a,b;
    var S = new Stack(30);
    str = str.split(',');
    str = str.filter(function(elem){
        return elem !== " " && elem !== "";
    });
    console.log(str);
    for(var i=0;i<str.length;i++){
        if(Number(str[i]) || str[i] === '0'){
            S.push(Number(str[i]));
        }
        else if(str[i] === '+'){
            S.push(S.pop()+S.pop());
        }
        else if(str[i] === '-'){
            a = S.pop();
            b = S.pop();
            S.push(b-a);
        }
        else if(str[i] == '*'){
            S.push(S.pop()*S.pop());
        }
        else{
            a = S.pop();
            b = S.pop();
            S.push(b/a);
        }
    }
    var val = S.pop();
    if(!val){
        printError("Invalid expression !!");
        return null;
    }

    return val;
}
//Helper functions for changing from infix to postfix
function isOperator(char){
    return char === '+' || char === '-' || char === '*' || char === '/';
}
function isBrackets(char){
    return char === ')' || char === '(';
}
function priority(ch){
    if(ch === '/' || ch === '*')
        return 2;
    else if(ch === '+' || ch ==='-')
        return 1;
    else
        return 0;
}
//Converting from infix To postfix
function infixToPostfix(str){
    var i=0,p='',ch='';
    var S = new Stack(30);
    while(i<str.length){
        if(str[i] === ' ')
            i++;
        if(Number(str[i]) || str[i] === '0' || str[i] === '.'){
            while(Number(str[i]) || str[i] === '0' || str[i] === '.' ) {
                p += str[i++];
            }
            p+=',';
        }
        if(str[i] === '(')
            S.push(str[i++]);
        if(str[i] === '*' || str[i] === '/' || str[i] === '+' || str[i] === '-'){

            if(S.length ==0)
                S.push(str[i++]);
            else{
                ch = S.pop();
                while(priority(str[i]) <= priority(ch)){
                    p += ch;
                    p += ',';
                    ch = S.pop();
                }
                S.push(ch);
                S.push(str[i++]);
            }
        }
        if(str[i] == ')'){
            ch = S.pop();
            while(ch != '('){
                p+=ch;
                p += ',';
                ch = S.pop();
            }
            i++;
        }

    }
    while(!S.isEmpty()){
        p += S.pop();
        p += ',';
    }
    console.log("from infixToPostfix=> p: "+p);
    return p;
}

function calcFinalValue(str) {
    return calcPostfix(infixToPostfix(str));
}
/******************************************************************************************************************/
/******************************************************************************************************************/




/* for setting a new value to a new variable and storing " when the input contains ':' "
 * split the string into 2 halves => the left accept only chars => the right accept anything then convert it
 * and calculate its value
 */
function setAVar(input,index){
    var ar = input.split("");
    var firstHalf = ar.slice(0,index);
    var secondHalf = ar.slice(index+1,input.length+1);
    console.log(firstHalf+"\n"+secondHalf);

    firstHalf = firstHalf.filter(function(elem){
        return !((elem.charCodeAt(0) < 'a'.charCodeAt(0) && elem.charCodeAt(0) >'z'.charCodeAt(0)) || (elem.charCodeAt(0) < 'A'.charCodeAt(0) && elem.charCodeAt(0) >'Z'.charCodeAt(0)) || elem === ' ')
    });
    firstHalf = firstHalf.join('');
    if(checkForOneVar(firstHalf)) {
        secondHalf = secondHalf.filter(function (elem) {
            return !(elem === ' ' || elem.charCodeAt(0) === 13);
        });

        secondHalf = calcFinalValue(convertValue(secondHalf.join('')));

        console.log("from setAVar=>" + "firstHalf: " + firstHalf + "\t" + "secondHalf: " + secondHalf);
        if (secondHalf) {
            print(secondHalf);
            vars[firstHalf] = secondHalf;
        }
    }
}


/*
    this function checks if the L.H.S of the expression contains only one var and not an operation
 */
function checkForOneVar(str) {
    for(var i=0;i<str.length;i++){
        if(isOperator(str[i]) || isBrackets(str[i])){
            printError("invalid left hand side expression !");
            return 0;
        }
    }
    return 1;
}


/*when the input contains '?' this method is called to extract the variable of the whole string
 * then returns the converted value
 */

function getValue(input,index){
    var ar = input.split("");
    var firstHalf = ar.slice(0,index);
    firstHalf = firstHalf.filter(function(elem){
        return elem !== ' ';
    });
    firstHalf = firstHalf.join('');
    return(convertValue(firstHalf));
}

function checkIfExists(str) {
    if(vars[str])
        return vars[str];
    else {
        printError(str + ' not found !!');
        return ;
    }
}

//Helper method for getValue that converts the string to it's real numerical value if exists,
//If not throws an Error.
function convertValue(exp){
    var newValue = [],str = '',i,j;
    exp = exp.split("");

    for (i=0;i<exp.length;i++){
        if(isOperator(exp[i]) || exp[i] === '(' || exp[i] === ')' || Number(exp[i]) || exp[i] === '0' || exp[i] === '.')
            newValue.push(exp[i]);
        else{
            j = i;
            str = '';
            for(i;!isOperator(exp[i]) && exp[i] !== '(' && exp[i] !== ')' && !Number(exp[i]) && i<exp.length;i++){
                str+=exp[i];
            }
            i--;
            newValue[j] = checkIfExists(str);
        }
    }
    /*if(newValue.indexOf(false))
        return;*/
    console.log(newValue);
    newValue = newValue.filter(function(elem){
       return elem !== ' ';
    });
    newValue = newValue.join('');
    console.log("from convertValue=> newValue: "+ newValue);
    return newValue;
}

/* splits the string into 2 halves and converts them then checks if they are equal */
function checkEqual(input,index){
    var firstHalf = input.slice(0,index).split("");
    var secondHalf = input.slice(index+2,input.length+1).split("");
    firstHalf = firstHalf.filter(function (elem) {
        return elem !== ' ';
    });
    secondHalf = secondHalf.filter(function (elem) {
        return elem !== ' ';
    });
    firstHalf = calcFinalValue(convertValue(firstHalf.join("")));
    secondHalf= calcFinalValue(convertValue(secondHalf.join("")));
    if(firstHalf && secondHalf) {
        if (firstHalf === secondHalf)
            print("true");
        else
            print("false");
    }
}

//for incrementing a var
function increment(str,i){
    str = str.slice(0,i);
    str = str.split("");
    str = str.filter(function (elem) {
        return elem !== ' ' && elem !== '';
    });
    str = str.join('');
    if(!vars[str])
        printError(str + " not found !");
    else {
        vars[str] += 1;
        print(vars[str]);
    }
}

//for decrementing a var
function decrement(str,i){
    str = str.slice(0,i);
    str = str.split('');

    str = str.filter(function(elem){
        return elem !== ' ' && elem !== '';
    });
    str = str.join('');

    if(!vars[str])
        printError(str + " not found !");
    else {
        vars[str] -= 1;
        print(vars[str]);
    }
}


//new function to get the index before the last of an element
Array.prototype.beforeLastIndex = function(elem){
    var ar = [];
    for(var i=0;i<this.length;i++){
        if(this[i] === elem)
            ar.push(i);
    }
    return ar[ar.length-2];
};
// returns the last line
function sliceTheString(str) {
    return str.slice(str.split("").beforeLastIndex(';')+2,str.length-1);//+2 for semicolon and next line
}

function check(input){
    var slicedString = sliceTheString(input);
    console.log(slicedString);
    var flagInit = 0,flagVal = 0,flagCheckEqual = 0,flagIncrement =0,flagDecrement = 0;
    for(var i =0;i<slicedString.length;i++){
        if(slicedString[i] === '=') {
            if(slicedString[i+1] === '='){
                flagCheckEqual =1;
                break;
            }
            flagInit = 1;
            break;
        }
        if(slicedString[i] === '?'){
            flagVal = 1;
            break;
        }
        if(slicedString[i] === '+' && slicedString[i+1] === '+'){
            flagIncrement = 1;
            break;
        }
        if(slicedString[i] === '-' && slicedString[i+1] === '-'){
            flagDecrement = 1;
            break;
        }

    }
    if(flagIncrement)
        increment(slicedString,i);
    else if(flagDecrement)
        decrement(slicedString,i);
    else if(flagCheckEqual)
        checkEqual(slicedString,i);
    else if(flagInit) {
        setAVar(slicedString,i);
    }
    else if(flagVal) {
        if(calcFinalValue(getValue(slicedString, i)))
            print(calcFinalValue(getValue(slicedString, i)));
        else
            printError("invalid expression !");
    }
    else{
        printError("invalid operation !");
    }

}

function printError(str) {
    msg.value = str;
    msg.classList.toggle('error');

    setTimeout(function () {
        msg.value = '';
        msg.classList.toggle('error');
    },1000);
}

function print(str){
    msg.value = str;
    msg.classList.toggle('active');
    setTimeout(function () {
        msg.value = '';
        msg.classList.toggle('active');
    },1000);
}

text.onkeydown = function (e) {
    var charCode = e.charCode || e.keyCode;
    if(charCode==13)
        check(text.value);

};
