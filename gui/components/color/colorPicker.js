(function(){
  var ColorPicker=$j.classes.GraphicControl.extend({
    _ClassName: "ColorPicker",
    init: function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        //#region Private
        this._handle=new $j.classes.Point((this.width/2)-5,-5);
        this._handleObj=null;
        //#endregion
        this.onChange=new $j.classes.NotifyEvent(this);
        this.color=new $j.classes.Color(_colors.RED);
        this.autoCapture=true;
        this.setHitTest(true);
        this.colorQuad=null;
        this.clipChilds=false;
      }
    },
    //#region Setters
    setColor:function(newValue) {
      var pos;
      if (!(newValue instanceof $j.classes.Color)) return;
      if (!this.color.equals(newValue)) {
        this.color.assign(newValue);
		    pos=(this.color.hue*this.height/360)|0;
        pos-=_const.COLORPICKSIZE/2;
        this._handle.y=(pos>this.height-5?this.height-5:(pos<-5)?-5:pos);
        this.update();
      }
    },
    setColorQuad:function(newValue) {
      if (!(newValue instanceof $j.classes.ColorQuad)) return;
      if (this.colorQuad!==newValue) {
        this.colorQuad=newValue;
        if (this.colorQuad instanceof $j.classes.ColorQuad) this.colorQuad.color.assign(this.color);
      }
    },
    //#endregion
    //#region Methods
    mouseDown:function(){
      this._inherited();
      if($j.mouse.button===$j.types.mouseButtons.LEFT&&this._isPressed) {
        if (this.height!==0) {
          var point=this.documentToClient();
          this.changeHandle(point);
        }
      }
    },
    mouseMove:function(){
      this._inherited();
      if($j.mouse.button===$j.types.mouseButtons.LEFT&&this._isPressed) {
        if (this.height!==0) {
          var point=this.documentToClient();
          this.changeHandle(point);
        }
      }
    },
    realign:$j.tools.emptyFunc,
    getDOMObj:function(id) {
      this._inherited(id);
      if (!$j.tools.isNull(this._DOMObj)) {
        this._handleObj=this._DOMObj.firstElementChild;
        this._handleObj.jsObj=this;
      }
    },
    changeHandle:function(point){
      this.color.setHue(~~((point.y*360)/this.height));
      if (!$j.isDOMRenderer) {
        point.x-=_const.COLORPICKSIZE*2;
        point.y-=_const.COLORPICKSIZE*2;
      } else {
        point.y-=_const.COLORPICKSIZE/2;
      }
      this._handle.y=(point.y>this.height-5?this.height-5:(point.y<-5)?-5:point.y);
      if (!$j.tools.isNull(this._handleObj)) {
        this.update();
      }
      if (!this._updating) this.onChange.invoke();
    },
    update:function() {
      this._handleObj.style.top=this._handle.y+$j.types.CSSUnits.PX;
      if (!this._updating) {
        if (this.colorQuad instanceof $j.classes.ColorQuad) this.colorQuad.setHue(this.color.hue);
      }
    },
    updateFromDOM: function() {
      this._inherited();
      var data=($j.browser.ie)?this._DOMObj.getAttribute("data-colorquad"):this._DOMObj.dataset.colorquad;
      if (!$j.tools.isNull(data)) this.colorQuad=this.form[data];
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-color"):this._DOMObj.dataset.color;
      if (!$j.tools.isNull(data)) this.color.assign(_colors.parse(data));
    }
    //#endregion
  });
  Object.seal(ColorPicker);
  $j.classes.register($j.types.categories.COLOR,ColorPicker);
  //#region Templates
  var ColorPickerTpl=["<div id='{internalId}' data-name='{name}' data-class='ColorPicker' style='{style}' class='ColorPicker' data-color='{color}'>",
                      "<div class='ColorPickerIndicator' style='left: {indicatorLeft}px; top: -5px;'></div>",
                      "</div>"].join(String.empty);
  $j.classes.registerTemplates([{Class:ColorPicker,template:ColorPickerTpl}]);
  //endregion
})();