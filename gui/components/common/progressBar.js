(function(){
  var ProgressBar=$j.classes.ThemedControl.extend({
    _ClassName: "ProgressBar",
    init: function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        //#region Private
        this._progress=null;
        //#endregion
        this.height=20;
        this.width=100;
        this.value=0;
        this.min=0;
        this.max=100;
        this.hitTest=false;
        this.orientation=$j.types.orientations.HORIZONTAL;
      }
    },
    //#region setter
    setOrientation:function(newValue) {
      if (!$j.tools.valueInSet(newValue,$j.types.orientations)) return;
      if (this.orientation!==newValue) {
        this.orientation=newValue;
        this.update();
      }
    },
    setValue:function(newValue) {
      if (typeof newValue!==_const.NUMBER)return;
      if (newValue!==this.value){
        this.value=newValue;
        if(this.value>this.max) this.value=this.max;
        if(this.value<this.min) this.value=this.min;
        if (!$j.isDOMRenderer) {
          var lastRect=this.screenRect();
          if (this._allowUpdate) this.update();
          this.redraw(lastRect);
        } else this.update();
      }
    },
    setMin: function(newValue) {
      if (typeof newValue!==_const.NUMBER)return;
      if (newValue!==this.min){
        this.min=newValue;
        if (!$j.isDOMRenderer) {
          if (this._allowUpdate) this.update();
          this.redraw();
        } else this.update();
      }
    },
    setMax: function(newValue) {
      if (typeof newValue!==_const.NUMBER)return;
      if (newValue!==this.max){
        this.max=newValue;
        if (!$j.isDOMRenderer) {
          if (this._allowUpdate) this.update();
          this.redraw();
        } else this.update();
      }
    },
    setWidth:function(newValue) {
      var style=String.empty;
      this._inherited(newValue);
      //this.addAnimation();
      this.update();
    },
    setHeight:function(newValue) {
      var style=String.empty;
      this._inherited(newValue);
      //this.addAnimation();
      this.update();
    },
    //#endregion
    //#region Methods
    loaded:function() {
      this._inherited();
      this.update();
      //this.addAnimation();
    },
    calculProgress:function() {
      var style,w,nv,margin=new $j.classes.Rect,borderLeft=0,borderTop=0,borderRight=0,borderBottom=0;
      if (!$j.isDOMRenderer) {
        style=this.getStyle($j.types.styles.NORMAL,$j.types.styleObjects.MIDDLE);
        margin=style.margin;
      } else {
        if (!$j.tools.isNull(this._DOMObj)) {
          borderLeft=parseInt(getComputedStyle(this._DOMObj).borderLeftWidth,10);
          borderTop=parseInt(getComputedStyle(this._DOMObj).borderTopWidth,10);
          borderRight=parseInt(getComputedStyle(this._DOMObj).borderRightWidth,10);
          borderBottom=parseInt(getComputedStyle(this._DOMObj).borderBottomWidth,10);
        }
        if (!$j.tools.isNull(this._progress)) {
          margin.left=parseInt(getComputedStyle(this._progress).marginLeft,10);
          margin.top=parseInt(getComputedStyle(this._progress).marginTop,10);
          margin.right=parseInt(getComputedStyle(this._progress).marginRight,10);
          margin.bottom=parseInt(getComputedStyle(this._progress).marginBottom,10);
        }
        style=this.localRect();
      }
      if (this.orientation===$j.types.orientations.HORIZONTAL) nv=this.width-this.padding.left()-this.padding.right()-margin.left-margin.right;
      else nv=this.height-this.padding.top()-this.padding.bottom()-margin.top-margin.bottom-borderTop-borderBottom;
      nv=~~(((this.value-this.min)/(this.max-this.min))*nv);
      return nv;
    },
    update:function() {
      var style,wh;
      if (!$j.tools.isNull(this._progress)) {
        wh=this.calculProgress();
        style=this._progress.style;
        if (this.orientation===$j.types.orientations.HORIZONTAL) {
          if (this.value===this.max) {
            style.right=0;
            style.width=String.empty;
          } else {
            style.width=wh+$j.types.CSSUnits.PX;
            style.right=String.empty;
          }
        } else {
          if (this.value===this.max) {
            style.top=0;
            style.height=String.empty;
          } else {
            style.height=wh+$j.types.CSSUnits.PX;
            style.top=String.empty;
          }
        }
        if ($j.browser.ie) {
          this._DOMObj.setAttribute("data-value",this.value);
          this._DOMObj.setAttribute("data-min",this.min);
          this._DOMObj.setAttribute("data-max",this.max);
        } else {
          this._DOMObj.dataset.value=this.value;
          this._DOMObj.dataset.min=this.min;
          this._DOMObj.dataset.max=this.max;
        }
      }
    },
    getChildsDOMObj:function(id) {
      if (!$j.tools.isNull(this._DOMObj)) {
        this._progress=this._DOMObj.firstElementChild;
        this._progress.jsObj=this;
      }
    },
    updateFromDOM: function() {
      var data=($j.browser.ie)?this._DOMObj.getAttribute("data-value"):this._DOMObj.dataset.value;
      if (!$j.tools.isNull(data)) {
        this.value=parseFloat(data);
      }
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-min"):this._DOMObj.dataset.min;
      if (!$j.tools.isNull(data)) this.min=parseFloat(data);
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-max"):this._DOMObj.dataset.max;
      if (!$j.tools.isNull(data)) this.max=parseFloat(data);
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-orientation"):this._DOMObj.dataset.orientation;
      if (!$j.tools.isNull(data)) this.orientation=data;
      this._inherited();
      //this.addAnimation();
    },
    addAnimation: function() {
      var style=String.empty;
      // ajout de la régle pour l'animation
      $j.CSS.removeCSSRule("#"+this._internalId+"_progress"+$j.types.pseudoCSSClass.AFTER);
      style=$j.browser.getVendorPrefix("animation")+"animation: 2s linear 0s normal none infinite "+this._internalId+"_indic;";
      $j.CSS.addCSSRule("#"+this._internalId+"_progress"+$j.types.pseudoCSSClass.AFTER,style);
      style=String.empty;
      if (this.orientation===$j.types.orientations.HORIZONTAL) style="0% { left: -100px; } 100% { left: "+(this.width*4)+"px; }";
      if (this.orientation===$j.types.orientations.VERTICAL) style="0% { bottom: -100px; } 100% { bottom: "+(this.height*4)+"px; }";
      $j.CSS.removeCSSRule("@"+$j.browser.getVendorPrefix("keyframes")+"keyframes "+this._internalId+"_indic",$j.types.CSSRuleTypes.KEYFRAMES_RULE);
      if (style!==String.empty) $j.CSS.addCSSRule("@"+$j.browser.getVendorPrefix("keyframes")+"keyframes "+this._internalId+"_indic",style);
    }
    //#endregion
  });
  Object.seal(ProgressBar);
  //#endregion
  $j.classes.register($j.types.categories.COMMON,ProgressBar);
  //#region Templates
  var ProgressBarTpl=["<div id='{internalId}' data-name='{name}' data-class='ProgressBar' class='ProgressBar' data-theme='{theme}' style='{style}' data-value='0' data-min='0' data-max='100' data-orientation='horizontal'>",
                      "<div class='ProgressBar_progress' data-theme='{theme}'></div>",
                      "</div>"].join(String.empty);
  //endregion
  $j.classes.registerTemplates([{Class:ProgressBar,template:ProgressBarTpl}]);
})();