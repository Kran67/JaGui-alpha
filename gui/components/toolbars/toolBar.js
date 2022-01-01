(function(){
  //#region ToolBar
  var ToolBar=$j.classes.ThemedControl.extend({
    _ClassName: "ToolBar",
    init: function(owner,props){
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        if (owner===owner.form._content) owner=owner.form._layout;
        this._inherited(owner,props);
        this.align=$j.types.aligns.MOSTTOP;
        this.height=29;
      }
    }
    //#region Methods
    //#endregion
  });
  Object.seal(ToolBar);
  //#endregion
  $j.classes.register($j.types.categories.TOOLBARS,ToolBar);
  //#region Templates
  var ToolBarTpl="<div id='{internalId}' data-name='{name}' data-class='ToolBar' class='ToolBar' data-theme='{theme}' style='{style}'></div>";
  $j.classes.registerTemplates([{Class:ToolBar,template:ToolBarTpl}]);
  //endregion
})();