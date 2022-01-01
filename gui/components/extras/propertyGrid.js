(function(){
  $j.classes.register($j.types.categories.EXTRAS,PropertyGrid);
  PropertyGrid.inherit($j.classes.ThemedControl);
  function PropertyGrid(owner) {
    if (!$j.tools.isNull(owner)){
      $j.classes.ThemedControl.apply(this,arguments);
    }
  }
  //#region Methods
  //#endregion
  Object.seal(PropertyGrid);
})();