(function(){
  $j.classes.register($j.types.categories.EXTRAS,Diagrams);
  Diagrams.inherit($j.classes.ThemedControl);
  function Diagrams(owner) {
    if (!$j.tools.isNull(owner)){
      $j.classes.ThemedControl.apply(this,arguments);
    }
  }
  //#region Methods
  //#endregion
  Object.seal(Diagrams);
})();