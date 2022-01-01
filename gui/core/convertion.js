(function() {
  //#region Convert
  $j.convert={
    //#region Methods
    enum2Str: function Convert_enum2Str(e,v){
      for (var prop in e)
        if (e[prop]===v) return prop;
    },
    rect2Str: function Convert_rect2Str(r) {
      if (!(r instanceof $j.classes.Rect)) return String.empty;
      return "left:"+r.left+" top:"+r.top+" right:"+r.right+" bottom:"+r.bottom+" width:"+r.width+" height:"+r.height;
    },
    str2Rect: function Convert_str2Rect(s) {
      if (!s) return null;
      if (typeof s!==_const.STRING) return null;
      if (!s.indexOf(",")) return null;
      var a=s.split(","),l,t,r,b;
      l=+a[0];
      t=+a[1];
      r=+a[2];
      b=+a[3];
      if (isNaN(l)) l=0;
      if (isNaN(t)) t=0;
      if (isNaN(r)) r=0;
      if (isNaN(b)) b=0;
      return new $j.classes.Rect(l,t,r,b);
    },
    str2Bound: function Convert_str2Bound(s,p) {
      if (!s) return null;
      if (typeof s!==_const.STRING) return null;
      if (!s.indexOf(",")) return null;
      var a=s.split(","),l,t,r,b;
      l=+a[0];
      t=+a[1];
      r=+a[2];
      b=+a[3];
      if (isNaN(l)) l=0;
      if (isNaN(t)) t=0;
      if (isNaN(r)) r=0;
      if (isNaN(b)) b=0;
      return new $j.classes.Bounds(new $j.classes.Rect(l,t,r,b),p);
    },
    point2Str: function Convert_point2Str(p) {
      if (!(p instanceof $j.classes.Point)) return String.empty;
      return "X:"+p.x+" Y:"+p.y;
    },
    str2Point: function Convert_str2Point(s) {
      if (typeof s!==_const.STRING) return null;
      if (!s.indexOf(",")) return null;
      var a=s.split(","),x,y;
      x=+a[0];
      y=+a[1];
      if (isNaN(x)) x=0;
      if (isNaN(y)) y=0;
      return $j.classes.point(x,y);
    },
    vector2Str: function Convert_vector2Str(a) {
      if (!(a instanceof $j.classes.Vector)) return String.empty;
      return "X:"+a.x+" Y:"+a.y+" Z:"+a.z;
    },
    matrix2Str: function Convert_matrix2Str(a) {
      if (!(a instanceof $j.classes.Matrix)) return String.empty;
      return "m11:"+a.m11+" m12:"+a.m12+" m13:"+a.m13+"\n"+
            "m21:"+a.m21+" m22:"+a.m22+" m23:"+a.m23+"\n"+
            "m31:"+a.m31+" m32:"+a.m32+" m33:"+a.m33;
    },
    intToStr: function Convert_intToStr(a) {
      if (typeof a!==_const.NUMBER) return String.empty;
      else return String(a);
    },
    floatToStr: function Convert_floatToStr(a) {
      if (typeof a!==_const.NUMBER) return String.empty;
      else return String(a);
    },
    floatToInt: function Convert_floatToInt(a) {
      return a|0;
    },
    boolToStr: function Convert_boolToStr(a) {
      if (typeof a===_const.BOOLEAN) {
        if (a) return "true";
        else return "false";
      } else return "false";
    },
    strToInt: function Convert_strToInt(a) {
      a=a|0;
      return a;
    },
    strToFloat: function Convert_strToFloat(a) {
      a=+a;
      if (typeof a!==_const.NUMBER) a=0;
      return a;
    },
    strToBool: function Convert_strToBool(a) {
      if ((typeof a===_const.STRING) && ((a.toLowerCase()==="true") || (a.toLowerCase()==="false"))) {
        if(a.toLowerCase()==="true")return true;
        else if(a.toLowerCase()==="false")return false;
        else return false;
      } else return false;
    },
    intToBool: function Convert_intToBool(a) {
      if (typeof a===_const.NUMBER) a=a|0;
      if (a>1) a=1;
      if (a===0)return false;
      if (a===1)return true;
    },
    deg2Rad: function Convert_deg2Rad(a) {
      if (typeof a!==_const.NUMBER) a=0;
      return (a*Math.PI)/180;
    },
    rad2Deg: function Convert_rad2Deg(a) { 
      if (typeof a!==_const.NUMBER) a=0;
      return (a*180)/Math.PI;
    },
    dec2Bin: function Convert_dec2Bin(a) { 
      a=a|0;
      return a.toString(2);
    },
    dec2Hex: function Convert_dec2Hex(a) {
      a=a|0;
      return a.toString(16);
    },
    dec2Oct: function Convert_dec2Oct(a) {
      a=a|0;
      return a.toString(8);
    },
    bin2Hex: function Convert_bin2Hex(a) {
      if (!(typeof a===_const.STRING)) return String.empty;
      return _conv.dec2Hex(parseInt(a,2));
    },
    bin2Dec: function Convert_bin2Dec(a) {
      if (!(typeof a===_const.STRING)) return String.empty;
      return parseInt(a,2);
    },
    bin2Oct: function Convert_bin2Oct(a) {
      if (!(typeof a===_const.STRING)) return String.empty;
      return parseInt(a,2).toString(8);
    },
    hex2Bin: function Convert_hex2Bin(a) {
      if (!(typeof a===_const.STRING)) return String.empty;
      return parseInt(a,16).toString(2);
    },
    hex2Dec: function Convert_hex2Dec(a) {
      if (!(typeof a===_const.STRING)) return String.empty;
      return parseInt(a,16);
    },
    hex2Oct: function Convert_hex2Oct(a) {
      if (!(typeof a===_const.STRING)) return String.empty;
      return parseInt(a,16).toString(8);
    },
    oct2Dec: function Convert_oct2Dec(a) {
      if (!(typeof a===_const.STRING)) return String.empty;
      return parseInt(a.toString(),8);
    },
    oct2Bin: function Convert_oct2Bin(a) {
      if (!(typeof a===_const.STRING)) return String.empty;
      return parseInt(a.toString(),8).toString(2);
    },
    oct2Hex: function Convert_oct2Hex(a) {
      if (!(typeof a===_const.STRING)) return String.empty;
      return parseInt(a.toString(),8).toString(16);
    },
    toByte: function Convert_toByte(value) {
      return value&0xFF;
    },
    toWord: function Convert_toWord(value) {
      return value&0xFFFF;
    },
    toLongWord: function Convert_toLongWord(value) {
      return value&0xFFFFFFFF;
    },
    toInt64: function Convert_toInt64(value) {
      return value&0xFFFFFFFFFFFFFFFF;
    },
    cssUnit: function Convert_cssUnit(value,from,to,base,dpi,decimals){
      //1em == 16px == 0.17in == 12pt == 1pc == 4.2mm == 0.42cm
      if (typeof value!==_const.NUMBER) value=1;
      if (base===undefined) base=10;
      if (dpi===undefined) dpi=72;
      if (decimals===undefined) decimals=0;
	    var units=from+"-"+to,result,formulas={
        "cm-em":value/0.42175176,
        "cm-in":value*0.39,
        "cm-mm":value*10,
        "cm-pc":value/0.42175176,
        "cm-pt":value*28.3464566929,
        "cm-%":value/base*100/2.54*dpi,
        "cm-px":value/2.54*dpi,
        "cm-rem":value/0.42175176,

        "em-cm":value*0.42175176,
        "em-in":value*0.166044,
        "em-mm":value/0.237106301584,
        "em-pc":value,
        "em-pt":value*11.955168,
        "em-%":value*100,
        "em-px":value*base,
        "em-rem":value,

        "in-cm":value*2.54,
        "in-em":value/0.166044,
        "in-mm":value*2.54*10,
        "in-pc":value/0.166044,
        "in-pt":value/0.014842519685,
        "in-%":value/base*100*dpi,
        "in-px":value*dpi,
        "in-rem":value/0.166044,

        "mm-cm":value/10,
        "mm-em":value*0.237106301584,
        "mm-in":value*0.39/10,
        "mm-pc":value/4.42175176,
        "mm-pt":value/0.352777777778,
        "mm-%":value/base*100/2.54*dpi/10,
        "mm-px":value/2.54*dpi/10,
        "mm-rem":value*0.237106301584,

        "pc-cm":value*0.42175176,
        "pc-em":value,
        "pc-in":value*0.166044,
        "pc-mm":value*4.42175176,
        "pc-pt":value/0.0836458341698,
        "pc-%":value*100,
        "pc-px":value*base,
        "pc-rem":value,

        "pt-cm":value/28.3464566929,
        "pt-em":value/11.955168,
        "pt-in":value*0.014842519685,
        "pt-mm":value*0.352777777778,
        "pt-pc":value*0.0836458341698,
        "pt-%":value/(base-4)*100,
        "pt-px":value*96/72,
        "pt-rem":value/11.955168,

        "%-cm":value*base/100*2.54/dpi,
        "%-em":value/100,
        "%-in":value*base/100/dpi,
        "%-mm":value*base/100*2.54/dpi*10,
        "%-pc":value/100,
        "%-pt":value*(base-4)/100,
        "%-px":value*base/100,
        "%-rem":value/100,

        "px-cm":value*2.54/dpi,
        "px-em":value/base,
        "px-in":value/dpi,
        "px-mm":value*2.54/dpi*10,
        "px-pc":value/base,
        "px-pt":value*72/96,
        "px-%":value/base*100,
        "px-rem":value/base,

        "rem-cm":value*0.42175176,
        "rem-em":value,
        "rem-in":value*0.166044,
        "rem-mm":value/0.237106301584,
        "rem-pc":value,
        "rem-pt":value*11.955168,
        "rem-%":value*100,
        "rem-px":value*base
      };
      result=formulas[units]||false;
      return (isNaN(result)?"N/A":$j.round(result,decimals)+to);
    },
    propertyToCssProperty: function Convert_propertyToCssProperty(animationObj,endValue) {
      if ($j.tools.isNull(endValue)) endValue=false;
      switch (animationObj.propertyName) {
        case "width":
        case "height":
        case "left":
        case "top":
        case "right":
        case "bottom":
          return $j.browser.getVendorPrefix(animationObj.propertyName)+animationObj.propertyName+":"+(endValue?animationObj.stopValue:animationObj.startValue)+$j.types.CSSUnits.PX+";";
          break;
        case "opacity":
          return $j.browser.getVendorPrefix(animationObj.propertyName)+animationObj.propertyName+":"+(endValue?animationObj.stopValue:animationObj.startValue)+";";
          break;
        case "rotateAngle":
          return $j.browser.getVendorPrefix("transform")+"transform:rotate("+(endValue?animationObj.stopValue:animationObj.startValue)+"deg);";
          break;
        case "background.color":
          return $j.browser.getVendorPrefix("background-color")+"background-color:"+(endValue?animationObj.stopValue.toARGBString():animationObj.startValue.toARGBString())+";";
          break;
        case "bitmap":
          return "opacity:"+(endValue?1:0)+";";
          break;
        case "rotateCenter":
          return "";
          break;
        case "scale.x":
          return "transform:scaleX";
          break;
        case "scale.y":
          return "transform:scaleY";
          break;
        case "borderWidth":
          return "";
          break;
        case "bordersRadius":
          return "";
          break;
        case "shadowColor":
          return "";
          break;
        case "shadowOffsetX":
          return "";
          break;
        case "shadowOffsetY":
          return "";
          break;
        case "shadowBlur":
          return "";
          break;
        case "borderDash":
          return "";
          break;
        case "outline":
          return "";
          break;
        case "margin":
          return "";
          break;
        case "padding":
          return "";
          break;
      }
    },
    cssGradient2Gradient: function Convert_cssGradient2Gradient(cssGradient) {
      var gradient=new $j.classes.Gradient(window);
      if (cssGradient.indexOf("gradient")!==-1){
        cssGradient=cssGradient.replace("-o-",String.empty);
        cssGradient=cssGradient.replace("-moz-",String.empty);
        cssGradient=cssGradient.replace("-ms-",String.empty);
        cssGradient=cssGradient.replace("-webkit-",String.empty);
        if (cssGradient.indexOf("linear")!==-1){ // linear gradient
          gradient.style=$j.types.gradientStyles.LINEAR;
          cssGradient=cssGradient.replace("linear-gradient(",String.empty);
          cssGradient=cssGradient.replace("%)",$j.types.CSSUnits.PO);
          cssGradient=$j.tools.text.replace(cssGradient,"transparent","rgba(0,0,0,0)");
          cssGradient=$j.tools.text.replace(cssGradient,", rgb","|rgb");
          var gradValues=cssGradient.split("|");
          gradient.startPosition.assign(new $j.classes.Point());
          if (gradValues[0].indexOf("top")!==-1) gradient.stopPosition=new $j.classes.Point(0,1);
          else if (gradValues[0].indexOf("left")!==-1) gradient.stopPosition.assign(new $j.classes.Point(1,0));
          gradient.items.clear();
          for (var i=1,l=gradValues.length;i<l;i++){
            var colorOffset=gradValues[i].replace(") ",")|"),color=colorOffset.split("|")[0],offset=+(colorOffset.split("|")[1].replace($j.types.CSSUnits.PO,String.empty));
            gradient.items.push(new $j.classes.GradientPoint(offset/100,_colors.parse(color)));
          }
        }
      }
      return gradient;
    }
    //#endregion Methods
  };
  //#endregion Convert
  //#region Alias
  window._conv=$j.convert;
  //#endregion
})();

// Optimisation
/*for (var i=0;i<10000;i++) -> var i=10000; while(i--) ...

x=x*2; -> x=x << 1;
x=x*64; -> x=x << 6;

x=x / 2; -> x=x >> 1;
x=x / 64; -> x=x >> 6;

x=int(1.232) -> x=1.232 >> 0;

i++ -> i=-~i;
i-- -> i=~-i;

i=-i; -> i=~i+1;

x=131 % 4; -> x=131 & (4 - 1);

(i % 2)==0; -> (i & 1) 
*/