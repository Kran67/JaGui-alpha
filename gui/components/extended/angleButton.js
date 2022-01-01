(function(){
  var AngleButton=$j.classes.CustomButton.extend({
    _ClassName: "AngleButton",
    init: function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        //#region Private
        this._internalValue=0;
        this._knob=null;
        this._saveValue=0;
        //#endregion
        this.width=30;
        this.height=30;
        this.frequency=0;
        this.tracking=true;
        this.value=0;
        this.showValue=false;
        this.autoCapture=true;
        this.caption=String.empty;
        this.onChanged=new $j.classes.NotifyEvent(this);
      }
    },
    //#region Setters
    setFrequency:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if(this.frequency!==newValue) this.frequency=newValue;
    },
    setTracking:function(newValue) {
      if(typeof newValue!==_const.BOOLEAN) return;
      if(this.tracking!==newValue) this.tracking=newValue;
    },
    setInternalValue:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if(this._internalValue!==newValue) {
        if(this.frequency===0) {
          this._internalValue=newValue;
        } else {
          var nv=$j.round(newValue/this.frequency)*this.frequency;
          if(this._internalValue!==nv) {
            this._internalValue=nv;
          }
        }
        if (this._internalValue<0) this.value=~~((this._internalValue+360)%360);
        else this.value=~~(this._internalValue%360);
        if (!$j.isDOMRenderer) {
          if (this._allowUpdate) this.update();
          this.redraw();
        } else this.update();
        this.onChanged.invoke();
      }
    },
    setValue:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if (newValue>=360) newValue=0;
      if (newValue<0) newValue=0;
      if(this.value!==newValue) {
        this.value=newValue;
        this.setInternalValue(this.value);
      }
    },
    setShowValue:function(newValue) {
      if(typeof newValue!==_const.BOOLEAN) return;
      if(this.showValue!==newValue) {
        this.showValue=newValue;
        if (this.showValue) $j.CSS.removeClass(this.text,"hidden");
        else $j.CSS.addClass(this.text,"hidden");
        if (!$j.isDOMRenderer) {
          if (this._allowUpdate) this.update();
          this.redraw();
        } else this.update();
      }
    },
    //#region
    //#region Methods
    mouseDown:function() {
      this._inherited();
      if($j.mouse.button===$j.types.mouseButtons.LEFT) {
        this._saveValue=this._internalValue;
      }
    },
    mouseMove:function() {
      this._inherited();
      if(($j.mouse.button===$j.types.mouseButtons.LEFT)&&this._isPressed) {
        var point=this.documentToClient();
        this.valueFromPoint(point);
      }
    },
    mouseUp:function() {
      var pressing=this._isPressed;
      this._inherited();
      if(pressing) {
        var point=this.documentToClient();
        this.valueFromPoint(point);
      }
    },
    update:function() {
      if (this._loading||this.form._loading) return;
      var CSSProp=$j.types.CSSProperties.TRANSFORM,value;
      value=" rotate("+this._internalValue+"deg)";
      this._knob.style[$j.browser.getVendorPrefix(CSSProp)+CSSProp]=value;
      this._textObj.innerHTML=this.value+"&deg;";
      this._textObj.style[$j.types.LINEHEIGHT]=this._textObj.offsetHeight+$j.types.CSSUnits.PX;
      this._textObj.style[$j.types.CSSProperties.LINEHEIGHT]=this._textObj.offsetHeight+$j.types.CSSUnits.PX;
    },
    valueFromPoint:function(point) {
      var v=new $j.classes.Vector(point.x-this.width/2,point.y-this.height/2);
      var v1=new $j.classes.Vector(1,0,0);
      this.setInternalValue(-v1.angle(v));
    },
    mouseWheel:function(){
      this.setInternalValue(this._internalValue+~~($j.mouse.wheelDelta*10));
    },
    getChildsDOMObj:function() {
      this._inherited();
      this._knob=this._DOMObj.lastElementChild;
      this._knob.jsObj=this;
    }
    //#endregion
  });
  Object.seal(AngleButton);
  $j.classes.register($j.types.categories.EXTENDED,AngleButton);
  //#region Templates
  var AngleButtonTpl=["<div id='{internalId}' data-name='{name}' data-class='AngleButton' style='{style}' class='AngleButton' data-theme='{theme}'>",
                      "<div class='AngleButton_text hidden' data-theme='{theme}'>0°</div>",
                      "<div class='AngleButton_knob' data-theme='{theme}'></div>",
                      "</div>"].join(String.empty);
  //endregion
  $j.classes.registerTemplates([{Class:AngleButton,template:AngleButtonTpl}]);
})();