(function(){
  var PaintBox=$j.classes.Control.extend({
    _ClassName: "PaintBox",
    init: function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        //#region Private
        this._ctx=null;
        //#endregion
      }
    },
    //#region Setter
    setWidth:function(newValue) {
      if(typeof newValue!==_const.NUMBER) return;
      this._inherited(newValue);
      if(this.width!==newValue){
        if ($j.isDOMRenderer) {
          if (!this._loading&&!this.form._loading) this.paint();
        }
      }
    },
    setHeight:function(newValue) {
      if(typeof newValue!==_const.NUMBER) return;
      this._inherited(newValue);
      if(this.height!==newValue){
        if ($j.isDOMRenderer) {
          if (!this._loading&&!this.form._loading) this.paint();
        }
      }
    },
    //#endregion
    //#region Methods
    getDOMObj:function(id) {
      this._inherited(id);
      if (!$j.tools.isNull(this._DOMObj)) {
        this._ctx=this._DOMObj.getContext("2d");
      }
    },
    update:function(){
      if (this.form._loading||this.form._creating) return;
      this._DOMObj.setAttribute('width', this.width);
      this._DOMObj.setAttribute('height', this.height);
      this.paint();
    },
    paint:function(){
      if ((this.width===0)||(this.height===0)) return;
      if (this.form._loading||this.form._creating) return;
      if (!this.isEnabled()) return;
      if ($j.isDOMRenderer) {
        this._ctx.clear();
        this.onPaint.invoke();
      }
    },
    updateFromDOM:function() {
      this._inherited();
      this.width=parseInt(this._DOMObj.getAttribute("width"),10);
      this.height=parseInt(this._DOMObj.getAttribute("height"),10);
    },
    //#endregion
  });
  Object.seal(PaintBox);
  $j.classes.register($j.types.categories.COMMON,PaintBox);
  //#region Templates
  var PaintBoxTpl="<canvas id='{internalId}' data-class='PaintBox' data-name='{name}' width='{width}' height='{height}' style='{style}'></canvas>";
  //endregion
  $j.classes.registerTemplates([{Class:PaintBox,template:PaintBoxTpl}]);
})();