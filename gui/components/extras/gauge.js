(function(){
  $j.classes.register($j.types.categories.EXTRAS,Gauge);
  Gauge.inherit($j.classes.ThemedControl);
  function Gauge(owner) {
    if (!$j.tools.isNull(owner)){
      $j.classes.ThemedControl.apply(this,arguments);
    }
  }
  //#region Methods
  //#endregion
  Object.seal(Gauge);
})();