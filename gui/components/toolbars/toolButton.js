(function(){
  var ToolButton=$j.classes.BitmapButton.extend({
    _ClassName:"ToolButton",
    init:function(owner,props) {
      if (!$j.tools.isNull(owner)){
        this._inherited(owner,props);
        this.canFocused=false;
      }
    }
    //#region Methods
    //#endregion
  });
  Object.seal(ToolButton);
  $j.classes.register($j.types.categories.TOOLBARS,ToolButton);
  //#region Templates
  var ToolButtonTpl=["<div id='{internalId}' data-name='{name}' data-class='ToolButton' style='{style}' class='ToolButton' data-theme='{theme}'>",
                     "<span>{caption}</span>",
                     "<img alt='' src='{src}'>",
                     "</div>"].join(String.empty);
  $j.classes.registerTemplates([{Class:ToolButton,template:ToolButtonTpl}]);
  //endregion
})();