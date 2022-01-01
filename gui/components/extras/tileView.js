(function(){
  $j.classes.register($j.types.categories.EXTRAS,TileView);
  TileView.inherit($j.classes.ThemedControl);
  function TileView(owner) {
    if (!$j.tools.isNull(owner)){
      $j.classes.ThemedControl.apply(this,arguments);
    }
  }
  //#region Methods
  //#endregion
  Object.seal(TileView);
})();