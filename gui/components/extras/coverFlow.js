(function(){
  $j.classes.register($j.types.categories.EXTRAS,CoverFlow);
  CoverFlow.inherit($j.classes.ThemedControl);
  function CoverFlow(owner) {
    if (!$j.tools.isNull(owner)){
      $j.classes.ThemedControl.apply(this,arguments);
    }
  }
  //#region Methods
  //#endregion
  Object.seal(CoverFlow);
})();