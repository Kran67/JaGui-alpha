(function(){
  var CornerButton=$j.classes.Button.extend({
    _ClassName: "CornerButton",
    init: function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        this.bordersRadius={
          owner:this,
          topLeft:new $j.classes.Point,
          topRight:new $j.classes.Point,
          bottomLeft:new $j.classes.Point,
          bottomRight:new $j.classes.Point,
          cssUnit:$j.types.CSSUnits.PX,
          setTopLeft:function(newValue) {
            var changed=false;
            if (!(newValue instanceof $j.classes.Point)&&typeof newValue!==_const.NUMBER) return;
            if (typeof newValue===_const.NUMBER) {
              if (this.topLeft.x!==newValue||this.topLeft.y!==newValue) {
                this.topLeft.x=newValue;
                this.topLeft.y=newValue;
                changed=true;
              }
            } else if (!this.topLeft.equals(newValue)) {
              this.topLeft.assign(newValue);
              changed=true;
            }
            if (changed) this._owner.update();
          },
          setTopRight:function(newValue) {
            var changed=false;
            if (!(newValue instanceof $j.classes.Point)&&typeof newValue!==_const.NUMBER) return;
            if (typeof newValue===_const.NUMBER) {
              if (this.topRight.x!==newValue||this.topRight.y!==newValue) {
                this.topRight.x=newValue;
                this.topRight.y=newValue;
                changed=true;
              }
            } else if (!this.topRight.equals(newValue)) {
              this.topRight.assign(newValue);
              changed=true;
            }
            if (changed) this._owner.update();
          },
          setBottomLeft:function(newValue) {
            var changed=false;
            if (!(newValue instanceof $j.classes.Point)&&typeof newValue!==_const.NUMBER) return;
            if (typeof newValue===_const.NUMBER) {
              if (this.bottomLeft.x!==newValue||this.bottomLeft.y!==newValue) {
                this.bottomLeft.x=newValue;
                this.bottomLeft.y=newValue;
                changed=true;
              }
            } else if (!this.bottomLeft.equals(newValue)) {
              this.bottomLeft.assign(newValue);
              changed=true;
            }
            if (changed) this._owner.update();
          },
          setBottomRight:function(newValue) {
            var changed=false;
            if (!(newValue instanceof $j.classes.Point)&&typeof newValue!==_const.NUMBER) return;
            if (typeof newValue===_const.NUMBER) {
              if (this.bottomRight.x!==newValue||this.bottomRight.y!==newValue) {
                this.bottomRight.x=newValue;
                this.bottomRight.y=newValue;
                changed=true;
              }
            } else if (!this.bottomRight.equals(newValue)) {
              this.bottomRight.assign(newValue);
              changed=true;
            }
            if (changed) this._owner.update();
          },
          setCssUnit:function(newValue) {
            if (!$j.tools.valueInSet(newValue,$j.types.CSSUnits)) return;
            if (!this.cssUnit!==newValue) {
              this.cssUnit=newValue;
              this._owner.update();
            }
          }
        };
      }
    },
    //#region Methods
    update:function() {
      this._inherited();
      $j.CSS.updateInlineCSS(this,$j.types.jsCSSProperties.BORDERRADIUS);
    },
    updateFromDOM:function() {
      var values,data;
      this._inherited();
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-topLeft"):this._DOMObj.dataset.topLeft;
      if (!$j.tools.isNull(data)) {
        values=data.split(",");
        this.bordersRadius.topLeft.setValues(parseInt(values[0],10),parseInt(values[1],10));
      }
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-topRight"):this._DOMObj.dataset.topRight;
      if (!$j.tools.isNull(data)) {
        values=data.split(",");
        this.bordersRadius.topRight.setValues(parseInt(values[0],10),parseInt(values[1],10));
      }
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-bottomLeft"):this._DOMObj.dataset.bottomLeft;
      if (!$j.tools.isNull(data)) {
        values=data.split(",");
        this.bordersRadius.bottomLeft.setValues(parseInt(values[0],10),parseInt(values[1],10));
      }
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-bottomRight"):this._DOMObj.dataset.bottomRight;
      if (!$j.tools.isNull(data)) {
        values=data.split(",");
        this.bordersRadius.bottomRight.setValues(parseInt(values[0],10),parseInt(values[1],10));
      }
      data=($j.browser.ie)?this._DOMObj.getAttribute("data-cssUnit"):this._DOMObj.dataset.cssUnit;
      if (!$j.tools.isNull(data)) this.bordersRadius.cssUnit=data;
    }
    //#endregion
  });
  Object.seal(CornerButton);
  $j.classes.register($j.types.categories.EXTENDED,CornerButton);
  //#region Templates
  var CornerButtonTpl=["<div id='{internalId}' data-name='{name}' data-class='CornerButton' style='{style}' class='CornerButton' data-theme='{theme}'>",
                       "<span>{caption}</span>",
                       "</div>"].join(String.empty);
  $j.classes.registerTemplates([{Class:CornerButton,template:CornerButtonTpl}]);
  //#endregion
})();