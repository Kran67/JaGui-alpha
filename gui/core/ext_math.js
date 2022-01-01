(function() {
/******************************************************************************/
/*                                                                            */
/* math.js cette partie définit les fonctions supplémentaires de l'objet Math */
/*                                                                            */
/******************************************************************************/
$j.intCeiling=function(value,precision) { 
  if (typeof value!==_const.NUMBER) value=0;
  if (typeof precision!==_const.NUMBER) precision=1;
  return $j.ceil(value/precision)*precision;
};
$j.intFloor=function(value,precision) {
  if (typeof value!==_const.NUMBER) value=0;
  if (typeof precision!==_const.NUMBER) precision=1;
  return $j.floor(value/precision)*precision;
};
$j.intRound=function(value,precision) {
  if (typeof value!==_const.NUMBER) value=0;
  if (typeof precision!==_const.NUMBER) precision=1;
  return $j.round(value/precision)*precision;
};
$j.sqr=function(value) {
  if (typeof value!==_const.NUMBER) return;
  return $j.abs(value)*Math.abs(value);
};
$j.trunc=function(value) {
  if (typeof value!==_const.NUMBER) return;
  return value|0;
};
$j.frac=function(value) {
  if (typeof value!==_const.NUMBER) return;
  return (+(value)-(~~value));
};
$j.RSqrt=function(value) {
  if (typeof value!==_const.NUMBER) return;
  var r=$j.abs(value);
  if (r>0) return 1/$j.sqrt(r);
  else return 1;
};
$j.round=function(value,decimal) {
  var d;
  if (typeof value!==_const.NUMBER) return;
  if (typeof decimal!==_const.NUMBER) d=0;
  if (decimal!==undefined) {
    d=$j.pow(10,decimal);
    return $j.round(value*d)/d;
  } else return value=~~(0.5+value);
};
$j.floor=function(value) {
  if (typeof value!==_const.NUMBER) return;
  return value<<0;
};
$j.mod=function(value,value1) {
  if (typeof value!==_const.NUMBER) return;
  if (typeof value1!==_const.NUMBER) return;
  return value&(value1-1);
};
$j.maxFloat=function(value,value1) {
  if (typeof value!==_const.NUMBER) return;
  if (typeof value1!==_const.NUMBER) return;
  if (value>value1) return value;
  else return value1;
};
$j.sinCos=function(value) {
  if (typeof value!==_const.NUMBER) return;
  var s=$j.sin(value),c=$j.cos(value);
  return { sin:s,cos:c };
};
$j.mulDiv=function(number,numerator,denominator) {
  return ~~((number*numerator)/denominator);
};
$j.isZero=function(value,epsilon) {
  if (epsilon===undefined) epsilon=1E-19*1000;
  return $j.abs(value)<=epsilon;
};
$j.isUndefined=function(obj){  
  return obj===undefined;
};
$j.decimalPart=function(value) {
  return ~~value-value;
};
$j.isNumber=function(num) { return parseFloat(num).toString() == num; };

//aliases
$j.pow=Math.pow;
$j.cos=Math.cos;
$j.ceil=Math.ceil;
$j.max=Math.max;
$j.min=Math.min;
$j.random=Math.random;
$j.sqrt=Math.sqrt;
$j.E=Math.E;
$j.exp=Math.exp;
$j.LN2=Math.LN2;
$j.LN10=Math.LN10;
$j.log=Math.log;
$j.LOG2E=Math.LOG2E;
$j.SQRT_2=Math.SQRT1_2;
$j.SQRT2=Math.SQRT2;
$j.sin=Math.sin;
$j.asin=Math.asin;
$j.cos=Math.cos;
$j.acos=Math.acos;
$j.tan=Math.tan;
$j.atan=Math.atan;
$j.atan2=Math.atan2;
$j.abs=Math.abs;
$j.floor=Math.floor;
})();