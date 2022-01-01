(function(){
  var ColorBox=$j.classes.GraphicControl.extend({
    _ClassName: "ColorBox",
    init: function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
      }
    },
    //#region Setter
    setColor:function(newValue) {
      if (!(newValue instanceof $j.classes.Color)) return;
      if (!this.fillColor.equals(newValue)) {
        this.fillColor.assign(newValue);
        if ($j.isDOMRenderer) {
          if (!this._loading&&!this.form._loading) this.update();
        } else {
          if (this._allowUpdate) this.update();
          this.redraw();
        }
      }
    },
    //#endregion
    //#region Methods
    update:function() {
      //if (this._loading||this.form._loading) return;
      if ($j.tools.isNull(this._DOMObj)) return;
      this._DOMObj.style[$j.types.jsCSSProperties.BOXSHADOW]="inset 0 0 0 1000px "+this.fillColor.toARGBString();
      if ($j.browser.ie) this._DOMObj.setAttribute("data-color",this.fillColor.toARGBString());
      else this._DOMObj.dataset.color=this.fillColor.toARGBString();
    },
    updateFromDOM: function() {
      var bshadow=getComputedStyle(this._DOMObj).BoxShadow,data=($j.browser.ie)?this._DOMObj.getAttribute("data-color"):this._DOMObj.dataset.color;
      if (!$j.tools.isNull(data)) this.fillColor.assign(_colors.parse(data));
      if (!$j.tools.isNull(bshadow)&&bshadow!==String.empty) {
        bshadow=$j.tools.text.replace(bshadow,", ",",");
        bshadow=bshadow.split(String.SPACE);
      }
      this._inherited();
    },
    loaded:function() {
      this._inherited();
      this.update();
    },
    realign:$j.tools.emptyFunc
    //#endregion
  });
  $j.classes.register($j.types.categories.COLOR,ColorBox);
  //#region Templates
  var ColorBoxTpl="<div id='{internalId}' data-name='{name}' data-class='ColorBox' class='ColorBox' style='{style}' data-color='{color}'></div>";
  $j.classes.registerTemplates([{Class:ColorBox,template:ColorBoxTpl}]);
  //endregion
})();