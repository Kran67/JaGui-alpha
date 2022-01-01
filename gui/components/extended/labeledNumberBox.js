(function(){
  $j.classes.register($j.types.categories.EXTENDED,LabeledNumberBox);
  LabeledNumberBox.inherit($j.classes.Control);
  function LabeledNumberBox(owner) {
    if (!$j.tools.isNull(owner)){
      $j.classes.Control.apply(this,arguments);
    }
  }
  //#region Methods
  //#endregion
  Object.seal(LabeledNumberBox);
})();