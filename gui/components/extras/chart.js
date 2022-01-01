(function(){
  $j.classes.register($j.types.categories.EXTRAS,Chart);
  Chart.inherit($j.classes.ThemedControl);
  function Chart(owner) {
    if (!$j.tools.isNull(owner)){
      $j.classes.ThemedControl.apply(this,arguments);
    }
  }
  //#region Methods
  //#endregion
  Object.seal(Chart);
})();