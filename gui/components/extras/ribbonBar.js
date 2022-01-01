(function(){
  $j.classes.register($j.types.categories.EXTRAS,RibbonBar);
  RibbonBar.inherit($j.classes.ThemedControl);
  function RibbonBar(owner) {
    if (!$j.tools.isNull(owner)){
      $j.classes.ThemedControl.apply(this,arguments);
    }
  }
  //#region Methods
  //#endregion
  Object.seal(RibbonBar);
})();