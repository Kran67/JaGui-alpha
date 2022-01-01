(function(){
  $j.classes.register($j.types.categories.EXTRAS,Wizard);
  Wizard.inherit($j.classes.PageControl);
  function Wizard(owner) {
    if (!$j.tools.isNull(owner)){
      $j.classes.PageControl.apply(this,arguments);
    }
  }
  //#region Methods
  //#endregion
  Object.seal(Wizard);
})();