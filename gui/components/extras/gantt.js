(function(){
  $j.classes.register($j.types.categories.EXTRAS,Gantt);
  Gantt.inherit($j.classes.ThemedControl);
  function Gantt(owner) {
    if (!$j.tools.isNull(owner)){
      $j.classes.ThemedControl.apply(this,arguments);
    }
  }
  //#region Methods
  //#endregion
  Object.seal(Gantt);
})();