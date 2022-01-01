(function(){
  $j.classes.register($j.types.categories.EXTRAS,BarCode);
  BarCode.inherit($j.classes.ThemedControl);
  function BarCode(owner) {
    if (!$j.tools.isNull(owner)){
      $j.classes.ThemedControl.apply(this,arguments);
    }
  }
  //#region Methods
  //#endregion
  Object.seal(BarCode);
})();