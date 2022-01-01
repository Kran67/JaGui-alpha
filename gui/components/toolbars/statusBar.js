//TODO : faire les panels
(function(){
  var StatusBar=$j.classes.ThemedControl.extend({
    _ClassName: "StatusBar",
    init: function(owner,props) {
      props=($j.tools.isNull(props))?{}:props;
      if (!$j.tools.isNull(owner)){
        if (owner===owner.form._content) owner=owner.form._layout;
        this._inherited(owner,props);
        this.align=$j.types.aligns.MOSTBOTTOM;
        this.height=19;
      }
    }
    //#region Methods
    //#endregion
  });
  Object.seal(StatusBar);
  $j.classes.register($j.types.categories.TOOLBARS,StatusBar);
  //#region Templates
  var StatusBarTpl="<div id='{internalId}' data-name='{name}' data-class='StatusBar' class='StatusBar' data-theme='{theme}' style='{style}'></div>";
  $j.classes.registerTemplates([{Class:StatusBar,template:StatusBarTpl}]);
  //endregion
})();