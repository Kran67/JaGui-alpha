(function(){
  $j.classes.register($j.types.categories.EXTRAS,ControlCloud);
  ControlCloud.inherit($j.classes.ThemedControl);
  function ControlCloud(owner) {
    if (!$j.tools.isNull(owner)){
      $j.classes.ThemedControl.apply(this,arguments);
    }
  }
  //#region Methods
  //#endregion
  Object.seal(ControlCloud);
})();