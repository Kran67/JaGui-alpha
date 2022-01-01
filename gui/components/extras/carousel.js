(function(){
  $j.classes.register($j.types.categories.EXTRAS,Carousel);
  Carousel.inherit($j.classes.ThemedControl);
  function Carousel(owner) {
    if (!$j.tools.isNull(owner)){
      $j.classes.ThemedControl.apply(this,arguments);
    }
  }
  //#region Methods
  //#endregion
  Object.seal(Carousel);
})();