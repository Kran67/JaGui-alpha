(function(){
  $j.classes.register($j.types.categories.CONTAINERS,ScaledLayout);
  ScaledLayout.inherit($j.classes.Layout);
  function ScaledLayout(owner) {
    if (owner!==NULL){
      $j.classes.Layout.apply(this,arguments);
    }
  }
  //#region Methods
  //#endregion
  Object.seal(ScaledLayout);
})();