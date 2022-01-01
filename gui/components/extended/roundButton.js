(function(){
  var RoundButton=$j.classes.Button.extend({
    _ClassName: "RoundButton",
    init: function(owner,props) {
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
      }
    },
    //#region Setter
    setWidth:function(newValue) {
      this._inherited(newValue);
      this.updateRadius();
    },
    setHeight:function(newValue) {
      this._inherited(newValue);
      this.updateRadius();
    },
    //#endregion
    //#region Methods
    radius:function() {
      var radius;
      if(this.height<this.width) radius=$j.ceil(this.height*0.5);
      else radius=$j.ceil(this.width*0.5);
      return radius;
    },
    update:function() {
      this.updateRadius();
    },
    updateRadius:function(){
    }
    //#endregion
  });
  Object.seal(RoundButton);
  $j.classes.register($j.types.categories.EXTENDED,RoundButton);
  //#region Template
  var RoundButtonTpl=["<div id='{internalId}' data-name='{name}' data-class='RoundButton' style='{style}' class='RoundButton' data-theme='{theme}'>",
                      "<span>{caption}</span>",
                      "</div>"].join(String.empty);
  $j.classes.registerTemplates([{Class:RoundButton,template:RoundButtonTpl}]);
  //#endregion
})();