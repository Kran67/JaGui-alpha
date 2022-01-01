(function(){
  $j.classes.register($j.types.categories.EXTRAS,OutlookBar);
  OutlookBar.inherit($j.classes.ThemedControl);
  function OutlookBar(owner) {
    if (!$j.tools.isNull(owner)){
      $j.classes.ThemedControl.apply(this,arguments);
    }
  }
  //#region Methods
  //#endregion
  Object.seal(OutlookBar);
})();