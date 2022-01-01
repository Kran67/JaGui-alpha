(function(){
//#region CSS
  $j.CSS={
    //#region Methods
    addClass: function CSS_addClass(o,c){
      var cssClass=[];
      if ($j.tools.isNull(o)||$j.tools.isNull(c)) return;
      if (o.className.contains(String.SPACE)) cssClass=o.className.split(String.SPACE);
      else if (o.className.trim()!==String.empty) cssClass.add(o.className);
      if (cssClass.indexOf(c)===-1) cssClass.add(c);
      o.className=cssClass.join(String.SPACE);
    },
    removeClass: function CSS_removeClass(o,c){
      var cssClass=[];
      if ($j.tools.isNull(o)||$j.tools.isNull(c)) return;
      if (o.className.contains(String.SPACE)) cssClass=o.className.split(String.SPACE);
      else if (o.className.trim()!==String.empty) cssClass.push(o.className);
      if (!$j.tools.isNull(cssClass)){
        cssClass.remove(c);
        o.className=cssClass.join(String.SPACE);
      }
    },
    getStyles: function CSS_getStyles(cssClass,complement){
      var classes,classTitle=cssClass.split("_")[0].replace(".",""),isCSSRule=false;
      if ((cssClass==="*")||!cssClass.contains("_")) classes=document.styleSheets[0].rules||document.styleSheets[0].cssRules;
      else {
        if (cssClass!=="*"){
          if (!cssClass.startsWith(".")) cssClass="."+cssClass;
        }
        for (var i=0,l=document.styleSheets.length;i<l;i++)
        {
          if (document.styleSheets[i].title===classTitle){
            classes=document.styleSheets[i].rules||document.styleSheets[i].cssRules;
            break;
          }
        }
      }
      var className=cssClass+complement,styles=[];
      for(var x=classes.length-1;x>0;x--){
        if ($j.browser.opera) isCSSRule=(classes[x].className==="CSSRule");
        else isCSSRule=(classes[x] instanceof CSSStyleRule);
        if (!$j.tools.isNull(isCSSRule)){
          if(classes[x].selectorText.contains(className)) styles.push(classes[x].style);
        }
      }
      return styles;
    },
    getBackground: function CSS_getBackground(className,object){
      var /*gradientRect=object.path.bounds(),*/css=$j.css[className];
      if ($j.tools.isNull(css)) return;
      var backColor=css.backgroundColor;
      if (typeof backColor===_const.STRING){
        if (backColor.toLowerCase()==="transparent") backColor=null;
      }
      if (!$j.tools.isNull(backColor)){
        //if(hovered){
        //  object.style.hovered.background.style=$j.types.brushStyles.SOLID;
        //  object.style.hovered.background.color.assign(_colors.parse(css.backgroundColor));
        //} else if (pressed){
        //  object.style.pressed.background.style=$j.types.brushStyles.SOLID;
        //  object.style.pressed.background.color.assign(_colors.parse(css.backgroundColor));
        //} else {
          if (object instanceof $j.classes.Control){
            object.style.normal.background.style=$j.types.brushStyles.SOLID;
            object.style.normal.background.color.assign(_colors.parse(css.backgroundColor));
          } else if (object instanceof $j.classes.DrawingInfo) {
            object.background.style=$j.types.brushStyles.SOLID;
            object.background.color.assign(_colors.parse(css.backgroundColor));
          }
          //if (firstPass){
          //  if (!hovered&&!pressed){
          //    if(object.style.hovered){
          //      object.style.hovered.background.style=$j.types.brushStyles.SOLID;
          //      object.style.hovered.background.color.assign(_colors.parse(css.backgroundColor));
          //    }
          //    if (object.style.pressed){
          //      object.style.pressed.background.style=$j.types.brushStyles.SOLID;
          //      object.style.pressed.background.color.assign(_colors.parse(css.backgroundColor));
          //    }
          //  }
          //}
        //}
      } else if (!$j.tools.isNull(css.backgroundImage)){
        if (css.backgroundImage.indexOf("gradient")!==-1){
          var gradient=css.backgroundImage;
          gradient=gradient.replace("-o-",String.empty);
          gradient=gradient.replace("-moz-",String.empty);
          gradient=gradient.replace("-ms-",String.empty);
          gradient=gradient.replace("-webkit-",String.empty);
          //if(hovered) object.style.hovered.background.style=$j.types.brushStyles.GRADIENT;
          //else if (pressed) object.style.pressed.background.style=$j.types.brushStyles.GRADIENT;
          //else {
            if (object instanceof $j.classes.DrawingInfo) object.background.style=$j.types.brushStyles.GRADIENT;
            else object.style.normal.background.style=$j.types.brushStyles.GRADIENT;
            //if (firstPass){
            //  if(!hovered&&!pressed){
            //    if (object.style.hovered) object.style.hovered.background.style=$j.types.brushStyles.GRADIENT;
            //    if (object.style.pressed) object.style.pressed.background.style=$j.types.brushStyles.GRADIENT;
            //  }
            //}
          //}
          if (gradient.indexOf("linear")!==-1){ // linear gradient
            //if(hovered) object.style.hovered.background.gradient.style=$j.types.gradientStyles.LINEAR;
            //else if (pressed) object.style.pressed.background.gradient.style=$j.types.gradientStyles.LINEAR;
            //else {
              if (object instanceof $j.classes.DrawingInfo)object.background.gradient.style=$j.types.gradientStyles.LINEAR;
              else object.style.normal.background.gradient.style=$j.types.gradientStyles.LINEAR;
              //if (firstPass){
              //  if(!hovered&&!pressed){
              //    if (object.style.hovered) object.style.hovered.background.gradient.style=$j.types.gradientStyles.LINEAR;
              //    if (object.style.pressed) object.style.pressed.background.gradient.style=$j.types.gradientStyles.LINEAR;
              //  }
              //}
            //}
            gradient=gradient.replace("linear-gradient(",String.empty);
            gradient=gradient.replace("%)",$j.types.CSSUnits.PO);
            gradient=$j.tools.text.replace(gradient,"transparent","rgba(0,0,0,0)");
            gradient=$j.tools.text.replace(gradient,", rgb","|rgb");
            var gradValues=gradient.split("|");
            //if(hovered) object.style.hovered.background.gradient.startPosition.assign($j.classes.Point.create());
            //else if (pressed) object.style.pressed.background.gradient.startPosition.assign($j.classes.Point.create());
            //else {
              if (object instanceof $j.classes.DrawingInfo)object.background.gradient.startPosition.assign(new $j.classes.Point());
              else object.style.normal.background.gradient.startPosition.assign(new $j.classes.Point());
              //if (firstPass){
              //  if(!hovered&&!pressed){
              //    if (object.style.hovered) object.style.hovered.background.gradient.startPosition.assign($j.classes.Point.create());
              //    if (object.style.pressed) object.style.pressed.background.gradient.startPosition.assign($j.classes.Point.create());
              //  }
              //}
            //}
            if (gradValues[0].indexOf("top")!==-1){
              //if(hovered) object.style.hovered.background.gradient.stopPosition.assign($j.classes.Point.create(0,1));
              //else if(pressed) object.style.pressed.background.gradient.stopPosition.assign($j.classes.Point.create(0,1));
              //else {
                if (object instanceof $j.classes.DrawingInfo)object.background.gradient.stopPosition=new $j.classes.Point(0,1);
                else object.style.normal.background.gradient.stopPosition=new $j.classes.Point(0,1);
                //if (firstPass){
                //  if(!hovered&&!pressed){
                //    if (object.style.hovered) object.style.hovered.background.gradient.stopPosition.assign($j.classes.Point.create(0,1));
                //    if (object.style.pressed) object.style.pressed.background.gradient.stopPosition.assign($j.classes.Point.create(0,1));
                //  }
                //}
              //}
            } else if (gradValues[0].indexOf("left")!==-1){
              //if(hovered) object.style.hovered.background.gradient.stopPosition.assign($j.classes.Point.create(1,0));
              //else if(pressed) object.style.pressed.background.gradient.stopPosition.assign($j.classes.Point.create(1,0));
              //else {
                if (object instanceof $j.classes.DrawingInfo)object.background.gradient.stopPosition.assign(new $j.classes.Point(1,0));
                else object.style.normal.background.gradient.stopPosition.assign(new $j.classes.Point(1,0));
                //if (firstPass){
                //  if(!hovered&&!pressed){
                //    if (object.style.hovered) object.style.hovered.background.gradient.stopPosition.assign($j.classes.Point.create(1,0));
                //    if (object.style.pressed) object.style.pressed.background.gradient.stopPosition.assign($j.classes.Point.create(1,0));
                //  }
                //}
              //}
            }
            //if(hovered) object.style.hovered.background.gradient.items.length=0;
            //else if(pressed) object.style.pressed.background.gradient.items.length=0;
            //else {
              if (object instanceof $j.classes.DrawingInfo) object.background.gradient.items.clear();
              else object.style.normal.background.gradient.items.clear();
              //if (firstPass){
              //  if(!hovered&&!pressed){
              //    if (object.style.hovered) object.style.hovered.background.gradient.items.length=0;
              //    if (object.style.pressed) object.style.pressed.background.gradient.items.length=0;
              //  }
              //}
            //}
            for (var i=1,l=gradValues.length;i<l;i++){
              var colorOffset=gradValues[i].replace(") ",")|"),color=colorOffset.split("|")[0],offset=+(colorOffset.split("|")[1].replace($j.types.CSSUnits.PO,String.empty));
              //if(hovered) object.style.hovered.background.gradient.items.push($j.classes.GradientPoint.create(offset/100,_colors.parse(color)));
              //else if(pressed) object.style.pressed.background.gradient.items.push($j.classes.GradientPoint.create(offset/100,_colors.parse(color)));
              //else {
                if (object instanceof $j.classes.DrawingInfo)object.background.gradient.items.push(new $j.classes.GradientPoint(offset/100,_colors.parse(color)));
                else object.style.normal.background.gradient.items.push(new $j.classes.GradientPoint(offset/100,_colors.parse(color)));
                //if (firstPass){
                //  if(!hovered&&!pressed){
                //    if (object.style.hovered) object.style.hovered.background.gradient.items.push($j.classes.GradientPoint.create(offset/100,_colors.parse(color)));
                //    if (object.style.pressed) object.style.pressed.background.gradient.items.push($j.classes.GradientPoint.create(offset/100,_colors.parse(color)));
                //  }
                //}
              //}
            }
          } else if (gradient.indexOf("radial")!==-1){ // radial gradient
            //if(hovered) object.style.hovered.background.gradient.setStyle($j.types.gradientStyles.RADIAL);
            //else if(pressed) object.style.pressed.background.gradient.setStyle($j.types.gradientStyles.RADIAL);
            //else {
              if (object instanceof $j.classes.DrawingInfo) object.background.gradient.style=$j.types.gradientStyles.RADIAL;
              else object.style.normal.background.gradient.style=$j.types.gradientStyles.RADIAL;
              //if (firstPass){
              //  if(!hovered&&!pressed){
              //    if (object.style.hovered) object.style.hovered.background.gradient.setStyle($j.types.gradientStyles.RADIAL);
              //    if (object.style.pressed) object.style.pressed.background.gradient.setStyle($j.types.gradientStyles.RADIAL);
              //  }
              //}
            //}
          }
        } else if (css.backgroundImage.indexOf("image/svg+xml")!==-1){ // svg gradient
        } else if (css.backgroundImage.indexOf("image/")!==-1){ // image base64
          var back,i;
          if (object instanceof $j.classes.DrawingInfo) back=object.background;
          else back=object.style.normal.background;
          back.style=$j.types.brushStyles.BITMAP;
          back.bitmapRepeatMode=$j.types.bitmapRepeatModes.REPEAT;
          back.bitmap.src=$j.tools.uri.clean(css.backgroundImage);
          if (!$j.tools.isNull(css.backgroundRepeat)) back.bitmapRepeatMode=css.backgroundRepeat;
        }
      }
    },
    getBorderRadius: function CSS_getBorderRadius(className){
      var css=$j.css[className],ret,radius;
      if ($j.tools.isNull(css)) return;
      if(!$j.tools.isNull(css.borderRadius)){
        if(css.borderRadius!==String.empty){
          if (css.borderRadius.contains("/")) {
          } else {
          
          }
          //ret=[0,0,0,0];
          //if(css.borderTopLeftRadius) ret[0]=+css.borderTopLeftRadius.replace("px",String.empty).replace("%",String.empty);
          //if(css.borderTopRightRadius) ret[1]=+css.borderTopRightRadius.replace("px",String.empty).replace("%",String.empty);
          //if(css.borderBottomLeftRadius) ret[2]=+css.borderBottomLeftRadius.replace("px",String.empty).replace("%",String.empty);
          //if(css.borderBottomRightRadius) ret[3]=+css.borderBottomRightRadius.replace("px",String.empty).replace("%",String.empty);
          //return ret;
        }
      } else if(!$j.tools.isNull(css.borderTopLeftRadius)||!$j.tools.isNull(css.borderTopRightRadius)||!$j.tools.isNull(css.borderBottomLeftRadius)||!$j.tools.isNull(css.borderBottomRightRadius)){
        ret=[[0,0],[0,0],[0,0],[0,0]];
        if(!$j.tools.isNull(css.borderTopLeftRadius)&&css.borderTopLeftRadius!==String.empty) {
          if (css.borderTopLeftRadius.contains(String.SPACE)) {
            radius=css.borderTopLeftRadius.split(String.SPACE);
            ret[0][0]=+radius[0].replace($j.types.CSSUnits.PX,String.empty).replace($j.types.CSSUnits.PO,String.empty);
            ret[0][1]=+radius[1].replace($j.types.CSSUnits.PX,String.empty).replace($j.types.CSSUnits.PO,String.empty);
          } else {
            radius=+css.borderTopLeftRadius.replace($j.types.CSSUnits.PX,String.empty).replace($j.types.CSSUnits.PO,String.empty);
            ret[0][0]=radius;
            ret[0][1]=radius;
          }
        }
        if(!$j.tools.isNull(css.borderTopRightRadius)&&css.borderTopRightRadius!==String.empty) {
          if (css.borderTopRightRadius.contains(String.SPACE)) {
            radius=css.borderTopRightRadius.split(String.SPACE);
            ret[1][0]=+radius[0].replace($j.types.CSSUnits.PX,String.empty).replace($j.types.CSSUnits.PO,String.empty);
            ret[1][1]=+radius[1].replace($j.types.CSSUnits.PX,String.empty).replace($j.types.CSSUnits.PO,String.empty);
          } else {
            radius=+css.borderTopRightRadius.replace($j.types.CSSUnits.PX,String.empty).replace($j.types.CSSUnits.PO,String.empty);
            ret[1][0]=radius;
            ret[1][1]=radius;
          }
        }
        if(!$j.tools.isNull(css.borderBottomLeftRadius)&&css.borderBottomLeftRadius!==String.empty) {
          if (css.borderBottomLeftRadius.contains(String.SPACE)) {
            radius=css.borderBottomLeftRadius.split(String.SPACE);
            ret[2][0]=+radius[0].replace($j.types.CSSUnits.PX,String.empty).replace($j.types.CSSUnits.PO,String.empty);
            ret[2][1]=+radius[1].replace($j.types.CSSUnits.PX,String.empty).replace($j.types.CSSUnits.PO,String.empty);
          } else {
            radius=+css.borderBottomLeftRadius.replace($j.types.CSSUnits.PX,String.empty).replace($j.types.CSSUnits.PO,String.empty);
            ret[2][0]=radius;
            ret[2][1]=radius;
          }
        }
        if(!$j.tools.isNull(css.borderBottomRightRadius)&&css.borderBottomRightRadius!==String.empty) {
          if (css.borderBottomRightRadius.contains(String.SPACE)) {
            radius=css.borderBottomRightRadius.split(String.SPACE);
            ret[3][0]=+radius[0].replace($j.types.CSSUnits.PX,String.empty).replace($j.types.CSSUnits.PO,String.empty);
            ret[3][1]=+radius[1].replace($j.types.CSSUnits.PX,String.empty).replace($j.types.CSSUnits.PO,String.empty);
          } else {
            radius=+css.borderBottomRightRadius.replace($j.types.CSSUnits.PX,String.empty).replace($j.types.CSSUnits.PO,String.empty);
            ret[3][0]=radius;
            ret[3][1]=radius;
          }
        }
        //ret=[0,0,0,0];
        //if(css.borderTopLeftRadius) ret[0]=+css.borderTopLeftRadius.replace("px",String.empty).replace("%",String.empty);
        //if(css.borderTopRightRadius) ret[1]=+css.borderTopRightRadius.replace("px",String.empty).replace("%",String.empty);
        //if(css.borderBottomLeftRadius) ret[2]=+css.borderBottomLeftRadius.replace("px",String.empty).replace("%",String.empty);
        //if(css.borderBottomRightRadius) ret[3]=+css.borderBottomRightRadius.replace("px",String.empty).replace("%",String.empty);
        return ret;
      }
    },
    getBorder: function CSS_getBorder(className,object){
      var css=$j.css[className],c,w=0;;
      if ($j.tools.isNull(css)) return;
      if(!$j.tools.isNull(css.borderLeftColor)||!$j.tools.isNull(css.borderTopColor)||!$j.tools.isNull(css.borderRightColor)||!$j.tools.isNull(css.borderBottomColor)){
        if(!$j.tools.isNull(css.borderLeftColor)) c=css.borderLeftColor;
        else if(!$j.tools.isNull(css.borderTopColor)) c=css.borderTopColor;
        else if(!$j.tools.isNull(css.borderRightColor)) c=css.borderRightColor;
        else if(!$j.tools.isNull(css.borderBottomColor)) c=css.borderBottomColor;
        //if (hovered) {
        //  object.style.hovered.border.color.assign(_colors.parse(c));
        //  object.style.hovered.border.style=$j.types.brushStyles.SOLID;
        //} else if (pressed) {
        //  object.style.pressed.border.color.assign(_colors.parse(c));
        //  object.style.pressed.border.style=$j.types.brushStyles.SOLID;
        //} else {
          //if (firstPass){
          //  if(object.style.hovered) {
          //    object.style.hovered.border.color.assign(_colors.parse(c));
          //    object.style.hovered.border.style=$j.types.brushStyles.SOLID;
          //  }
          //  if(object.style.pressed) {
          //    object.style.pressed.border.color.assign(_colors.parse(c));
          //    object.style.pressed.border.style=$j.types.brushStyles.SOLID;
          //  }
          //}
          if (!(object instanceof $j.classes.DrawingInfo)) object=object.style.normal;
          object.border.color.assign(_colors.parse(c));
          object.border.style=$j.types.brushStyles.SOLID;
        //}
      }
      if(!$j.tools.isNull(css.borderLeftWidth)||!$j.tools.isNull(css.borderTopWidth)||!$j.tools.isNull(css.borderRightWidth)||!$j.tools.isNull(css.borderBottomWidth)){
        if(!$j.tools.isNull(css.borderLeftWidth)) w=+css.borderLeftWidth.replace($j.types.CSSUnits.PX,String.empty);
        else if(!$j.tools.isNull(css.borderTopWidth)) w=+css.borderTopWidth.replace($j.types.CSSUnits.PX,String.empty);
        else if(!$j.tools.isNull(css.borderRightWidth)) w=+css.borderRightWidth.replace($j.types.CSSUnits.PX,String.empty);
        else if(!$j.tools.isNull(css.borderBottomWidth)) w=+css.borderBottomWidth.replace($j.types.CSSUnits.PX,String.empty);
        object.sides=$j.types.sides.NONE;
        if(!$j.tools.isNull(css.borderLeftWidth))object.sides|=$j.types.sides.LEFT;
        if(!$j.tools.isNull(css.borderTopWidth))object.sides|=$j.types.sides.TOP;
        if(!$j.tools.isNull(css.borderRightWidth))object.sides|=$j.types.sides.RIGHT;
        if(!$j.tools.isNull(css.borderBottomWidth))object.sides|=$j.types.sides.BOTTOM;
        if (isNaN(w)) w=0;
        //if (hovered) object.style.hovered.borderWidth=w;
        //else if (pressed) object.style.pressed.borderWidth=w;
        //else {
          //if (firstPass){
          //  if (object.style.hovered) object.style.hovered.borderWidth=w;
          //  if (object.style.pressed) object.style.pressed.borderWidth=w;
          //}
          if (object instanceof $j.classes.ThemedControl)object.style.normal.borderWidth=w;
          else if (object instanceof $j.classes.DrawingInfo) object.borderWidth=w;
        //}
      }
    },
    getOutline: function CSS_getOutline(className,object){
      var css=$j.css[className],c,w=0;;
      if ($j.tools.isNull(css)) return;
      if(!$j.tools.isNull(css.outlineColor)){
        c=css.outlineColor;
        if (!(object instanceof $j.classes.DrawingInfo)) object=object.style.normal;
        object.outline.color.assign(_colors.parse(c));
      }
      if(!$j.tools.isNull(css.outlineWidth)){
        w=+css.outlineWidth.replace($j.types.CSSUnits.PX,String.empty);
        if (isNaN(w)) w=0;
        if (object instanceof $j.classes.ThemedControl)object.style.normal.outline.width=w;
        else if (object instanceof $j.classes.DrawingInfo) object.outline.width=w;
      }
    },
    getShadow: function CSS_getShadow(className,object){
      var css=$j.css[className];
      if ($j.tools.isNull(css)) return;
      if(!$j.tools.isNull(css.boxShadow)){
        if (css.boxShadow!==String.empty){
          var shadow=css.boxShadow.replace(/, /g,",").split(String.SPACE);
          //if (hovered){
          //  object.style.hovered.shadowOffsetX=+shadow[0].replace("px",String.empty);
          //  object.style.hovered.shadowOffsetY=+shadow[1].replace("px",String.empty);
          //  object.style.hovered.shadowBlur=+shadow[2].replace("px",String.empty);
          //  object.style.hovered.shadowColor.assign(_colors.parse(shadow[3]));
          //} else if (pressed){
          //  object.style.pressed.shadowOffsetX=+shadow[0].replace("px",String.empty);
          //  object.style.pressed.shadowOffsetY=+shadow[1].replace("px",String.empty);
          //  object.style.pressed.shadowBlur=+shadow[2].replace("px",String.empty);
          //  object.style.pressed.shadowColor.assign(_colors.parse(shadow[3]));
          //} else {
            object.shadowOffsetX=+shadow[0].replace($j.types.CSSUnits.PX,String.empty);
            object.shadowOffsetY=+shadow[1].replace($j.types.CSSUnits.PX,String.empty);
            object.shadowBlur=+shadow[2].replace($j.types.CSSUnits.PX,String.empty);
            object.shadowColor.assign(_colors.parse(shadow[3]));
            //if (firstPass){
            //  if (!hovered){
            //    if (object.style.hovered){
            //      object.style.hovered.shadowOffsetX=object.shadowOffsetX;
            //      object.style.hovered.shadowOffsetY=object.shadowOffsetY;
            //      object.style.hovered.shadowBlur=object.shadowBlur;
            //      object.style.hovered.shadowColor.assign(_colors.parse(shadow[3]));
            //    }
            //  }
            //  if (!pressed){
            //    if (object.style.pressed){
            //      object.style.pressed.shadowOffsetX=object.shadowOffsetX;
            //      object.style.pressed.shadowOffsetY=object.shadowOffsetY;
            //      object.style.pressed.shadowBlur=object.shadowBlur;
            //      object.style.pressed.shadowColor.assign(_colors.parse(shadow[3]));
            //    }
            //  }
            //}
          //}
        }
      }
    },
    getTextShadow: function CSS_getTextShadow(className,object){
      var css=$j.css[className];
      if ($j.tools.isNull(css)) return;
      if(!$j.tools.isNull(css.textShadow)){
        if (css.textShadow!==String.empty){
          var shadow=$j.tools.replace(css.textShadow,", ",",").split(String.SPACE);
          object.shadowOffsetX=+shadow[0].replace($j.types.CSSUnits.PX,String.empty);
          object.shadowOffsetY=+shadow[1].replace($j.types.CSSUnits.PX,String.empty);
          object.shadowBlur=+shadow[2].replace($j.types.CSSUnits.PX,String.empty);
          object.shadowColor.assign(_colors.parse(shadow[3]));
        }
        else {
          object.shadowOffsetX=0;
          object.shadowOffsetY=0;
          object.shadowBlur=0;
          object.shadowColor.assign(_colors.TRANSPARENT);
        }
      }
    },
    CSSBorderRadius2Canvas: function CSS_CSSBorderRadius2Canvas(className,object){
      // border radius
      var r=this.getBorderRadius(className),style;
      if (object instanceof $j.classes.ThemedControl)style=object.style.normal;
      else if (object instanceof $j.classes.DrawingInfo) style=object;
      if (!$j.tools.isNull(r)){
        //if (hovered){
        //  object.style.hovered.bordersRadius.topLeft.setValues(r[0][0],r[0][1]);
        //  object.style.hovered.bordersRadius.topRight.setValues(r[1][0],r[1][1]);
        //  object.style.hovered.bordersRadius.bottomLeft.setValues(r[2][0],r[2][1]);
        //  object.style.hovered.bordersRadius.bottomRight.setValues(r[3][0],r[3][1]);
        //} else if (pressed){
        //  object.style.pressed.bordersRadius.topLeft.setValues(r[0][0],r[0][1]);
        //  object.style.pressed.bordersRadius.topRight.setValues(r[1][0],r[1][1]);
        //  object.style.pressed.bordersRadius.bottomLeft.setValues(r[2][0],r[2][1]);
        //  object.style.pressed.bordersRadius.bottomRight.setValues(r[3][0],r[3][1]);
        //} else {
          style.bordersRadius.topLeft.setValues(r[0][0],r[0][1]);
          style.bordersRadius.topRight.setValues(r[1][0],r[1][1]);
          style.bordersRadius.bottomLeft.setValues(r[2][0],r[2][1]);
          style.bordersRadius.bottomRight.setValues(r[3][0],r[3][1]);
          //if (firstPass){
          //  if (!hovered){
          //    if (object.style.hovered){
          //      object.style.hovered.bordersRadius.topLeft.assign(style.bordersRadius.topLeft);
          //      object.style.hovered.bordersRadius.topRight.assign(style.bordersRadius.topRight);
          //      object.style.hovered.bordersRadius.bottomLeft.assign(style.bordersRadius.bottomLeft);
          //      object.style.hovered.bordersRadius.bottomRight.assign(style.bordersRadius.bottomRight);
          //    }
          //  }
          //  if (!pressed){
          //    if (object.style.pressed){
          //      object.style.pressed.bordersRadius.topLeft.assign(style.bordersRadius.topLeft);
          //      object.style.pressed.bordersRadius.topRight.assign(style.bordersRadius.topRight);
          //      object.style.pressed.bordersRadius.bottomLeft.assign(style.bordersRadius.bottomLeft);
          //      object.style.pressed.bordersRadius.bottomRight.assign(style.bordersRadius.bottomRight);
          //    }
          //  }
          //}
        //}
      }
    },
    getPadding: function CSS_getPadding(className,object){
      var css=$j.css[className];
      if ($j.tools.isNull(css)) return;
      if ($j.tools.isNull(object.padding)) return;
      if(!$j.tools.isNull(css.paddingLeft)) object.padding.rect.left=+css.paddingLeft.replace($j.types.CSSUnits.PX,String.empty);
      if(!$j.tools.isNull(css.paddingTop)) object.padding.rect.top=+css.paddingTop.replace($j.types.CSSUnits.PX,String.empty);
      if(!$j.tools.isNull(css.paddingRight)) object.padding.rect.right=+css.paddingRight.replace($j.types.CSSUnits.PX,String.empty);
      if(!$j.tools.isNull(css.paddingBottom)) object.padding.rect.bottom=+css.paddingBottom.replace($j.types.CSSUnits.PX,String.empty);
    },
    getMargins: function CSS_getMargins(className,object){
      var css=$j.css[className];
      if ($j.tools.isNull(css)) return;
      if ($j.tools.isNull(object.margin)) return;
      if(!$j.tools.isNull(css.marginLeft)) object.margin.rect.left=+css.marginLeft.replace($j.types.CSSUnits.PX,String.empty);
      if(!$j.tools.isNull(css.marginTop)) object.margin.rect.top=+css.marginTop.replace($j.types.CSSUnits.PX,String.empty);
      if(!$j.tools.isNull(css.marginRight)) object.margin.rect.right=+css.marginRight.replace($j.types.CSSUnits.PX,String.empty);
      if(!$j.tools.isNull(css.marginBottom)) object.margin.rect.bottom=+css.marginBottom.replace($j.types.CSSUnits.PX,String.empty);
    },
    getSize: function CSS_getSize(className,object){
      var css=$j.css[className],w=null,h=null,l=null,t=null,r=null,b=null,style;
      if (object instanceof $j.classes.ThemedControl)style=object.style.normal;
      else if (object instanceof $j.classes.DrawingInfo) style=object;
      if ($j.tools.isNull(css)) return;
      if (css.width&&css.width!==String.empty) w=~~css.width.replace($j.types.CSSUnits.PX,String.empty)+(style?style.borderWidth*2:0);
      if (css.height&&css.height!==String.empty) h=~~css.height.replace($j.types.CSSUnits.PX,String.empty)+(style?style.borderWidth*2:0);
      if (css.left&&css.left!==String.empty) l=~~css.left.replace($j.types.CSSUnits.PX,String.empty);
      if (css.top&&css.top!==String.empty) t=~~css.top.replace($j.types.CSSUnits.PX,String.empty);
      if (css.right&&css.right!==String.empty) r=~~css.right.replace($j.types.CSSUnits.PX,String.empty);
      if (css.bottom&&css.bottom!==String.empty) b=~~css.bottom.replace($j.types.CSSUnits.PX,String.empty);
      if (!$j.tools.isNull(w)) object.width=w;
      if (!$j.tools.isNull(h)) object.height=h;
      if (!$j.tools.isNull(l)) object.left=l;
      if (!$j.tools.isNull(t)) object.top=t;
      if (!$j.tools.isNull(r)) object.right=r;
      if (!$j.tools.isNull(b)) object.bottom=b;
      if (!$j.tools.isNull(css.position)) object.position=css.position;
    },
    getOpacity: function CSS_getOpacity(className,object){
      var css=$j.css[className];
      if ($j.tools.isNull(css)) return;
      if (!$j.tools.isNull(css.opacity)) object.opacity=+css.opacity;
    },
    getVisibility: function CSS_getVisibility(className,object){
      var css=$j.css[className];
      if ($j.tools.isNull(css)) return;
      if (!$j.tools.isNull(css.visibility)) {
      }
    },
    getDisplay: function CSS_getDisplay(className,object){
      var css=$j.css[className];
      if ($j.tools.isNull(css)) return;
      if (!$j.tools.isNull(css.display)) {
        if (css.display==="none") object.visible=false;
      }
    },
    CSS2Canvas: function CSS_CSS2Canvas(className,object){
      // border radius
      this.CSSBorderRadius2Canvas(className,object);
      // borders
      //this.getBorderColor(className,object);
      //this.getBorderWidth(className,object);
      this.getBorder(className,object);
      // shadow
      this.getShadow(className,object);
      // background
      this.getBackground(className,object);
      // outline
      this.getOutline(className,object);
      // padding
      this.getPadding(className,object);
      // margin
      this.getMargins(className,object);
      // size
      this.getSize(className,object);
      // opacity
      this.getOpacity(className,object);
      // content
      this.getDefaultText(className,object);
      // display
      this.getDisplay(className,object);
    },
    CSSFont2Canvas: function CSS_CSSFont2Canvas(className,font){
      var css=$j.css[className];
      if ($j.tools.isNull(css)) return;
      if (!$j.tools.isNull(css.fontFamily)) font.family=css.fontFamily.replace(/"/g,String.empty);
      if (!$j.tools.isNull(css.fontSize)) {
        if (css.fontSize.endsWith($j.types.CSSUnits.PO)||css.fontSize.endsWith($j.types.CSSUnits.REM)){
          font.size=parseFloat(css.fontSize);
          if (css.fontSize.endsWith($j.types.CSSUnits.PO)) font.sizeUnit=$j.types.CSSUnits.PO;
          else font.sizeUnit=$j.types.CSSUnits.REM;
        } else {
          font.size=parseFloat(css.fontSize);
          font.sizeUnit=css.fontSize.substr(css.fontSize.length-2,2).toLowerCase();
        }
      }
      if (!$j.tools.isNull(css.textDecoration)){
        if (css.textDecoration==="line-through") font.strikeout=true;
        if (css.textDecoration==="underline") font.underline=true;
      }
      if (!$j.tools.isNull(css.color)) {
        font.brush.color.assign(_colors.parse(css.color));
        font.brush.style=$j.types.brushStyles.SOLID;
      }
    },
    getDefaultText: function CSS_getDefaultText(className,object){
      var css=$j.css[className];
      if ($j.tools.isNull(css)) return;
      if (!$j.tools.isNull(css.content)) {
        if (!$j.tools.isNull(object.caption)) object.caption=css.content.replace(/"/g,String.empty);
        else if (!$j.tools.isNull(object.content)) object.content=css.content.replace(/"/g,String.empty);
      }
      if (!$j.tools.isNull(object.colorContent)) {
        object.colorContent=css.color;
      }
    },
    getPath: function CSS_getPath(css){
      var result={pathStr:null,fill:null,stroke:null};
      if (!$j.tools.isNull(css.backgroundImage)){
        if (css.backgroundImage.contains("base64,")){
          var svg=css.backgroundImage.split(",")[1];
          svg=svg.substring(0,svg.length-2);
          svg=atob(svg);
          if (svg.contains("path")){
            var xml=new DOMParser();
            var doc=xml.parseFromString(svg,'text/xml');
            if (doc.getElementsByTagName("path")[0]){
              result.pathStr=doc.getElementsByTagName("path")[0].getAttribute("d");
              result.fill=doc.getElementsByTagName("path")[0].getAttribute("fill");
              result.stroke=doc.getElementsByTagName("path")[0].getAttribute("stroke");
            }
          }
          svg=null;
        }
      }
      return result;
    },
    generateCSSBorder: function CSS_generateCSSBorder(o){
      var b,borderStyle="solid";
      if (o.stroke.style===$j.brushStyle.NONE) b="none";
      else if (o.stroke.style===$j.brushStyle.SOLID) b=[o.strokeThickness,"px ",borderStyle,String.SPACE,o.stroke.color.toARGBString()].join(String.empty);
      else if (o.stroke.style===$j.brushStyle.GRADIENT){
        // NOT SUPPORTED BY ANY BROWSER
      } else if (o.stroke.style===$j.brushStyle.BITMAP){
        // récupération des datas du canvas
        // ONLY SUPPORTED BY CHROME (border-image) & FIREFOX 15 (-moz-border-image)
      }
      o.oDom.style.border=b;
      if (!$j.tools.isNull(o.radius)){
        // AT THE MOMENT ONLY BORDER RADIUS ARE APPLIED
        o.oDom.style.borderRadius=o.radius+$j.types.CSSUnits.PX;
      }
    },
    generateCSSBackground: function CSS_generateCSSBackground(o){
      var i;
      if (o.fill.style===$j.brushStyle.NONE){
        o.oDom.style.backgroundImage="none";
        o.oDom.style.backgroundColor="none";
      }
      else if (o.fill.style===$j.brushStyle.SOLID){
        o.oDom.style.backgroundColor=o.fill.color.toARGBString();
        o.oDom.style.backgroundImage="none";
      } else if (o.fill.style===$j.brushStyle.GRADIENT){
        // TODO : à voir pour la direction du dégradé
        var colorstops=o.fill.gradient.items,b;
        b="linear-gradient(top, ";
        for (i=0,l=colorstops.length;i<l;i++){
          if (i>0) b+=", ";
          b+=colorstops[i].color.toARGBString()+String.SPACE+(colorstops[i].offset*100)+$j.types.CSSUnits.PO;
        }
        b+=")";
        if (!$j.tools.isNull(o.oDom.style.linearGradient)){
        } else if ($j.browser.webkit||$j.browser.chrome||$j.browser.safari) b="-webkit-"+b;
        else if ($j.browser.opera) b="-o-"+b;
        else if ($j.browser.ff) b="-moz-"+b;
        else if ($j.browser.ie){
          // convertion du dégradé en svg
          if ($j.browser.coreVersion===9){
            b="url(data:image/svg+xml;base64,";
            // TODO : à voir pour la direction du dégradé
            var svg='<?xml version="1.0" ?><svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1 1" preserveAspectRatio="none"><linearGradient id="grad" gradientUnits="userSpaceOnUse" x1="0%" y1="0%" x2="0%" y2="100%">';
            for (i=0,l=colorstops.length;i<l;i++){
              svg+='<stop offset="'+(colorstops[i].offset*100)+'%" stop-color="'+colorstops[i].color.toRGBHexString()+'" stop-opacity="'+colorstops[i].color.a+'"/>';
            }
            svg+='</linearGradient><rect x="0" y="0" width="1" height="1" fill="url(#grad)" /></svg>';
            b+=btoa(svg)+")";
          } else if ($j.browser.coreVersion>9){
            b="-ms-"+b;
          }
        }
        o.oDom.style.backgroundImage=b;
      } else if (o.fill.style===$j.brushStyle.BITMAP){
        // récupération des datas du canvas
        o.oDom.style.backgroundImage="url("+o.fill.bitmap.bitmap.canvas.toDataURL()+")";
        o.oDom.style.backgroundPosition="center center";
        o.oDom.style.backgroundRepeat="no-repeat";
      }
    },
    generateSVGFromPath: function CSS_generateSVGFromPath(o,p){
      var b="url(data:image/svg+xml;base64,",bounds=p.Bounds();
      var svg='<?xml version="1.0"?><svg width="'+bounds.Width()+'" height="'+bounds.Height()+'" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"><path ';
      if (o.fill.style===$j.brushStyle.SOLID) svg+=' fill="'+o.fill.color.toARGBString()+'"';
      else if (o.fill.style===$j.brushStyle.GRADIENT){
      } else if (o.fill.style===$j.brushStyle.BITMAP){
      }
      if (o.stroke.style===$j.brushStyle.SOLID) svg+=' stroke="'+o.stroke.color.toARGBString()+'"';
      else if (o.stroke.style===$j.brushStyle.GRADIENT){
      } else if (o.stroke.style===$j.brushStyle.BITMAP){
      }
      if (o.strokeDash!==$j.canvasProps.lineDahs.SOLID) svg+=' stroke-dasharray="'+o.strokeDash.join(String.SPACE)+'"';
      svg+=' d="'+p.PathString()+'" /></svg>';
      b+=btoa(svg)+")";
      o.oDom.style.backgroundImage=b;
    },
    measureText: function CSS_measureText(t,f){
      var d,H=0,W=0;
      if (typeof t!==_const.STRING) return;
      if (!(f instanceof $j.font)) return;
      d=$j.doc.createElement("div");
      d.style.position="absolute";
      if (!$j.tools.isNull(f)) f.toCss(d);
      d.innerHTML=t;
      $j.doc.body.appendChild(d);
      H=d.offsetHeight;
      W=d.offsetWidth;
      $j.doc.body.removeChild(d);
      return {w:W,h:H};
    },
    getSVGStyle: function CSS_getSVGStyle(o,type){
      // TODO : gestion du dégradé radial & bitmap
      if (o[type].style===$j.brushStyle.NONE) return type+":rgba(0,0,0,0)";
      else if (o[type].style===$j.brushStyle.SOLID) return type+":"+o[type].color.toARGBString();
      else if (o[type].style===$j.brushStyle.GRADIENT){
        var colorstops=o[type].gradient.items,g;
        g=document.createElementNS($j.SVG.xmlns, "linearGradient");
        g.setAttribute("id", "grad");
        g.setAttribute("x1", (o[type].gradient.startPosition.x*100) + $j.types.CSSUnits.PO);
        g.setAttribute("y1", (o[type].gradient.startPosition.y*100) + $j.types.CSSUnits.PO);
        g.setAttribute("x2", (o[type].gradient.stopPosition.x*100) + $j.types.CSSUnits.PO);
        g.setAttribute("y2", (o[type].gradient.stopPosition.y*100) + $j.types.CSSUnits.PO);
        for (var i=0,l=colorstops.length;i<l;i++){
          var stop=document.createElementNS("http://www.w3.org/2000/svg", "stop");
          stop.setAttribute('offset', (colorstops[i].offset*100)+$j.types.CSSUnits.PO);
          stop.setAttribute('stop-color', colorstops[i].color.toRGBHexString());
          g.appendChild(stop);
        }
        o.svg.appendChild(g);
        return type+":url(#grad)";
      } else if (o[type].style===$j.brushStyle.BITMAP){
      }
    },
    isCSSRuleExist: function CSS_isCSSRuleExist(selector,ruleType) {
      if ($j.tools.isNull(ruleType)) ruleType=$j.types.CSSRuleTypes.STYLE_RULE;
      for (var i=0,l=$j.rtStyle.sheet.cssRules.length;i<l;i++){
        if ($j.rtStyle.sheet.cssRules[i].type===ruleType) {
          if (ruleType===$j.types.CSSRuleTypes.STYLE_RULE) {
            if ($j.rtStyle.sheet.cssRules[i].selectorText===selector) {
              return true;
            }
          } else if (ruleType===$j.types.CSSRuleTypes.KEYFRAMES_RULE) {
            if ($j.rtStyle.sheet.cssRules[i].cssText.contains(selector)) {
              return true;
            }
          }
        }
      }
      return false;
    },
    addCSSRule: function CSS_addCSSRule(selector,style){
      if (selector==="#") return;
      if (style===String.empty) $j.rtStyle.sheet.insertRule([selector,"{}"].join(String.empty),0);
      else $j.rtStyle.sheet.insertRule([selector," {",style,"}"].join(String.empty),0);
    },
    removeCSSRule: function CSS_removeCSSRule(selector,ruleType){
      var rulesIndex=[],i,l;
      if ($j.tools.isNull(ruleType)) ruleType=$j.types.CSSRuleTypes.STYLE_RULE;
      l=$j.rtStyle.sheet.cssRules.length;
      for (i=0;i<l;i++){
        if ($j.rtStyle.sheet.cssRules[i].type===ruleType) {
          if (ruleType===$j.types.CSSRuleTypes.STYLE_RULE) {
            if ($j.rtStyle.sheet.cssRules[i].selectorText===selector) {
              rulesIndex.push(i);
            }
          } else if (ruleType===$j.types.CSSRuleTypes.KEYFRAMES_RULE) {
            if ($j.rtStyle.sheet.cssRules[i].cssText.contains(selector)) {
              rulesIndex.push(i);
            }
          }
        }
      }
      i=rulesIndex.length;
      while (i>0) {
        $j.rtStyle.sheet.deleteRule(i);
        i--;
      }
    },
    getCSSValue: function CSS_getCSSValue(selector,cssProp,flags,title){
      // on part du dernier stylesheet et on remonte jusqu'au premier ou lorsqu'on a trouvé
      var styles=document.styleSheets,selectorFounded=false,isCSSRule=false,styleName;
      if (selector!=="*"){
        if (!selector.startsWith(".")) selector="."+selector;
      }
      if (!$j.tools.valueInSet(flags,$j.types.CSSSelectorsFlags)) flags=$j.types.CSSSelectorsFlags.START;
      for (var x=styles.length-1;x>-1;x--){
        if (!$j.tools.isNull(title)) {
          if (!$j.tools.isNull(styles[x].href)) {
            styleName=$j.tools.uri.extractFileName(styles[x].href).split(".").first();
            if (styleName!==String.empty) {
              if (styleName!==title) continue;
            } else continue;
          } else continue;
        }
        var classes=styles[x].rules||styles[x].cssRules;
        if ($j.tools.isNull(classes)) continue;
        for (var i=0,l=classes.length;i<l;i++){
          if ($j.browser.opera) isCSSRule=(classes[i].className==="CSSRule");
          else isCSSRule=(classes[i] instanceof CSSStyleRule);
          if (!$j.tools.isNull(isCSSRule)){
            if (typeof classes[i].selectorText===_const.STRING){
              if (flags===$j.types.CSSSelectorsFlags.START) selectorFounded=classes[i].selectorText.startsWith(selector);
              else if (flags===$j.types.CSSSelectorsFlags.CONTAINS) selectorFounded=classes[i].selectorText.indexOf(selector)>-1;
              else if (flags===$j.types.CSSSelectorsFlags.ENDS) selectorFounded=classes[i].selectorText.endsWith(selector);
              else selectorFounded=classes[i].selectorText===selector;
              if(selectorFounded){
                return classes[i].style.getPropertyValue(cssProp);
              }
            }
          }
        }
      }
      return String.empty;
    },
    //CSS.prototype.initODomObject=function(o,s){
    //  var r=o.svg?o.AbsoluteRect():o.ClientRect(),svgStroke="",svgFill="";
    //  if (s===$j.shapes.CIRCLE){
    //    var w=r.Width()>r.Height()?r.Height():r.Width();
    //    r.setRight(r.left+w);
    //    r.setBottom(r.top+w);
    //  }
    //  o.oDom.style.MozTransform=o.oDom.style.WebkitTransform=o.oDom.style.OTransform=o.oDom.style.msTransform="rotate("+o.rotateAngle+"deg)";
    //  o.oDom.style.left=r.left+"px";
    //  o.oDom.style.top=r.top+"px";
    //  o.oDom.style.width=r.Width()+"px";
    //  o.oDom.style.height=r.Height()+"px";
    //  if (s===$j.shapes.ELLIPSE) o.oDom.style.borderRadius=((r.Width()*0.5)+o.strokeThickness)+"px / "+((r.Height()*0.5)+o.strokeThickness)+"px";
    //  if (o.svg!==null){
    //    svgStroke=this.getSVGStyle(o,"stroke");
    //    svgFill=this.getSVGStyle(o,"fill");
    //    o.svgElem.setAttributeNS(null,"style","stroke-linejoin:"+o.strokeJoin+";stroke-linecap:"+o.strokeCap+";stroke-width:"+o.strokeThickness+";"+svgStroke+";"+svgFill);
    //  }
    //};
    updateInlineCSS: function CSS_updateInlineCSS(obj,CSSProp,value) {
      /*if ((obj.form._loading||obj._loading||obj._DOMObj===null)&&(CSSProp!==$j.types.jsCSSProperties.ANIMATION)) return;
      var r,w;
      if ((obj._DOMObj===null)&&(CSSProp!==$j.types.jsCSSProperties.ANIMATION)) {
        obj._DOMObj=$j.doc.getElementById(obj._internalId);
        obj._DOMObj.jsObj=obj;
      }
      if (value===null) {
        switch (CSSProp) {
          case $j.types.jsCSSProperties.LEFT:
            if (obj.align===$j.types.aligns.MOSTRIGHT||
                obj.align===$j.types.aligns.RIGHT||
                obj.align===$j.types.aligns.TOPRIGHT||
                obj.align===$j.types.aligns.BOTTOMRIGHT) return;
            if (obj.align===$j.types.aligns.HORZCENTER||
                obj.align===$j.types.aligns.CENTER) value="50%";
            else value=obj.left+$j.types.CSSUnits.PX;
            break;
          case $j.types.jsCSSProperties.TOP:
            if (obj.align===$j.types.aligns.MOSTBOTTOM||
                obj.align===$j.types.aligns.BOTTOM||
                obj.align===$j.types.aligns.BOTTOMLEFT||
                obj.align===$j.types.aligns.BOTTOMRIGHT) return;
            if (obj.align===$j.types.aligns.VERTCENTER||
                obj.align===$j.types.aligns.CENTER) value="50"+$j.types.CSSUnits.PO;
            else value=obj.top+$j.types.CSSUnits.PX;
            break;
          case $j.types.jsCSSProperties.RIGHT:
            if (obj.align===$j.types.aligns.MOSTLEFT||
                obj.align===$j.types.aligns.LEFT||
                obj.right===-0xFFFF) return;
            value=obj.right+$j.types.CSSUnits.PX;
            break;
          case $j.types.jsCSSProperties.BOTTOM:
            if (obj.bottom===-0xFFFF) return;
            value=obj.bottom+$j.types.CSSUnits.PX;
            break;
          case $j.types.jsCSSProperties.DISPLAY:
            if (obj.visible) value="block";
            else value="none";
            break;
          case $j.types.jsCSSProperties.WIDTH:
            if (obj.align===$j.types.aligns.MOSTTOP||
                obj.align===$j.types.aligns.TOP||
                obj.align===$j.types.aligns.MOSTBOTTOM||
                obj.align===$j.types.aligns.BOTTOM||
                obj.align===$j.types.aligns.CLIENT||
                obj.align===$j.types.aligns.VERTCENTER) value="auto";
            else if (obj instanceof $j.classes.GraphicControl) value=(obj.width-obj.borderWidth*2)+$j.types.CSSUnits.PX;
            else if (obj instanceof $j.classes.ThemedControl) {
              r=this.getCSSValue(obj.themeAndClassName,"border-left");
              if (r!==null) w=~~(r.replace($j.types.CSSUnits.PX,String.empty));
              r=this.getCSSValue(obj.themeAndClassName,"border-right");
              if (r!==null) w+=~~(r.replace($j.types.CSSUnits.PX,String.empty));
              value=(obj.width+w)+$j.types.CSSUnits.PX;
            } else value=obj.width+$j.types.CSSUnits.PX;
            break;
          case $j.types.jsCSSProperties.HEIGHT:
            if (obj.align===$j.types.aligns.MOSTLEFT||
                obj.align===$j.types.aligns.LEFT||
                obj.align===$j.types.aligns.MOSTRIGHT||
                obj.align===$j.types.aligns.RIGHT||
                obj.align===$j.types.aligns.CLIENT||
                obj.align===$j.types.aligns.HORZCENTER) value="auto";
            else if (obj instanceof $j.classes.GraphicControl) value=(obj.height-obj.borderWidth*2)+$j.types.CSSUnits.PX;
            else if (obj instanceof $j.classes.ThemedControl) {
              r=this.getCSSValue(obj.themeAndClassName,"border-top");
              if (r!==null) w=~~(r.replace($j.types.CSSUnits.PX,String.empty));
              r=this.getCSSValue(obj.themeAndClassName,"border-bottom");
              if (r!==null) w+=~~(r.replace($j.types.CSSUnits.PX,String.empty));
              value=(obj.height+w)+$j.types.CSSUnits.PX;
            } else value=obj.height+$j.types.CSSUnits.PX;
            break;
          case $j.types.jsCSSProperties.TRANSFORM:
            value=String.empty;
            if (obj.rotateAngle!==0) value+=" rotate("+obj.rotateAngle+"deg)";
            if (obj.scale.x!==1||obj.scale.y!==1) value+=" scale("+obj.scale.x+","+obj.scale.y+")";
            break;
          case $j.types.jsCSSProperties.TRANSFORMORIGIN:
            value=obj.rotateCenter.x+$j.types.CSSUnits.PO+String.SPACE+obj.rotateCenter.y+$j.types.CSSUnits.PO;
            break;
          case $j.types.jsCSSProperties.PADDING:
            if (!obj.padding.empty) value=obj.padding.toCSS();
            else value=String.empty;
            break;
          case $j.types.jsCSSProperties.MARGIN:
            var offset=0;
            if (obj instanceof $j.classes.GraphicControl) offset=obj.borderWidth;
            if (obj.align===$j.types.aligns.CENTER) {
              value="-"+(~~(obj.height/2)+obj.margin.top+offset)+$j.types.CSSUnits.PX+String.SPACE+obj.margin.right+$j.types.CSSUnits.PX+String.SPACE+
                    obj.margin.bottom+$j.types.CSSUnits.PX+" -"+(~~(obj.width/2)+obj.margin.left+offset)+$j.types.CSSUnits.PX;
            } else if (obj.align===$j.types.aligns.HORZCENTER) {
              value=obj.margin.top+$j.types.CSSUnits.PX+String.SPACE+obj.margin.right+$j.types.CSSUnits.PX+String.SPACE+obj.margin.bottom+
                    $j.types.CSSUnits.PX+" -"+(~~(obj.width/2)+obj.margin.left+offset)+$j.types.CSSUnits.PX;
            } else if (obj.align===$j.types.aligns.VERTCENTER) {
              value="-"+(~~(obj.height/2)+obj.margin.top+offset)+$j.types.CSSUnits.PX+String.SPACE+obj.margin.right+$j.types.CSSUnits.PX+String.SPACE+
                    obj.margin.bottom+$j.types.CSSUnits.PX+String.SPACE+obj.margin.left+$j.types.CSSUnits.PX;
            }
            else if (!obj.margin.empty) value=obj.margin.toCSS();
            else value=String.empty;
            break;
          case $j.types.jsCSSProperties.FONT:
            if (obj instanceof $j.classes.ThemedControl) {
              //if (!obj.style.customNormal.font.empty) {
              //  CSSProp=String.empty;
              //  obj.style.customNormal.font.toCss(obj._DOMObj);
              //}
            }
            break;
          case $j.types.jsCSSProperties.COLOR:
            if (obj.DOMElement===$j.types.HTMLElements.CANVAS) return;
            if (obj instanceof $j.classes.ThemedControl) {
              //if (!obj.style.customNormal.font.empty) {
              //  value=obj.style.customNormal.font.brush.color.toARGBString();
              //}
            }
            break;
          case $j.types.jsCSSProperties.BACKGROUND:
            if (obj.DOMElement===$j.types.HTMLElements.CANVAS) return;
            if (obj instanceof $j.classes.GraphicControl) {
              if (obj.background.style===$j.types.brushStyles.GRADIENT) {
                if (obj.background.gradient.style===$j.types.gradientStyles.LINEAR) {
                  value=$j.browser.getVendorPrefix("linear-gradient")+"linear-gradient(";
                  // top
                  if (obj.background.gradient.stopPosition.x===0&&obj.background.gradient.stopPosition.y===1) {
                    value+="top, ";
                  } else if (obj.background.gradient.stopPosition.x===1&&obj.background.gradient.stopPosition.y===0) {
                    value+="left, ";
                  }
                  for (var i=0,l=obj.background.gradient.items.length;i<l;i++) {
                    value+=obj.background.gradient.items[i].color.toARGBString()+String.SPACE+(obj.background.gradient.items[i].offset*100)+"%";
                    if (i<l-1) value+=", ";
                  }
                  value+=")";
                } else {
                }
              } else if (obj.background.style===$j.types.brushStyles.BITMAP) {
              }
            } else {
            }
            break;
          case $j.types.jsCSSProperties.BACKGROUNDCOLOR:
            if (obj.DOMElement===$j.types.HTMLElements.CANVAS) return;
            if (obj instanceof $j.classes.GraphicControl) {
              switch (obj.background.style) {
                case $j.types.brushStyles.SOLID:
                  value=obj.background.color.toARGBString();
                  break;
                //case $j.types.brushStyles.GRADIENT:
                //  value=$j.browser.("linear-gradient")+"linear-gradient("
                //  break;
                //case $j.types.brushStyles.BITMAP:
                //  break;
              }
            } else {
            }
            //value=
            break;
          case $j.types.jsCSSProperties.BACKGROUNDREPEAT:
            if (obj.DOMElement===$j.types.HTMLElements.CANVAS) return;
            break;
          case $j.types.jsCSSProperties.BACKGROUNDATTACHMENT:
            if (obj.DOMElement===$j.types.HTMLElements.CANVAS) return;
            break;
          case $j.types.jsCSSProperties.BACKGROUNDIMAGE:
            if (obj.DOMElement===$j.types.HTMLElements.CANVAS) return;
            if  (obj instanceof $j.classes.Image) {
              if (obj.bitmap.src!==String.empty) {
                value="url('"+obj.bitmap.src+"')";
              } else return;
            }
            break;
          case $j.types.jsCSSProperties.BACKGROUNDSIZE:
            if (obj.DOMElement===$j.types.HTMLElements.CANVAS) return;
            break;
          case $j.types.jsCSSProperties.BORDER:
            if (obj.DOMElement===$j.types.HTMLElements.CANVAS) return;
            if (obj instanceof $j.classes.GraphicControl) {
              if (obj.border.style!==$j.types.brushStyles.NONE) {
                value=obj.borderWidth+$j.types.CSSUnits.PX+String.SPACE;
                switch (obj.border.style) {
                  case $j.types.brushStyles.SOLID:
                    value+=" solid "+obj.border.color.toARGBString();
                    break;
                  case $j.types.brushStyles.GRADIENT:

                    break;
                  case $j.types.brushStyles.BITMAP:

                    break;
                }
              }
            } else {
            }
            break;
          case $j.types.jsCSSProperties.BORDERRADIUS:
            if (obj.DOMElement===$j.types.HTMLElements.CANVAS) return;
            if (obj instanceof $j.classes.GraphicControl||obj.bordersRadius!==null) {
              value=obj.bordersRadius.topLeft.x+obj.bordersRadius.cssUnit+String.SPACE+obj.bordersRadius.topRight.x+obj.bordersRadius.cssUnit+String.SPACE+
                    obj.bordersRadius.bottomRight.x+obj.bordersRadius.cssUnit+String.SPACE+obj.bordersRadius.bottomLeft.x+obj.bordersRadius.cssUnit;
              value+=" / "+obj.bordersRadius.topLeft.y+obj.bordersRadius.cssUnit+String.SPACE+obj.bordersRadius.topRight.y+obj.bordersRadius.cssUnit+
                    String.SPACE+obj.bordersRadius.bottomRight.y+obj.bordersRadius.cssUnit+String.SPACE+obj.bordersRadius.bottomLeft.y+obj.bordersRadius.cssUnit;
            }
            break;
          case $j.types.jsCSSProperties.MINWIDTH:
            break;
          case $j.types.jsCSSProperties.MAXWIDTH:
            break;
          case $j.types.jsCSSProperties.MINHEIGHT:
            break;
          case $j.types.jsCSSProperties.MAXHEIGHT:
            break;
          case $j.types.jsCSSProperties.BOXSHADOW:
            if (obj instanceof $j.classes.ThemedControl) {
              //if (!obj.style.customNormal.back.empty) {
              //  r=obj.style.customNormal.back;
              //  if (!r.shadowColor.equals(_colors.TRANSPARENT)||r.shadowBlur!==0) {
              //    value=r.shadowOffsetX+$j.types.CSSUnits.PX+String.SPACE+r.shadowOffsetY+$j.types.CSSUnits.PX+String.SPACE+r.shadowBlur+$j.types.CSSUnits.PX+String.SPACE+r.shadowColor.toARGBString();
              //  }
              //  if (obj.DOMElement===$j.types.HTMLElements.LABEL) {
              //    CSSProp=$j.types.jsCSSProperties.TEXTSHADOW;
              //  } else {
              //    CSSProp=$j.types.jsCSSProperties.BOXSHADOW;
              //  }
              //}
            } else if (obj instanceof $j.classes.GraphicControl) {
              if (!obj.shadowColor.equals(_colors.TRANSPARENT)||obj.shadowBlur!==0) {
                value=obj.shadowOffsetX+$j.types.CSSUnits.PX+String.SPACE+obj.shadowOffsetY+$j.types.CSSUnits.PX+String.SPACE+obj.shadowBlur+$j.types.CSSUnits.PX+String.SPACE+obj.shadowColor.toARGBString();
              }
              CSSProp=$j.types.jsCSSProperties.BOXSHADOW;
            }
            break;
          case $j.types.jsCSSProperties.OPACITY:
            if (obj.opacity<=1) value=obj.opacity;
            break;
          case $j.types.jsCSSProperties.ZINDEX:
            break;
          //case $j.types.jsCSSProperties.CURSOR:
          //  value=obj.form.getThemeName()+"_"+obj.cursor;
          //  break;
          case $j.types.jsCSSProperties.TEXTALIGN:
            if (!(obj instanceof $j.classes.CaptionControl)) return;
            value=obj.horizAlign;
            //switch (obj.horizAlign) {
            //  case $j.types.textAligns.LEFT:
            //    value="left";
            //    break;
            //  case $j.types.textAligns.CENTER:
            //    value="center";
            //    break;
            //  case $j.types.textAligns.RIGHT:
            //    value="right";
            //    break;
            //};
            break;
          case $j.types.jsCSSProperties.LINEHEIGHT:
            if (!(obj instanceof $j.classes.CaptionControl)) return;
            switch (obj.vertAlign) {
              case $j.types.vertTextAligns.TOP:
                value=String.empty;
                break;
              case $j.types.vertTextAligns.MIDDLE:
                value=obj.height+$j.types.CSSUnits.PX;
                break;
              case $j.types.vertTextAligns.BOTTOM:
                value=((obj.height*2)-$j.tools.font.getTextHeight("°_").H)+$j.types.CSSUnits.PX;
                break;
            };
            break;
          case $j.types.jsCSSProperties.OVERFLOW:
            if (obj.clipChilds) value="hidden";
            break;
          case $j.types.jsCSSProperties.ANIMATION:
            if ($j.classes.Animation===null) return;
            if (obj instanceof $j.classes.Animation) {
              value=obj.toCSS();
              obj=obj.owner;
            } else return;
            break;
          case $j.types.jsCSSProperties.ANIMATIONSTATE:
            if (obj.pause) value="paused";
            else value=String.empty;
            obj=obj.owner;
            break;
        }
      }
      obj._DOMObj.style[$j.browser.getVendorPrefix(CSSProp)+CSSProp]=value;
      // for scaled object only
      //if (CSSProp===$j.types.CSSProperties.TRANSFORM) {
      //  if (obj.scale.x!==1||obj.scale.y!==1) {
      //    r=obj._DOMObj.getBoundingClientRect();
      //    obj._DOMObj.style.left=obj.left+~~((r.width-obj._DOMObj.offsetWidth)/2)+"px";
      //    obj._DOMObj.style.top=obj.top+~~((r.height-obj._DOMObj.offsetHeight)/2)+"px";
      //  }
      //}*/
    },
    /*CSS.prototype.generateCSSProperties=function CSS_generateCSSProperties(obj) {
      var r,w=0,offset,cssRule={},cssValue;
      if (obj.align!==$j.types.aligns.MOSTRIGHT&&
          obj.align!==$j.types.aligns.RIGHT&&
          obj.align!==$j.types.aligns.TOPRIGHT&&
          obj.align!==$j.types.aligns.BOTTOMRIGHT) {
        if (obj.align===$j.types.aligns.HORZCENTER||obj.align===$j.types.aligns.CENTER) cssValue="50"+$j.types.CSSUnits.PO+";";
        else cssValue=obj.left+$j.types.CSSUnits.PX+";";
        cssRule[$j.types.CSSProperties.LEFT]=cssValue;
      }
      // top
      if (obj.align!==$j.types.aligns.MOSTBOTTOM&&
          obj.align!==$j.types.aligns.BOTTOM&&
          obj.align!==$j.types.aligns.BOTTOMLEFT&&
          obj.align!==$j.types.aligns.BOTTOMRIGHT) {
        if (obj.align===$j.types.aligns.VERTCENTER||obj.align===$j.types.aligns.CENTER) cssValue="50"+$j.types.CSSUnits.PO+";";
        else cssValue=obj.top+$j.types.CSSUnits.PX+";";
        cssRule[$j.types.CSSProperties.TOP]=cssValue;
      }
      // right
      if (obj.align!==$j.types.aligns.MOSTLEFT&&
          obj.align!==$j.types.aligns.LEFT&&
          obj.right!==-0xFFFF) {
        cssRule[$j.types.CSSProperties.RIGHT]=obj.right+$j.types.CSSUnits.PX+";";
      }
      // bottom
      if (obj.bottom!==-0xFFFF) {
        cssRule[$j.types.CSSProperties.BOTTOM]=obj.bottom+$j.types.CSSUnits.PX+";";
      }
      // display
      if (obj.visible&&!obj._loading) cssValue="block;";
      else cssValue="none;";
      cssRule[$j.types.CSSProperties.DISPLAY]=cssValue;
      // width
      if (obj.align===$j.types.aligns.MOSTTOP||
          obj.align===$j.types.aligns.TOP||
          obj.align===$j.types.aligns.MOSTBOTTOM||
          obj.align===$j.types.aligns.BOTTOM||
          obj.align===$j.types.aligns.CLIENT||
          obj.align===$j.types.aligns.VERTCENTER) cssValue="auto;";
      else if (obj instanceof $j.classes.GraphicControl) cssValue=(obj.width-obj.borderWidth*2)+$j.types.CSSUnits.PX+";";
      else if (obj instanceof $j.classes.ThemedControl) {
        r=this.getCSSValue(obj.themeAndClassName,$j.types.CSSProperties.BORDERLEFTWIDTH,$j.types.CSSSelectorsFlags.CONTAINS);
        if (r!==null) w=~~(r.replace($j.types.CSSUnits.PX,String.empty));
        r=this.getCSSValue(obj.themeAndClassName,$j.types.CSSProperties.BORDERRIGHTWIDTH,$j.types.CSSSelectorsFlags.CONTAINS);
        if (r!==null) w+=~~(r.replace($j.types.CSSUnits.PX,String.empty));
        cssValue=(obj.width-w)+$j.types.CSSUnits.PX+";";
      } else cssValue=obj.width+$j.types.CSSUnits.PX+";";
      cssRule[$j.types.CSSProperties.WIDTH]=cssValue;
      // height
      if (obj.align===$j.types.aligns.MOSTLEFT||
          obj.align===$j.types.aligns.LEFT||
          obj.align===$j.types.aligns.MOSTRIGHT||
          obj.align===$j.types.aligns.RIGHT||
          obj.align===$j.types.aligns.CLIENT||
          obj.align===$j.types.aligns.HORZCENTER) cssValue="auto;";
      else if (obj instanceof $j.classes.GraphicControl) cssValue=(obj.height-obj.borderWidth*2)+$j.types.CSSUnits.PX+";";
      else if (obj instanceof $j.classes.ThemedControl) {
        r=this.getCSSValue(obj.themeAndClassName,$j.types.CSSProperties.BORDERTOPWIDTH,$j.types.CSSSelectorsFlags.CONTAINS);
        if (r!==null) w=~~(r.replace($j.types.CSSUnits.PX,String.empty));
        r=this.getCSSValue(obj.themeAndClassName,$j.types.CSSProperties.BORDERBOTTOMWIDTH,$j.types.CSSSelectorsFlags.CONTAINS);
        if (r!==null) w+=~~(r.replace($j.types.CSSUnits.PX,String.empty));
        cssValue=(obj.height-w)+$j.types.CSSUnits.PX+";";
      } else cssValue=obj.height+$j.types.CSSUnits.PX+";";
      cssRule[$j.types.CSSProperties.HEIGHT]=cssValue;
      // transform
      cssValue=String.empty;
      if (obj.rotateAngle!==0) cssValue=$j.types.CSSProperties.ROTATE+"("+obj.rotateAngle+"deg)";
      if (obj.scale.x!==1||obj.scale.y!==1) cssValue+=String.SPACE+$j.types.CSSProperties.SCALE+"("+obj.scale.x+","+obj.scale.y+")";
      if (cssValue!==String.empty) cssRule[$j.browser.getVendorPrefix($j.types.CSSProperties.TRANSFORM)+$j.types.CSSProperties.TRANSFORM]=cssValue+";";
      // transformorigin
      if (obj.rotateCenter.x!==0||obj.rotateCenter.y!==0) {
        cssValue=obj.rotateCenter.x+$j.types.CSSUnits.PO+String.SPACE+obj.rotateCenter.y+$j.types.CSSUnits.PO+";";
        cssRule[$j.browser.getVendorPrefix($j.types.CSSProperties.TRANSFORMORIGIN)+$j.types.CSSProperties.TRANSFORMORIGIN]=cssValue;
      }
      // padding
      if (!obj.padding.empty) cssRule[$j.types.CSSProperties.PADDING]=obj.padding.toCSS()+";";
      // margin
      cssValue=String.empty;
      offset=0;
      //if (obj instanceof $j.classes.GraphicControl) value=obj.borderWidth;
      if (obj.align===$j.types.aligns.CENTER) {
        cssValue="-"+(~~(obj.height/2)+obj.margin.top+offset)+$j.types.CSSUnits.PX+String.SPACE+obj.margin.right+$j.types.CSSUnits.PX+
              String.SPACE+obj.margin.bottom+$j.types.CSSUnits.PX+" -"+(~~(obj.width/2)+obj.margin.left+offset)+$j.types.CSSUnits.PX+";";
      } else if (obj.align===$j.types.aligns.HORZCENTER) {
        cssValue=obj.margin.top+$j.types.CSSUnits.PX+String.SPACE+obj.margin.right+$j.types.CSSUnits.PX+String.SPACE+obj.margin.bottom+
              $j.types.CSSUnits.PX+" -"+(~~(obj.width/2)+obj.margin.left+offset)+$j.types.CSSUnits.PX+";";
      } else if (obj.align===$j.types.aligns.VERTCENTER) {
        cssValue=(~~(obj.height/2)+obj.margin.top+offset)+$j.types.CSSUnits.PX+String.SPACE+obj.margin.right+$j.types.CSSUnits.PX+
              String.SPACE+obj.margin.bottom+$j.types.CSSUnits.PX+String.SPACE+obj.margin.left+$j.types.CSSUnits.PX+";";
      }
      else if (!obj.margin.empty) cssValue=obj.margin.toCSS()+";";
      if (cssValue!==String.empty) cssRule[$j.types.CSSProperties.MARGIN]=cssValue;
      // font
      if (obj instanceof $j.classes.ThemedControl) {
        //if (!obj.style.customNormal.font.empty) {
        //  cssValue=obj.style.customNormal.font.toCssString();
        //  cssRule[$j.types.CSSProperties.FONT]=cssValue;
        //}
      }
      // color
      if (obj.DOMElement!==$j.types.HTMLElements.CANVAS) {
        if (obj instanceof $j.classes.ThemedControl) {
          //if (!obj.style.customNormal.font.empty) {
          //  cssValue=obj.style.customNormal.font.brush.color.toARGBString()+";";
          //  cssRule[$j.types.CSSProperties.COLOR]=cssValue;
          //}
        }
      }
      // background
      cssValue=String.empty;
      if (obj.DOMElement!==$j.types.HTMLElements.CANVAS) {
        if (obj instanceof $j.classes.GraphicControl) {
          if (obj.background.style===$j.types.brushStyles.GRADIENT) {
            if (obj.background.gradient.style===$j.types.gradientStyles.LINEAR) {
              cssValue=$j.browser.getVendorPrefix($j.types.CSSProperties.LINEARGRADIENT)+$j.types.CSSProperties.LINEARGRADIENT+"(";
              // top
              if (obj.background.gradient.stopPosition.x===0&&obj.background.gradient.stopPosition.y===1) {
                cssValue+=$j.types.CSSProperties.TOP+", ";
              } else if (obj.background.gradient.stopPosition.x===1&&obj.background.gradient.stopPosition.y===0) {
                cssValue+=$j.types.CSSProperties.LEFT+", ";
              } else {
                // calculate the angle from points
                var dx=obj.background.gradient.stopPosition.x-obj.background.gradient.startPosition.x;
                var dy=obj.background.gradient.stopPosition.y-obj.background.gradient.startPosition.y;
                var angle=-$j.convert.rad2Deg($j.atan2(dy,dx));
                cssValue+=~~angle+"deg, ";
              }
              for (var i=0,l=obj.background.gradient.items.length;i<l;i++) {
                cssValue+=obj.background.gradient.items[i].color.toARGBString()+String.SPACE+(obj.background.gradient.items[i].offset*100)+$j.types.CSSUnits.PO;
                if (i<l-1) cssValue+=", ";
              }
              cssValue+=");";
            } else {
            }
          } else if (obj.background.style===$j.types.brushStyles.BITMAP) {
          }
        } else {
        }

        if (cssValue!==String.empty) cssRule[$j.types.CSSProperties.BACKGROUND]=cssValue;
      }
      // backgroundcolor
      cssValue=String.empty;
      if (obj.DOMElement!==$j.types.HTMLElements.CANVAS) {
        if (obj instanceof $j.classes.GraphicControl) {
          switch (obj.background.style) {
            case $j.types.brushStyles.SOLID:
              cssValue=obj.background.color.toARGBString()+";";
              break;
            //case $j.types.brushStyles.GRADIENT:
            //  value=$j.browser.("linear-gradient")+"linear-gradient("
            //  break;
            //case $j.types.brushStyles.BITMAP:
            //  break;
          }
        } else {
        }
        if (cssValue!==String.empty) cssRule[$j.types.CSSProperties.BACKGROUNDCOLOR]=cssValue;
      }
      // backgroundrepeat
      if (obj.DOMElement!==$j.types.HTMLElements.CANVAS) {
      }
      // backgroundattachment
      if (obj.DOMElement!==$j.types.HTMLElements.CANVAS) {
      }
      // backgroundimage
      if (obj.DOMElement!==$j.types.HTMLElements.CANVAS) {
        if  (obj instanceof $j.classes.Image) {
          if (obj.bitmap.src!==String.empty) {
            cssValue='url("'+obj.bitmap.src+'");';
            cssRule[$j.types.CSSProperties.BACKGROUNDIMAGE]=cssValue;
          } else return;
        }
      }
      // backgroundsize
      if (obj.DOMElement!==$j.types.HTMLElements.CANVAS) {
      }
      // border
      if (obj.DOMElement!==$j.types.HTMLElements.CANVAS) {
        if (obj instanceof $j.classes.GraphicControl) {
          if (obj.border.style!==$j.types.brushStyles.NONE) {
            cssValue=obj.borderWidth+$j.types.CSSUnits.PX+String.SPACE;
            switch (obj.border.style) {
              case $j.types.brushStyles.SOLID:
                cssValue+=" solid "+obj.border.color.toARGBString();
                break;
              case $j.types.brushStyles.GRADIENT:

                break;
              case $j.types.brushStyles.BITMAP:

                break;
            }
            cssValue+=";";
          }
          cssRule[$j.types.CSSProperties.BORDER]=cssValue;
        } else {
        }
      }
      // borderradius
      if (obj.DOMElement!==$j.types.HTMLElements.CANVAS) {
        if (obj instanceof $j.classes.GraphicControl||obj.bordersRadius!==null) {
          cssValue=obj.bordersRadius.topLeft.x+obj.bordersRadius.cssUnit+String.SPACE+obj.bordersRadius.topRight.x+obj.bordersRadius.cssUnit+
                String.SPACE+obj.bordersRadius.bottomRight.x+obj.bordersRadius.cssUnit+String.SPACE+obj.bordersRadius.bottomLeft.x+obj.bordersRadius.cssUnit;
          cssValue+=" / "+obj.bordersRadius.topLeft.y+obj.bordersRadius.cssUnit+String.SPACE+obj.bordersRadius.topRight.y+obj.bordersRadius.cssUnit+
                String.SPACE+obj.bordersRadius.bottomRight.y+obj.bordersRadius.cssUnit+String.SPACE+obj.bordersRadius.bottomLeft.y+obj.bordersRadius.cssUnit;
          cssValue+=";";
          cssRule[$j.types.CSSProperties.BORDERRADIUS]=cssValue;
        } else {
        }
      }
      // minwidth
      // maxwidth
      // minheight
      // maxheight
      // shadow
      if (obj instanceof $j.classes.ThemedControl) {
        //if (!obj.style.customNormal.back.empty) {
        //  r=obj.style.customNormal.back;
        //  if (!r.shadowColor.equals(_colors.TRANSPARENT)||r.shadowBlur!==0) {
        //    cssValue=r.shadowOffsetX+$j.types.CSSUnits.PX+String.SPACE+r.shadowOffsetY+$j.types.CSSUnits.PX+String.SPACE+r.shadowBlur+$j.types.CSSUnits.PX+
        //          String.SPACE+r.shadowColor.toARGBString()+";";
        //    if (obj.DOMElement===$j.types.HTMLElements.LABEL) {
        //      cssRule[$j.types.CSSProperties.TEXTSHADOW]=cssValue;
        //    } else {
        //      cssRule[$j.types.CSSProperties.BOXSHADOW]=cssValue;
        //    }
        //  }
        //}
      } else if (obj instanceof $j.classes.GraphicControl) {
        if (!obj.shadowColor.equals(_colors.TRANSPARENT)||obj.shadowBlur!==0) {
          cssValue=obj.shadowOffsetX+$j.types.CSSUnits.PX+String.SPACE+obj.shadowOffsetY+$j.types.CSSUnits.PX+String.SPACE+obj.shadowBlur+
                $j.types.CSSUnits.PX+String.SPACE+obj.shadowColor.toARGBString()+";";
          cssRule[$j.types.CSSProperties.BOXSHADOW]=cssValue;
        }
      }
      // opacity
      if (obj.opacity<1) cssRule[$j.types.CSSProperties.OPACITY]=obj.opacity+";";
      // zindex
      // textalign
      if (obj instanceof $j.classes.CaptionControl) {
        //switch (obj.horizAlign) {
        //  case $j.types.textAligns.LEFT:
        //    cssValue=$j.types.CSSProperties.LEFT+";";
        //    break;
        //  case $j.types.textAligns.CENTER:
        //    style+="center;";
        //    break;
        //  case $j.types.textAligns.RIGHT:
        //    style+="right;";
        //    break;
        //};
        cssRule[$j.types.CSSProperties.TEXTALIGN]=obj.horizAlign+";";
      }
      // lineheight
      if (obj.vertAlign!==null) {
        cssValue=String.empty;
        switch (obj.vertAlign) {
          case $j.types.vertTextAligns.TOP:
            //style+=String.empty;
            break;
          case $j.types.vertTextAligns.MIDDLE:
            cssValue=obj.height+$j.types.CSSUnits.PX+";";
            break;
          case $j.types.vertTextAligns.BOTTOM:
            cssValue=~~((obj.height-$j.tools.text.getTextSizes(obj.caption,null,obj._DOMObj).h)/2)+$j.types.CSSUnits.PX+";";
            break;
        }
        cssRule[$j.types.CSSProperties.LINEHEIGHT]=cssValue;
      }
      // overflow
      if (obj.clipChilds) cssRule[$j.types.CSSProperties.OVERFLOW]="hidden;";
      // animation
      //if (obj instanceof $j.classes.Animation) {
      //  value=obj.toCSS();
      //  obj=obj.owner;
      //}
      //// animationstate
      //if (obj.pause) value="paused";
      //else value=String.empty;
      //obj=obj.owner;

      //this.addCSSRule("#"+obj.name,style);
      return cssRule;
    };*/
    updateAllInlineCSS: function CSS_updateAllInlineCSS(obj) {
      this.updateInlineCSS(obj,$j.types.CSSProperties.LEFT);
      this.updateInlineCSS(obj,$j.types.CSSProperties.TOP);
      this.updateInlineCSS(obj,$j.types.CSSProperties.RIGHT);
      this.updateInlineCSS(obj,$j.types.CSSProperties.BOTTOM);
      this.updateInlineCSS(obj,$j.types.CSSProperties.DISPLAY);
      this.updateInlineCSS(obj,$j.types.CSSProperties.WIDTH);
      this.updateInlineCSS(obj,$j.types.CSSProperties.HEIGHT);
      this.updateInlineCSS(obj,$j.types.CSSProperties.TRANSFORM);
      //this.updateInlineCSS(obj,$j.types.CSSProperties.TRANSFORMORIGIN);
      this.updateInlineCSS(obj,$j.types.CSSProperties.PADDING);
      this.updateInlineCSS(obj,$j.types.CSSProperties.MARGIN);
      this.updateInlineCSS(obj,$j.types.CSSProperties.FONT);
      this.updateInlineCSS(obj,$j.types.CSSProperties.COLOR);
      this.updateInlineCSS(obj,$j.types.CSSProperties.BACKGROUND);
      this.updateInlineCSS(obj,$j.types.CSSProperties.BACKGROUNDCOLOR);
      this.updateInlineCSS(obj,$j.types.CSSProperties.BACKGROUNDREPEAT);
      this.updateInlineCSS(obj,$j.types.CSSProperties.BACKGROUNDATTACHMENT);
      this.updateInlineCSS(obj,$j.types.CSSProperties.BACKGROUNDIMAGE);
      this.updateInlineCSS(obj,$j.types.CSSProperties.BACKGROUNDPOSITION);
      this.updateInlineCSS(obj,$j.types.CSSProperties.BACKGROUNDSIZE);
      this.updateInlineCSS(obj,$j.types.CSSProperties.TEXTALIGN);
      this.updateInlineCSS(obj,$j.types.CSSProperties.BORDER);
      this.updateInlineCSS(obj,$j.types.CSSProperties.BORDERRADIUS);
      this.updateInlineCSS(obj,$j.types.CSSProperties.MINWIDTH);
      this.updateInlineCSS(obj,$j.types.CSSProperties.MAXWIDTH);
      this.updateInlineCSS(obj,$j.types.CSSProperties.MINHEIGHT);
      this.updateInlineCSS(obj,$j.types.CSSProperties.MAXHEIGHT);
      this.updateInlineCSS(obj,$j.types.CSSProperties.SHADOW);
      this.updateInlineCSS(obj,$j.types.CSSProperties.OPACITY);
      this.updateInlineCSS(obj,$j.types.CSSProperties.ZINDEX);
      this.updateInlineCSS(obj,$j.types.CSSProperties.LINEHEIGHT);
      this.updateInlineCSS(obj,$j.types.CSSProperties.OVERFLOW);
      this.updateInlineCSS(obj,$j.types.CSSProperties.ANIMATION);
    },
    /*CSS.prototype.generateCSSText=function CSS_generateCSSText(cssRule) {
      var cssText=String.empty;
      for (var p in cssRule) {
        if (cssRule.hasOwnProperty(p)) {
          if (cssRule[p]!==String.empty) cssText+=p+":"+cssRule[p];
        }
      }
      return cssText;
    };*/
    //#endregion
  };
  Object.seal($j.CSS);
//#endregion
})();

/*
.button                       -> back
.button:hover                 -> back
.button:active                -> back

.button:before                -> middle
.button:hover:before          -> middle
.button:active:before         -> middle

.button:after                 -> front
.button:hover:after           -> front
.button:active:after          -> front

.theme_button                 -> back
.theme_button:hover           -> back
.theme_button:active          -> back

.theme_button:before          -> middle
.theme_button:hover:before    -> middle
.theme_button:active:before   -> middle

.theme_button:after           -> front
.theme_button:hover:after     -> front
.theme_button:active:after    -> front
*/