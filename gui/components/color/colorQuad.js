(function(){
  var ColorQuad=$j.classes.GraphicControl.extend({
    _ClassName: "ColorQuad",
    init: function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        //#region Private
        this._handleObj=null;
        this._handle=new $j.classes.Point;
        //#endregion
        this.autoCapture=true;
        this.colorBox=null;
        this.onChange=new $j.classes.NotifyEvent(this);
        this.color=new $j.classes.Color(this.fillColor);
        this.format=$j.types.colorFormats.HSL;
        this.setHitTest(true);
        this.clipChilds=false;
        this.gradientEdit=null;
      }
    },
    //#region Setter
    setColorBox:function(newValue) {
      if (!(newValue instanceof $j.classes.ColorBox)) return;
      if (this.colorBox!==newValue) {
        this.colorBox=newValue;
        if (this.colorBox instanceof $j.classes.ColorBox) {
          if (!$j.tools.isNull(this.colorBox.fillColor)) this.colorBox.fillColor.assign(this.color);
        }
      }
    },
    setColor:function(newValue) {
      if (!(newValue instanceof $j.classes.Color)) return;
      if (!this.color.equals(newValue)) {
        this.color.assign(newValue);
        this.fillColor.assign(newValue);
        this.changeHandle();
      }
    },
    setHue:function(newValue) {
      if (typeof newValue!==_const.NUMBER) return;
      if (newValue<0) newValue=0;
      if (newValue>360) newValue=359;
      if (this.fillColor.hue!==newValue) {
        this.color.hue=newValue;
        this.update();
      }
    },
    setFormat:function(newValue) {
      if (!$j.tools.valueInSet(newValue,$j.types.colorFormats)) return;
      if (newValue!==this.format) {
        this.format=newValue;
        if ($j.isDOMRenderer) {
          if (this._DOMObj) {
            if ($j.browser.ie) this._DOMObj.setAttribute("data-format",this.format);
            else this._DOMObj.dataset.format=this.format;
            this.update();
          }
        } else {
          if (this._allowUpdate) this.update();
          this.redraw();
        }
      }
    },
    setWidth:function(newValue){
      var oldWidth=this.width;
      if (oldWidth===newValue) return;
      this._inherited(newValue);
      if (!$j.isDOMRenderer) {
        destroy(this.colorBitmap);
        this.colorBitmap=null;
      }
    },
    setHeight:function(newValue){
      var oldHeight=this.height;
      if (oldHeight===newValue) return;
      this._inherited(newValue);
      if (!$j.isDOMRenderer) {
        destroy(this.colorBitmap);
        this.colorBitmap=null;
      }
    },
    //#endregion
    //#region Methods
    changeHandle:function(point){
      if ($j.tools.isNull(point)) {
        point=$j.classes.Point;
        if (this.format===$j.types.colorFormats.HSV) value=this.color.value;
        else value=this.color.lightness;
        point.x=((this.color.saturation*this.width/100)|0);
        point.y=(this.height-(value*this.height/100)|0);
      }
      this._handle.x=point.x;
      this._handle.y=point.y;
      this._handleObj.style.left=(this._handle.x-_const.COLORPICKSIZE/2)+$j.types.CSSUnits.PX;
      this._handleObj.style.top=(this._handle.y-_const.COLORPICKSIZE/2)+$j.types.CSSUnits.PX;
      this.update();
    },
    mouseDown:function(mouseButton,point){
      this._inherited();
      if($j.mouse.button===$j.types.mouseButtons.LEFT&&this._isPressed) {
        var point=this.documentToClient();
        this.changeHandle(point);
      }
    },
    mouseMove:function(){
      this._inherited();
      if($j.mouse.button===$j.types.mouseButtons.LEFT&&this._isPressed) {
        var point=this.documentToClient();
        this.changeHandle(point);
      }
    },
    getDOMObj:function(id) {
      this._inherited(id);
      if (!$j.tools.isNull(this._DOMObj)) {
        this._handleObj=this._DOMObj.firstElementChild;
        this._handleObj.jsObj=this;
      }
    },
    update:function() {
		  var value,saturation;
      if (this._loading||this.form._loading) return;
      if ($j.tools.isNull(this._DOMObj)) return;
      if ($j.browser.ie) this._DOMObj.setAttribute("data-format",this.format);
      else this._DOMObj.dataset.format=this.format;
      this.fillColor.hue=this.color.hue;
      this.fillColor.saturation=100;
      this.fillColor.value=100;
      this.fillColor.lightness=50;
      if (this.format===$j.types.colorFormats.HSV) this.fillColor.HSVtoRGB();
      else this.fillColor.HSLtoRGB();
      this._DOMObj.style[$j.types.jsCSSProperties.BACKGROUNDCOLOR]=this.fillColor.toARGBString();
      if (this._handle.x<0) this._handle.x=0;
      if (this._handle.x>this.width) this._handle.x=this.width;
      if (this._handle.y<0) this._handle.y=0;
      if (this._handle.y>this.height) this._handle.y=this.height;
      value=100-(this._handle.y*100/this.height)|0;
      saturation=this._handle.x*100/this.width|0;
      if (this.format===$j.types.colorFormats.HSV) this.color.setHSV(this.fillColor.hue,saturation,value);
      else this.color.setHSL(this.fillColor.hue,saturation,value);
      if (!this._updating) {
        if (this.colorBox instanceof $j.classes.ColorBox) this.colorBox.setColor(this.color);
        if (this.gradientEdit instanceof $j.classes.GradientEdit) this.gradientEdit.changeCurrentPointColor(this.color);
        this.onChange.invoke();
      }
    },
    realign:$j.tools.emptyFunc,
    updateFromDOM:function() {
      this._inherited();
      var data=($j.browser.ie)?this._DOMObj.getAttribute("data-format"):this._DOMObj.dataset.format;
      if (!$j.tools.isNull(data)) this.format=data;
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-color"):this._DOMObj.dataset.color;
      if (!$j.tools.isNull(data)) this.setColor(_colors.parse(data));
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-colorbox"):this._DOMObj.dataset.colorbox;
      if (!$j.tools.isNull(data)) this.colorBox=this.form[data];
      this.bindEventFromDOM("onChange");
    }
    //#endregion
  });
  Object.seal(ColorQuad);
  $j.classes.register($j.types.categories.COLOR,ColorQuad);
  //#region Templates
  var ColorQuadTpl=["<div id='{internalId}' data-name='{name}' data-class='ColorQuad' style='{style}' class='ColorQuad' data-color='{color}' data-format='{format}'>",
                    "<div class='ColorPickerIndicator' style='left: -5px; top: -5px; background-color: {color};'></div>",
                    "</div>"].join(String.empty);
  $j.classes.registerTemplates([{Class:ColorQuad,template:ColorQuadTpl}]);
  //endregion
})();