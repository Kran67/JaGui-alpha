(function(){
  $j.classes.register($j.types.categories.EXTRAS,Scheduler);
  Scheduler.inherit($j.classes.ThemedControl);
  function Scheduler(owner) {
    if (!$j.tools.isNull(owner)){
      $j.classes.ThemedControl.apply(this,arguments);
    }
  }
  //#region Methods
  //#endregion
  Object.seal(Scheduler);
})();