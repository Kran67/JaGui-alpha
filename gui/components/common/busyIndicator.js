(function(){
  $j.types.busyIndicatorStyles={
    SPIN:"spin",
    WIN8CIRCLE:"win8Circle",
    BALL:"ball",
    CIRCLE:"circle"
  };
  Object.freeze($j.types.busyIndicatorStyles);
  //#region BusyIndicatorSpinOptions
  var BusyIndicatorSpinOptions=$j.classes.Bindable.extend({
    _ClassName:"BusyIndicatorSpinOptions",
    init:function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)) {
        this._inherited(owner,props);
        // The number of lines to draw
        this.lines=12;
        // The length of each line
        this.length=7;
        // The line thickness
        this.width=4;
        // Roundness (0..1)
        this.corners=0;
        // 1: clockwise, -1: counterclockwise
        this.direction=1;
        // Rounds per second
        this.speed=1;
        // Afterglow percentage
        this.trail=100;
      }    
    },
    //#region Setters
    setLines:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if (newValue<5||newValue>17) newValue=12;
      if (this.lines!==newValue) {
        this.lines=newValue;
        this.propertyChanged("lines");
        this._owner.update();
      }
    },
    setLength:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if (newValue<0||newValue>40) newValue=7;
      if (this.length!==newValue) {
        this.length=newValue;
        this.propertyChanged("length");
        this._owner.update();
      }
    },
    setWidth:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if (newValue<2||newValue>30) newValue=4;
      if (this.width!==newValue) {
        this.width=newValue;
        this.propertyChanged("width");
        this._owner.update();
      }
    },
    setCorners:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if (newValue<0||newValue>1) newValue=0;
      if (this.corners!==newValue) {
        this.corners=newValue;
        this.propertyChanged("corners");
        this._owner.update();
      }
    },
    setDirection:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if (newValue<-1||newValue>1) newValue=1;
      if (this.direction!==newValue) {
        this.direction=newValue;
        this.propertyChanged("direction");
        this._owner.update();
      }
    },
    setSpeed:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if (newValue<0.5||newValue>2.2) newValue=1;
      if (this.speed!==newValue) {
        this.speed=newValue;
        this.propertyChanged("speed");
        this._owner.update();
      }
    },
    setTrail:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if (newValue<10||newValue>100) newValue=100;
      if (this.trail!==newValue) {
        this.properties.trail=newValue;
        this.propertyChanged("trail");
        this._owner.update();
      }
    }
    //#endregion
    //#region Methods
    //#endregion Methods
  });
  //#endregion BusyIndicatorSpinOptions
  //#region BusyIndicator
  var BusyIndicator=$j.classes.ThemedControl.extend({
    _ClassName:"BusyIndicator",
    init:function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        this.indicatorStyle=$j.types.busyIndicatorStyles.SPIN
        this.spinIndicatorOptions=new $j.classes.BusyIndicatorSpinOptions(this);
      }
    },
    //#region Setters
    setIndicatorStyle:function(newValue) {
      if (!$j.tools.valueInSet(newValue,$j.types.busyIndicatorStyles)) return
      if (this.indicatorStyle!==newValue){
        this.indicatorStyle=newValue;
        this.update();
      }
    },
    //#endregion
    //#region Methods
    loaded:function(){
      var cssProp,transform=$j.browser.getVendorPrefix("transform"),atf=$j.browser.getVendorPrefix("animation-timing-function");
      this._inherited();
      switch (this.indicatorStyle) {
        case $j.types.busyIndicatorStyles.WIN8CIRCLE:
          if (!$j.CSS.isCSSRuleExist("@"+$j.browser.getVendorPrefix("keyframes")+"keyframes orbit")) {
            cssProp="0% { "+transform+"transform: rotate(225deg);opacity: 1;"+atf+"animation-timing-function: ease-out; } ";
            cssProp+="7% { "+transform+"transform: rotate(345deg);"+atf+"animation-timing-function: linear; } ";
            cssProp+="30% { "+transform+"transform: rotate(455deg);"+atf+"animation-timing-function: ease-in-out; } ";
            cssProp+="39% { "+transform+"transform: rotate(690deg);"+atf+"animation-timing-function: linear; } ";
            cssProp+="70% { "+transform+"transform: rotate(815deg);opacity: 1;"+atf+"animation-timing-function: ease-out; } ";
            cssProp+="75% { "+transform+"transform: rotate(945deg);"+atf+"animation-timing-function: ease-out; } ";
            cssProp+="76% { "+transform+"transform: rotate(945deg);opacity: 0; } ";
            cssProp+="100% { "+transform+"transform: rotate(945deg);opacity: 0; } ";
            $j.CSS.addCSSRule("@"+$j.browser.getVendorPrefix("keyframes")+"keyframes orbit",cssProp);
          }
          break;
        case $j.types.busyIndicatorStyles.BALL:
          if (!$j.CSS.isCSSRuleExist("@"+$j.browser.getVendorPrefix("keyframes")+"keyframes spinoff")) {
            cssProp="0% { "+transform+"transform: rotate(0deg); }";
            cssProp+="100% { "+transform+"transform: rotate(360deg); }";
            $j.CSS.addCSSRule("@"+$j.browser.getVendorPrefix("keyframes")+"keyframes spin",cssProp);
            cssProp="0% { "+transform+"transform: rotate(0deg); }";
            cssProp+="100% { "+transform+"transform: rotate(-360deg); }";
            $j.CSS.addCSSRule("@"+$j.browser.getVendorPrefix("keyframes")+"keyframes spinoff",cssProp);
          }
          break;
        case $j.types.busyIndicatorStyles.CIRCLE:
          if (!$j.CSS.isCSSRuleExist("@"+$j.browser.getVendorPrefix("keyframes")+"keyframes spinoffPulse")) {
            //cssProp="0% { "+transform+"transform: rotate(160deg);opacity: 0;box-shadow: 0 0 1"+$j.types.CSSUnits.PX+" rgb"+$j.CSS.getCSSValue("carbon_focused","box-shadow",null,$j.types.CSSFiles.).split(" rgb")[3]+"; } ";
            cssProp+="50% { "+transform+"transform: rotate(145deg);opacity: 1; } ";
            cssProp+="100% { "+transform+"transform: rotate(-320deg);opacity: 0; }; ";
            $j.CSS.addCSSRule("@"+$j.browser.getVendorPrefix("keyframes")+"keyframes spinPulse",cssProp);
            cssProp="0% { "+transform+"transform: rotate(0deg); } ";
            cssProp+="100% { "+transform+"transform: rotate(360deg); }; ";
            $j.CSS.addCSSRule("@"+$j.browser.getVendorPrefix("keyframes")+"keyframes spinoffPulse",cssProp);
          }
          break;
      }
      this.update();
    },
    removeCssRules:function() {
      switch (this.indicatorStyle) {
        case $j.types.busyIndicatorStyles.SPIN:
          break;
        case $j.types.busyIndicatorStyles.WIN8CIRCLE:
          $j.CSS.removeCSSRule("#"+this._internalId+" .carbon_win8circle:after");
          $j.CSS.removeCSSRule("#"+this._internalId+" .win8circle");
          break;
        case $j.types.busyIndicatorStyles.BALL:
          break;
        case $j.types.busyIndicatorStyles.CIRCLE:
          break;
      }
    },
    update:function() {
      var child,child1,child2,cssRuleValues=String.empty,i=0,style=String.empty,sio,name,start,z;
      if (this._loading||this.form._loading) return;
      if ($j.tools.isNull(this._DOMObj)) return;
      this._DOMObj.innerHTML=String.empty;
      switch (this.indicatorStyle) {
        case $j.types.busyIndicatorStyles.SPIN:
          // based on http://fgnass.github.io/spin.js/
          sio=this.spinIndicatorOptions;
          child=$j.doc.createElement($j.types.HTMLElements.DIV);
          style="left:50%;";
          style+="top:50%;";
          child.setAttribute("style",style);
          for (;i<sio.lines;i++) {
            child1=$j.doc.createElement($j.types.HTMLElements.DIV);
            style="top:"+(1+~(sio.width/2))+$j.types.CSSUnits.PX+";";
            style+="opacity:0;";
            child1.setAttribute("id",this._internalId+"_"+(i+1));
            start=0.01+i/sio.lines*100;
            z=$j.max(1-1/sio.trail*(100-start),0);
            style+=$j.browser.getVendorPrefix("animation")+"animation:"+child1.id+' '+1/sio.speed+'s linear infinite';
            $j.CSS.removeCSSRule('@'+$j.browser.getVendorPrefix("keyframes")+"keyframes "+child1.id);
            $j.CSS.addCSSRule('@'+$j.browser.getVendorPrefix("keyframes")+"keyframes "+child1.id,
              '0%{opacity:'+z+'}'+
              start+'%{opacity:0}'+
              (start+0.01)+'%{opacity:1}'+
              (start+sio.trail)%100+'%{opacity:0}'+
              '100%{opacity:'+z+'}'
            );
            child1.setAttribute("style",style);
            child1.jsObj=this;
            child2=$j.doc.createElement($j.types.HTMLElements.DIV);
            child2.setAttribute("class","spinIndic");
            if ($j.browser.ie) child2.setAttribute("data-theme",this.getThemeName());
            else child2.dataset.theme=this.getThemeName();
            style="width:"+(sio.length+sio.width)+$j.types.CSSUnits.PX+";";
            style+="height:"+sio.width+$j.types.CSSUnits.PX+";";
            style+=$j.browser.getVendorPrefix("transform-origin")+"transform-origin:left;";
            style+=$j.browser.getVendorPrefix("transform")+"transform:rotate("+~~(360/sio.lines*i)+"deg) "+$j.browser.getVendorPrefix("translate")+"translate("+sio.length+$j.types.CSSUnits.PX+",0);";
            style+="border-radius:"+(sio.corners*sio.width>>1)+$j.types.CSSUnits.PX+";";
            child2.setAttribute("style",style);
            child2.jsObj=this;
            child1.appendChild(child2);
            child.appendChild(child1);
            this._DOMObj.appendChild(child);
          }
          break;
        case $j.types.busyIndicatorStyles.WIN8CIRCLE:
          // based on http://codepen.io/janrubio/pen/DusIE
          $j.CSS.removeCSSRule("#"+this._internalId+" .win8circle:after");
          for (var i=0;i<5;i++) {
            child=$j.doc.createElement($j.types.HTMLElements.DIV);
            child.setAttribute("class","win8circle win8circle");
            if ($j.browser.ie) child.setAttribute("data-theme",this.getThemeName());
            else child.dataset.theme=this.getThemeName();
            child.jsObj=this;
            this._DOMObj.appendChild(child);
          }
          $j.CSS.addClass(this._DOMObj,"win8loader");
          break;
        case $j.types.busyIndicatorStyles.BALL:
          // based on http://www.alessioatzeni.com/wp-content/tutorials/html-css/CSS3-loading-animation-loop/index.html
          child=$j.doc.createElement($j.types.HTMLElements.DIV);
          child.setAttribute("class","ballIndic");
          if ($j.browser.ie) child.setAttribute("data-theme",this.getThemeName());
          else child.dataset.theme=this.getThemeName();
          child.jsObj=this;
          this._DOMObj.appendChild(child);
          child=$j.doc.createElement($j.types.HTMLElements.DIV);
          child.setAttribute("class","ball1Indic");
          if ($j.browser.ie) child.setAttribute("data-theme",this.getThemeName());
          else child.dataset.theme=this.getThemeName();
          child.jsObj=this;
          this._DOMObj.appendChild(child);
          break;
        case $j.types.busyIndicatorStyles.CIRCLE:
          // based on http://www.alessioatzeni.com/wp-content/tutorials/html-css/CSS3-loading-animation-loop/index.html
          child=$j.doc.createElement($j.types.HTMLElements.DIV);
          child.setAttribute("class","circleIndic");
          if ($j.browser.ie) child.setAttribute("data-theme",this.getThemeName());
          else child.dataset.theme=this.getThemeName();
          child.jsObj=this;
          this._DOMObj.appendChild(child);
          child=$j.doc.createElement($j.types.HTMLElements.DIV);
          child.setAttribute("class","circle1Indic");
          if ($j.browser.ie) child.setAttribute("data-theme",this.getThemeName());
          else child.dataset.theme=this.getThemeName();
          child.jsObj=this;
          this._DOMObj.appendChild(child);
          break;
      }
    },
    updateFromDOM:function() {
      this._inherited();
      var data=($j.browser.ie)?this._DOMObj.getAttribute("data-style"):this._DOMObj.dataset.style;
      if (!$j.tools.isNull(data)) this.indicatorStyle=data;
    }
    //#endregion Methods
  });
  Object.seal(BusyIndicator);
  //#endregion BusyIndicator
  $j.classes.register($j.types.categories.INTERNAL,BusyIndicatorSpinOptions);
  $j.classes.register($j.types.categories.COMMON,BusyIndicator);
  //#region Templates
  var BusyIndicatorTpl=["<div id='{internalId}' data-name='{name}' data-class='BusyIndicator' class='BusyIndicator' data-theme='{theme}' style='{style}' data-style='spin'>",
                        "<div style='left:50%;top:50%;'>",
                        "<div id='{internalId}_1' style='top:-2px;opacity:0;-webkit-animation:{internalId}_1 1s linear infinite'>",
                        "<div class='spinIndic' data-theme='{theme}' style='width:11px;height:4px;-webkit-transform-origin:left;-webkit-transform:rotate(0deg) translate(7px,0);border-radius:0px;'></div>",
                        "</div>",
                        "<div id='{internalId}_2' style='top:-2px;opacity:0;-webkit-animation:{internalId}_2 1s linear infinite'>",
                        "<div class='spinIndic' data-theme='{theme}' style='width:11px;height:4px;-webkit-transform-origin:left;-webkit-transform:rotate(30deg) translate(7px,0);border-radius:0px;'></div>",
                        "</div>",
                        "<div id='{internalId}_3' style='top:-2px;opacity:0;-webkit-animation:{internalId}_3 1s linear infinite'>",
                        "<div class='spinIndic' data-theme='{theme}' style='width:11px;height:4px;-webkit-transform-origin:left;-webkit-transform:rotate(60deg) translate(7px,0);border-radius:0px;'></div>",
                        "</div>",
                        "<div id='{internalId}_4' style='top:-2px;opacity:0;-webkit-animation:{internalId}_4 1s linear infinite'>",
                        "<div class='spinIndic' data-theme='{theme}' style='width:11px;height:4px;-webkit-transform-origin:left;-webkit-transform:rotate(90deg) translate(7px,0);border-radius:0px;'></div>",
                        "</div>",
                        "<div id='{internalId}_5' style='top:-2px;opacity:0;-webkit-animation:{internalId}_5 1s linear infinite'>",
                        "<div class='spinIndic' data-theme='{theme}' style='width:11px;height:4px;-webkit-transform-origin:left;-webkit-transform:rotate(120deg) translate(7px,0);border-radius:0px;'></div>",
                        "</div>",
                        "<div id='{internalId}_6' style='top:-2px;opacity:0;-webkit-animation:{internalId}_6 1s linear infinite'>",
                        "<div class='spinIndic' data-theme='{theme}' style='width:11px;height:4px;-webkit-transform-origin:left;-webkit-transform:rotate(150deg) translate(7px,0);border-radius:0px;'></div>",
                        "</div>",
                        "<div id='{internalId}_7' style='top:-2px;opacity:0;-webkit-animation:{internalId}_7 1s linear infinite'>",
                        "<div class='spinIndic' data-theme='{theme}' style='width:11px;height:4px;-webkit-transform-origin:left;-webkit-transform:rotate(180deg) translate(7px,0);border-radius:0px;'></div>",
                        "</div>",
                        "<div id='{internalId}_8' style='top:-2px;opacity:0;-webkit-animation:{internalId}_8 1s linear infinite'>",
                        "<div class='spinIndic' data-theme='{theme}' style='width:11px;height:4px;-webkit-transform-origin:left;-webkit-transform:rotate(210deg) translate(7px,0);border-radius:0px;'></div>",
                        "</div>",
                        "<div id='{internalId}_9' style='top:-2px;opacity:0;-webkit-animation:{internalId}_9 1s linear infinite'>",
                        "<div class='spinIndic' data-theme='{theme}' style='width:11px;height:4px;-webkit-transform-origin:left;-webkit-transform:rotate(240deg) translate(7px,0);border-radius:0px;'></div>",
                        "</div>",
                        "<div id='{internalId}_10' style='top:-2px;opacity:0;-webkit-animation:{internalId}_10 1s linear infinite'>",
                        "<div class='spinIndic' data-theme='{theme}' style='width:11px;height:4px;-webkit-transform-origin:left;-webkit-transform:rotate(270deg) translate(7px,0);border-radius:0px;'></div>",
                        "</div>",
                        "<div id='{internalId}_11' style='top:-2px;opacity:0;-webkit-animation:{internalId}_11 1s linear infinite'>",
                        "<div class='spinIndic' data-theme='{theme}' style='width:11px;height:4px;-webkit-transform-origin:left;-webkit-transform:rotate(300deg) translate(7px,0);border-radius:0px;'></div>",
                        "</div>",
                        "<div id='{internalId}_12' style='top:-2px;opacity:0;-webkit-animation:{internalId}_12 1s linear infinite'>",
                        "<div class='spinIndic' data-theme='{theme}' style='width:11px;height:4px;-webkit-transform-origin:left;-webkit-transform:rotate(330deg) translate(7px,0);border-radius:0px;'></div>",
                        "</div>",
                        "</div>",
                        "</div>"].join(String.empty);
  $j.classes.registerTemplates([{Class:BusyIndicator,template:BusyIndicatorTpl}]);
  //#endregion
})();  