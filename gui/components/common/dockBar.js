(function(){
  $j.classes.register($j.types.categories.COMMON,DockBar);
  DockBar.inherit($j.classes.ThemedControl);
  function DockBar(owner) {
    if (!$j.tools.isNull(owner)){
      $j.classes.ThemedControl.apply(this,arguments);
    }
  }
  //#region Methods
  //#endregion
  Object.seal(DockBar);
})();
//https://github.com/coderespawn/dock-spawn