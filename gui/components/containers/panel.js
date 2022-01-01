(function(){
  var Panel=$j.classes.ThemedControl.extend({
    _ClassName: "Panel",
    init:function(owner,props) {
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
      }
    }
    //#region Methods
    //#endregion
  });
  Object.seal(Panel);
  $j.classes.register($j.types.categories.CONTAINERS,Panel);
  //#region Templates
  var PanelTpl="<div id='{internalId}' data-name='{name}' data-class='Panel' class='Panel' data-theme='{theme}' style='{style}'></div>";
  $j.classes.registerTemplates([{Class:Panel,template:PanelTpl}]);
  //endregion
})();