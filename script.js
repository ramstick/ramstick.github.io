/**
 * 
 *  Simplify the input string
 * 
 *  expression = expression + expression | expression - expression | expression * expression | expression / expression | expression (expression)
 *  
 * 
 * @param {String} input_string 
 */
var debug = "";
function parseExpression(input_string) {
    input_string = removeSpaces(input_string);
    input_string = removeSurroundingParen(input_string);
    if(input_string == null){
        return "ERROR! UNMATCHED PARENTHESIS";
    }
    var paren_count = 0;
    var out1 = "";
    var out2 = "";
    for(var i = 0; i < input_string.length; i ++){
        if(input_string[i] == "(") paren_count ++;
        else if(input_string[i] == ")") paren_count --;
        else if(input_string[i] == "+" && paren_count == 0) {out1 = parseExpression(input_string.substring(0,i)); out2 = parseExpression(input_string.substring(i+1)); return Expression.Expression(out1,out2,1);}
    }
    for(var i = 0; i < input_string.length; i ++){
        if(input_string[i] == "(") paren_count ++;
        else if(input_string[i] == ")") paren_count --;
        else if(input_string[i] == "-" && paren_count == 0) {out1 = parseExpression(input_string.substring(0,i)); out2 = parseExpression(input_string.substring(i+1)); return Expression.Expression(out1,out2,2);}
    }
    for(var i = 0; i < input_string.length; i ++){
        if(input_string[i] == "(") paren_count ++;
        else if(input_string[i] == ")") paren_count --;
        else if(input_string[i] == "*" && paren_count == 0) {out1 = parseExpression(input_string.substring(0,i)); out2 = parseExpression(input_string.substring(i+1)); return Expression.Expression(out1,out2,3);}
    }
    for(var i = 0; i < input_string.length; i ++){
        if(input_string[i] == "(") paren_count ++;
        else if(input_string[i] == ")") paren_count --;
        else if(input_string[i] == "/" && paren_count == 0) {out1 = parseExpression(input_string.substring(0,i)); out2 = parseExpression(input_string.substring(i+1)); return Expression.Expression(out1,out2,4);}
    }
    for(var i = 0; i < input_string.length; i ++){
        if(input_string[i] == "(" && paren_count == 0 && i != 0) {out1 = parseExpression(input_string.substring(0,i)); out2 = parseExpression(input_string.substring(i)); return Expression.Expression(out1,out2,3);}
        if(input_string[i] == ")" && input_string[i+1] == "(" && paren_count == 1 && i != 0) {out1 = parseExpression(input_string.substring(0,i+1)); out2 = parseExpression(input_string.substring(i+1,input_string.length)); return Expression.Expression(out1,out2,3);}
        if(input_string[i] == ")" && paren_count == 1 && i != 0) {out1 = parseExpression(input_string.substring(1,i)); out2 = parseExpression(input_string.substring(i+2)); return Expression.Expression(out1,out2,3);}
    
        if(input_string[i] == "(") paren_count ++;
        else if(input_string[i] == ")") paren_count --;
    }
    debug += input_string+"    ";
    return Expression.Term(input_string);
}
/**
 * 
 *  Simplify the input string
 * 
 *  expression = expression + expression | expression - expression | expression * expression | expression / expression | expression (expression)
 *  
 * 
 * @param {String} input_string 
 * @param {HTMLElement} element
 * @param {HTMLELement} debugE
 */
function parseExpressionE(input_string, element, debugE) {
    debug = "Terms:   ";
    var a = parseExpression(input_string);
    element.innerHTML = a.print();
    debugE.innerHTML = debug;
}



/**
 * Removes spaces from string.
 * 
 * @param {String} input 
 * 
 * @return {String}
 */
function removeSpaces(input){
    var out = "";
    for(var i = 0; i < input.length; i ++){
        if(input[i] != " ") out += input[i];
    }
    return out;
}
/**
 *  
 *  Remove all unneeded parenthesis
 * 
 * @param {String} input 
 */
function removeSurroundingParen(input){
    while(true){
        var paren_count = 0;
        for(var i = 1; i < input.length - 1; i ++){
            if(input[i] == "(") {paren_count ++;}
            else if(input[i] == ")") {paren_count --;}

            if(paren_count < 0){
                break;
            }
        }
        if(paren_count == 0 && input[0] == "(" && input[input.length - 1] == ")"){
            input = input.substring(1,input.length - 1);
        }else if(paren_count == 1 && paren_count == 0){
            return null;
        }else{
            return input;
        }
    }
    //return input;
}
/**
 * 1 - add
 * 2 - sub
 * 3 - mul
 * 4 - div
 * 5 - exp
 */
class Expression{
    constructor(){
        this.variables = {};
        this.coefficient = 1;
        this.isTerm = false;
    
        this.expA = null;
        this.expB = null;
        this.operation = 0;
    }

    static Term(input){
        var out = new Expression();
        out.isTerm = true;
        var parsingNumber = false;
        var lastNumber = 0;
        for(var i = 0; i < input.length; i++){
            var curr = input[i];
            if(isDigit(curr)){
                if(!parsingNumber){
                    lastNumber = i;
                }
            }else  {
                if(parsingNumber){
                    out.coefficient *= parseFloat(input.substring(lastNumber, i));
                }
                if(out.variables[curr]){
                    out.variables[curr] ++;
                }else{
                    out.variables[curr] = 1;
                }
            }
        }

        return out;
    }
    static Expression(inputA, inputB, operation){
        var out = new Expression();
        out.expA = inputA;
        out.expB = inputB;
        out.operation = operation;
        return out;
    }

    print(){
        var out = "";
        if(this.isTerm){
            var vars = Object.keys(this.variables);
            if(this.coefficient == -1){
                out += "-";
            }else if(this.coefficient != 1 || vars.length == 1) out += this.coefficient;
            for(var i = 0; i < vars.length; i++){
                out += vars[i];
                if(this.variables[vars[i]] != 1){
                    out += "^"+this.variables[vars[i]];
                }
            }
        }else{
            console.log(this.operation);
            switch(this.operation){
                case 1: out += "("+this.expA.print() + " + " + this.expB.print()+")"; break;
                case 2: out += "("+this.expA.print() + " - " + this.expB.print()+")"; break;
                case 3: out += "("+this.expA.print() + " * " + this.expB.print()+")"; break;
                case 4: out += "("+this.expA.print() + " / " + this.expB.print()+")"; break;
                case 5: out += "("+this.expA.print() + " ^ " + this.expB.print()+")"; break;
            }
        }
        return out;
    }
}

function isDigit(d){
    return d[0] >= "0" && d[0] <= "9";
}

var PARABOLA_STATE_A = 0;

/**
 * 
 *  Simplify the input string
 * 
 *  expression = expression + expression | expression - expression | expression * expression | expression / expression | expression (expression)
 *  
 * 
 * @param {String} input_string 
 * @param {HTMLElement} element
 * @param {HTMLELement} debugE
 */
function parabola(input_string, element, debugE) {
    debug = "";
    var a = parabolaCompute(input_string);
    element.innerHTML = a;
    debugE.innerHTML = debug;
}
/**
 * 
 * @param {String} input_string 
 */
function parabolaCompute(input_string){
    var params = removeSpaces(input_string).split(",");
    var vertex_given = params[0] != "" || params[1] != "";
    var focus_given = params[2] != "" || params[3] != "";
    var focal_length_given = params[4] != "";
    var vertex = {x : parseFraction(params[0]), y : parseFraction(params[1])};
    var focus = {x : parseFraction(params[2]), y : parseFraction(params[3])};
    var focal_length = parseFraction(params[4]);
    var directrix = parseFraction(params[5]);

    if(params[0] == ""){
        vertex.x = new Fraction(0,1);
    }
    if(params[1] == ""){
        vertex.y = new Fraction(0,1);
    }
    if(params[2] == ""){
        focus.x = new Fraction(0,1);
    }
    if(params[3] == ""){
        focus.y = new Fraction(0,1);
    }

    if(vertex_given){
        if(focus_given){
            debug += focus.x.toString() + " " + focus.y.toString()+"<br>"+vertex.x.toString()+" "+vertex.y.toString();
            if(vertex.x.equals(focus.x)){
                focal_length = focus.y.subtractFrac(vertex.y);
                var a = focal_length.multiplyNum(4).reciprocal();
                var b = vertex.x.multiplyNum(-2).multiplyFrac(a);
                var c = vertex.x.square().multiplyFrac(a).addFrac(vertex.y);
                var out = "", out2 = "";
                var d = false;
                if(!a.isZero()){
                    out += a.toHTML() +" x<sup>2</sup> ";
                    out2 += a.toDecimalString() + " x<sup>2</sup> ";
                    d = true;
                }
                if(!b.isZero()){
                    if(d && b.numerator > 0){
                        out += "+ ";
                        out2 += "+ ";
                    }
                    out += b.toHTML() + " x ";
                    out2 += b.toDecimalString() + " x ";
                    d = true;
                }
                if(!c.isZero()){
                    if(d && c.numerator > 0){
                        out += "+ ";
                        out2 += "+ ";
                    }
                    out += c.toHTML();
                    out2 += c.toDecimalString();
                }
                return out +"<br>"+out2;
            }else if(vertex.y.equals(focus.y)){
                focal_length = focus.x.subtractFrac(vertex.x);
                var a = focal_length.multiplyNum(4).reciprocal();
                var b = vertex.y.multiplyNum(-2).multiplyFrac(a);
                var c = vertex.y.square().multiplyFrac(a).addFrac(vertex.x);
                var out = "", out2 = "";
                var d = false;  
                if(!a.isZero()){
                    out += a.toHTML() +" y<sup>2</sup> ";
                    out2 += a.toDecimalString() + " y<sup>2</sup> ";
                    d = true;
                }
                if(!b.isZero()){
                    if(d && b.numerator > 0){
                        out += "+ ";
                        out2 += "+ ";
                    }
                    out += b.toHTML() + " y ";
                    out2 += b.toDecimalString() + " y ";
                    d = true;
                }
                if(!c.isZero()){
                    if(d && c.numerator > 0){
                        out += "+ ";
                        out2 += "+ ";
                    }
                    out += c.toHTML();
                    out2 += c.toDecimalString();
                }
                return out+"<br><br>"+out2;
            }else{
                return "ERROR no coordinates matchup";
            }
        }else if(focal_length_given){

        }
    }else{
        if(focus_given && focal_length_given){

        }else{
            return "ERROR";
        }
    }
}
class Fraction{
    constructor(num,deno){
        this.numerator = Math.abs(num);
        this.denominator = Math.abs(deno);

        const neg = num < 0 ^ deno < 0;
        if(neg) this.numerator *= -1;
        this.simplify();
    }
    simplify(){
        const e = GCF(this.numerator, this.denominator);
        this.numerator /= e;
        this.denominator /= e;

        const neg = this.numerator < 0 ^ this.denominator < 0;
        this.numerator = Math.abs(this.numerator);
        this.denominator = Math.abs(this.denominator);
        if(neg) this.numerator *= -1;
    }
    multiplyFrac(fracb){
        return new Fraction(this.numerator * fracb.numerator, this.denominator * fracb.denominator);
    }
    addFrac(fracb){
        const e = LCM(this.denominator,fracb.denominator);
        const numerator = this.numerator * e / this.denominator + fracb.numerator * e / fracb.denominator;
        const denominator = e;
        return new Fraction(numerator, denominator);
    }
    toString(){
        return this.numerator+"/"+this.denominator;
    }
    multiplyNum(a){
        return new Fraction(this.numerator * a, this.denominator);
    }
    reciprocal(){
        return new Fraction(this.denominator, this.numerator);
    }
    subtractFrac(fracb){
        const e = LCM(this.denominator,fracb.denominator);
        const numerator = this.numerator * e / this.denominator - fracb.numerator * e / fracb.denominator;
        const denominator = e;
        return new Fraction(numerator, denominator);
    }
    toHTML(){
        if(this.denominator == 1){
            return this.numerator;
        }
        if(this.numerator < 0){
            return "- <sup>"+Math.abs(this.numerator)+"</sup>/<sub>"+this.denominator+"</sub>";
        }
        return "<sup>"+this.numerator+"</sup>/<sub>"+this.denominator+"</sub>";
    }
    square(){
        return new Fraction(this.numerator * this.numerator, this.denominator * this.denominator);
    }
    equals(fracb){
        return this.numerator == fracb.numerator && this.denominator == fracb.denominator && this.neg == fracb.neg;
    }
    isZero(){
        return this.numerator == 0;
    }
    toDecimalString(){
        return this.numerator/this.denominator;
    }
    invert(){
        return new Fraction(-this.numerator, this.denominator);
    }
    isNegative(){
        return this.numerator < 0;
    }
    toDecimal(){
        return this.numerator / this.denominator;
    }
    greaterThan(fracB){
        return this.toDecimal() > fracB.toDecimal();
    }
}
/**
 * 
 * @param {Number} a 
 * @param {Number} b 
 */
function GCF(a, b){
    if(isNaN(a) || isNaN(b)) return 1;
    if(b == 0)
       return a; 
    else
       return GCF(b, a % b);
}
function LCM(a,b){
    return Math.abs(a*b) / GCF(a,b);
}
function parseFraction(input_string){
    var e = input_string.split("/");
    if(input_string == "") return new Fraction(0,1);
    if(e[1] == null) return new Fraction(parseFloat(e[0]),1);
    return new Fraction(parseFloat(e[0]) , parseFloat(e[1]));
}
function updateParabola(){
    switch (PARABOLA_STATE_A){
        case 0:
        case 1: document.getElementById("directrix-label").innerHTML = "y ="; break;
        case 2:
        case 3: document.getElementById("directrix-label").innerHTML = "x ="; break;
    }
}

var CONIC_EQUATION_SIGNS = [false, false, false, false, false];

function conic(out, debugE){
    debug = "";
    out.innerHTML = computeConic(document.getElementById("conic-in-a").value+","+document.getElementById("conic-in-b").value+","+document.getElementById("conic-in-c").value+","+document.getElementById("conic-in-d").value+","+document.getElementById("conic-in-e").value);
    debugE.innerHTML = debug;
}
function computeConic(input_string){
    const params = removeSpaces(input_string).split(",");
    debug += input_string + "<br>";
    var a = parseFraction(params[0]);
    var b = parseFraction(params[1]);
    var c = parseFraction(params[2]);
    var d = parseFraction(params[3]);
    var e = parseFraction(params[4]);
    if(CONIC_EQUATION_SIGNS[0]) a = a.invert();
    if(CONIC_EQUATION_SIGNS[1]) b = b.invert();
    if(CONIC_EQUATION_SIGNS[2]) c = c.invert();
    if(CONIC_EQUATION_SIGNS[3]) d = d.invert();
    if(CONIC_EQUATION_SIGNS[4]) e = e.invert();
    debug += a.toString() + " " + b.toString() + " " + c.toString() + " " + d.toString() + " "+ e.toString();
    if(!a.isNegative() && !b.isNegative()){
        return ellipse(a,b,c,d,e);
    }else{
        return hyperbola(a,b,c,d,e);
    }
}

function ellipse(a, b, c, d, e){
    const h = e.invert().addFrac(c.square().multiplyFrac(a.reciprocal().multiplyFrac(new Fraction(1,4)))).addFrac(d.square().multiplyFrac(b.reciprocal().multiplyFrac(new Fraction(1,4))));
    const ax1 = h.multiplyFrac(a.reciprocal());
    const ax2 = h.multiplyFrac(b.reciprocal());
    const cx = c.multiplyFrac(a.reciprocal().multiplyFrac(new Fraction(1,2)));
    const cy = d.multiplyFrac(b.reciprocal().multiplyFrac(new Fraction(1,2)));
    var out = "ELLIPSE <br>";
    out += "Center: ("+cx.toHTML()+", "+cy.toHTML()+")<br>";
    if(ax1.greaterThan(ax2)){
        out += "Major Axis Length: " + ax1.multiplyNum(2).toHTML() + "<br>";
        out += "Minor Axis Length: " + ax2.multiplyNum(2).toHTML() + "<br>";
        out += "Focii: ( &#8730;("+(h.square().multiplyFrac(a.reciprocal().square()).subtractFrac(h.square().multiplyFrac(b.reciprocal().square()))).toHTML()+") &plusmn; "+cx.toHTML()+", "+cy.toHTML()+")";
    }else{
        out += "Major Axis Length: " + ax1.multiplyNum(2).toHTML() + "<br>";
        out += "Minor Axis Length: " + ax2.multiplyNum(2).toHTML() + "<br>";
        out += "Focii: ( "+cx.toHTML()+", &#8730;("+(h.square().multiplyFrac(a.reciprocal().square()).subtractFrac(h.square().multiplyFrac(b.reciprocal().square()))).toHTML()+") &plusmn; "+cy.toHTML()+")";
    }
    return out;
}

function hyperbola(a, b, c, d, e){
    const h = e.invert().addFrac(c.square().multiplyFrac(a.reciprocal().multiplyFrac(new Fraction(1,4)))).addFrac(d.square().multiplyFrac(b.reciprocal().multiplyFrac(new Fraction(1,4))));
    const ax1 = h.multiplyFrac(a.reciprocal());
    const ax2 = h.multiplyFrac(b.reciprocal());
    const cx = c.multiplyFrac(a.reciprocal().multiplyFrac(new Fraction(1,2)));
    const cy = d.multiplyFrac(b.reciprocal().multiplyFrac(new Fraction(1,2)));
    var out = "HYPERBOLA <br>";
    out += "Center: ("+cx.toHTML()+", "+cy.toHTML()+")<br>";
    if(ax1.greaterThan(ax2)){
        out += "Major Axis Length: " + ax1.multiplyNum(2).toHTML() + "<br>";
        out += "Minor Axis Length: " + ax2.multiplyNum(2).toHTML() + "<br>";
        out += "Focii: ( &#8730;("+(h.square().multiplyFrac(a.reciprocal().square()).addFrac(h.square().multiplyFrac(b.reciprocal().square()))).toHTML()+") &plusmn; "+cx.toHTML()+", "+cy.toHTML()+")";
    }else{
        out += "Major Axis Length: " + ax1.multiplyNum(2).toHTML() + "<br>";
        out += "Minor Axis Length: " + ax2.multiplyNum(2).toHTML() + "<br>";
        out += "Focii: ( "+cx.toHTML()+", &#8730;("+(h.square().multiplyFrac(a.reciprocal().square()).addFrac(h.square().multiplyFrac(b.reciprocal().square()))).toHTML()+") &plusmn; "+cy.toHTML()+")";
    }
    return out;
}