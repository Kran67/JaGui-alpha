(function(){
  var CircleButton=$j.classes.Button.extend({
    _ClassName: "CircleButton",
    init: function(owner,props) {
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
      }
    },
    //#region Setter
    setWidth:function(newValue) {
      this._inherited(newValue);
      this.update($j.types.jsCSSProperties.WIDTH);
    },
    setHeight:function(newValue) {
      this._inherited(newValue);
      this.update($j.types.jsCSSProperties.HEIGHT);
    },
    //#endregion
    //#region Methods
    update:function(source) {
      this._inherited();
      if (!$j.tools.isNull(source)) {
        switch (source) {
          case $j.types.jsCSSProperties.WIDTH:
            this.height=this.width;
            $j.CSS.updateInlineCSS(this,$j.types.jsCSSProperties.HEIGHT);
            break;
          case $j.types.jsCSSProperties.HEIGHT:
            this.width=this.height;
            $j.CSS.updateInlineCSS(this,$j.types.jsCSSProperties.WIDTH);
            break;
        }
      } else {
        if (this.width>this.height) {
          this.height=this.width;
          $j.CSS.updateInlineCSS(this,$j.types.jsCSSProperties.HEIGHT);
        } else {
          this.width=this.height;
          $j.CSS.updateInlineCSS(this,$j.types.jsCSSProperties.WIDTH);
        }
      }
    }
    //#endregion
  });
  Object.seal(CircleButton);
  $j.classes.register($j.types.categories.EXTENDED,CircleButton);
  //#region Templates
  var CircleButtonTpl=["<div id='{internalId}' data-name='{name}' data-class='CircleButton' style='{style}' class='CircleButton' data-theme='{theme}'>",
                       "<span>{caption}Button</span>",
                       "</div>"].join(String.empty);
  $j.classes.registerTemplates([{Class:CircleButton,template:CircleButtonTpl}]);
  //#endregion
})();